'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import {
  Popup,
  Button,
  Card,
  Grid,

  Badge,
  Toast,
  SpinLoading,
  Swiper,
  NoticeBar,
  Skeleton,
  PullToRefresh,
  ActionSheet
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline,
  EyeOutline,
  StarOutline,
  RightOutline,

  GiftOutline
} from 'antd-mobile-icons';

import { createUserRequest, selectCurrentUser } from '@/modules';
import { formatNumber, formatCurrency } from '@/lib/formatNumber';
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
  UnorderedListOutlined
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
  const [isEarn, setIsEarn] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState(false);
  const [isAdWatchOpen, setIsAdWatchOpen] = useState(false);
  const [isTaskPopupOpen, setIsTaskPopupOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showClaimSheet, setShowClaimSheet] = useState(false);


  const quickActions: QuickAction[] = [
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
      id: 'watch-ads',
      title: 'Watch Ads',
      icon: <PlayCircleOutlined className="text-red-600 text-xl" />,
      color: 'bg-red-100',
      action: () => setIsAdWatchOpen(true)
    },
    {
      id: 'earn',
      title: 'Earn Points',
      icon: <DollarOutlined className="text-yellow-600 text-xl" />,
      color: 'bg-yellow-100',
      action: () => setIsEarn(true)
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: <WalletOutlined className="text-purple-600 text-xl" />,
      color: 'bg-purple-100',
      action: () => setIsOpenWithdraw(true)
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
    }
  ];

  const newsItems = [
    "🎉 New tasks available! Earn up to 500 points each",
    "💰 Withdrawal fees reduced by 50% this week",
    "🎁 Daily bonus increased to 200 points",
    "🔥 Refer friends and get 1000 bonus points"
  ];

  const handleQuickAction = (action: QuickAction) => {
    action.action();

  };

  const handleClaimAchievement = (achievement: Achievement) => {
    if (achievement.completed) {
      setSelectedAchievement(achievement);
      setShowClaimSheet(true);
    }
  };

  const confirmClaimAchievement = () => {
    if (selectedAchievement) {
      // Simulate claiming reward
      toast.success(`🎉 +${selectedAchievement.reward} points claimed!`);
      console.log(`Achievement claimed: ${selectedAchievement.title}`);

      // In real app, update user balance and mark achievement as claimed
      // dispatch(claimAchievement(selectedAchievement.id));
    }
    setShowClaimSheet(false);
    setSelectedAchievement(null);
  };

  const cancelClaimAchievement = () => {
    setShowClaimSheet(false);
    setSelectedAchievement(null);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API calls to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch(createUserRequest(currentUser));
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Content */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 py-4">
            {/* News Banner */}
            <NoticeBar
              content={newsItems.join(' • ')}
              color="info"
              className="mb-4"
              closeable
            />

            {/* Welcome Card */}
            <Card className="mb-6 bg-gradient-to-r from-blue-200 to-purple-200 text-black">
              <div className="flex items-center gap-4 p-4">
                {loading ? (
                  <>
                    <Skeleton.Title animated className="!w-12 !h-12 !rounded-full" />
                    <div className="flex-1">
                      <Skeleton.Title animated className="!w-32 !h-5 !mb-1" />
                      <Skeleton.Title animated className="!w-40 !h-4 !mb-2" />
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Skeleton.Title animated className="!w-12 !h-5 !mb-1" />
                          <Skeleton.Title animated className="!w-10 !h-3" />
                        </div>
                        <div className="text-center">
                          <Skeleton.Title animated className="!w-8 !h-5 !mb-1" />
                          <Skeleton.Title animated className="!w-12 !h-3" />
                        </div>
                        <div className="text-center">
                          <Skeleton.Title animated className="!w-10 !h-5 !mb-1" />
                          <Skeleton.Title animated className="!w-8 !h-3" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar
                      src={user?.profilePicUrl || currentUser.profilePicUrl as any}
                      className="border-2 border-black/30"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1 text-black">
                        Hello, <span className="text-yellow-700">{user?.username || currentUser.username}</span>!
                      </h3>
                      <p className="text-sm text-black/80 mb-2">
                        Ready to earn some <span className="text-yellow-700 font-semibold">points</span> today?
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-700">{formatNumber(user?.balance || 0)}</div>
                          <div className="text-xs text-black/70 font-medium">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-green-700">
                            {formatCurrency((user?.balance || 0) * 0.25 / 10000)}
                          </div>
                          <div className="text-xs text-black/70 font-medium">USD Value</div>
                        </div>
                        <div className="text-center bg-black/10 px-2 py-1 rounded-md">
                          <div className="text-xs text-black/80 font-medium">
                            {formatNumber(10000)} pts = {formatCurrency(0.25)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>



            {/* Quick Actions */}
            <Card title="Quick Actions" className="mb-6">
              <Grid columns={3} gap={12}>
                {loading ? (
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

            {/* Today's Progress */}
            <Card title="Today's Progress" className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <Skeleton.Title animated className="!w-8 !h-8 !mb-2 !mx-auto" />
                      <Skeleton.Title animated className="!w-12 !h-3 !mx-auto" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-xs text-green-600">Tasks Done</div>
                    </div>

                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{user?.adsWatchedToday || 0}</div>
                      <div className="text-xs text-blue-600">Ads Watched</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{user?.referralCount || 0}</div>
                      <div className="text-xs text-purple-600">Referrals</div>
                    </div>
                  </>
                )}
              </div>
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
    </>
  );
}
