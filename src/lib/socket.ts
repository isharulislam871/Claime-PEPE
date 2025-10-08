import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      auth: {
        userId
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.emitLogin(userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event emitters
  emitLogin(userId: string) {
    this.socket?.emit('user_login', {
      userId,
      timestamp: new Date(),
      platform: 'telegram_web_app'
    });
  }

  emitLogout(userId: string) {
    this.socket?.emit('user_logout', {
      userId,
      timestamp: new Date()
    });
  }

  emitAdView(userId: string, adType: string) {
    this.socket?.emit('ad_viewed', {
      userId,
      adType,
      timestamp: new Date()
    });
  }

  emitTaskComplete(userId: string, taskId: string, reward: number) {
    this.socket?.emit('task_completed', {
      userId,
      taskId,
      reward,
      timestamp: new Date()
    });
  }

  emitWithdrawal(userId: string, amount: number, method: string) {
    this.socket?.emit('withdrawal_request', {
      userId,
      amount,
      method,
      timestamp: new Date()
    });
  }

  emitSpinWheel(userId: string, result: any) {
    this.socket?.emit('spin_wheel', {
      userId,
      result,
      timestamp: new Date()
    });
  }

  // Event listeners
  onUserOnline(callback: (data: any) => void) {
    this.socket?.on('user_online', callback);
  }

  onUserOffline(callback: (data: any) => void) {
    this.socket?.on('user_offline', callback);
  }

  onBalanceUpdate(callback: (data: any) => void) {
    this.socket?.on('balance_update', callback);
  }

  onWithdrawalUpdate(callback: (data: any) => void) {
    this.socket?.on('withdrawal_update', callback);
  }

  onAdminNotification(callback: (data: any) => void) {
    this.socket?.on('admin_notification', callback);
  }

  onSystemMessage(callback: (data: any) => void) {
    this.socket?.on('system_message', callback);
  }

  // Utility methods
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;
