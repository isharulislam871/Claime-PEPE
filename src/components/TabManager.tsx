'use client';

import { useState } from 'react';
import { TabBar } from 'antd-mobile';
import { 
  HomeOutlined, 
  DollarOutlined, 
  WalletOutlined, 
  GiftOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import HomeTab from '@/components/HomeTab';
import TasksTab from '@/components/TasksTab';
import WithdrawTab from '@/components/WithdrawTab';
import InviteTab from '@/components/InviteTab';
import ProfileTab from '@/components/ProfileTab';

export default function TabManager() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    {
      key: 'home',
      title: 'Home',
      icon: <HomeOutlined />,
    },
    {
      key: 'tasks',
      title: 'Earn',
      icon: <DollarOutlined />,
    },
    {
      key: 'withdraw',
      title: 'Withdraw',
      icon: <WalletOutlined />,
    },
    {
      key: 'invite',
      title: 'Invite',
      icon: <GiftOutlined />,
    },
    {
      key: 'profile',
      title: 'Profile',
      icon: <UserOutlined />,
    },
  ];

  const renderActiveTab = () => {
    const tabComponents = {
      home: <HomeTab />,
      tasks: <TasksTab />,
      withdraw: <WithdrawTab />,
      invite: <InviteTab />,
      profile: <ProfileTab />
    };

    return tabComponents[activeTab as keyof typeof tabComponents] || tabComponents.home;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {renderActiveTab()}
        </div>
      </div>
      
      {/* Ant Design Mobile TabBar */}
      <TabBar
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="border-t border-gray-200 bg-white/95 backdrop-blur-sm"
        style={{
          '--adm-color-primary': '#f59e0b',
          '--adm-color-text': '#6b7280',
          '--adm-color-text-secondary': '#9ca3af',
          '--adm-font-size-7': '11px',
        } as any}
      >
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
}
