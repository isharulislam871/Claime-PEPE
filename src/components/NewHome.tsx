'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import {
  
  Card,
  Grid,
 
  Skeleton,
  PullToRefresh,
 
} from 'antd-mobile';
 
import { createUserRequest, selectCurrentUser } from '@/modules';
 
import { getCurrentUser } from '@/lib/api';
import {
  DollarOutlined,
  TrophyOutlined,
  UserAddOutlined,
  WalletOutlined,
  HomeOutlined,
  GiftOutlined,
  HistoryOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
  CustomerServiceOutlined,
  StarOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CrownOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import { Avatar } from 'antd';
import NewProfile from './NewProfile';
import NewWithdrawal from './NewWithdrawal';

import InviteFriendsEarn from './InviteFriendsEarn';
import { toast } from 'react-toastify';
import WithdrawHistoryPopup from './WithdrawHistoryPopup';
import NewSwap from './NewSwap';
import DailyCheckInPopup from './DailyCheckInPopup';
import AdWatchPopup from './AdWatchPopup';
import TaskPopup from './TaskPopup';
 
import NewRegistrationBlockedPopup from './NewRegistrationBlockedPopup';
import MinimumInvitesRequiredPopup from './MinimumInvitesRequiredPopup';
import SuspendAllPaymentServicesPopup from './SuspendAllPaymentServicesPopup';
import RewardsPopup from './RewardsPopup';
import ShopPopup from './ShopPopup';
import LeaderboardPopup from './LeaderboardPopup';
import VoucherPopup from './VoucherPopup';
import EarningCenterPopup from './EarningCenterPopup';
import SupportPopup from './SupportPopup';
import PromotionSwiper, { Promotion } from './PromotionSwiper';
import HeaderBalance from './HeaderBalance';
import AppLaunchCountdownPopup from './AppLaunchCountdownPopup';



interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
}


