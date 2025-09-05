'use client';

import { useState } from 'react';
import { 
  HomeOutlined, 
  DollarOutlined, 
  WalletOutlined, 
  GiftOutlined, 
  UserOutlined 
} from '@ant-design/icons';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [rippleTab, setRippleTab] = useState<string | null>(null);

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeOutlined },
    { id: 'tasks', label: 'Earn', icon: DollarOutlined },
    { id: 'withdraw', label: 'Withdraw', icon: WalletOutlined },
    { id: 'invite', label: 'Invite & Earn', icon: GiftOutlined },
    { id: 'profile', label: 'Profile', icon: UserOutlined },
  ];

  const handleTabClick = (tabId: string) => {
    setRippleTab(tabId);
    onTabChange(tabId);
    
    setTimeout(() => setRippleTab(null), 600);
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Binance-style Navigation Container */}
      <div className="bg-white border-t border-gray-100 px-1 py-2 safe-area-pb">
        {/* Navigation Items */}
        <div className="flex items-center justify-around">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-200"
              >
                {/* Ripple Effect */}
                {rippleTab === tab.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-full animate-ping" />
                  </div>
                )}

                {/* Icon Container */}
                <div className="relative mb-1">
                  <tab.icon 
                    className={`text-xl transition-all duration-200 ${
                      isActive 
                        ? 'text-yellow-500' 
                        : 'text-gray-400'
                    }`}
                  />
                </div>

                {/* Label */}
                <span 
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-yellow-500' 
                      : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-0.5 bg-yellow-500 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
