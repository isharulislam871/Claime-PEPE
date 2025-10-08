import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

// GET /api/admin/tasks - Get all tasks with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Filter parameters
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minReward = searchParams.get('minReward');
    const maxReward = searchParams.get('maxReward');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build filter query
    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minReward || maxReward) {
      filter.reward = {};
      if (minReward) filter.reward.$gte = parseInt(minReward);
      if (maxReward) filter.reward.$lte = parseInt(maxReward);
    }
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
    }

    // Get tasks with pagination
    const [tasks, totalCount] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(filter)
    ]);

    // Get summary statistics
    const [
      totalTasks,
      activeTasks,
      pausedTasks,
      completedTasks,
      totalRewards,
      totalCompletions
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'active' }),
      Task.countDocuments({ status: 'paused' }),
      Task.countDocuments({ status: 'completed' }),
      Task.aggregate([
        { $group: { _id: null, total: { $sum: '$reward' } } }
      ]).then(result => result[0]?.total || 0),
      Task.aggregate([
        { $group: { _id: null, total: { $sum: '$currentCompletions' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    const summary = {
      totalTasks,
      activeTasks,
      pausedTasks,
      completedTasks,
      totalRewards,
      totalCompletions
    };

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      summary
    });

  } catch (error) {
    console.error('Error fetching admin tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      title,
      description,
      reward,
      type,
      category,
      url,
      duration,
      maxCompletions,
      status = 'draft',
      createdBy,
      requirements
    } = body;

    // Validation
    if (!title || !description || !reward || !type || !category) {
      return NextResponse.json({
        error: 'Missing required fields: title, description, reward, type, category'
      }, { status: 400 });
    }

    // Generate unique task ID
    const taskId = `TSK${Date.now()}`;

    const newTask = new Task({
      id: taskId,
      title,
      description,
      reward,
      type,
      category,
      url,
      duration,
      maxCompletions: maxCompletions || 1000,
      currentCompletions: 0,
      status,
      createdBy,
      requirements
    });

    await newTask.save();

    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Task created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/tasks - Update a task
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { taskId, ...updateData } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update task
    Object.assign(task, updateData);
    await task.save();

    return NextResponse.json({
      success: true,
      task,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/tasks - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await Task.deleteOne({ id: taskId });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
