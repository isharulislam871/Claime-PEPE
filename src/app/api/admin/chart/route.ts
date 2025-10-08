import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import Activity from '@/models/Activity';

// GET /api/admin/chart - Get chart data
export async function GET(request: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  switch (type) {
    case 'user_growth':
      return await getUserGrowthData(searchParams);
    case 'withdrawal_stats':
      return await getWithdrawalStats(searchParams);
    case 'ad_performance':
      return await getAdPerformanceData(searchParams);
    case 'activity_stats':
      return await getActivityStats(searchParams);
    default:
      return await getUserGrowthData(searchParams);
  }
}

async function getUserGrowthData(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get('days') || '30');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  try {
    // Get daily user registrations
    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Fill in missing dates with 0 count
    const chartData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const existingData = userGrowthData.find(item => 
        item._id.year === year && 
        item._id.month === month && 
        item._id.day === day
      );
      
      chartData.push({
        date: dateStr,
        users: existingData ? existingData.count : 0,
        label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get cumulative totals
    let cumulativeTotal = await User.countDocuments({ 
      createdAt: { $lt: startDate } 
    });
    
    const cumulativeData = chartData.map(item => {
      cumulativeTotal += item.users;
      return {
        ...item,
        cumulative: cumulativeTotal
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        daily: chartData,
        cumulative: cumulativeData,
        totalUsers: cumulativeTotal,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user growth data' },
      { status: 500 }
    );
  }
}

async function getWithdrawalStats(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get('days') || '30');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  try {
    const withdrawalStats = await Withdrawal.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Process data for chart
    const chartData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const dayData = withdrawalStats.filter(item => 
        item._id.year === year && 
        item._id.month === month && 
        item._id.day === day
      );
      
      const pending = dayData.find(d => d._id.status === 'pending')?.count || 0;
      const completed = dayData.find(d => d._id.status === 'completed')?.count || 0;
      const failed = dayData.find(d => d._id.status === 'failed')?.count || 0;
      const totalAmount = dayData.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
      
      chartData.push({
        date: dateStr,
        pending,
        completed,
        failed,
        totalAmount,
        label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json({
      success: true,
      data: {
        withdrawals: chartData,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching withdrawal stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal stats' },
      { status: 500 }
    );
  }
}

async function getAdPerformanceData(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get('days') || '30');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  try {
    // Get daily ad views from Activity collection
    const adViewsData = await Activity.aggregate([
      {
        $match: {
          type: 'ad_view',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalAdsWatched: { $sum: 1 },
          totalEarnings: { $sum: '$reward' },
          uniqueUsers: { $addToSet: '$telegramId' }
        }
      },
      {
        $addFields: {
          activeUsers: { $size: '$uniqueUsers' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);


 

    // Fill in missing dates
    const chartData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const existingData = adViewsData.find(item => 
        item._id.year === year && 
        item._id.month === month && 
        item._id.day === day
      );
      
      chartData.push({
        date: dateStr,
        adsWatched: existingData?.totalAdsWatched || 0,
        earnings: existingData?.totalEarnings || 0,
        activeUsers: existingData?.activeUsers || 0,
        label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json({
      success: true,
      data: {
        adPerformance: chartData,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching ad performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad performance data' },
      { status: 500 }
    );
  }
}

async function getActivityStats(searchParams: URLSearchParams) {
  const days = parseInt(searchParams.get('days') || '30');
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  try {
    const activityStats = await Activity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            type: '$type'
          },
          count: { $sum: 1 },
          totalReward: { $sum: '$reward' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Process data for chart
    const chartData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      
      const dayData = activityStats.filter(item => 
        item._id.year === year && 
        item._id.month === month && 
        item._id.day === day
      );
      
      const adViews = dayData.find(d => d._id.type === 'ad_view')?.count || 0;
      const taskCompletes = dayData.find(d => d._id.type === 'task_complete')?.count || 0;
      const referrals = dayData.find(d => d._id.type === 'referral')?.count || 0;
      const withdrawals = dayData.find(d => d._id.type === 'withdrawal')?.count || 0;
      const logins = dayData.find(d => d._id.type === 'login')?.count || 0;
      const totalRewards = dayData.reduce((sum, d) => sum + (d.totalReward || 0), 0);
      const totalActivities = dayData.reduce((sum, d) => sum + (d.count || 0), 0);
      
      chartData.push({
        date: dateStr,
        adViews,
        taskCompletes,
        referrals,
        withdrawals,
        logins,
        totalRewards,
        totalActivities,
        label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get activity type breakdown for the entire period
    const typeBreakdown = await Activity.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalReward: { $sum: '$reward' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activities: chartData,
        typeBreakdown,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    );
  }
}
