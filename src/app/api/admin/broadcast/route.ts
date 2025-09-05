import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Broadcast from '@/models/Broadcast';
import User from '@/models/User';
import TelegramService from '@/lib/telegram';

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

// GET - Fetch broadcast history
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Build query filters
    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // Get total count for pagination
    const total = await Broadcast.countDocuments(query);

    // Fetch broadcasts with pagination
    const broadcasts = await Broadcast.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get stats using the static method
    const stats = await Broadcast.getStats();

    return NextResponse.json({
      success: true,
      data: broadcasts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching broadcast history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch broadcast history' },
      { status: 500 }
    );
  }
}

// Helper function to get audience count from Target Audience API
async function getAudienceCount(audience: string): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/target-audience?audience=${audience}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data.count;
    } else {
      console.error('Failed to get audience count:', result.error);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching audience count:', error);
    return 0;
  }
}

// Helper function to get user IDs by audience type
async function getUserIdsByAudience(audience: string): Promise<string[]> {
  try {
    let query: any = { status: 'active' };
    
    switch (audience) {
      case 'all':
        // Already set above
        break;
      case 'active_users':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query.updatedAt = { $gte: sevenDaysAgo };
        break;
      case 'new_users':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query.createdAt = { $gte: thirtyDaysAgo };
        break;
      case 'pending_withdrawals':
        // This would need a withdrawal model/field in User schema
        return [];
      case 'high_earners':
        query.totalEarned = { $gte: 10000 };
        break;
      case 'inactive_users':
        const inactiveDate = new Date();
        inactiveDate.setDate(inactiveDate.getDate() - 30);
        query.updatedAt = { $lt: inactiveDate };
        break;
      default:
        return [];
    }

    const users = await User.find(query)
      .select('telegramId')
      .lean();

    return users.map(user => user.telegramId);
  } catch (error) {
    console.error('Error getting user IDs by audience:', error);
    return [];
  }
}

// POST - Create new broadcast
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, message, type, audience, priority = 'normal', sendNow = true, scheduledTime } = body;

    // Validation
    if (!title || !message || !type || !audience) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, message, type, audience' },
        { status: 400 }
      );
    }

    if (!sendNow && !scheduledTime) {
      return NextResponse.json(
        { success: false, error: 'Scheduled time is required when sendNow is false' },
        { status: 400 }
      );
    }

    // Get target audience count from database
    const totalUsers = await getAudienceCount(audience);

    // Create broadcast document
    const broadcastData = {
      title,
      message,
      type,
      audience,
      priority,
      totalUsers,
      status: sendNow ? 'sending' : 'scheduled',
      sentBy: 'Admin', // In production, get from auth context
      scheduledTime: sendNow ? null : new Date(scheduledTime)
    };

    const newBroadcast = await Broadcast.create(broadcastData);

    // Send to Telegram if immediate broadcast
    if (sendNow) {
      try {
        // Get user IDs for the target audience
        const userIds = await getUserIdsByAudience(audience);
        
        const telegramService = new TelegramService();
        const result = await telegramService.sendBroadcast(title, message, type, userIds);
        
        if (result.success) {
          // Update broadcast with actual delivery stats
          newBroadcast.delivered = result.delivered;
          newBroadcast.status = 'completed';
          newBroadcast.sentDate = new Date();
          await newBroadcast.save();
        } else {
          newBroadcast.status = 'failed';
          newBroadcast.delivered = result.delivered;
          newBroadcast.errorMessage = result.errors ? result.errors.join('; ') : 'Failed to send broadcast';
          await newBroadcast.save();
        }
      } catch (telegramError) {
        console.error('Telegram service error:', telegramError);
        newBroadcast.status = 'failed';
        newBroadcast.errorMessage = 'Failed to send to users';
        await newBroadcast.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: sendNow ? 'Broadcast sent successfully' : 'Broadcast scheduled successfully',
      data: newBroadcast
    });
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create broadcast' },
      { status: 500 }
    );
  }
}

// DELETE - Remove broadcast
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Broadcast ID is required' },
        { status: 400 }
      );
    }

    // Find broadcast by ID
    const broadcast = await Broadcast.findById(id);

    if (!broadcast) {
      return NextResponse.json(
        { success: false, error: 'Broadcast not found' },
        { status: 404 }
      );
    }

    // Check if broadcast can be deleted using the instance method
    if (!broadcast.canBeDeleted()) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete broadcast that is currently being sent' },
        { status: 400 }
      );
    }

    // Delete the broadcast
    await Broadcast.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Broadcast deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting broadcast:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete broadcast' },
      { status: 500 }
    );
  }
}
