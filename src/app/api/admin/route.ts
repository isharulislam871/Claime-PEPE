import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import Activity from '@/models/Activity';
import { sendErc20 , getERC20Decimals  } from 'auth-fingerprint'
// GET /api/admin - Get admin dashboard stats
export async function GET(request: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  switch (action) {
    case 'stats':
      return await getAdminStats();
    case 'users':
      return await getUsers(searchParams);
    case 'withdrawals':
      return await getWithdrawals(searchParams);
    default:
      return await getAdminStats();
  }
}

// POST /api/admin - Admin actions
export async function POST(request: NextRequest) {
  await dbConnect();
  
  const body = await request.json();
  const { action, ...data } = body;
  
  switch (action) {
    case 'update_user':
      return await updateUser(data);
    case 'ban_user':
      return await banUser(data);
    case 'unban_user':
      return await unbanUser(data);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// Helper functions
async function getAdminStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const [
    totalUsers,
    activeUsers,
    todayUsers,
    totalWithdrawals,
    pendingWithdrawals,
    completedWithdrawals,
    failedWithdrawals,
    totalWithdrawalAmount,
    totalDistributedAmount,
    todayAdsViewed
  ] = await Promise.all([
    User.countDocuments(),
    Activity.aggregate([
      {
        $match: {
          type: { $in: ['ad_view', 'ad_view_home'] },
          timestamp: { $gte: twoHoursAgo }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      }
    ]),
    User.countDocuments({ createdAt: { $gte: today } }),
    Withdrawal.countDocuments(),
    Withdrawal.countDocuments({ status: 'pending' }),
    Withdrawal.countDocuments({ status: 'completed' }),
    Withdrawal.countDocuments({ status: 'failed' }),
    Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarned' } } }
    ]),
    Activity.aggregate([
      {
        $match: {
          type: { $in: ['ad_view', 'ad_view_home'] },
          createdAt: { $gte: today }
        }
      },
      {
        $count: "total"
      }
    ])
  ]);
 
 

  return NextResponse.json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        active: activeUsers.length ,
        todayRegistered: todayUsers,
        inactive: totalUsers - activeUsers.length
      },
      withdrawals: {
        total: totalWithdrawals,
        pending: pendingWithdrawals,
        completed: completedWithdrawals,
        failed: failedWithdrawals,
        totalAmount: totalWithdrawalAmount[0]?.total || 0
      },
      pepe: {
        totalDistributed: totalDistributedAmount[0]?.total || 0,
        todayAdsViewed: todayAdsViewed[0]?.total || 0
      }
    }
  });
}


async function getUsers(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  
  const skip = (page - 1) * limit;
  
  let query: any = {};
  
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { telegramId: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status !== 'all') {
    if (status === 'banned') {
      query.banned = true;
    } else if (status === 'active') {
      query.banned = { $ne: true };
      query.lastActive = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }
  }
  
  const [users, total] = await Promise.all([
    User.find(query)
      .select('username telegramId balance totalEarned referralCount banned lastActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ]);
  
  return NextResponse.json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}

async function getWithdrawals(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || 'all';
  
  const skip = (page - 1) * limit;
  
  let query: any = {};
  if (status !== 'all') {
    query.status = status;
  }
  
  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(query)
      .populate('userId', 'username telegramId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Withdrawal.countDocuments(query)
  ]);
  
  return NextResponse.json({
    success: true,
    withdrawals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}


async function updateUser(data: any) {
  const { userId, updates } = data;
  
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  Object.assign(user, updates);
  await user.save();
  
  return NextResponse.json({
    success: true,
    user,
    message: 'User updated successfully'
  });
}

async function banUser(data: any) {
  const { userId, reason } = data;
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  user.status = 'ban';
  user.banReason = reason;
  await user.save();
  
  return NextResponse.json({
    success: true,
    message: 'User banned successfully'
  });
}

async function unbanUser(data: any) {
  const { userId } = data;
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  user.status = 'active';
  user.banReason = undefined;
  await user.save();
  
  return NextResponse.json({
    success: true,
    message: 'User unbanned successfully'
  });
}
