import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await dbConnect();
    
    const { id } = await context.params;
    
    let user: any = null;
    
    // Check if the ID is a valid MongoDB ObjectId (24 character hex string)
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Search by MongoDB ObjectId
      user = await User.findById(id).lean();
    } else {
      
      user = await User.findOne({ telegramId: id }).lean();
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
   
    // Get last activity from Activity model for more accurate data
    const lastActivity = await Activity.findOne(
      { telegramId: user.telegramId },
      {},
      { sort: { timestamp: -1 } }
    );

    // Get activity statistics
    const [taskCount, adCount] = await Promise.all([
      Activity.countDocuments({ telegramId: user.telegramId, type: 'task_complete' }),
      Activity.countDocuments({ telegramId: user.telegramId, type: 'ad_view' })
    ]);

    // Use Activity data for last active, fallback to user.lastActiveAt
    const lastActiveAt = lastActivity?.timestamp || user.lastActiveAt;

    // Format the response with additional user information
    const formattedUser = {
      ...user,
      accountAge: user.createdAt ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      isActive: lastActiveAt ? (Date.now() - new Date(lastActiveAt).getTime()) < (7 * 24 * 60 * 60 * 1000) : false, // Active within 7 days
      averageEarningsPerDay: user.createdAt ? Math.round((user.totalEarned || 0) / Math.max(1, Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)))) : 0,
      // Additional computed fields using Activity data
      totalAdsViewed: adCount || user.totalAdsViewed || 0,
      totalTasks: taskCount || user.totalTasks || user.tasksCompletedToday || 0,
      ipAddress: user.ipAddress || null,
      userAgent: user.userAgent || null,
      lastActiveAt: lastActiveAt ? new Date(lastActiveAt).toISOString() : null
    };
    
    return NextResponse.json({
      success: true,
      data: formattedUser
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context : any
) {
  try {
    await dbConnect();
    
    const { id } = await context.params;
    const body = await request.json();
    
    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: user,
      message: 'User updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
   context : any
) {
  try {
    await dbConnect();
    
    const { id } = await context.params;
    
    // Delete user
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
