import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { Socket } from 'socket.io';
import dbConnect from './src/lib/mongodb';

import User from './src/models/User';
import ActivityLog from './src/models/ActivityLog';
import UserSession from './src/models/UserSession';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface UserInfo {
  socketId: string;
  loginTime: number;
  status: 'online' | 'offline';
}

interface LoginData {
  userId: string;
  timestamp: Date;
  platform?: string;
}

interface LogoutData {
  userId: string;
  timestamp: Date;
}

interface AdViewData {
  userId: string;
  adType: string;
  page?: string;
  timestamp: Date;
}

interface TaskCompleteData {
  userId: string;
  taskId: string;
  reward: number;
  newBalance?: number;
  timestamp: Date;
}

interface WithdrawalData {
  userId: string;
  amount: number;
  method: string;
  timestamp: Date;
}

interface SpinWheelData {
  userId: string;
  result: any;
  reward?: number;
  timestamp: Date;
}

interface AdminBroadcastData {
  message: string;
  priority?: 'low' | 'normal' | 'high';
}

app.prepare().then(async () => {
  // Connect to MongoDB
  await dbConnect()

  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Store active users
  const activeUsers = new Map<string, UserInfo>();

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);
    
    const userId = socket.handshake.auth.userId as string;
    
    if (userId) {
      socket.join(userId);
      activeUsers.set(userId, {
        socketId: socket.id,
        loginTime: Date.now(),
        status: 'online'
      });
      
      // Broadcast user online status
      socket.broadcast.emit('user_status_change', {
        userId,
        status: 'online',
        timestamp: new Date()
      });
    }

    // Login event
    socket.on('user_login', async (data: LoginData) => {
      console.log('User login:', data);
      
      if (data.userId) {
        socket.join(data.userId);
        activeUsers.set(data.userId, {
          socketId: socket.id,
          loginTime: Date.now(),
          status: 'online'
        });

        try {
          // Create user session in database
          await UserSession.createSession({
            userId: data.userId,
            socketId: socket.id,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent']
          });

          // Log activity to database
          await ActivityLog.create({
            userId: data.userId,
            type: 'user_login',
            data: data,
            timestamp: new Date(),
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent']
          });

          // Update user's last activity
          await User.findOneAndUpdate(
            { telegramId: data.userId },
            { updatedAt: new Date() }
          );

          // Broadcast stats update to admins
          io.to('admins').emit('stats_changed', {
            type: 'user_login',
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error logging user login:', error);
        }

        // Log login activity (for real-time events)
        io.emit('activity_log', {
          userId: data.userId,
          type: 'user_login',
          data: data,
          timestamp: new Date()
        });
      }
    });

    // Logout event
    socket.on('user_logout', async (data: LogoutData) => {
      console.log('User logout:', data);
      
      const userInfo = activeUsers.get(data.userId);
      if (userInfo) {
        const sessionDuration = Date.now() - userInfo.loginTime;

        try {
          // End user session in database
          const session = await UserSession.findOne({ socketId: socket.id, isActive: true });
          if (session) {
            await session.endSession();
          }

          // Log logout activity to database
          await ActivityLog.create({
            userId: data.userId,
            type: 'user_logout',
            data: { sessionDuration },
            timestamp: new Date(),
            sessionDuration,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent']
          });

          // Broadcast stats update to admins
          io.to('admins').emit('stats_changed', {
            type: 'user_logout',
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error logging user logout:', error);
        }

        // Log logout activity (for real-time events)
        io.emit('activity_log', {
          userId: data.userId,
          type: 'user_logout',
          data: { sessionDuration },
          timestamp: new Date()
        });
        
        activeUsers.delete(data.userId);
      }
    });

    // Ad view event
    socket.on('ad_viewed', async (data: AdViewData) => {
      console.log('Ad viewed:', data);
      
      try {
        // Log ad view to database
        await ActivityLog.create({
          userId: data.userId,
          type: 'ad_viewed',
          data: data,
          timestamp: new Date(),
          ipAddress: socket.handshake.address,
          userAgent: socket.handshake.headers['user-agent']
        });

        // Update user's ad view count
        await User.findOneAndUpdate(
          { telegramId: data.userId },
          { 
            $inc: { totalAdsViewed: 1 },
            updatedAt: new Date()
          }
        );

        // Broadcast stats update to admins
        io.to('admins').emit('stats_changed', {
          type: 'ad_viewed',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error logging ad view:', error);
      }

      io.emit('activity_log', {
        userId: data.userId,
        type: 'ad_viewed',
        data: data,
        timestamp: new Date()
      });

      // Notify admins of ad activity
      io.emit('admin_notification', {
        type: 'ad_activity',
        message: `User ${data.userId} viewed ad on ${data.page || 'unknown page'}`,
        timestamp: new Date()
      });
    });

    // Task completion event
    socket.on('task_completed', async (data: TaskCompleteData) => {
      console.log('Task completed:', data);
      
      try {
        // Log task completion to database
        await ActivityLog.create({
          userId: data.userId,
          type: 'task_completed',
          data: data,
          timestamp: new Date(),
          ipAddress: socket.handshake.address,
          userAgent: socket.handshake.headers['user-agent']
        });

        // Update user's balance and task count
        await User.findOneAndUpdate(
          { telegramId: data.userId },
          { 
            $inc: { 
              balance: data.reward,
              totalEarned: data.reward,
              tasksCompletedToday: 1
            },
            lastTaskTimestamp: new Date(),
            updatedAt: new Date()
          }
        );

        // Broadcast stats update to admins
        io.to('admins').emit('stats_changed', {
          type: 'task_completed',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error logging task completion:', error);
      }

      io.emit('activity_log', {
        userId: data.userId,
        type: 'task_completed',
        data: data,
        timestamp: new Date()
      });

      // Notify user of reward
      io.to(data.userId).emit('balance_update', {
        type: 'task_reward',
        amount: data.reward,
        newBalance: data.newBalance,
        timestamp: new Date()
      });
    });

    // Withdrawal request event
    socket.on('withdrawal_request', async (data: WithdrawalData) => {
      console.log('Withdrawal request:', data);
      
      io.emit('activity_log', {
        userId: data.userId,
        type: 'withdrawal_request',
        data: data,
        timestamp: new Date()
      });

      // Notify admins
      io.emit('admin_notification', {
        type: 'withdrawal_request',
        message: `User ${data.userId} requested withdrawal of ${data.amount}`,
        data: data,
        timestamp: new Date()
      });
    });

    // Spin wheel event
    socket.on('spin_wheel', async (data: SpinWheelData) => {
      console.log('Spin wheel:', data);
      
      io.emit('activity_log', {
        userId: data.userId,
        type: 'spin_wheel',
        data: data,
        timestamp: new Date()
      });

      // Notify user of result
      io.to(data.userId).emit('spin_result', {
        result: data.result,
        reward: data.reward,
        timestamp: new Date()
      });
    });

    // Admin broadcast
    socket.on('admin_broadcast', async (data: AdminBroadcastData) => {
      console.log('Admin broadcast:', data);
      
      // Send to all connected users
      io.emit('system_message', {
        type: 'broadcast',
        message: data.message,
        priority: data.priority || 'normal',
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Find and remove user from active users
      for (const [userId, userInfo] of activeUsers.entries()) {
        if (userInfo.socketId === socket.id) {
          // Log logout activity
          io.emit('activity_log', {
            userId: userId,
            type: 'user_logout',
            data: {
              sessionDuration: Date.now() - userInfo.loginTime
            },
            timestamp: new Date()
          });
          
          activeUsers.delete(userId);
          
          // Broadcast user offline status
          socket.broadcast.emit('user_status_change', {
            userId,
            status: 'offline',
            timestamp: new Date()
          });
          break;
        }
      }
    });
  });

  // Start server
  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running on port ${port}`);
    });
});
