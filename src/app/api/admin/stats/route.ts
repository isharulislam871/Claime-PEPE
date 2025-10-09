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
  // Define the start of today (00:00:00)
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 

// Define the exclusive end of today (00:00:00 tomorrow)
const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

// Define the last millisecond of today (23:59:59.999 today)
// Note: Using 'startOfTomorrow' as the $lt boundary is generally preferred for queries, 
// but using 'lastMillisecondOfToday' works for the $lte boundary.
const lastMillisecondOfToday = new Date(startOfTomorrow.getTime() - 1); 


    const [
      totalUsers,
      todayRegistered,
      activeUsersToday // Renamed for clarity
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        // Counts users registered between 00:00:00 today (inclusive) and 00:00:00 tomorrow (exclusive)
        createdAt: { $gte: startOfToday, $lt: startOfTomorrow }
      }),
      Activity.aggregate([
        {
          // 1. FILTER: Match documents for today and 'ad_view' type
          $match: {
            type: 'ad_view',
            createdAt: { $gte: startOfToday, $lt: startOfTomorrow }
          }
        },
        {
          // 2. GROUP: Group by the unique 'telegramId' field. 
          // The _id field in the output documents will be the unique telegramId.
          $group: {
            _id: '$telegramId'
          }
        },
        {
          // 3. COUNT: Count the number of unique groups (which are the unique users)
          $count: 'count' // Puts the final count into a field named 'count'
        }
      ]) 
    ]);

    const finalActiveTelegramUsersToday = activeUsersToday.length > 0 
    ? activeUsersToday[0].count 
    : 0;

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
        // Change: Use $gte (inclusive) start of today and $lt (exclusive) start of tomorrow.
        createdAt: { $gte: startOfToday, $lt: startOfTomorrow } 
    })
    ]);

    // Compile statistics
    const stats = {
      users: {
        total: totalUsers,
        active: finalActiveTelegramUsersToday,
        todayRegistered: todayRegistered,
  
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


    console.log(stats)

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
