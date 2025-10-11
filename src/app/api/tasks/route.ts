import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Task from '@/models/Task';
import TelegramService from '@/lib/telegram';
import { verifySignature } from 'auth-fingerprint';
 
export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const { hash, signature, timestamp } = body;
    const { success, data } = verifySignature({ hash, signature, timestamp }, process.env.NEXT_PUBLIC_APP_SECRET || 'app');
    if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    const { telegramId, taskId, taskType } = JSON.parse(data as string);

    const task = await Task.findOne({ id: taskId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if task already completed
    if (user.joinedBonusTasks.includes(taskId)) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 409 });
    }
    const telegramService = new TelegramService();
 
    function getTelegramUsername(url: string): string | null {
      try {
        const regex = /^https?:\/\/t\.me\/([a-zA-Z0-9_]{5,32})(?:\/)?$/;
        const match = url.match(regex);
        return match ? `@${match[1]}` : null;
      } catch (e) {
        return null;
      }
    }
    
    const telegramUsername = getTelegramUsername(task.url);
 

    if (!telegramUsername) {
      return NextResponse.json({ error: 'Invalid task URL' }, { status: 404 });
    }

    const  check  = await telegramService.verifyUser(telegramId, telegramUsername);
    if (!check.success) {
      return NextResponse.json({ error: 'faild to join telegram channel'  }, { status: 404 });
    }

    const clientIP = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    // Update user data
    const updateData = {
      $inc: {
        balance: task.reward,
        totalEarned: task.reward
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

    // Increment task completion count
    await task.incrementCompletion();
    await task.save();
    const txhash = `${telegramId}_${taskId}_${Date.now()}`;

    // Log activity using Activity model
    await Activity.create({
      telegramId,
      type: 'task_complete',
      description: `Completed task ${taskId} and earned ${task.reward} pts`,
      reward: task.reward,
      metadata: {
        taskId,
        taskType
      },
      timestamp: new Date(),
      ipAddress: clientIP,
      hash: txhash
    });

    return NextResponse.json({
      user: updatedUser,
      message: `Task completed! Earned ${task.reward} pts`
    });


  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

}
 
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
 
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const timestamp = searchParams.get('timestamp');
    const signature = searchParams.get('signature');
   

    const { success ,  data  } = verifySignature({ timestamp , hash , signature } , process.env.NEXTAUTH_SECRET || 'app');

    if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { telegramId } = JSON.parse(data as string)

    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
    }

    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all active tasks
    const tasks = await Task.find({
      status: 'active'
    }).sort({ createdAt: -1 });

    // Get task completion statistics from Activity model
    const totalTasksCompleted = await Activity.countDocuments({
      type: 'task_complete'
    });

    const userTasksCompleted = await Activity.countDocuments({
      telegramId,
      type: 'task_complete'
    });

    // Format tasks with completion status
    const tasksWithStatus = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      reward: task.reward,
      type: task.type,
      category: task.category,
      url: task.url,
      duration: task.duration,
      completed: user.joinedBonusTasks.includes(task.id),
      completionCount: task.completionCount || 0,
      maxCompletions: task.maxCompletions || null,
      isAvailable: !task.maxCompletions || (task.completionCount || 0) < task.maxCompletions
    }));

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

    return NextResponse.json({ 
      tasks: tasksWithStatus,
      taskStatus 
    });

  } catch (error) {
    console.error('GET /api/users/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
