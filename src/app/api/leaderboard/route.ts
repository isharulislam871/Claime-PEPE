import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all-time'; // weekly, monthly, all-time
    const currentUserId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: weekAgo } };
        break;
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: monthAgo } };
        break;
      case 'all-time':
      default:
        dateFilter = {};
        break;
    }

    // Get top users based on total earned points
    const topUsers = await User.find({
      status: 'active',
      ...dateFilter
    })
    
    .sort({ balance : -1 })
    .limit(limit)
    .lean();
 

    // Transform data and add ranks
    const leaderboardData = topUsers.map((user, index) => ({
      id: user.telegramId,
      username: user.username,
      avatar: user.profilePicUrl || `https://i.pravatar.cc/150?u=${user.telegramId}`,
      points: user.balance,
      rank: index + 1,
      isCurrentUser: user.telegramId === currentUserId
    }));

    // Get current user's rank if userId is provided and user is not in top list
    let currentUserRank = null;
    if (currentUserId && !leaderboardData.some(user => user.id === currentUserId)) {
      // Count users with higher total earned than current user
      const currentUser = await User.findOne({ 
        telegramId: currentUserId,
        status: 'active'
      }) 

      if (currentUser) {
        const usersAbove = await User.countDocuments({
          status: 'active',
          balance: { $gt: currentUser.balance},
          ...dateFilter
        });

        currentUserRank = {
          id: currentUser.telegramId,
          username: currentUser.username,
          avatar: currentUser.profilePicUrl || `https://i.pravatar.cc/150?u=${currentUser.telegramId}`,
          points: currentUser.balance,
          rank: usersAbove + 1,
          isCurrentUser: true
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: leaderboardData,
        currentUserRank,
        period,
        totalUsers: await User.countDocuments({ status: 'active', ...dateFilter })
      }
    });

  } catch (error: any) {
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch leaderboard data',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
