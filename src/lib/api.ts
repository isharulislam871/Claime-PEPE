// API utility functions for client-side requests

import { generateSignature } from "auth-fingerprint";

 
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
 
// Mock Telegram WebApp data for development
export const mockTelegramUser = {
  telegramId: 709148502 ,//'709148502',
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
