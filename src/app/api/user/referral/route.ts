import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateUniqueReferralCode } from '@/lib/utils/referralCode';

// GET - Get user's referral information
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    
    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ telegramId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        totalEarned: user.totalEarned
      }
    });
    
  } catch (error) {
    console.error('Error getting user referral info:', error);
    return NextResponse.json(
      { error: 'Failed to get referral information' },
      { status: 500 }
    );
  }
}

// POST - Create new user or update referral code
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { telegramId, username, firstName, lastName, referredBy } = body;
    
    if (!telegramId || !firstName) {
      return NextResponse.json(
        { error: 'Telegram ID and first name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ telegramId });
    
    if (user) {
      // User exists, return existing referral code
      return NextResponse.json({
        success: true,
        data: {
          referralCode: user.referralCode,
          referralCount: user.referralCount,
          referralEarnings: user.referralEarnings,
          totalEarned: user.totalEarned,
          isNewUser: false
        }
      });
    }

    // Generate unique referral code
    const referralCode = await generateUniqueReferralCode();
    
    // Create new user
    user = new User({
      telegramId,
      username,
      firstName,
      lastName,
      referralCode,
      referredBy
    });

    // If user was referred, update referrer's stats
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referralEarnings: user.referralEarnings,
        totalEarned: user.totalEarned,
        isNewUser: true
      }
    });
    
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create or update user' },
      { status: 500 }
    );
  }
}
