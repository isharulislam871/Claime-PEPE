import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Get parameters
    const referralCode = searchParams.get('referralCode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!referralCode) {
      return NextResponse.json(
        { success: false, message: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Build query for referrals
    const query: any = {
      referredBy: referralCode
    };

    // Add search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { telegramId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { telegramUsername: { $regex: search, $options: 'i' } }
      ];
    }

    // For status filtering, we'll need to get active users from Activity model first
    let activeUserIds: string[] = [];
    if (status === 'active' || status === 'inactive') {
      const recentActivities = await Activity.aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: '$telegramId'
          }
        }
      ]);
      
      activeUserIds = recentActivities.map((activity: any) => activity._id);
      
      if (status === 'active') {
        query.telegramId = { $in: activeUserIds };
      } else if (status === 'inactive') {
        query.telegramId = { $nin: activeUserIds };
      }
    }

    // Add date range filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch referrals with pagination
    const referrals = await User.find(query)
      .select('telegramId username firstName lastName telegramUsername balance totalEarned referralCount createdAt lastActiveAt updatedAt totalAdsViewed totalTasks ipAddress userAgent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    // Get activity data for all referrals to determine last active status
    const referralTelegramIds = referrals.map((user: any) => user.telegramId);
    
    // Get last activity for each user from Activity model
    const lastActivities = await Activity.aggregate([
      {
        $match: {
          telegramId: { $in: referralTelegramIds }
        }
      },
      {
        $group: {
          _id: '$telegramId',
          lastActivity: { $max: '$timestamp' }
        }
      }
    ]);

    // Create a map for quick lookup
    const activityMap = new Map();
    lastActivities.forEach((activity: any) => {
      activityMap.set(activity._id, activity.lastActivity);
    });

    // Format referrals with computed fields using Activity data
    const formattedReferrals = referrals.map((user: any) => {
      const lastActivityFromDB = activityMap.get(user.telegramId);
      const lastActiveAt = lastActivityFromDB || user.lastActiveAt;
      
      return {
        ...user,
        _id: user._id.toString(),
        isActive: lastActiveAt ? 
          (Date.now() - new Date(lastActiveAt).getTime()) < (7 * 24 * 60 * 60 * 1000) : 
          false,
        createdAt: user.createdAt.toISOString(),
        lastActiveAt: lastActiveAt ? new Date(lastActiveAt).toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
      };
    });

    // Calculate statistics using Activity data for more accurate active count
    const allReferrals: any[] = await User.find({ referredBy: referralCode }).lean();
    const allReferralIds = allReferrals.map((user: any) => user.telegramId);
    
    // Get all last activities for statistics
    const allLastActivities = await Activity.aggregate([
      {
        $match: {
          telegramId: { $in: allReferralIds }
        }
      },
      {
        $group: {
          _id: '$telegramId',
          lastActivity: { $max: '$timestamp' }
        }
      }
    ]);

    // Create activity map for all referrals
    const allActivityMap = new Map();
    allLastActivities.forEach((activity: any) => {
      allActivityMap.set(activity._id, activity.lastActivity);
    });

    // Count active referrals using Activity data
    const activeReferrals = allReferrals.filter((user: any) => {
      const lastActivityFromDB = allActivityMap.get(user.telegramId);
      const lastActiveAt = lastActivityFromDB || user.lastActiveAt;
      return lastActiveAt && (Date.now() - new Date(lastActiveAt).getTime()) < (7 * 24 * 60 * 60 * 1000);
    }).length;

    // Get task completion statistics from Activity model
    const taskStats = await Activity.aggregate([
      {
        $match: {
          telegramId: { $in: allReferralIds },
          type: 'task_complete'
        }
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 }
        }
      }
    ]);

    // Get ad viewing statistics from Activity model
    const adStats = await Activity.aggregate([
      {
        $match: {
          telegramId: { $in: allReferralIds },
          type: 'ad_view'
        }
      },
      {
        $group: {
          _id: null,
          totalAdsViewed: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalReferrals: allReferrals.length,
      activeReferrals: activeReferrals,
      totalEarnings: allReferrals.reduce((sum: number, user: any) => sum + (user.totalEarned || 0), 0),
      averageEarningsPerReferral: allReferrals.length > 0 ? 
        allReferrals.reduce((sum: number, user: any) => sum + (user.totalEarned || 0), 0) / allReferrals.length : 
        0,
      totalAdsViewed: adStats.length > 0 ? adStats[0].totalAdsViewed : 0,
      totalTasks: taskStats.length > 0 ? taskStats[0].totalTasks : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        referrals: formattedReferrals,
        stats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}
