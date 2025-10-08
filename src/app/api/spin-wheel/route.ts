import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, reward } = await request.json();

    console.log(telegramId, reward);
    
    if (!telegramId || !reward) {
      return NextResponse.json({ 
        error: 'Telegram ID and reward are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ telegramId });
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Check if user already spun today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const lastSpin = user.lastSpinWheel ? new Date(user.lastSpinWheel) : null;
    const lastSpinStart = lastSpin ? 
      new Date(lastSpin.getFullYear(), lastSpin.getMonth(), lastSpin.getDate()) : null;

    if (lastSpinStart && lastSpinStart.getTime() === todayStart.getTime()) {
      return NextResponse.json({ 
        error: 'Spin wheel already used today' 
      }, { status: 400 });
    }

    // Validate reward amount (should be one of the predefined values)
    const validRewards = [50, 100, 200, 500, 1000];
    if (!validRewards.includes(reward)) {
      return NextResponse.json({ 
        error: 'Invalid reward amount' 
      }, { status: 400 });
    }

    // Update user balance and spin data
    user.balance += reward;
    user.lastSpinWheel = today;
    user.totalSpins = (user.totalSpins || 0) + 1;
    user.totalEarned += reward;

    await user.save();

    // Log activity
    const activity = new Activity({
      telegramId,
      type: 'bonus',
      description: `Lucky spin wheel completed`,
      reward: reward,
      metadata: {
        spinType: 'lucky_wheel',
        reward: reward,
        spinNumber: user.totalSpins
      },
      timestamp: today
    });

    await activity.save();

    return NextResponse.json({
      success: true,
      message: `🎉 Spin complete! +${reward} PEPE!`,
      user: {
        _id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        telegramUsername: user.telegramUsername,
        profilePicUrl: user.profilePicUrl,
        balance: user.balance,
        tasksCompletedToday: user.tasksCompletedToday,
        lastTaskTimestamp: user.lastTaskTimestamp,
        totalEarned: user.totalEarned,
        totalAdsViewed: user.totalAdsViewed,
        totalRefers: user.totalRefers,
        joinedBonusTasks: user.joinedBonusTasks,
        referredBy: user.referredBy,
        referralEarnings: user.referralEarnings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      spin: {
        reward: reward,
        totalSpins: user.totalSpins,
        nextSpinAvailable: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    console.error('Error processing spin wheel:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ 
        error: 'Telegram ID is required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ telegramId });
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Check if user can spin today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const lastSpin = user.lastSpinWheel ? new Date(user.lastSpinWheel) : null;
    const lastSpinStart = lastSpin ? 
      new Date(lastSpin.getFullYear(), lastSpin.getMonth(), lastSpin.getDate()) : null;

    const canSpin = !lastSpinStart || lastSpinStart.getTime() !== todayStart.getTime();
    
    // Get possible rewards
    const possibleRewards = [50, 100, 200, 500, 1000];

    return NextResponse.json({
      canSpin,
      totalSpins: user.totalSpins || 0,
      lastSpin: lastSpin?.toISOString() || null,
      possibleRewards,
      nextSpinAvailable: canSpin ? null : new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    });

  } catch (error) {
    console.error('Error getting spin wheel status:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
