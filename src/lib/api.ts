// API utility functions for client-side requests

import { encrypt } from "./authlib";

export interface User {
  _id: string;
  telegramId: string;
  username: string;
  telegramUsername: string;
  profilePicUrl?: string;
  balance: number;
  tasksCompletedToday: number;
  lastTaskTimestamp?: string;
  totalEarned: number;
  totalAdsViewed: number;
  totalRefers: number;
  joinedBonusTasks: string[];
  referredBy?: string;
  referralEarnings: number;
  createdAt: string;
  updatedAt: string;
  adsWatchedToday : number;
  referralCount : number;
}

export interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  failureReason?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatus {
  completedTasks: string[];
  tasksCompletedToday: number;
  canCompleteMoreTasks: boolean;
  tasksLeftToday: number;
}



// User API functions
export const userAPI = {
  // Get user by telegram ID
  async getUser(telegramId: string): Promise<User | null> {
    try {
      const hash = encrypt(telegramId)
      const response = await fetch(`/api/users?hash=${hash}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: {
    telegramId: string;
    username: string;
    telegramUsername: string;
    profilePicUrl?: string;
    referredBy?: string;
    
  }): Promise<User> {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get task status
  async getTaskStatus(telegramId: string): Promise<TaskStatus> {
    try {
      const response = await fetch(`/api/users/tasks?telegramId=${telegramId}`);
      if (!response.ok) throw new Error('Failed to fetch task status');
      const data = await response.json();
      return data.taskStatus;
    } catch (error) {
      console.error('Error fetching task status:', error);
      throw error;
    }
  },

  // Complete task (legacy)
  async completeTask(telegramId: string, taskId: string, reward: number, type: string): Promise<{ user: User; message: string }> {
    const response = await fetch('/api/users/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, taskId, reward, type }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete task');
    }
    return response.json();
  },

  // New ads API
  async viewAd(telegramId: string, adType: string = 'standard', reward: number = 250): Promise<{ user: User; message: string; adsLeftToday: number }> {
    const response = await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, adType, reward }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process ad view');
    }
    return response.json();
  },

  async getAdStats(telegramId: string): Promise<{ todayAdsViewed: number; adsLeftToday: number; totalAdsViewed: number; balance: number }> {
    const response = await fetch(`/api/ads?telegramId=${telegramId}`);
    if (!response.ok) throw new Error('Failed to get ad stats');
    return response.json();
  },

  // New activities API
  async logActivity(telegramId: string, type: string, description: string, reward: number = 0, metadata: any = {}): Promise<{ success: boolean; activity: any }> {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, type, description, reward, metadata }),
    });
    if (!response.ok) throw new Error('Failed to log activity');
    return response.json();
  },

  async getActivities(telegramId: string, limit: number = 50, type?: string): Promise<{ activities: any[]; stats: any; total: number }> {
    const params = new URLSearchParams({ telegramId, limit: limit.toString() });
    if (type) params.append('type', type);
    
    const response = await fetch(`/api/activities?${params}`);
    if (!response.ok) throw new Error('Failed to get activities');
    return response.json();
  },

  // Daily check-in API
  async getDailyCheckInStatus(telegramId: string): Promise<{ canClaim: boolean; streak: number; lastClaim: string | null; potentialReward: number; nextCheckInAvailable: string | null }> {
    const response = await fetch(`/api/daily-checkin?telegramId=${telegramId}`);
    if (!response.ok) throw new Error('Failed to get daily check-in status');
    return response.json();
  },

  async claimDailyCheckIn(telegramId: string, streak: number): Promise<{ user: User; message: string; checkIn: any }> {
    const response = await fetch('/api/daily-checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, streak }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to claim daily check-in');
    }
    return response.json();
  },

  // Spin wheel API
  async getSpinWheelStatus(telegramId: string): Promise<{ canSpin: boolean; totalSpins: number; lastSpin: string | null; possibleRewards: number[]; nextSpinAvailable: string | null }> {
    const response = await fetch(`/api/spin-wheel?telegramId=${telegramId}`);
    if (!response.ok) throw new Error('Failed to get spin wheel status');
    return response.json();
  },

  async spinWheel(telegramId: string, reward: number): Promise<{ user: User; message: string; spin: any }> {
    const response = await fetch('/api/spin-wheel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, reward }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to spin wheel');
    }
    return response.json();
  }
};

// Withdrawal API functions
export const withdrawalAPI = {
  // Get withdrawal history
  async getWithdrawals(telegramId: string, limit: number = 10): Promise<Withdrawal[]> {
    try {
      const response = await fetch(`/api/withdrawals?telegramId=${telegramId}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch withdrawals');
      const data = await response.json();
      return data.withdrawals;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  },

  // Create withdrawal request
  async createWithdrawal(withdrawalData: {
    telegramId: string;
    amount: number;
    method: string;
    walletId: string;
    currency?: string;
  }): Promise<{ withdrawal: Withdrawal; message: string }> {
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawalData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create withdrawal');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      throw error;
    }
  },

  // Get withdrawal statistics
  async getWithdrawalStats(telegramId: string): Promise<{ totalWithdrawn: number; pendingWithdrawals: number; completedWithdrawals: number }> {
    try {
      const response = await fetch(`/api/withdrawals/stats?telegramId=${telegramId}`);
      if (!response.ok) throw new Error('Failed to fetch withdrawal stats');
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Error fetching withdrawal stats:', error);
      throw error;
    }
  }
};

// Mock Telegram WebApp data for development
export const mockTelegramUser = {
  telegramId: '123456789' ,//'709148502',
  username: 'Md Rijon Hossain Jibon YT ▪️',
  telegramUsername: 'MdRijonHossainJibon',
  profilePicUrl: 'https://t.me/i/userpic/320/NzPzP-8sLLNQZkSxzx-VauBHAcE6hnGyFyDg6LxoA28.svg'
};

// Get current user from Telegram WebApp or mock data
export function getCurrentUser() {
  // If in development mode, always return mock data
  if (process.env.NODE_ENV === 'development') {
    return mockTelegramUser;
  }
  
  // In production, get data from Telegram WebApp
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    const start_param = window.Telegram.WebApp.initDataUnsafe?.start_param;
    const signature = window.Telegram.WebApp.initDataUnsafe?.signature;
    return {
      telegramId: tgUser.id.toString(),
      username: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
      telegramUsername: tgUser.username || `user${tgUser.id}`,
      profilePicUrl: tgUser.photo_url,
      referredBy : start_param,
      signature : signature
    };
  }
  
 
}
