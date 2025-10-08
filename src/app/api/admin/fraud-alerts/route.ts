import { NextRequest, NextResponse } from 'next/server';
import  connectDB   from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

 

// GET - Fetch fraud alerts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const alertType = searchParams.get('alertType');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build date filter if provided
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Build aggregation pipeline for fraud detection
    const pipeline: any[] = [
      // Match users with suspicious patterns
      {
        $match: {
          $and: [
            {
              $or: [
                // Multiple accounts from same IP (mock detection)
                { 'ipAddress': { $exists: true } },
                // High withdrawal frequency
                { totalEarned: { $gt: 25000 } },
                // Suspicious referral patterns
                { referralCount: { $gt: 10 } },
                // Bot-like behavior (high activity)
                { balance: { $gt: 25000 } },
                // Users with high earning rates
                { 'metadata.lastActivity': { $exists: true } }
              ]
            },
            // Apply date filter if provided
            ...Object.keys(dateFilter).length > 0 ? [dateFilter] : []
          ]
        }
      },
      // Add computed fraud alert fields
      {
        $addFields: {
          alertType: {
            $switch: {
              branches: [
                {
                  case: { 
                    $and: [
                      { $gt: ['$referralCount', 20] },
                      { $ne: ['$ipAddress', null] }
                    ]
                  },
                  then: 'multiple_accounts'
                },
                {
                  case: { $gt: ['$referralCount', 10] },
                  then: 'referral_abuse'
                },
                {
                  case: { 
                    $and: [
                      { $gt: ['$totalEarned', 100000] },
                      { $lt: [
                        { $divide: [
                          { $subtract: [new Date(), '$createdAt'] },
                          86400000
                        ]}, 
                        30
                      ]}
                    ]
                  },
                  then: 'bot_behavior'
                },
                {
                  case: { $gt: ['$balance', 50000] },
                  then: 'withdrawal_pattern'
                }
              ],
              default: 'suspicious_activity'
            }
          },
          severity: {
            $switch: {
              branches: [
                {
                  case: { 
                    $or: [
                      { $gt: ['$totalEarned', 500000] },
                      { $gt: ['$referralCount', 200] }
                    ]
                  },
                  then: 'critical'
                },
                {
                  case: { 
                    $or: [
                      { $gt: ['$totalEarned', 200000] },
                      { $gt: ['$referralCount', 100] },
                      { $gt: ['$balance', 100000] }
                    ]
                  },
                  then: 'high'
                },
                {
                  case: { 
                    $or: [
                      { $gt: ['$totalEarned', 100000] },
                      { $gt: ['$referralCount', 50] },
                      { $gt: ['$balance', 50000] }
                    ]
                  },
                  then: 'medium'
                }
              ],
              default: 'low'
            }
          },
          description: {
            $switch: {
              branches: [
                {
                  case: { $gt: ['$referralCount', 100] },
                  then: 'Multiple accounts detected from same source'
                },
                {
                  case: { $gt: ['$referralCount', 50] },
                  then: 'Suspicious referral patterns detected'
                },
                {
                  case: { $gt: ['$totalEarned', 200000] },
                  then: 'Automated behavior patterns detected'
                },
                {
                  case: { $gt: ['$balance', 50000] },
                  then: 'Unusual withdrawal patterns detected'
                }
              ],
              default: 'Suspicious activity patterns detected'
            }
          }
        }
      },
      // Apply filters
      {
        $match: {
          ...(alertType && alertType !== 'all' && { alertType }),
          ...(severity && severity !== 'all' && { severity }),
          ...(search && {
            $or: [
              { username: { $regex: search, $options: 'i' } },
              { telegramId: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { 'details.ipAddress': { $regex: search, $options: 'i' } }
            ]
          })
        }
      },
      // Project final structure
      {
        $project: {
          _id: 1,
          userId: '$_id',
          username: 1,
          telegramId: 1,
          alertType: 1,
          severity: 1,
          description: 1,
          details: {
            ipAddress: { $ifNull: ['$ipAddress', 'Unknown'] },
            deviceFingerprint: { $ifNull: ['$metadata.deviceFingerprint', { $concat: ['fp_', '$telegramId'] }] },
            suspiciousTransactions: { $cond: [{ $gt: ['$totalEarned', 100000] }, { $divide: ['$totalEarned', 1000] }, 0] },
            relatedAccounts: { $ifNull: ['$metadata.relatedAccounts', []] },
            totalEarned: '$totalEarned',
            balance: '$balance',
            referralCount: '$referralCount'
          },
          createdAt: 1,
          updatedAt: 1,
        }
      },
      // Sort by risk score and creation date
      {
        $sort: { createdAt: -1, totalEarned: -1 }
      }
    ];

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await User.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Get paginated results
    const alerts = await User.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit }
    ]);

    // Calculate statistics
    const statsPipeline = [
      ...pipeline.slice(0, -2), // Remove sort and project for stats
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: 1
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          },
          high: {
            $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
          }
        }
      }
    ];

    const statsResult = await User.aggregate(statsPipeline);
    const stats = statsResult[0] || {
      total: 0,
      pending: 0,
      critical: 0,
      high: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          pageSize: limit,
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching fraud alerts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fraud alerts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

 