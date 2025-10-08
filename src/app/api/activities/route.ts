import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getClientIP } from '@/lib/utils/getClientIP';
import crypto from 'crypto';

const secretKey = crypto.createHash('sha256').update('my_super_secret_key').digest();

function decrypt(encryptedValue: string) {
  const [ivHex, encrypted] = encryptedValue.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    secretKey,
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    const { hash, type, description, reward = 0, metadata = {} } = await request.json();

    if (!hash || !type || !description) {
      return NextResponse.json({ 
        error: 'Hash, type, and description are required' 
      }, { status: 400 });
    }

    // Decrypt hash to get telegramId
    const decrypted = decrypt(hash);
    const telegramId = decrypted.split(':')[0];

    // Get client IP
    const clientIP = getClientIP(request);

    await connectToDatabase();
    
    // Create activity using Mongoose model
    const activity = new Activity({
      telegramId,
      type,
      description,
      reward,
      metadata,
      timestamp: new Date(),
      ipAddress: clientIP,
      hash
    });

    await activity.save();
     
    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      activity
    });

  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');

    if (!hash) {
      return NextResponse.json({ error: 'Hash is required' }, { status: 400 });
    }

    // Decrypt hash to get telegramId
    const decrypted = decrypt(hash);
    const telegramId = decrypted.split(':')[0];

    // Get client IP
    const clientIP = getClientIP(request);

    await connectToDatabase();
    
    // Build query
    const query: any = { telegramId };
    if (type) {
      query.type = type;
    }

    // Get activities using Mongoose model
    const activities = await Activity
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Get activity stats using Mongoose aggregation
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
      activities,
      stats: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = {
          count: stat.count,
          totalReward: stat.totalReward
        };
        return acc;
      }, {}),
      total: activities.length,
      requestInfo: {
        ipAddress: clientIP,
        hash: hash
      }
    });

  } catch (error) {
    console.error('Error getting activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
