import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

// Database connection
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET - Fetch users with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
 
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
   
    const skip = (page - 1) * 100;

    // Filter parameters
    const status = searchParams.get('status');
    
    const username = searchParams.get('username');
    const referredBy = searchParams.get('referredBy');
    
    // Date range filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Balance filters
    const minBalance = searchParams.get('minBalance');
    const maxBalance = searchParams.get('maxBalance');
    const minEarned = searchParams.get('minEarned');
    const maxEarned = searchParams.get('maxEarned');

    // Build query object
    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    const usernameParam = searchParams.get('username') || '';

    // Allow only letters (a–z, A–Z) and hyphens (-)
    const textPart = usernameParam.replace(/[^a-zA-Z-]/g, '');
    
    // Extract numbers and convert to Number type if present
    const numberMatch = usernameParam.match(/\d+/);
    const numberPart = numberMatch ? Number(numberMatch[0]) : null;


 
  
  
      if (numberPart) {
        query.telegramId = numberPart;
      }
 
    if (textPart) {
      query.$or = [
        { username: { $regex: textPart, $options: 'i' } },
        { telegramUsername: { $regex: textPart, $options: 'i' } }
      ];
    }
    
    if (referredBy) {
      query.referredBy = referredBy;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Balance filters
    if (minBalance || maxBalance) {
      query.balance = {};
      if (minBalance) {
        query.balance.$gte = parseFloat(minBalance);
      }
      if (maxBalance) {
        query.balance.$lte = parseFloat(maxBalance);
      }
    }
    
    // Total earned filters
    if (minEarned || maxEarned) {
      query.totalEarned = {};
      if (minEarned) {
        query.totalEarned.$gte = parseFloat(minEarned);
      }
      if (maxEarned) {
        query.totalEarned.$lte = parseFloat(maxEarned);
      }
    }

    // Execute queries in parallel for better performance
    const [users, totalCount] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(100)
        .lean(),
      User.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / 100);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate summary statistics
    const [statusStats, earningsStats, balanceStats] = await Promise.all([
      User.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: '$status', 
            count: { $sum: 1 },
            totalBalance: { $sum: '$balance' },
            totalEarned: { $sum: '$totalEarned' }
          } 
        }
      ]),
      User.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: null, 
            totalEarnings: { $sum: '$totalEarned' },
            totalBalance: { $sum: '$balance' },
            totalReferrals: { $sum: '$referralCount' },
            avgEarnings: { $avg: '$totalEarned' },
            avgBalance: { $avg: '$balance' }
          } 
        }
      ]),
      User.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            highEarners: { 
              $sum: { $cond: [{ $gte: ['$totalEarned', 10000] }, 1, 0] } 
            },
            activeUsers: { 
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
            },
            newUsers: { 
              $sum: { 
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }, 
                  1, 
                  0
                ] 
              } 
            }
          }
        }
      ])
    ]);

    const response = {
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit:100,
          hasNextPage,
          hasPrevPage
        },
        summary: {
          statusBreakdown: statusStats,
          totalStats: earningsStats[0] || {
            totalEarnings: 0,
            totalBalance: 0,
            totalReferrals: 0,
            avgEarnings: 0,
            avgBalance: 0
          },
          userSegments: balanceStats[0] || {
            highEarners: 0,
            activeUsers: 0,
            newUsers: 0
          }
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin override)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      telegramId,
      username,
      telegramUsername,
      profilePicUrl,
      balance = 0,
      status = 'active'
    } = body;

    // Validate required fields
    if (!telegramId || !username || !telegramUsername) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: telegramId, username, telegramUsername' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findByTelegramId(telegramId);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this Telegram ID already exists' },
        { status: 409 }
      );
    }

    // Generate referral code
    const referralCode = `REF_${telegramId}_${Date.now()}`;

    // Create new user
    const user = await User.createUser({
      telegramId,
      username,
      telegramUsername,
      profilePicUrl,
      balance: Number(balance),
      status,
      referralCode
    });

    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PATCH - Update user status or details
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { telegramId, updates } = body;

    if (!telegramId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing telegramId or updates' },
        { status: 400 }
      );
    }

    if (updates.status && !['active', 'ban', 'suspend'].includes(updates.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (updates.balance && typeof updates.balance !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid balance value' },
        { status: 400 }
      );
    } 
    const user = await User.findOneAndUpdate(
      { telegramId },
      { $set:  updates  },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
