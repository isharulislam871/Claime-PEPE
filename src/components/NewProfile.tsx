'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popup,
  Button,
  Card,
  List,
  Avatar,
  Switch,
  Badge,
  Toast,
  SpinLoading
} from 'antd-mobile';
import {
  CloseOutline,
  UserOutline,
  BellOutline,
  QuestionCircleOutline,
  RightOutline,
  EditSOutline,
  MessageOutline,
  PhonebookOutline,
  GlobalOutline,
  FileOutline,
  StarOutline,
  ExclamationCircleOutline,
  MailOutline
} from 'antd-mobile-icons';

import { closePopup, selectCurrentUser, selectIsProfileOpen } from '@/modules';
import { getCurrentUser } from '@/lib/api';
import SupportHelpPopup from './SupportHelpPopup';
 
interface UserStats {
  totalEarned: number;
  tasksCompleted: number;
  adsWatched: number;
  referrals: number;
  joinDate: string;
  level: number;
}

export default function NewProfile( ) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isOpenProfile = useSelector(selectIsProfileOpen);
  const [supportHelpOpen, setSupportHelpOpen] = useState(false);
   
  const [userStats, setUserStats] = useState<UserStats>({
    totalEarned: 0,
    tasksCompleted: 0,
    adsWatched: 0,
    referrals: 0,
    joinDate: '',
    level: 1
  });

  const currentUser = getCurrentUser();

  
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLevelProgress = () => {
    const currentLevelPoints = (user?.totalEarned || 0) % 10000;
    return (currentLevelPoints / 10000) * 100;
  };

  const handleEditProfile = () => {
    Toast.show('Edit profile feature coming soon!');
  };

  const handleSettings = () => {
    Toast.show('Settings panel coming soon!');
  };

  const handleSupport = () => {
    setSupportHelpOpen(true);
  };

  const onClose = () => {
    dispatch(closePopup('isOpenProfile'))
  };

  return (
    <Popup
      visible={isOpenProfile}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <UserOutline className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </div>
            <Button
              fill='none'
              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutline className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {/* Profile Header */}
          <Card className="mb-6">
            <div className="flex items-center gap-4 p-4">
              <div className="relative">
                <Avatar
                  src={user?.profilePicUrl as any }

                  className="border-4 border-white shadow-lg"
                />
                <Badge
                  content={userStats.level}
                  className="absolute -bottom-1 -right-1"

                />

              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {user?.username }
                  </h3>
                  
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  @{user?.telegramUsername  }
                </p>

                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-600 font-medium">Level {userStats.level}</span>
                    <span className="text-xs text-purple-600">{getLevelProgress().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getLevelProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="text-center">
              <div className="py-4">
                <div className="text-2xl font-bold text-green-600">{userStats.totalEarned}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
            </Card>

            <Card className="text-center">
              <div className="py-4">
                <div className="text-2xl font-bold text-blue-600">{userStats.tasksCompleted}</div>
                <div className="text-sm text-gray-600">Tasks Done</div>
              </div>
            </Card>

            <Card className="text-center">
              <div className="py-4">
                <div className="text-2xl font-bold text-orange-600">{userStats.adsWatched}</div>
                <div className="text-sm text-gray-600">Ads Watched</div>
              </div>
            </Card>

            <Card className="text-center">
              <div className="py-4">
                <div className="text-2xl font-bold text-purple-600">{userStats.referrals}</div>
                <div className="text-sm text-gray-600">Referrals</div>
              </div>
            </Card>
          </div>

          {/* Account Info */}
          <Card title="Account Information" className="mb-6">
            <List>
              <List.Item extra={formatDate(userStats.joinDate)}>
                Member Since
              </List.Item>
              <List.Item extra={`Level ${userStats.level}`}>
                Current Level
              </List.Item>
              <List.Item extra={`${user?.balance || 0} Points`}>
                Current Balance
              </List.Item>
            </List>
          </Card>

         

          {/* Support & Help */}
          <Card title="Support & Help" className="mb-6">
            <List>
              <List.Item
                prefix={<QuestionCircleOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleSupport}
              >
                <div>
                  <div className="font-medium">Help Center</div>
                  <div className="text-sm text-gray-500">Get help, report issues, and more</div>
                </div>
              </List.Item>
            </List>
          </Card>
 
        </div>
      </div>

      {/* Support Help Popup */}
      <SupportHelpPopup 
        isOpen={supportHelpOpen} 
        onClose={() => setSupportHelpOpen(false)} 
      />
    </Popup>
  );
}
