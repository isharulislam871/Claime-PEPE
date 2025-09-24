import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Task from '@/models/Task';
 
// POST /api/users/tasks - Complete a task and update user balance
export async function POST(request: NextRequest) {

  function getOS(userAgent : any) {
    if (!userAgent) return 'Unknown';
  
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS') || userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Linux')) return 'Linux';
  
    return 'Unknown';
  }

  function getBrowser(userAgent = "") {
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
      return userAgent.match(/Chrome\/([\d.]+)/) ? "Chrome " + RegExp.$1 : "Chrome";
  
    if (userAgent.includes("Edg"))
      return userAgent.match(/Edg\/([\d.]+)/) ? "Edge " + RegExp.$1 : "Edge";
  
    if (userAgent.includes("Firefox"))
      return userAgent.match(/Firefox\/([\d.]+)/) ? "Firefox " + RegExp.$1 : "Firefox";
  
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      return userAgent.match(/Version\/([\d.]+)/) ? "Safari " + RegExp.$1 : "Safari";
  
    return "Unknown";
  }

  // Allowed browsers
  const allowedBrowsers = ["Chrome", "Firefox", "Safari", "Edg", "Opera"];

  // Get user agent and validate browser
  const userAgent = request.headers.get('user-agent') || '';
  const detectedBrowser = getBrowser(userAgent);
  const detectedOS = getOS(userAgent);
  
  // Detect mobile keyword
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  // Check if UA contains any allowed browser name
  const isBrowser = allowedBrowsers.some(browser => userAgent.includes(browser));

  if (!(isMobile && isBrowser)) {
    return NextResponse.json({ 
      success: false, 
      reason: "Only mobile browser clients allowed",
      detected: { browser: detectedBrowser, os: detectedOS, mobile: isMobile }
    }, { status: 403 });
  }

  const fingerprint = { 
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
    browser: detectedBrowser,
    os: detectedOS
  };

  const body = await request.json();

  console.log(body)
 
 /*  try {
    await dbConnect();
    
    const body = await request.json();
    const { telegramId, taskId } = body;
    
    if (!telegramId || !taskId) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId, taskId' },
        { status: 400 }
      );
    }
    
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find the task to get reward and type
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Check if task is available
    if (!task.isAvailable()) {
      return NextResponse.json({ error: 'Task is not available' }, { status: 400 });
    }
    
    // Check if task already completed
    if (user.joinedBonusTasks.includes(taskId)) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 409 });
    }
    
    const { reward, type: taskType } = task;
    
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

    // Increment task completion count
    await task.incrementCompletion();
    await task.save();

    // Get client IP and generate hash
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1';
    const hash = `${telegramId}_${taskId}_${Date.now()}`;

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
      timestamp: new Date(),
      ipAddress: clientIP,
      hash: hash
    });
    
    return NextResponse.json({ 
      user: updatedUser,
      message: `Task completed! Earned ${reward} PEPE`
    });
    
  } catch (error) {
    console.error('POST /api/users/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } */
 

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
