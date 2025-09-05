const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port =   3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    const userId = socket.handshake.auth.userId;
    
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
    socket.on('user_login', async (data) => {
      console.log('User login:', data);
      
      if (data.userId) {
        socket.join(data.userId);
        activeUsers.set(data.userId, {
          socketId: socket.id,
          loginTime: Date.now(),
          status: 'online'
        });

        // Log login activity
        io.emit('activity_log', {
          userId: data.userId,
          type: 'user_login',
          data: data,
          timestamp: new Date()
        });

        // Broadcast stats update to admins
        io.to('admins').emit('stats_changed', {
          type: 'user_login',
          timestamp: new Date()
        });
      }
    });

    // Logout event
    socket.on('user_logout', async (data) => {
      console.log('User logout:', data);
      
      const userInfo = activeUsers.get(data.userId);
      if (userInfo) {
        // Log logout activity
        io.emit('activity_log', {
          userId: data.userId,
          type: 'user_logout',
          data: {
            sessionDuration: Date.now() - userInfo.loginTime
          },
          timestamp: new Date()
        });
        
        activeUsers.delete(data.userId);

        // Broadcast stats update to admins
        io.to('admins').emit('stats_changed', {
          type: 'user_logout',
          timestamp: new Date()
        });
      }
    });

    // Ad view event
    socket.on('ad_viewed', async (data) => {
      console.log('Ad viewed:', data);
      
      io.emit('activity_log', {
        userId: data.userId,
        type: 'ad_viewed',
        data: data,
        timestamp: new Date()
      });

      // Notify admins of ad activity
      io.emit('admin_notification', {
        type: 'ad_activity',
        message: `User ${data.userId} viewed ad on ${data.page}`,
        timestamp: new Date()
      });

      // Broadcast stats update to admins
      io.to('admins').emit('stats_changed', {
        type: 'ad_viewed',
        timestamp: new Date()
      });
    });

    // Task completion event
    socket.on('task_completed', async (data) => {
      console.log('Task completed:', data);
      
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

      // Broadcast stats update to admins
      io.to('admins').emit('stats_changed', {
        type: 'task_completed',
        timestamp: new Date()
      });
    });

    // Withdrawal request event
    socket.on('withdrawal_request', async (data) => {
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

      // Broadcast stats update to admins
      io.to('admins').emit('stats_changed', {
        type: 'withdrawal_request',
        timestamp: new Date()
      });
    });

    // Spin wheel event
    socket.on('spin_wheel', async (data) => {
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
    socket.on('admin_broadcast', async (data) => {
      console.log('Admin broadcast:', data);
      
      // Send to all connected users
      io.emit('system_message', {
        type: 'broadcast',
        message: data.message,
        priority: data.priority || 'normal',
        timestamp: new Date()
      });
    });

    // Admin stats request
    socket.on('admin_stats_request', async () => {
      console.log('Admin stats requested');
      
      try {
        // Fetch fresh stats from database
        const response = await fetch(`http://localhost:${port}/api/admin?action=stats`);
        const data = await response.json();
        
        if (data.success) {
          // Send stats to requesting admin
          socket.emit('admin_stats_update', {
            stats: data.stats,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        socket.emit('admin_stats_error', {
          error: 'Failed to fetch stats',
          timestamp: new Date()
        });
      }
    });

    // Join admin room for admin-specific events
    socket.on('join_admin', (data) => {
      console.log('Admin joined:', data.adminId);
      socket.join('admins');
      
      // Send initial stats
      socket.emit('admin_stats_request');
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
