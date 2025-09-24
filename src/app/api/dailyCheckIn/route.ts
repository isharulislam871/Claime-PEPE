import User, { IUser } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import Activity, { IActivity } from '@/models/Activity';
import crypto from 'crypto';
 
interface DailyCheckInData {
  id: string;
  userId: string;
  streak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
  nextCheckInTime: string | null;
  rewardEarned: number;
  streakBonus: number;
}

interface CheckInReward {
  baseReward: number;
  streakBonus: number;
  totalReward: number;
  newStreak: number;
}

// Database integration functions using Mongoose User model
const getUserByTelegramId = async (telegramId: string) => {
  try {
    return await User.findByTelegramId(telegramId);
  } catch (error) {
    console.error('Error fetching user by telegram ID:', error);
    return null;
  }
};

const updateUserById = async (userId: string, updates: Partial<IUser>) => {
  try {
    return await User.findByIdAndUpdate(userId, updates, { new: true });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const getTelegramIdFromRequest = async (request: NextRequest): Promise<string> => {
  // Extract telegramId from request headers or body
  const telegramId = request.headers.get('x-telegram-id') || 
                    request.headers.get('telegram-id');
  
  if (!telegramId) {
    // Try to get from request body for POST requests
    try {
      const body = await request.json();
      if (body.telegramId) {
        return body.telegramId;
      }
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error('Telegram ID not found in request');
  }
  
  return telegramId;
};

// Function to create activity log for daily check-in
const createCheckInActivity = async (
  telegramId: string,
  reward: number,
  streak: number,
  ipAddress: string
): Promise<void> => {
  try {
    const activityData = {
      telegramId,
      type: 'bonus',
      description: `Daily check-in completed - Day ${streak} streak`,
      reward,
      metadata: {
        activityType: 'daily_checkin',
        streak,
        checkInDate: new Date().toISOString(),
        streakBonus: Math.min(streak * 2, 20)
      },
      timestamp: new Date(),
      ipAddress,
      hash: crypto.createHash('sha256')
        .update(`${telegramId}-daily_checkin-${Date.now()}`)
        .digest('hex')
    };

    await Activity.create(activityData);
  } catch (error) {
    console.error('Error creating check-in activity:', error);
    // Don't throw error to avoid breaking the check-in process
  }
};

// Helper functions
const isNewDay = (lastCheckInDate: Date | undefined): boolean => {
  if (!lastCheckInDate) return true;
  
  const lastDate = new Date(lastCheckInDate);
  const today = new Date();
  
  // Reset time to start of day for comparison
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return today.getTime() > lastDate.getTime();
};

const isConsecutiveDay = (lastCheckInDate: Date | undefined): boolean => {
  if (!lastCheckInDate) return false;
  
  const lastDate = new Date(lastCheckInDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset time to start of day for comparison
  lastDate.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  
  return lastDate.getTime() === yesterday.getTime();
};

const calculateReward = (currentStreak: number): CheckInReward => {
  const baseReward = 10;
  const streakBonus = Math.min(currentStreak * 2, 20);
  const totalReward = baseReward + streakBonus;
  
  return {
    baseReward,
    streakBonus,
    totalReward,
    newStreak: currentStreak
  };
};

const getNextCheckInTime = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

// Convert User model to DailyCheckInData format
const userToDailyCheckInData = (user: any): DailyCheckInData => {
  const canCheckIn = isNewDay(user.lastDailyCheckIn);
  const nextCheckInTime = canCheckIn ? null : getNextCheckInTime();
  
  return {
    id: user._id.toString(),
    userId: user._id.toString(),
    streak: user.dailyCheckInStreak || 0,
    totalCheckIns: user.dailyCheckInCycle || 0,
    lastCheckInDate: user.lastDailyCheckIn ? user.lastDailyCheckIn.toISOString() : null,
    canCheckIn,
    nextCheckInTime,
    rewardEarned: user.totalEarned || 0,
    streakBonus: 0 // Will be calculated during check-in
  };
};

// GET - Fetch check-in data
export async function GET(request: NextRequest) {
  try {
    const hash =request.headers.get('x-auth-hash')
    console.log(hash)
 
    // Get user ID from request (authentication)
    const userId = await getTelegramIdFromRequest(request);
    
    // Fetch user from database
    const user = await getUserByTelegramId(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Convert user data to daily check-in format
    const checkInData = userToDailyCheckInData(user);
    
    return NextResponse.json(checkInData);
  } catch (error) {
    console.error('Error fetching check-in data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-in data' },
      { status: 500 }
    );
  }
}

// POST - Perform daily check-in
export async function POST(request: NextRequest) {
  try {
    // Get user ID from request (authentication)
    const telegramId = await getTelegramIdFromRequest(request);
    
    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    
    // Fetch user from database
    const user = await getUserByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user can check in
    if (!isNewDay(user.lastDailyCheckIn)) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      );
    }
    
    // Calculate new streak
    let newStreak: number;
    if (isConsecutiveDay(user.lastDailyCheckIn)) {
      newStreak = (user.dailyCheckInStreak || 0) + 1;
    } else {
      newStreak = 1; // Reset streak if not consecutive
    }
    
    // Calculate reward
    const reward = calculateReward(newStreak);
    
    // Update user data in database
    const now = new Date();
    const updatedUser = await updateUserById((user as any)._id.toString(), {
      dailyCheckInStreak: newStreak,
      dailyCheckInCycle: (user.dailyCheckInCycle || 0) + 1,
      lastDailyCheckIn: now,
      balance: user.balance + reward.totalReward,
      totalEarned: (user.totalEarned || 0) + reward.totalReward,
    });
    
    // Create activity log for the check-in
    await createCheckInActivity(
      telegramId,
      reward.totalReward,
      newStreak,
      ipAddress
    );
    
    // Convert updated user to check-in data format
    const updatedCheckInData = userToDailyCheckInData(updatedUser);
    updatedCheckInData.streakBonus = reward.streakBonus;
    
    // Return updated data and reward info
    return NextResponse.json({
      checkInData: updatedCheckInData,
      reward: {
        ...reward,
        newStreak
      }
    });
  } catch (error) {
    console.error('Error performing check-in:', error);
    return NextResponse.json(
      { error: 'Failed to perform check-in' },
      { status: 500 }
    );
  }
}

// PUT - Reset check-in data (for testing)
export async function PUT(request: NextRequest) {
  try {
    // Get user ID from request (authentication)
    const userId = await getTelegramIdFromRequest(request);
    
    // Fetch user from database
    const user = await getUserByTelegramId(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Reset user's daily check-in data in database
    const updatedUser = await updateUserById((user as any)._id.toString(), {
      dailyCheckInStreak: 0,
      dailyCheckInCycle: 0,
      lastDailyCheckIn: undefined,
    });
    
    const resetCheckInData = userToDailyCheckInData(updatedUser);
    
    return NextResponse.json({ 
      message: 'Check-in data reset successfully',
      data: resetCheckInData 
    });
  } catch (error) {
    console.error('Error resetting check-in data:', error);
    return NextResponse.json(
      { error: 'Failed to reset check-in data' },
      { status: 500 }
    );
  }
}
