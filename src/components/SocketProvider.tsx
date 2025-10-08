'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '@/lib/socket';
import { getCurrentUser } from '@/lib/api';
import { Toast } from 'antd-mobile';

interface SocketContextType {
  isConnected: boolean;
  socket: any;
  emitLogin: () => void;
  emitLogout: () => void;
  emitAdView: (adType: string) => void;
  emitTaskComplete: (taskId: string, reward: number) => void;
  emitWithdrawal: (amount: number, method: string) => void;
  emitSpinWheel: (result: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Connect to socket
      const socketInstance = socketService.connect(currentUser.telegramId as string);
      setSocket(socketInstance);
      
      // Set up event listeners
      socketInstance.on('connect', () => {
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      // Balance update listener
      socketService.onBalanceUpdate((data) => {
        Toast.show({
          icon: 'success',
          content: `Balance updated: +${data.newBalance} PEPE`,
        });
      });

      // Withdrawal update listener
      socketService.onWithdrawalUpdate((data) => {
        Toast.show({
          icon: data.status === 'completed' ? 'success' : 'fail',
          content: `Withdrawal ${data.status}: ${data.amount} PEPE`,
        });
      });

      // System message listener
      socketService.onSystemMessage((data) => {
        Toast.show({
          icon: 'loading',
          content: data.message,
        });
      });

      // Admin notification listener (for testing)
      socketService.onAdminNotification((data) => {
        console.log('Admin notification:', data);
      });

      // Cleanup on unmount
      return () => {
        socketService.emitLogout(currentUser.telegramId as string);
        socketService.disconnect();
      };
    }
  }, []);

  const emitLogin = () => {
    if (user) {
      socketService.emitLogin(user.telegramId);
    }
  };

  const emitLogout = () => {
    if (user) {
      socketService.emitLogout(user.telegramId);
    }
  };

  const emitAdView = (adType: string) => {
    if (user) {
      socketService.emitAdView(user.telegramId, adType);
    }
  };

  const emitTaskComplete = (taskId: string, reward: number) => {
    if (user) {
      socketService.emitTaskComplete(user.telegramId, taskId, reward);
    }
  };

  const emitWithdrawal = (amount: number, method: string) => {
    if (user) {
      socketService.emitWithdrawal(user.telegramId, amount, method);
    }
  };

  const emitSpinWheel = (result: any) => {
    if (user) {
      socketService.emitSpinWheel(user.telegramId, result);
    }
  };

  const contextValue: SocketContextType = {
    isConnected,
    socket,
    emitLogin,
    emitLogout,
    emitAdView,
    emitTaskComplete,
    emitWithdrawal,
    emitSpinWheel
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
