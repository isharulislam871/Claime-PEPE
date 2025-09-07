import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!telegramId) {
      return NextResponse.json({
        success: false,
        error: 'telegramId is required'
      }, { status: 400 });
    }

    // Build query
    const query: any = { telegramId };

    // Add type filter if provided
    if (type) {
      query.type = type;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get activities with pagination
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Activity.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Get activity statistics
    const stats = await Activity.aggregate([
      { $match: { telegramId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalReward: { $sum: '$reward' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      activities,
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalReward: stat.totalReward
        };
        return acc;
      }, {}),
      result: {
        result: {
          activities,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          },
          stats: stats.reduce((acc, stat) => {
            acc[stat._id] = {
              count: stat.count,
              totalReward: stat.totalReward
            };
            return acc;
          }, {})
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user activities:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user activities'
    }, { status: 500 });
  }
}
