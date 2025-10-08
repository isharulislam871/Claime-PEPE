import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { verifySignature } from 'auth-fingerprint';
  
// GET /api/tasks - Get available tasks for users
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const signature = searchParams.get('signature');
    const timestamp = searchParams.get('timestamp');

    const {  success , data } = verifySignature({ hash, signature, timestamp } , process.env.NEXTAUTH_SECRET || 'app');
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
 
    const  { telegramId  } = JSON.parse(data  as string);


    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }
    
    // Get user to check completed tasks
    const user = await User.findOne({ telegramId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all active tasks
    const tasks = await Task.find({
      status: 'active',

    }).sort({ createdAt: -1 });

    // Get task completion statistics from Activity model
    const tasksWithStatus = await Promise.all(tasks.map(async (task) => {


      return {
        id: task.id,
        title: task.title,
        description: task.description,
        reward: task.reward,
        type: task.type,
        category: task.category,
        url: task.url,
        duration: task.duration,
        completed: user.joinedBonusTasks.includes(task.id),

      };
    }));

    // Get user's task status

    const taskStatus = {
      completedTasks: user.joinedBonusTasks,
      tasksCompletedToday: user.tasksCompletedToday,
      canCompleteMoreTasks: user.canCompleteTask(),
      tasksLeftToday: Math.max(0, 100 - user.tasksCompletedToday)
    };

    return NextResponse.json({
      result: {
        result: {
          tasks: tasksWithStatus,
          taskStatus
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
