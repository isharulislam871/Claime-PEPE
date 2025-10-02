import { NextRequest, NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

// Global socket server instance
let io: SocketIOServer;

export async function GET(request: NextRequest) {
  if (!io) {
    return NextResponse.json({ error: 'Socket server not initialized' }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Socket server is running',
    connectedClients: io.engine.clientsCount 
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, data } = body;

  if (!io) {
    return NextResponse.json({ error: 'Socket server not initialized' }, { status: 500 });
  }

  switch (action) {
    case 'broadcast':
      io.emit('system_message', data);
      break;
    case 'notify_user':
      io.to(data.userId).emit('notification', data.message);
      break;
    case 'admin_alert':
      io.emit('admin_notification', data);
      break;
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// Initialize Socket.IO server
export function initializeSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);
    
    const userId = socket.handshake.auth.userId;
    
    if (userId) {
      socket.join(userId);
      await updateUserStatus(userId, 'online');
    }

    // Login event
    socket.on('user_login', async (data) => {
      try {
        await dbConnect();
        
        // Update user last active
        await User.findOneAndUpdate(
          { telegramId: data.userId },
          { 
            lastActive: new Date(),
            status: 'online'
          }
        );

        // Log activity
        await Activity.create({
          userId: data.userId,
          type: 'user_login',
          data: {
            platform: data.platform,
            socketId: socket.id
          },
          timestamp: new Date()
        });

        // Broadcast to admins
        socket.broadcast.emit('user_online', {
          userId: data.userId,
          timestamp: data.timestamp
        });

        console.log(`User ${data.userId} logged in`);
      } catch (error) {
        console.error('Login event error:', error);
      }
    });

    // Logout event
    socket.on('user_logout', async (data) => {
      try {
        await dbConnect();
        
        await User.findOneAndUpdate(
          { telegramId: data.userId },
          { status: 'offline' }
        );

        await Activity.create({
          userId: data.userId,
          type: 'user_logout',
          data: {
            //sessionDuration: Date.now() - socket.handshake.time  
          },
          timestamp: new Date()
        });

        socket.broadcast.emit('user_offline', {
          userId: data.userId,
          timestamp: data.timestamp
        });

        console.log(`User ${data.userId} logged out`);
      } catch (error) {
        console.error('Logout event error:', error);
      }
    });

    // Ad viewed event
    socket.on('ad_viewed', async (data) => {
      try {
        await dbConnect();
        
        await Activity.create({
          userId: data.userId,
          type: data.adType === 'home' ? 'ad_view_home' : 'ad_view',
          data: {
            adType: data.adType,
            socketId: socket.id
          },
          timestamp: new Date()
        });

        // Notify admins of ad view
        socket.broadcast.emit('admin_notification', {
          type: 'ad_viewed',
          userId: data.userId,
          adType: data.adType,
          timestamp: data.timestamp
        });

        console.log(`User ${data.userId} viewed ${data.adType} ad`);
      } catch (error) {
        console.error('Ad view event error:', error);
      }
    });

    // Task completed event
    socket.on('task_completed', async (data) => {
      try {
        await dbConnect();
        
        await Activity.create({
          userId: data.userId,
          type: 'task_completed',
          data: {
            taskId: data.taskId,
            reward: data.reward
          },
          timestamp: new Date()
        });

        // Update user balance and stats
        await User.findOneAndUpdate(
          { telegramId: data.userId },
          { 
            $inc: { 
              balance: data.reward,
              totalEarned: data.reward,
              tasksCompletedToday: 1
            }
          }
        );

        // Notify user of balance update
        socket.emit('balance_update', {
          newBalance: data.reward,
          reason: 'task_completed'
        });

        console.log(`User ${data.userId} completed task ${data.taskId}`);
      } catch (error) {
        console.error('Task completion event error:', error);
      }
    });

    // Withdrawal request event
    socket.on('withdrawal_request', async (data) => {
      try {
        await dbConnect();
        
        await Activity.create({
          userId: data.userId,
          type: 'withdrawal_request',
          data: {
            amount: data.amount,
            method: data.method
          },
          timestamp: new Date()
        });

        // Notify admins of withdrawal request
        socket.broadcast.emit('admin_notification', {
          type: 'withdrawal_request',
          userId: data.userId,
          amount: data.amount,
          method: data.method,
          timestamp: data.timestamp
        });

        console.log(`User ${data.userId} requested withdrawal: ${data.amount} via ${data.method}`);
      } catch (error) {
        console.error('Withdrawal request event error:', error);
      }
    });

    // Spin wheel event
    socket.on('spin_wheel', async (data) => {
      try {
        await dbConnect();
        
        await Activity.create({
          userId: data.userId,
          type: 'spin_wheel',
          data: {
            result: data.result
          },
          timestamp: new Date()
        });

        console.log(`User ${data.userId} spun wheel: ${JSON.stringify(data.result)}`);
      } catch (error) {
        console.error('Spin wheel event error:', error);
      }
    });

    // Disconnect event
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      if (userId) {
        await updateUserStatus(userId, 'offline');
        
        socket.broadcast.emit('user_offline', {
          userId,
          timestamp: new Date()
        });
      }
    });
  });

  return io;
}

async function updateUserStatus(userId: string, status: 'online' | 'offline') {
  try {
    await dbConnect();
    await User.findOneAndUpdate(
      { telegramId: userId },
      { 
        status,
        lastActive: new Date()
      }
    );
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}

export { io };
