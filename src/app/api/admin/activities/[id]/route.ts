import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

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

// GET /api/admin/activities/[id] - Get individual activity details
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { id: activityId } = await context.params;

    if (!activityId) {
      return NextResponse.json(
        { success: false, error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the activity by ID
    const activity: any = await Activity.findById(activityId).lean();

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Get user information
    const user: any = await User.findOne({ telegramId: activity.telegramId })
      .select('username firstName lastName telegramId telegramUsername')
      .lean();

    // Format the response based on actual Activity model structure
    const formattedActivity = {
      _id: activity._id?.toString() || '',
      telegramId: activity.telegramId || '',
      username: user?.username || 'Unknown',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      telegramUsername: user?.telegramUsername || '',
      type: activity.type || '',
      description: activity.description || '',
      reward: activity.reward || 0,
      metadata: activity.metadata || {},
      ipAddress: activity.ipAddress || '',
      hash: activity.hash || '',
      timestamp: activity.timestamp ? new Date(activity.timestamp).toISOString() : new Date().toISOString(),
      createdAt: activity.createdAt ? new Date(activity.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: activity.updatedAt ? new Date(activity.updatedAt).toISOString() : new Date().toISOString(),
      // Additional computed fields
      activityCategory: getActivityCategory(activity.type || ''),
      riskLevel: getRiskLevel(activity.type || '', activity.reward || 0),
      deviceInfo: parseUserAgent((activity.metadata?.userAgent || activity.userAgent) || ''),
      locationInfo: {
        ipAddress: activity.ipAddress || 'Unknown',
        // Could be enhanced with IP geolocation
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedActivity
    });

  } catch (error: any) {
    console.error('Error fetching activity details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


// Helper functions
function getActivityCategory(type: string): string {
  const categories: { [key: string]: string } = {
    'ad_view': 'Advertising',
    'task_completion': 'Tasks',
    'referral': 'Referrals',
    'bonus': 'Bonuses',
    'withdrawal': 'Withdrawals',
    'login': 'Authentication',
    'signup': 'Authentication',
    'profile_update': 'Profile',
    'settings_change': 'Settings'
  };
  
  return categories[type] || 'Other';
}

function getRiskLevel(type: string, amount?: number): 'low' | 'medium' | 'high' {
  // High-risk activities
  if (['withdrawal', 'bonus'].includes(type) && amount && amount > 100000) {
    return 'high';
  }
  
  // Medium-risk activities
  if (['withdrawal', 'profile_update', 'settings_change'].includes(type)) {
    return 'medium';
  }
  
  // Low-risk activities
  return 'low';
}

function parseUserAgent(userAgent: string): any {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
  
  // Simple user agent parsing (could be enhanced with a proper library)
  const browser = userAgent.includes('Chrome') ? 'Chrome' :
                 userAgent.includes('Firefox') ? 'Firefox' :
                 userAgent.includes('Safari') ? 'Safari' :
                 userAgent.includes('Edge') ? 'Edge' : 'Unknown';
                 
  const os = userAgent.includes('Windows') ? 'Windows' :
            userAgent.includes('Mac') ? 'macOS' :
            userAgent.includes('Linux') ? 'Linux' :
            userAgent.includes('Android') ? 'Android' :
            userAgent.includes('iOS') ? 'iOS' : 'Unknown';
            
  const device = userAgent.includes('Mobile') ? 'Mobile' :
                userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';
  
  return { browser, os, device };
}
