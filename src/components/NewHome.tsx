'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Grid,
  Skeleton,
  PullToRefresh,
  Footer,
} from 'antd-mobile';
 
import { createUserRequest, selectCurrentUser, openPopup, closePopup, selectIsProfileOpen, selectIsWithdrawOpen, selectIsInviteFriendsOpen, selectIsHistoryOpen, selectIsSwapOpen, selectIsDailyCheckInOpen, selectIsAdWatchOpen, selectIsTaskPopupOpen, selectIsRegistrationBlockedPopupVisible, selectIsMinimumInvitesPopupVisible, selectIsPaymentSuspendedPopupVisible, selectIsRewardsPopupVisible, selectIsShopPopupVisible, selectIsVoucherPopupVisible, selectIsLeaderboardPopupVisible, selectIsEarningCenterPopupVisible, selectIsSupportPopupVisible, selectIsAppLaunchCountdownVisible, fetchQuickActionsRequest, selectEnabledQuickActions, selectQuickActionsLoading, selectQuickActionsError  } from '@/modules';
 
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
 
import { toast } from 'react-toastify';

 
import PromotionSwiper  from './PromotionSwiper';
import HeaderBalance from './HeaderBalance';
 

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

  
export default function NewHome() {
  const dispatch = useDispatch ();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
 
  const currentUser = getCurrentUser();
  
  const enabledQuickActionsFromRedux = useSelector(selectEnabledQuickActions);
  const quickActionsLoading = useSelector(selectQuickActionsLoading);
  const quickActionsError = useSelector(selectQuickActionsError);

  // Fetch quick actions on component mount
  useEffect(() => {
    dispatch(fetchQuickActionsRequest() as any);
  }, [dispatch]);

  // Handle quick actions error
  useEffect(() => {
    if (quickActionsError) {
      toast.error(`Failed to load quick actions: ${quickActionsError}`);
    }
  }, [quickActionsError]);

  const allQuickActions: QuickAction[] = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: <UnorderedListOutlined className="text-blue-600 text-xl" />,
      color: 'bg-blue-100',
      action: () => dispatch(openPopup('isTaskPopupOpen'))
    },
    {
      id: 'daily-checkin',
      title: 'Daily Check-in',
      icon: <CheckCircleOutlined className="text-green-600 text-xl" />,
      color: 'bg-green-100',
      action: () => dispatch(openPopup('isDailyCheckInOpen'))
    },
    {
      id: 'ads',
      title: 'Watch Ads',
      icon: <PlayCircleOutlined className="text-red-600 text-xl" />,
      color: 'bg-red-100',
      action: () => dispatch(openPopup('isAdWatchOpen'))
    },
    {
      id: 'home',
      title: 'Home',
      icon: <HomeOutlined className="text-yellow-600 text-xl" />,
      color: 'bg-yellow-100',
      action: () => dispatch(openPopup('isAppLaunchCountdownVisible'))
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: <WalletOutlined className="text-purple-600 text-xl" />,
      color: 'bg-purple-100',
      action: () => dispatch(openPopup('isOpenWithdraw'))
    },
    {
      id: 'invite',
      title: 'Invite Friends',
      icon: <UserAddOutlined className="text-pink-600 text-xl" />,
      color: 'bg-pink-100',
      action: () => dispatch(openPopup('isInviteFriendsEarn'))
    },
    {
      id: 'swap',
      title: 'Swap',
      icon: <SwapOutlined className="text-cyan-600 text-xl" />,
      color: 'bg-cyan-100',
      action: () => dispatch(openPopup('isSwapOpen'))
    },
    {
      id: 'history',
      title: 'History',
      icon: <HistoryOutlined className="text-indigo-600 text-xl" />,
      color: 'bg-indigo-100',
      action: () => dispatch(openPopup('isHistoryOpen'))
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <TrophyOutlined className="text-orange-600 text-xl" />,
      color: 'bg-orange-100',
      action: () => dispatch(openPopup('isOpenProfile'))
    },
    
    {
      id: 'rewards',
      title: 'Rewards',
      icon: <StarOutlined className="text-yellow-500 text-xl" />,
      color: 'bg-yellow-50',
      action: () => dispatch(openPopup('isRewardsPopupVisible'))
    },
    {
      id: 'shop',
      title: 'Shop',
      icon: <ShoppingOutlined className="text-green-500 text-xl" />,
      color: 'bg-green-50',
      action: () => dispatch(openPopup('isShopPopupVisible'))
    },
    {
      id: 'voucher',
      title: 'Voucher',
      icon: <CreditCardOutlined className="text-purple-500 text-xl" />,
      color: 'bg-purple-50',
      action: () => dispatch(openPopup('isVoucherPopupVisible'))
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: <CrownOutlined className="text-amber-500 text-xl" />,
      color: 'bg-amber-50',
      action: () => dispatch(openPopup('isLeaderboardPopupVisible'))
    },
    {
      id: 'earning-center',
      title: 'Earning Center',
      icon: <MoneyCollectOutlined className="text-emerald-600 text-xl" />,
      color: 'bg-emerald-100',
      action: () => dispatch(openPopup('isEarningCenterPopupVisible'))
    },
    {
      id: 'support',
      title: 'Support',
      icon: <CustomerServiceOutlined className="text-indigo-600 text-xl" />,
      color: 'bg-indigo-100',
      action: () => dispatch(openPopup('isSupportPopupVisible'))
    }
  ];

  // Filter quick actions based on enabled configuration from Redux
  const quickActions = allQuickActions.filter(action => 
    enabledQuickActionsFromRedux.some(enabledAction => enabledAction.id === action.id)
  );
 

  const handleQuickAction = (action: QuickAction) => {
    action.action();
  };
 

  const handleRefresh = async () => {
    setLoading(true);
    try {
      dispatch(createUserRequest(currentUser));
      dispatch(fetchQuickActionsRequest() as any);
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


  useEffect(() => {
    if (!user) {
      dispatch(createUserRequest({}));
    }
  }, [dispatch, user]);

 
 
  return (
    <>
      <div className="min-h-screen bg-gray-50">
 
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 py-4">
    
            <HeaderBalance user={user} currentUser={currentUser} loading={loading} />
           <PromotionSwiper  />
  
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
 
 
    </>
  );
}
