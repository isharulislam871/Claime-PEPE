'use client';

import { useState } from 'react';
import HomeTab from '@/components/HomeTab';
import TasksTab from '@/components/TasksTab';
import WithdrawTab from '@/components/WithdrawTab';
import InviteTab from '@/components/InviteTab';
import ProfileTab from '@/components/ProfileTab';
import BottomNavigation from '@/components/BottomNavigation';

export default function TabManager() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTab, setDisplayTab] = useState('home');

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Start exit animation
    setTimeout(() => {
      setActiveTab(newTab);
      setDisplayTab(newTab);
    }, 150); // Half of transition duration
    
    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const renderActiveTab = () => {
    const tabComponents = {
      home: <HomeTab />,
      tasks: <TasksTab />,
      withdraw: <WithdrawTab />,
      invite: <InviteTab />,
      profile: <ProfileTab />
    };

    return tabComponents[displayTab as keyof typeof tabComponents] || tabComponents.home;
  };

  return (
    <>
      <div className="p-5 pb-24 relative">
        {/* Tab Content with Slide Animation */}
        <div 
          className={`transform transition-all duration-300 ease-in-out ${
            isTransitioning 
              ? 'opacity-0 translate-x-4 scale-95' 
              : 'opacity-100 translate-x-0 scale-100'
          }`}
        >
          {renderActiveTab()}
        </div>
      </div>
      
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
