'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Grid, Badge, Skeleton, NoticeBar } from 'antd-mobile';
import {
  UserOutlined,
  DollarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  CloseOutlined,
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  WalletOutlined,
  CloudServerOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  GoldOutlined
} from '@ant-design/icons';
import { Dashboard } from '@/components/admin/Dashboard';
import { Users } from '@/components/admin/Users';
import { Tasks } from '@/components/admin/Tasks';
import { Withdrawals } from '@/components/admin/Withdrawals';
import { PaymentSettings } from '@/components/admin/PaymentSettings';
import { CoinManagement } from '@/components/admin/CoinManagement';
import { RPCNodeManagement } from '@/components/admin/RPCNodeManagement';
import { WalletManagement } from '@/components/admin/WalletManagement';
import { SendBroadcast } from '@/components/admin/SendBroadcast';
import { NotificationComponent } from '@/components/admin/NotificationComponent';
import   AdsSettings  from '@/components/admin/adNetworks';
import { Settings } from '@/components/admin/Settings';
import { MobileSidebar } from '@/components/admin/MobileSidebar';

 

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  tasksCompleted: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'banned';
}


export default function AdminPage() {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);




  const sidebarItems = [
    { id: 'dashboard', title: 'Dashboard', icon: <DashboardOutlined />, color: '#3F83F8', description: 'Overview & Analytics' },
    { id: 'users', title: 'User Management', icon: <TeamOutlined />, color: '#10B981', description: 'Manage users & permissions' },
    { id: 'tasks', title: 'Task Management', icon: <AppstoreOutlined />, color: '#F59E0B', description: 'Configure tasks & rewards' },
    { id: 'settings', title: 'System Settings', icon: <SettingOutlined />, color: '#8B5CF6', description: 'App configuration' },
    { id: 'analytics', title: 'Analytics', icon: <BarChartOutlined />, color: '#EF4444', description: 'Reports & insights' },
    { id: 'withdrawals', title: 'Withdrawals', icon: <DollarOutlined />, color: '#F59E0B', description: 'Payment processing' },
    { id: 'payments', title: 'Payment Settings', icon: <DollarOutlined />, color: '#059669', description: 'Configure payment methods' },
    { id: 'coins', title: 'Coin Management', icon: <GoldOutlined />, color: '#FFD700', description: 'Manage cryptocurrencies' },
    { id: 'rpc', title: 'RPC Node Management', icon: <CloudServerOutlined />, color: '#6366F1', description: 'Configure RPC nodes' },
    { id: 'ads', title: 'Ads Settings', icon: <VideoCameraOutlined />, color: '#EC4899', description: 'Advertisement configuration' },
    { id: 'broadcast', title: 'Send Broadcast', icon: <SoundOutlined />, color: '#10B981', description: 'Send notifications to users' },
    { id: 'wallet', title: 'Wallet Management', icon: <WalletOutlined />, color: '#8B5CF6', description: 'Manage wallets & balances' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };





  function renderContent() {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'tasks':
        return <Tasks />;
      case 'settings':
        return <Settings />;
      case 'withdrawals':
        return <Withdrawals />;
      case 'payments':
        return <PaymentSettings />;
      case 'coins':
        return <CoinManagement />;
      case 'rpc':
        return <RPCNodeManagement />;
      case 'wallet':
        return <WalletManagement />;
      case 'broadcast':
        return <SendBroadcast />;
      case 'ads':
        return <AdsSettings />;
      default:
        return <AdsSettings />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <MobileSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} sidebarItems={sidebarItems} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} activeTab={activeTab} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              fill="none"
              size="small"
              onClick={toggleSidebar}
              style={{ color: '#6B7280' }}
            >
              <MenuOutlined />
            </Button>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3F83F8, #10B981)' }}
            >
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1
                className="text-xl font-bold bg-gradient-to-r from-[#3F83F8] to-[#10B981] bg-clip-text text-transparent"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {sidebarItems.find(item => item.id === activeTab)?.title || 'Admin Panel'}
              </h1>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {sidebarItems.find(item => item.id === activeTab)?.description || 'Management Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationComponent />
            <Button fill="none" size="small" style={{ color: '#EF4444' }}>
              <LogoutOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div
          className="pb-20"
          style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #E0E7FF 100%)', minHeight: 'calc(100vh - 80px)' }}
        >
          <div className="p-4">
            {/* Alert Banner */}
            <NoticeBar
              content="System running normally. All services operational."
              color="success"
              className="mb-4"
              closeable
            />

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
