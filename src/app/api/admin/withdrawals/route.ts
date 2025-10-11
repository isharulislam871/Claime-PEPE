import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Withdrawal from '@/models/Withdrawal';

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

// GET - Fetch withdrawals with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;

    // Filter parameters
    const status = searchParams.get('status');
    const username = searchParams.get('username');
    const userId = searchParams.get('userId');
    const telegramId = searchParams.get('telegramId');
    const method = searchParams.get('method');
    const currency = searchParams.get('currency');
    
    // Date range filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query object
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (username) {
      query.$or = [
        { username: { $regex: username, $options: 'i' } },
        { telegramId: { $regex: username, $options: 'i' } },
        { walletId: { $regex: username, $options: 'i' } }
      ];
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (telegramId) {
      query.telegramId = telegramId;
    }
    
    if (method) {
      query.method = method;
    }
    
    if (currency) {
      query.currency = currency.toUpperCase();
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate && startDate !== 'null' && startDate !== 'undefined') {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          query.createdAt.$gte = start;
        }
      }
      if (endDate && endDate !== 'null' && endDate !== 'undefined') {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Set to end of day
          end.setHours(23, 59, 59, 999);
          query.createdAt.$lte = end;
        }
      }
      
      // If no valid dates were added, remove the createdAt filter
      if (Object.keys(query.createdAt).length === 0) {
        delete query.createdAt;
      }
    }

    // Execute queries in parallel for better performance
    const [withdrawals, totalCount] = await Promise.all([
      Withdrawal.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Withdrawal.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate summary statistics
    const [statusStats, totalAmount] = await Promise.all([
      Withdrawal.aggregate([
        { $match: query },
        { 
          $group: { 
            _id: '$status', 
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          } 
        }
      ]),
      Withdrawal.aggregate([
        { $match: { ...query, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const response = {
      success: true,
      data: {
        withdrawals,
        pagination: {
          currentPage: page,
          totalCount,
          pageSize: limit
        },
        summary: {
          statusBreakdown: statusStats,
          totalCompletedAmount: totalAmount[0]?.total || 0
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch withdrawals' },
      { status: 500 }
    );
  }
}

// POST - Create new withdrawal (admin override)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      telegramId,
      username,
      amount,
      method = 'binancepay',
      walletId,
      currency = 'PEPE'
    } = body;

    // Validate required fields
    if (!userId || !telegramId || !username || !amount || !walletId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new withdrawal
    const withdrawal = new Withdrawal({
      userId,
      telegramId,
      username,
      amount: Number(amount),
      method,
      walletId,
      currency: currency.toUpperCase(),
      network: method, // Use method as network for now
      address: walletId, // Use walletId as address for now
      networkFee: 0,
      status: 'pending'
    });

    await withdrawal.save();

    return NextResponse.json({
      success: true,
      data: withdrawal
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create withdrawal' },
      { status: 500 }
    );
  }
}
