import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, streak = 0 } = await request.json();

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

    // Check if user already claimed today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const lastCheckIn = user.lastDailyCheckIn ? new Date(user.lastDailyCheckIn) : null;
    const lastCheckInStart = lastCheckIn ? 
      new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate()) : null;

    if (lastCheckInStart && lastCheckInStart.getTime() === todayStart.getTime()) {
      return NextResponse.json({ 
        error: 'Daily check-in already claimed today' 
      }, { status: 400 });
    }

    // Calculate reward with 10% increase per cycle and 30-day reset
    const currentCycle = user.dailyCheckInCycle || 1;
    const dayInCycle = (streak % 30) + 1; // Reset every 30 days
    const newStreak = streak + 1;
    const newCycle = Math.floor(newStreak / 30) + 1;
    
    // Base reward: 100 PEPE
    const baseReward = 100;
    // Daily bonus: increases by day in cycle
    const dailyBonus = dayInCycle * 10;
    // Cycle bonus: 10% increase per completed cycle
    const cycleMultiplier = 1 + ((currentCycle - 1) * 0.1);
    
    const totalReward = Math.floor((baseReward + dailyBonus) * cycleMultiplier);

    // Update user balance and check-in data
    user.balance += totalReward;
    user.lastDailyCheckIn = today;
    user.dailyCheckInStreak = newStreak;
    user.dailyCheckInCycle = newCycle;
    user.totalEarned += totalReward;

    await user.save();

    // Log activity
    const activity = new Activity({
      telegramId,
      type: 'bonus',
      description: `Daily check-in completed (Day ${streak + 1})`,
      reward: totalReward,
      metadata: {
        checkInType: 'daily',
        streak: newStreak,
        cycle: newCycle,
        dayInCycle: dayInCycle,
        baseReward,
        dailyBonus,
        cycleMultiplier,
        totalReward
      },
      timestamp: today
    });

    await activity.save();

    return NextResponse.json({
      success: true,
      message: `Daily check-in complete! +${totalReward} PEPE 🎉`,
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
      checkIn: {
        streak: newStreak,
        cycle: newCycle,
        dayInCycle: dayInCycle,
        reward: totalReward,
        cycleMultiplier: cycleMultiplier,
        nextCheckInAvailable: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    console.error('Error processing daily check-in:', error);
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

    // Check if user can claim today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const lastCheckIn = user.lastDailyCheckIn ? new Date(user.lastDailyCheckIn) : null;
    const lastCheckInStart = lastCheckIn ? 
      new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate()) : null;

    const canClaim = !lastCheckInStart || lastCheckInStart.getTime() !== todayStart.getTime();
    
    // Calculate current streak and cycle
    let currentStreak = user.dailyCheckInStreak || 0;
    let currentCycle = user.dailyCheckInCycle || 1;
    
    // Reset streak if more than 1 day has passed
    if (lastCheckIn) {
      const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 1) {
        currentStreak = 0;
        currentCycle = 1;
      }
    }

    // Calculate potential reward with new system
    const dayInCycle = (currentStreak % 30) + 1;
    const baseReward = 100;
    const dailyBonus = dayInCycle * 10;
    const cycleMultiplier = 1 + ((currentCycle - 1) * 0.1);
    const potentialReward = Math.floor((baseReward + dailyBonus) * cycleMultiplier);

    return NextResponse.json({
      canClaim,
      streak: currentStreak,
      cycle: currentCycle,
      dayInCycle: dayInCycle,
      lastClaim: lastCheckIn?.toISOString() || null,
      potentialReward,
      cycleMultiplier: cycleMultiplier,
      nextCheckInAvailable: canClaim ? null : new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    });

  } catch (error) {
    console.error('Error getting daily check-in status:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
