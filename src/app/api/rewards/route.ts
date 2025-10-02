import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Achievement, UserAchievement } from '@/models/Achievement';
import User from '@/models/User';
 
import { verifySignature } from 'auth-fingerprint';
// Initialize default achievements
async function initializeAchievements() {
  const defaultAchievements = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Complete your first task',
      category: 'milestone',
      reward: 100,
      requiresAds: true,
      conditions: { type: 'task_count', target: 1 },
      isActive: true
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      category: 'milestone',
      reward: 500,
      requiresAds: true,
      conditions: { type: 'task_count', target: 10 },
      isActive: true
    },
    {
      id: 'daily-streak',
      title: 'Daily Warrior',
      description: 'Check in for 7 consecutive days',
      category: 'daily',
      reward: 300,
      requiresAds: true,
      conditions: { type: 'daily_streak', target: 7 },
      isActive: true
    },
    {
      id: 'referral-king',
      title: 'Referral King',
      description: 'Invite 5 friends successfully',
      category: 'special',
      reward: 1000,
      requiresAds: true,
      conditions: { type: 'referral_count', target: 5 },
      isActive: true
    },
    {
      id: 'ad-watcher',
      title: 'Ad Enthusiast',
      description: 'Watch 20 ads',
      category: 'daily',
      reward: 200,
      requiresAds: true,
      conditions: { type: 'ads_watched', target: 20 },
      isActive: true
    },
    {
      id: 'point-collector',
      title: 'Point Collector',
      description: 'Earn 10,000 total points',
      category: 'milestone',
      reward: 2000,
      requiresAds: true,
      conditions: { type: 'points_earned', target: 10000 },
      isActive: true
    } 
  ];

  for (const achievement of defaultAchievements) {
    await Achievement.findOneAndUpdate(
      { id: achievement.id },
      achievement,
      { upsert: true, new: true }
    );
  }
}

// Calculate user progress for achievements
async function calculateUserProgress(telegramId: string, user: any) {
  const progressMap: Record<string, number> = {
    'first-task': Math.min(user.tasksCompletedToday + (user.totalEarned > 0 ? 1 : 0), 1),
    'task-master': Math.min(user.tasksCompletedToday + Math.floor(user.totalEarned / 100), 10),
    'daily-streak': Math.min(user.dailyCheckInStreak, 7),
    'referral-king': Math.min(user.referralCount, 5),
    'ad-watcher': Math.min(user.totalAdsViewed, 20),
    'point-collector': Math.min(user.totalEarned, 10000),
   
  };

  return progressMap;
}

// GET - Fetch user achievements and progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const timestamp = searchParams.get('timestamp');
    const signature = searchParams.get('signature');


    if (!hash || !timestamp || !signature) {
      return NextResponse.json({ error: 'Hash is required with timestamp and signature' }, { status: 400 });
    }

    const { success , data } = verifySignature({ hash , timestamp , signature  }, process.env.NEXTAUTH_SECRET || '');
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
    }

    const { telegramId   } = JSON.parse(data as string);

    await connectToDatabase();
    
    // Initialize achievements if they don't exist
    await initializeAchievements();

    // Get user data
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all active achievements
    const achievements = await Achievement.find({ isActive: true }).lean();

    // Get user achievement progress
    const userAchievements = await UserAchievement.find({ telegramId }).lean();
    const userAchievementMap = userAchievements.reduce((acc: any, ua: any) => {
      acc[ua.achievementId] = ua;
      return acc;
    }, {});

    // Calculate current progress
    const progressMap = await calculateUserProgress(telegramId, user);

    // Combine achievement data with user progress
    const achievementsWithProgress = achievements.map((achievement: any) => {
      const userAchievement = userAchievementMap[achievement.id];
      const currentProgress = progressMap[achievement.id] || 0;
      const isCompleted = currentProgress >= achievement.conditions.target;

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        reward: achievement.reward,
        requiresAds: achievement.requiresAds,
        progress: currentProgress,
        total: achievement.conditions.target,
        completed: isCompleted,
        claimed: userAchievement?.claimed || false,
        unlockedAt: userAchievement?.unlockedAt || null,
        claimedAt: userAchievement?.claimedAt || null
      };
    });

    // Calculate stats
    const totalPoints = user.balance;
    const completedCount = achievementsWithProgress.filter((a: any) => a.completed).length;
    const claimedCount = achievementsWithProgress.filter((a: any) => a.claimed).length;

    return NextResponse.json({
      success: true,
      achievements: achievementsWithProgress,
      stats: {
        totalPoints,
        completedAchievements: completedCount,
        claimedAchievements: claimedCount,
        totalAchievements: achievements.length
      }
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Handle achievement actions (unlock, claim)
export async function POST(request: NextRequest) {
  try {
    const {  hash , timestamp , signature } = await request.json();
 
    
    if (!hash    || !timestamp || !signature) {
      return NextResponse.json({ 
        error: 'Hash,  are required with timestamp and signature' 
      }, { status: 400 });
    }

    const { success , data } = verifySignature({ hash , timestamp , signature }, process.env.NEXTAUTH_SECRET || '');
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
    }
   
    const { telegramId , action, achievementId  } = JSON.parse(data as string);
  

    if (!telegramId || !action || !achievementId) {
      return NextResponse.json({ 
        error: 'TelegramId, action, and achievementId are required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Get user and achievement
    const user = await User.findByTelegramId(telegramId);
    const achievement = await Achievement.findOne({ id: achievementId, isActive: true });

    if (!user || !achievement) {
      return NextResponse.json({ error: 'User or achievement not found' }, { status: 404 });
    }

    // Get or create user achievement record
    let userAchievement = await UserAchievement.findOne({ telegramId, achievementId });
    if (!userAchievement) {
      userAchievement = new UserAchievement({
        telegramId,
        achievementId,
        progress: 0,
        completed: false,
        claimed: false
      });
    }

    // Calculate current progress
    const progressMap = await calculateUserProgress(telegramId, user);
    const currentProgress = progressMap[achievementId] || 0;
    const isCompleted = currentProgress >= achievement.conditions.target;

    // Update progress
    userAchievement.progress = currentProgress;
    userAchievement.completed = isCompleted;

    if (action === 'unlock' && isCompleted && !userAchievement.unlockedAt) {
      // Simulate watching ads (in real app, this would verify ad completion)
      userAchievement.unlockedAt = new Date();
      await userAchievement.save();

      return NextResponse.json({
        success: true,
        message: 'Achievement unlocked after watching ads',
        userAchievement
      });
    }

    if (action === 'claim' && isCompleted && userAchievement.unlockedAt && !userAchievement.claimed) {
      // Award points to user
      user.balance += achievement.reward;
      user.totalEarned += achievement.reward;
      
      // Mark as claimed
      userAchievement.claimed = true;
      userAchievement.claimedAt = new Date();

      await Promise.all([user.save(), userAchievement.save()]);

      return NextResponse.json({
        success: true,
        message: `Claimed ${achievement.reward} points!`,
        reward: achievement.reward,
        newBalance: user.balance,
        userAchievement
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action or achievement not ready' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error processing achievement action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
