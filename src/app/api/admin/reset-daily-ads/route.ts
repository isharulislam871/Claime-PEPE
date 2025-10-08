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

// POST - Reset daily ads for all users
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Reset tasksCompletedToday to 0 for all users
    const result = await User.updateMany(
      {}, // Empty filter means all documents
      { 
        $set: { 
          tasksCompletedToday: 0,
          lastTaskTimestamp: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully reset daily ads for ${result.modifiedCount} users`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error('Error resetting daily ads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset daily ads for users' },
      { status: 500 }
    );
  }
}

// GET - Check how many users would be affected by reset
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments({});
    const usersWithAdsToday = await User.countDocuments({ 
      tasksCompletedToday: { $gt: 0 } 
    });

    return NextResponse.json({
      success: true,
      totalUsers,
      usersWithAdsToday,
      usersToReset: usersWithAdsToday
    });
  } catch (error) {
    console.error('Error checking users for reset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check users' },
      { status: 500 }
    );
  }
}
