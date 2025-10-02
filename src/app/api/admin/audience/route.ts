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

// GET - Fetch audience counts for different segments
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Calculate date ranges
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 30);

    // Run all queries in parallel for better performance
    const [
      allUsers,
      activeUsers,
      newUsers,
      highEarners,
      inactiveUsers
    ] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ 
        status: 'active',
        updatedAt: { $gte: sevenDaysAgo }
      }),
      User.countDocuments({ 
        status: 'active',
        createdAt: { $gte: thirtyDaysAgo }
      }),
      User.countDocuments({ 
        status: 'active',
        totalEarned: { $gte: 10000 }
      }),
      User.countDocuments({ 
        status: 'active',
        updatedAt: { $lt: inactiveDate }
      })
    ]);

    const audienceCounts = {
      all: allUsers,
      active_users: activeUsers,
      new_users: newUsers,
      high_earners: highEarners,
      inactive_users: inactiveUsers
    };

    return NextResponse.json({
      success: true,
      data: audienceCounts
    });
  } catch (error) {
    console.error('Error fetching audience counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audience counts' },
      { status: 500 }
    );
  }
}
