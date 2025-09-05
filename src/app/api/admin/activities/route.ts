import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Activity from '@/models/Activity';
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

// GET - Fetch activities with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Filter parameters
    const type = searchParams.get('type');
    const telegramId = searchParams.get('telegramId');
    const username = searchParams.get('username');
    
    // Date range filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Reward filters
    const minReward = searchParams.get('minReward');
    const maxReward = searchParams.get('maxReward');

    // Build query object
    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (telegramId) {
      query.telegramId = telegramId;
    }
    
    // If searching by username, first find matching users
    let userTelegramIds: string[] = [];
    if (username) {
      const users = await User.find({
        $or: [
          { username: { $regex: username, $options: 'i' } },
          { telegramUsername: { $regex: username, $options: 'i' } }
        ]
      }).select('telegramId');
      userTelegramIds = users.map(u => u.telegramId);
      
      if (userTelegramIds.length > 0) {
        query.telegramId = { $in: userTelegramIds };
      } else {
        // No matching users found, return empty result
        return NextResponse.json({
          success: true,
          data: {
            activities: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalCount: 0,
              limit,
              hasNextPage: false,
              hasPrevPage: false
            },
            summary: {
              typeBreakdown: [],
              totalRewards: 0,
              avgReward: 0
            }
          }
        });
      }
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Reward filters
    if (minReward || maxReward) {
      query.reward = {};
      if (minReward) {
        query.reward.$gte = parseFloat(minReward);
      }
      if (maxReward) {
        query.reward.$lte = parseFloat(maxReward);
      }
    }

    // Execute queries in parallel for better performance
    const [activities, totalCount] = await Promise.all([
      Activity.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments(query)
    ]);

    // Get user information for activities
    const activitiesWithUsers = await Promise.all(
      activities.map(async (activity) => {
        const user = await User.findOne({ telegramId: activity.telegramId }).select('username telegramUsername');
        return {
          ...activity,
          username: user?.username || 'Unknown',
          telegramUsername: user?.telegramUsername || null
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate summary statistics
    const [typeStats, rewardStats] = await Promise.all([
      Activity.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: '$type', 
            count: { $sum: 1 },
            totalReward: { $sum: '$reward' }
          } 
        }
      ]),
      Activity.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: null, 
            totalRewards: { $sum: '$reward' },
            avgReward: { $avg: '$reward' },
            count: { $sum: 1 }
          } 
        }
      ])
    ]);

    const response = {
      success: true,
      data: {
        activities: activitiesWithUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        },
        summary: {
          typeBreakdown: typeStats,
          totalRewards: rewardStats[0]?.totalRewards || 0,
          avgReward: rewardStats[0]?.avgReward || 0,
          totalActivities: rewardStats[0]?.count || 0
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
