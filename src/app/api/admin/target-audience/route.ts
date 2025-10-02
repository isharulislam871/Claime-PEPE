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

// Helper function to get audience count by type
async function getAudienceCount(audience: string): Promise<number> {
  try {
    switch (audience) {
      case 'all':
        return await User.countDocuments({ status: 'active' });
      case 'active_users':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return await User.countDocuments({ 
          status: 'active',
          updatedAt: { $gte: sevenDaysAgo }
        });
      case 'new_users':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return await User.countDocuments({ 
          status: 'active',
          createdAt: { $gte: thirtyDaysAgo }
        });
      case 'pending_withdrawals':
        // This would need a withdrawal model/field in User schema
        // For now, return 0 as placeholder
        return 0;
      case 'high_earners':
        return await User.countDocuments({ 
          status: 'active',
          totalEarned: { $gte: 10000 }
        });
      case 'inactive_users':
        const inactiveDate = new Date();
        inactiveDate.setDate(inactiveDate.getDate() - 30);
        return await User.countDocuments({ 
          status: 'active',
          updatedAt: { $lt: inactiveDate }
        });
      default:
        return 0;
    }
  } catch (error) {
    console.error('Error getting audience count:', error);
    return 0;
  }
}

// Helper function to get users by audience type
async function getUsersByAudience(audience: string, limit?: number): Promise<any[]> {
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
      .select('telegramId username totalEarned createdAt updatedAt')
      .limit(limit || 100)
      .lean();

    return users;
  } catch (error) {
    console.error('Error getting users by audience:', error);
    return [];
  }
}

// GET - Get target audience information
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get('audience');
    const includeUsers = searchParams.get('includeUsers') === 'true';
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!audience) {
      return NextResponse.json(
        { success: false, error: 'Audience type is required' },
        { status: 400 }
      );
    }

    // Get audience count
    const count = await getAudienceCount(audience);
    
    const response: any = {
      success: true,
      data: {
        audience,
        count,
        description: getAudienceDescription(audience)
      }
    };

    // Include user list if requested
    if (includeUsers) {
      const users = await getUsersByAudience(audience, limit);
      response.data.users = users;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching target audience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch target audience' },
      { status: 500 }
    );
  }
}

// POST - Get multiple audience counts at once
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { audiences } = body;

    if (!audiences || !Array.isArray(audiences)) {
      return NextResponse.json(
        { success: false, error: 'Audiences array is required' },
        { status: 400 }
      );
    }

    // Get counts for all requested audiences in parallel
    const audienceCounts = await Promise.all(
      audiences.map(async (audience: string) => ({
        audience,
        count: await getAudienceCount(audience),
        description: getAudienceDescription(audience)
      }))
    );

    return NextResponse.json({
      success: true,
      data: audienceCounts.reduce((acc, item) => {
        acc[item.audience] = {
          count: item.count,
          description: item.description
        };
        return acc;
      }, {} as any)
    });
  } catch (error) {
    console.error('Error fetching multiple audiences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audience counts' },
      { status: 500 }
    );
  }
}

// Helper function to get audience description
function getAudienceDescription(audience: string): string {
  switch (audience) {
    case 'all':
      return 'All active users';
    case 'active_users':
      return 'Users active in the last 7 days';
    case 'new_users':
      return 'Users who joined in the last 30 days';
    case 'pending_withdrawals':
      return 'Users with pending withdrawal requests';
    case 'high_earners':
      return 'Users who have earned more than 10,000 PEPE tokens';
    case 'inactive_users':
      return 'Users who have been inactive for more than 30 days';
    default:
      return 'Unknown audience type';
  }
}
