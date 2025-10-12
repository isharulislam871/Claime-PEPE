'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, Button, Menu, Layout, Badge, notification, Avatar, Dropdown } from 'antd';
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
 
 
import { SendBroadcast } from '@/components/admin/SendBroadcast';
import { NotificationComponent } from '@/components/admin/NotificationComponent';
import AdsSettings from '@/components/admin/adNetworks';
import { Settings } from '@/components/admin/Settings';

const { Header, Content } = Layout;

 

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarItems = [
    { 
      key: 'dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    { 
      key: 'users', 
      icon: <TeamOutlined />, 
      label: 'User Management',
      description: 'Manage users & permissions'
    },
    { 
      key: 'tasks', 
      icon: <AppstoreOutlined />, 
      label: 'Task Management',
      description: 'Configure tasks & rewards'
    },
    { 
      key: 'settings', 
      icon: <SettingOutlined />, 
      label: 'System Settings',
      description: 'App configuration'
    },
   
    { 
      key: 'withdrawals', 
      icon: <DollarOutlined />, 
      label: 'Withdrawals',
      description: 'Payment processing'
    },
    { 
      key: 'payments', 
      icon: <DollarOutlined />, 
      label: 'Payment Settings',
      description: 'Configure payment methods'
    },
  
   
    { 
      key: 'ads', 
      icon: <VideoCameraOutlined />, 
      label: 'Ads Settings',
      description: 'Advertisement configuration'
    },
    { 
      key: 'broadcast', 
      icon: <SoundOutlined />, 
      label: 'Send Broadcast',
      description: 'Send notifications to users'
    } 
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setActiveTab(key);
    setDrawerOpen(false); // Close drawer on mobile after selection
  };

  const getCurrentPageInfo = () => {
    return sidebarItems.find(item => item.key === activeTab) || sidebarItems[0];
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

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
 
      case 'broadcast':
        return <SendBroadcast />;
      case 'ads':
        return <AdsSettings />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <>
    <style jsx global>{`
      .admin-layout {
        background-color: #f9fafb !important;
        color: #374151 !important;
      }
      .admin-layout .ant-layout-header {
        background-color: #ffffff !important;
        border-color: #f3f4f6 !important;
      }
      .admin-layout .ant-layout-content {
        background-color: #f9fafb !important;
      }
    `}</style>
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900 admin-layout">
      {/* Mobile Header */}
      <Header 
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 px-4 flex items-center justify-between lg:hidden"
        style={{ backgroundColor: '#ffffff', height: 'auto', lineHeight: 'normal', padding: '12px 16px' }}
      >
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          />
          <div className="flex items-center gap-3">
            <Avatar 
              size={40}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400"
            >
              A
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-0">
                {getCurrentPageInfo().label}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">
                {getCurrentPageInfo().description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationComponent />
          <Dropdown 
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar 
              size={32}
              icon={<UserOutlined />}
              className="cursor-pointer bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400"
            />
          </Dropdown>
        </div>
      </Header>

      {/* Binance-Style Drawer for Mobile Navigation */}
      <Drawer
        title={null}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={320}
        className="lg:hidden binance-drawer [&_.ant-drawer-body]:bg-gray-50 dark:[&_.ant-drawer-body]:bg-gray-800"
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
          wrapper: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }
        }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      >
        {/* Binance-Style Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Avatar 
                size={48}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400 shadow-lg"
              >
                A
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Admin Panel</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Management Dashboard</p>
            </div>
          </div>
          
     
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4">
          {sidebarItems.map((item, index) => (
            <div
              key={item.key}
              onClick={() => handleMenuClick({ key: item.key })}
              className={`mx-3 mb-2 p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                activeTab === item.key
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-400/20 dark:to-orange-500/20 border border-yellow-300 dark:border-yellow-400/30 shadow-lg'
                  : 'hover:bg-white/60 dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/20 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-xl transition-colors duration-300 ${
                  activeTab === item.key 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium transition-colors duration-300 ${
                    activeTab === item.key 
                      ? 'text-gray-800 dark:text-gray-100' 
                      : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs transition-colors duration-300 ${
                    activeTab === item.key 
                      ? 'text-yellow-700 dark:text-yellow-300' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {activeTab === item.key && (
                  <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
 
      </Drawer>

      {/* Main Content */}
      <Content className="bg-gray-50 dark:bg-gray-900">
        <div className="min-h-full dark:bg-gray-900 bg-gray-50">
          {/* Desktop Header - Hidden on Mobile */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar 
                  size={48}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400"
                >
                  A
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-0">
                    {getCurrentPageInfo().label}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mb-0">
                    {getCurrentPageInfo().description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <NotificationComponent />
            
                <Dropdown 
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                    <Avatar size={36} icon={<UserOutlined />} className="bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400" />
                    <div className="text-right">
                      <div className="font-medium text-gray-800 dark:text-gray-100">Admin User</div>
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="px-6">
              <Menu
                mode="horizontal"
                selectedKeys={[activeTab]}
                onClick={handleMenuClick}
                className="border-none"
                items={sidebarItems}
                style={{
                  backgroundColor: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[calc(100vh-200px)]">
              {renderContent()}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
    </>
  );
}