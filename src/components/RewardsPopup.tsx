'use client';

import React, { useState } from 'react';
import { Popup, Button, Card, ProgressBar, Badge, Tabs } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { StarOutlined, TrophyOutlined, GiftOutlined, CheckCircleOutlined, LockOutlined, FireOutlined } from '@ant-design/icons';

interface RewardsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  icon: React.ReactNode;
  category: 'daily' | 'milestone' | 'special';
}

export default function RewardsPopup({ isOpen, onClose }: RewardsPopupProps) {
  const [activeTab, setActiveTab] = useState('achievements');

  const achievements: Achievement[] = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Complete your first task',
      progress: 1,
      total: 1,
      reward: 100,
      completed: true,
      icon: <CheckCircleOutlined className="text-green-500" />,
      category: 'milestone'
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      progress: 7,
      total: 10,
      reward: 500,
      completed: false,
      icon: <TrophyOutlined className="text-blue-500" />,
      category: 'milestone'
    },
    {
      id: 'daily-streak',
      title: 'Daily Warrior',
      description: 'Check in for 7 consecutive days',
      progress: 4,
      total: 7,
      reward: 300,
      completed: false,
      icon: <FireOutlined className="text-orange-500" />,
      category: 'daily'
    },
    {
      id: 'referral-king',
      title: 'Referral King',
      description: 'Invite 5 friends successfully',
      progress: 2,
      total: 5,
      reward: 1000,
      completed: false,
      icon: <StarOutlined className="text-purple-500" />,
      category: 'special'
    },
    {
      id: 'ad-watcher',
      title: 'Ad Enthusiast',
      description: 'Watch 20 ads',
      progress: 15,
      total: 20,
      reward: 200,
      completed: false,
      icon: <GiftOutlined className="text-pink-500" />,
      category: 'daily'
    },
    {
      id: 'point-collector',
      title: 'Point Collector',
      description: 'Earn 10,000 total points',
      progress: 6500,
      total: 10000,
      reward: 2000,
      completed: false,
      icon: <StarOutlined className="text-yellow-500" />,
      category: 'milestone'
    }
  ];

  const dailyRewards = [
    { day: 1, reward: 50, claimed: true },
    { day: 2, reward: 75, claimed: true },
    { day: 3, reward: 100, claimed: true },
    { day: 4, reward: 150, claimed: true },
    { day: 5, reward: 200, claimed: false },
    { day: 6, reward: 300, claimed: false },
    { day: 7, reward: 500, claimed: false }
  ];

  const totalPoints = 8750;
  const completedAchievements = achievements.filter(a => a.completed).length;

  const renderAchievementCard = (achievement: Achievement) => (
    <Card key={achievement.id} className="mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            {achievement.completed ? (
              <CheckCircleOutlined className="text-green-500 text-xl" />
            ) : achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h4 className="font-semibold text-gray-800 mr-2">{achievement.title}</h4>
              {achievement.completed && (
                <Badge content="✓" style={{ backgroundColor: '#10B981' }} />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
            <div className="flex items-center">
              <ProgressBar
                percent={(achievement.progress / achievement.total) * 100}
                style={{
                  '--fill-color': achievement.completed ? '#10B981' : '#8B5CF6',
                  '--track-color': '#E5E7EB',
                  flex: 1,
                  marginRight: '8px'
                }}
              />
              <span className="text-xs text-gray-500">
                {achievement.progress}/{achievement.total}
              </span>
            </div>
          </div>
        </div>
        <div className="text-center ml-3">
          <div className="text-sm font-semibold text-purple-600">
            +{achievement.reward}
          </div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>
    </Card>
  );

  const renderDailyRewards = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Login Rewards</h3>
        <p className="text-sm text-gray-600">Login daily to claim increasing rewards</p>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dailyRewards.map((reward, index) => (
          <div
            key={reward.day}
            className={`text-center p-3 rounded-lg border-2 ${
              reward.claimed
                ? 'bg-green-50 border-green-200'
                : index === 4
                ? 'bg-purple-50 border-purple-200 border-dashed'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="text-xs text-gray-600 mb-1">Day {reward.day}</div>
            <div className={`text-sm font-semibold ${
              reward.claimed ? 'text-green-600' : index === 4 ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {reward.reward}
            </div>
            <div className="text-xs text-gray-500">pts</div>
            {reward.claimed && (
              <CheckCircleOutlined className="text-green-500 text-xs mt-1" />
            )}
            {!reward.claimed && index === 4 && (
              <div className="text-xs text-purple-600 mt-1">Next</div>
            )}
          </div>
        ))}
      </div>
      
      <Button
        block
        size="large"
        disabled={dailyRewards[4].claimed}
        style={{
          backgroundColor: dailyRewards[4].claimed ? '#D1D5DB' : '#8B5CF6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          height: '48px',
          fontWeight: '500'
        }}
      >
        {dailyRewards[4].claimed ? 'Already Claimed Today' : 'Claim Day 5 Reward'}
      </Button>
    </div>
  );

  const tabItems = [
    {
      key: 'achievements',
      title: 'Achievements'
    },
    {
      key: 'daily',
      title: 'Daily Rewards'
    }
  ];

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      bodyStyle={{
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f8f9fa',
        overflow: 'auto'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <StarOutlined className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rewards Center</h2>
              <p className="text-sm text-gray-500">Track your progress and claim rewards</p>
            </div>
          </div>
          <Button
            fill="none"
            size="small"
            onClick={onClose}
            style={{ padding: '4px' }}
          >
            <CloseOutline fontSize={20} />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{totalPoints.toLocaleString()}</div>
            <div className="text-xs text-purple-600">Total Points</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedAchievements}</div>
            <div className="text-xs text-green-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{achievements.length - completedAchievements}</div>
            <div className="text-xs text-blue-600">In Progress</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title="Achievements" key="achievements">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Your Achievements</h3>
                <Badge content={`${completedAchievements}/${achievements.length}`} style={{ backgroundColor: '#8B5CF6' }} />
              </div>
              
              {achievements.map(renderAchievementCard)}
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab title="Daily Rewards" key="daily">
            {renderDailyRewards()}
          </Tabs.Tab>
        </Tabs>
      </div>
    </Popup>
  );
}
