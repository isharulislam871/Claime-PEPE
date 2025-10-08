import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import Activity from '@/models/Activity';

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    // Get current date for last 1 hour stats
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Get user statistics
    const [
      totalUsers,
      todayRegistered,
      activeUsers1h
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        createdAt: { $gte: startOfToday, $lt: endOfToday }
      }),
      // Active users based on last 1 hour ad views only
      Activity.distinct('telegramId', {
        type: 'ad_view',
        createdAt: { $gte: last24Hours }
      }).then(users => users.length)
    ]);

    const inactiveUsers = totalUsers - activeUsers1h;

    // Get withdrawal statistics
    const [
      totalWithdrawals,
      pendingWithdrawals,
      completedWithdrawals,
      failedWithdrawals,
      totalWithdrawalAmount
    ] = await Promise.all([
      Withdrawal.countDocuments(),
      Withdrawal.countDocuments({ status: 'pending' }),
      Withdrawal.countDocuments({ status: 'completed' }),
      Withdrawal.countDocuments({ status: 'failed' }),
      Withdrawal.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    // Get PEPE/Points statistics
    const [
      totalDistributed,
      todayAdsViewed
    ] = await Promise.all([
      // Total points distributed (sum of all user totalEarned)
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$totalEarned' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Last 1 hour ad views from Activity collection
      Activity.countDocuments({
        type: 'ad_view',
        createdAt: { $gte: last24Hours }
      })
    ]);

    // Compile statistics
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers1h,
        todayRegistered: todayRegistered,
        inactive: inactiveUsers
      },
      withdrawals: {
        total: totalWithdrawals,
        pending: pendingWithdrawals,
        completed: completedWithdrawals,
        failed: failedWithdrawals,
        totalAmount: totalWithdrawalAmount
      },
      pepe: {
        totalDistributed: totalDistributed,
        todayAdsViewed: todayAdsViewed
      }
    };

    return NextResponse.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch admin statistics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