export default function NewHome() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);
  const [isInviteFriendsEarn, setIsInviteFriendsEarn] = useState(false);
  const currentUser = getCurrentUser();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState(false);
  const [isAdWatchOpen, setIsAdWatchOpen] = useState(false);
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showClaimSheet, setShowClaimSheet] = useState(false);
  const [isTelegramOpenPopupVisible, setIsTelegramOpenPopupVisible] = useState(false);
  const [isRegistrationBlockedPopupVisible, setIsRegistrationBlockedPopupVisible] = useState(false);
  const [newRegistrationsEnabled, setNewRegistrationsEnabled] = useState(true);
  const [isMinimumInvitesPopupVisible, setIsMinimumInvitesPopupVisible] = useState(false);
  const [isPaymentSuspendedPopupVisible, setIsPaymentSuspendedPopupVisible] = useState(false);
  const [paymentServicesSuspended, setPaymentServicesSuspended] = useState(false);
  const [isRewardsPopupVisible, setIsRewardsPopupVisible] = useState(false);
  const [isShopPopupVisible, setIsShopPopupVisible] = useState(false);
  const [isVoucherPopupVisible, setIsVoucherPopupVisible] = useState(false);
  const [isLeaderboardPopupVisible, setIsLeaderboardPopupVisible] = useState(false);
  const [isEarningCenterPopupVisible, setIsEarningCenterPopupVisible] = useState(false);
  const [isSupportPopupVisible, setIsSupportPopupVisible] = useState(false);
  const [isAppLaunchCountdownVisible, setIsAppLaunchCountdownVisible] = useState(false);
  const [enabledQuickActions, setEnabledQuickActions] = useState<string[]>([]);
  const [quickActionsLoading, setQuickActionsLoading] = useState(false);

  const allQuickActions: QuickAction[] = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: <UnorderedListOutlined className="text-blue-600 text-xl" />,
      color: 'bg-blue-100',
      action: () => setIsTaskPopupOpen(true)
    },
    {
      id: 'daily-checkin',
      title: 'Daily Check-in',
      icon: <CheckCircleOutlined className="text-green-600 text-xl" />,
      color: 'bg-green-100',
      action: () => setIsDailyCheckInOpen(true)
    },
    {
      id: 'ads',
      title: 'Watch Ads',
      icon: <PlayCircleOutlined className="text-red-600 text-xl" />,
      color: 'bg-red-100',
      action: () => setIsAdWatchOpen(true)
    },
    {
      id: 'home',
      title: 'Home',
      icon: <HomeOutlined className="text-yellow-600 text-xl" />,
      color: 'bg-yellow-100',
      action: () => setIsAppLaunchCountdownVisible(true)
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: <WalletOutlined className="text-purple-600 text-xl" />,
      color: 'bg-purple-100',
      action: () => {
        // Check if payment services are suspended
        if (paymentServicesSuspended) {
          setIsPaymentSuspendedPopupVisible(true);
          return;
        }
        
        // Check if user meets minimum invite requirement
        const requiredInvites = 10; // This should come from admin settings
        const currentInvites = user?.referralCount || 0;
        
        if (currentInvites < requiredInvites) {
          setIsMinimumInvitesPopupVisible(true);
        } else {
          setIsOpenWithdraw(true);
        }
      }
    },
    {
      id: 'invite',
      title: 'Invite Friends',
      icon: <UserAddOutlined className="text-pink-600 text-xl" />,
      color: 'bg-pink-100',
      action: () => setIsInviteFriendsEarn(true)
    },
    {
      id: 'swap',
      title: 'Swap',
      icon: <SwapOutlined className="text-cyan-600 text-xl" />,
      color: 'bg-cyan-100',
      action: () => setIsSwapOpen(true)
    },
    {
      id: 'history',
      title: 'History',
      icon: <HistoryOutlined className="text-indigo-600 text-xl" />,
      color: 'bg-indigo-100',
      action: () => setIsHistoryOpen(true)
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <TrophyOutlined className="text-orange-600 text-xl" />,
      color: 'bg-orange-100',
      action: () => setIsOpenProfile(true)
    },
    
    {
      id: 'rewards',
      title: 'Rewards',
      icon: <StarOutlined className="text-yellow-500 text-xl" />,
      color: 'bg-yellow-50',
      action: () => setIsRewardsPopupVisible(true)
    },
    {
      id: 'shop',
      title: 'Shop',
      icon: <ShoppingOutlined className="text-green-500 text-xl" />,
      color: 'bg-green-50',
      action: () => setIsShopPopupVisible(true)
    },
    {
      id: 'voucher',
      title: 'Voucher',
      icon: <CreditCardOutlined className="text-purple-500 text-xl" />,
      color: 'bg-purple-50',
      action: () => setIsVoucherPopupVisible(true)
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: <CrownOutlined className="text-amber-500 text-xl" />,
      color: 'bg-amber-50',
      action: () => setIsLeaderboardPopupVisible(true)
    },
    {
      id: 'earning-center',
      title: 'Earning Center',
      icon: <MoneyCollectOutlined className="text-emerald-600 text-xl" />,
      color: 'bg-emerald-100',
      action: () => setIsEarningCenterPopupVisible(true)
    },
    {
      id: 'support',
      title: 'Support',
      icon: <CustomerServiceOutlined className="text-indigo-600 text-xl" />,
      color: 'bg-indigo-100',
      action: () => setIsSupportPopupVisible(true)
    }
  ];

  // Fetch quick actions configuration from API
  const fetchQuickActionsConfig = useCallback(async () => {
    try {
      setQuickActionsLoading(true);
      const response = await fetch('/api/quickActions');
      const data = await response.json();
      
      if (data.success) {
        const enabledActionIds = data.data.map((action: any) => action.id);
        setEnabledQuickActions(enabledActionIds);
      } else {
        console.error('Failed to fetch quick actions:', data.message);
        toast.error('Failed to load quick actions configuration');
        // Fallback: enable all actions
        setEnabledQuickActions(allQuickActions.map(action => action.id));
      }
    } catch (error) {
      console.error('Error fetching quick actions:', error);
      toast.error('Failed to load quick actions');
      // Fallback: enable all actions
      setEnabledQuickActions(allQuickActions.map(action => action.id));
    } finally {
      setQuickActionsLoading(false);
    }
  }, []);

  // Filter quick actions based on enabled configuration
  const quickActions = allQuickActions.filter(action => 
    enabledQuickActions.includes(action.id)
  );
 

  const handleQuickAction = (action: QuickAction) => {
    action.action();
  };

  const handleClaimAchievement = (achievement: Achievement) => {
    if (achievement.completed) {
      setSelectedAchievement(achievement);
      setShowClaimSheet(true);
    }
  };
 
 

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API calls to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(createUserRequest(currentUser));
      fetchQuickActionsConfig();
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // Fetch quick actions configuration on component mount
  useEffect(() => {
    fetchQuickActionsConfig();
  }, [fetchQuickActionsConfig]);

  useEffect(() => {
    if (!user) {
      dispatch(createUserRequest({}));
    }
  }, [dispatch, user]);

  // Check registration and payment status on component mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Simulate API call to check admin settings
        // In a real app, this would be an API call to your admin settings
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const settings = await response.json();
          setNewRegistrationsEnabled(settings.newRegistrations);
          setPaymentServicesSuspended(settings.suspendAllPaymentServices || false);
          
          // Show popup if registrations are disabled and user is new
          if (!settings.newRegistrations && (!user || !user.id)) {
            setIsRegistrationBlockedPopupVisible(true);
          }
        }
      } catch (error) {
        // Fallback: assume services are enabled if API fails
        console.log('Could not check system status');
      }
    };

    checkSystemStatus();
  }, [user]);



 

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Content */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 py-4">
         

            {/* Header with Avatar and Balance */}
            <HeaderBalance user={user} currentUser={currentUser} loading={loading} />

            {/* Promotions Swiper */}
            <PromotionSwiper  />



            {/* Quick Actions */}
            <Card title="Quick Actions" className="mb-6">
              <Grid columns={3} gap={12}>
                {loading || quickActionsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Grid.Item key={index}>
                      <div className="flex flex-col items-center p-4 rounded-lg">
                        <Skeleton.Title animated className="!w-12 !h-12 !rounded-full !mb-2" />
                        <Skeleton.Title animated className="!w-16 !h-4" />
                      </div>
                    </Grid.Item>
                  ))
                ) : (
                  quickActions.map((action) => (
                    <Grid.Item key={action.id}>
                      <div
                        className="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleQuickAction(action)}
                        style={{ padding: '8px' }}
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-1`}>
                          {action.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight">{action.title}</span>
                      </div>
                    </Grid.Item>
                  ))
                )}
              </Grid>
            </Card>
  
          </div>
        </PullToRefresh>


      </div>
      <NewProfile isOpen={isOpenProfile} onClose={() => setIsOpenProfile(false)} />
      <NewWithdrawal isOpen={isOpenWithdraw} onClose={() => setIsOpenWithdraw(false)} />

      <InviteFriendsEarn isOpen={isInviteFriendsEarn} onClose={() => setIsInviteFriendsEarn(false)} />
      < WithdrawHistoryPopup visible={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      < NewSwap isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />
      < DailyCheckInPopup isOpen={isDailyCheckInOpen} onClose={() => setIsDailyCheckInOpen(false)} />
      < AdWatchPopup isOpen={isAdWatchOpen} onClose={() => setIsAdWatchOpen(false)} />
      < TaskPopup isOpen={isTaskPopupOpen} onClose={() => setIsTaskPopupOpen(false)} />
      < NewRegistrationBlockedPopup 
        isOpen={isRegistrationBlockedPopupVisible} 
        onClose={() => setIsRegistrationBlockedPopupVisible(false)} 
      />
      < MinimumInvitesRequiredPopup 
        isOpen={isMinimumInvitesPopupVisible}
        onClose={() => setIsMinimumInvitesPopupVisible(false)}
        currentInvites={user?.referralCount || 0}
        requiredInvites={10}
        onInviteFriends={() => setIsInviteFriendsEarn(true)}
      />
      < SuspendAllPaymentServicesPopup 
        isOpen={isPaymentSuspendedPopupVisible}
        onClose={() => setIsPaymentSuspendedPopupVisible(false)}
      />
      < RewardsPopup 
        isOpen={isRewardsPopupVisible}
        onClose={() => setIsRewardsPopupVisible(false)}
      />
      < ShopPopup 
        isOpen={isShopPopupVisible}
        onClose={() => setIsShopPopupVisible(false)}
      />
      < LeaderboardPopup 
        visible={isLeaderboardPopupVisible}
        onClose={() => setIsLeaderboardPopupVisible(false)}
      />
      <VoucherPopup 
        visible={isVoucherPopupVisible}
        onClose={() => setIsVoucherPopupVisible(false)}
      />
      <EarningCenterPopup 
        visible={isEarningCenterPopupVisible}
        onClose={() => setIsEarningCenterPopupVisible(false)}
      />
      <SupportPopup 
        visible={isSupportPopupVisible}
        onClose={() => setIsSupportPopupVisible(false)}
      />
      <AppLaunchCountdownPopup 
        isOpen={isAppLaunchCountdownVisible}
        onClose={() => setIsAppLaunchCountdownVisible(false)}
        launchDate={new Date('2026-12-31T23:59:59')}
      />
     
    </>
  );
}
