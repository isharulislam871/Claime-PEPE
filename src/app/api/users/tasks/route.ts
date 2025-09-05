import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

// POST /api/users/tasks - Complete a task and update user balance
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { telegramId, taskId, reward, taskType = 'bonus' } = body;
    
    if (!telegramId || !taskId || !reward) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId, taskId, reward' },
        { status: 400 }
      );
    }
    
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if task already completed
    if (user.joinedBonusTasks.includes(taskId)) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 409 });
    }
    
    // Check daily task limit for regular tasks
    if (taskType === 'regular') {
      user.resetDailyTasks();
      if (!user.canCompleteTask()) {
        return NextResponse.json({ error: 'Daily task limit reached' }, { status: 429 });
      }
    }
    
    // Update user data
    const updateData = {
      $inc: {
        balance: reward,
        totalEarned: reward
      },
      $push: {
        joinedBonusTasks: taskId
      },
      lastTaskTimestamp: new Date()
    };
    
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity using Activity model
    await Activity.create({
      telegramId,
      type: 'task_complete',
      description: `Completed task ${taskId} and earned ${reward} PEPE`,
      reward,
      metadata: {
        taskId,
        taskType
      },
      timestamp: new Date()
    });
    
    return NextResponse.json({ 
      user: updatedUser,
      message: `Task completed! Earned ${reward} PEPE`
    });
    
  } catch (error) {
    console.error('POST /api/users/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/users/tasks - Get user's task completion status
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    console.log('userTasksCompleted');
    
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    
    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
    }
    
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
     
    // Get task completion statistics from Activity model
    const totalTasksCompleted = await Activity.countDocuments({
      type: 'task_complete'
    });
    
    const userTasksCompleted = await Activity.countDocuments({
      telegramId,
      type: 'task_complete'
    });


    
    const maxTasks = 1000;
    const progressPercentage = Math.min((totalTasksCompleted / maxTasks) * 100, 100);
    
    const taskStatus = {
      completedTasks: user.joinedBonusTasks,
      tasksCompletedToday: user.tasksCompletedToday,
      canCompleteMoreTasks: user.canCompleteTask(),
      
      progress: {
        current: totalTasksCompleted,
        max: maxTasks,
        percentage: progressPercentage
      },
      userProgress: {
        completed: userTasksCompleted,
        percentage: userTasksCompleted > 0 ? Math.min((userTasksCompleted / 50) * 100, 100) : 0
      }
    };
    
    return NextResponse.json({ taskStatus });
    
  } catch (error) {
    console.error('GET /api/users/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
