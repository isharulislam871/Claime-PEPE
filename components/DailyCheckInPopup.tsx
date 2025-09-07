'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Card, List, Button, Badge } from 'antd-mobile';
import { CheckCircleOutline, StarOutline, CloseOutline } from 'antd-mobile-icons';
import { CheckCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

interface DailyCheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn?: (reward: number) => void;
}

interface CheckInData {
  lastCheckIn: string | null;
  streak: number;
  totalCheckIns: number;
  canCheckIn: boolean;
}

export default function DailyCheckInPopup({ isOpen, onClose, onCheckIn }: DailyCheckInPopupProps) {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    lastCheckIn: null,
    streak: 0,
    totalCheckIns: 0,
    canCheckIn: true
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Load check-in data from localStorage
    const savedData = localStorage.getItem('dailyCheckIn');
    if (savedData) {
      const data = JSON.parse(savedData);
      const today = new Date().toDateString();
      const lastCheckIn = data.lastCheckIn;
      
      // Check if user can check in today
      const canCheckIn = !lastCheckIn || new Date(lastCheckIn).toDateString() !== today;
      
      // Calculate streak
      let streak = data.streak || 0;
      if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Reset streak if more than 1 day gap
        if (lastDate.toDateString() !== yesterday.toDateString() && 
            lastDate.toDateString() !== today) {
          streak = 0;
        }
      }
      
      setCheckInData({
        lastCheckIn: data.lastCheckIn,
        streak,
        totalCheckIns: data.totalCheckIns || 0,
        canCheckIn
      });
    }
  }, [isOpen]);

  const handleCheckIn = async () => {
    if (!checkInData.canCheckIn || isChecking) return;

    setIsChecking(true);
    try {
      const today = new Date().toISOString();
      const baseReward = 10;
      const streakBonus = Math.min(checkInData.streak * 2, 20); // Max 20 bonus
      const totalReward = baseReward + streakBonus;

      // Update check-in data
      const newData = {
        lastCheckIn: today,
        streak: checkInData.streak + 1,
        totalCheckIns: checkInData.totalCheckIns + 1,
        canCheckIn: false
      };

      // Save to localStorage
       localStorage.setItem('dailyCheckIn', JSON.stringify(newData));
      setCheckInData(newData);

      // Call callback if provided
      if (onCheckIn) {
        onCheckIn(totalReward);
      }

      toast.success(`Daily check-in complete! +${totalReward} points earned!`);
      
      // Auto close after successful check-in
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to check in. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStreakReward = () => {
    const baseReward = 10;
    const streakBonus = Math.min(checkInData.streak * 2, 20);
    return baseReward + streakBonus;
  };

  const getStreakBadgeColor = () => {
    if (checkInData.streak >= 7) return 'success';
    if (checkInData.streak >= 3) return 'warning';
    return 'primary';
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Daily Check-in</h2>
                <p className="text-sm text-gray-500">Earn daily rewards and build streaks</p>
              </div>
            </div>
            <Button
              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutline className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Card
            className={`rounded-xl ${
              checkInData.canCheckIn 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gray-50'
            }`}
          >
            <div className="p-4 text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  checkInData.canCheckIn 
                    ? 'bg-white/20' 
                    : 'bg-green-50'
                }`}>
                  {checkInData.canCheckIn ? (
                    <CheckCircleOutlined className="text-2xl text-black" />
                  ) : (
                    <CheckCircleOutline className="text-2xl text-green-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`text-lg font-bold mb-1 ${
                    checkInData.canCheckIn ? 'text-black' : 'text-gray-900'
                  }`}>
                    Daily Check-in
                  </div>
                  <div className={`text-sm ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}>
                    {checkInData.canCheckIn 
                      ? `Earn ${getStreakReward()} points today!`
                      : 'Come back tomorrow!'
                    }
                  </div>
                </div>

                {checkInData.streak > 0 && (
                  <Badge 
                    content={`${checkInData.streak} day${checkInData.streak > 1 ? 's' : ''}`}
                    color={getStreakBadgeColor()}
                  />
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className={`text-center p-3 rounded-lg ${
                  checkInData.canCheckIn 
                    ? 'text-black/10' 
                    : 'bg-gray-100'
                }`}>
                  <div className={`text-xl font-bold ${
                    checkInData.canCheckIn ? 'text-black' : 'text-gray-900'
                  }`}>
                    {checkInData.streak}
                  </div>
                  <div className={`text-xs ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}>
                    Current Streak
                  </div>
                </div>

                <div className={`text-center p-3 rounded-lg ${
                  checkInData.canCheckIn 
                    ? 'bg-text-black/10' 
                    : 'bg-gray-100'
                }`}>
                  <div className={`text-xl font-bold ${
                    checkInData.canCheckIn ? 'text-black' : 'text-gray-900'
                  }`}>
                    {checkInData.totalCheckIns}
                  </div>
                  <div className={`text-xs ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}>
                    Total Check-ins
                  </div>
                </div>

                <div className={`text-center p-3 rounded-lg ${
                  checkInData.canCheckIn 
                    ? 'text-black/10' 
                    : 'bg-gray-100'
                }`}>
                  <div className={`text-xl font-bold ${
                    checkInData.canCheckIn ? 'text-black' : 'text-gray-900'
                  }`}>
                    {getStreakReward()}
                  </div>
                  <div className={`text-xs ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}>
                    Today's Reward
                  </div>
                </div>
              </div>

              <Button
                block
                size="large"
                disabled={!checkInData.canCheckIn}
                loading={isChecking}
                onClick={handleCheckIn}
                className={`font-bold rounded-lg border-none ${
                  checkInData.canCheckIn 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {checkInData.canCheckIn ? 'Check In Now' : 'Already Checked In'}
              </Button>

              {checkInData.streak >= 7 && (
                <div className="mt-3 p-2 px-3 rounded-md bg-yellow-200/20 border border-yellow-300/30 flex items-center gap-2">
                  <StarOutline className="text-yellow-400 text-base" />
                  <span className={`text-xs ${
                    checkInData.canCheckIn ? 'text-white' : 'text-gray-900'
                  }`}>
                    Amazing! You're on a {checkInData.streak}-day streak! 🔥
                  </span>
                </div>
              )}

              <List className="mt-4 bg-transparent">
                <List.Item
                  className={`text-xs py-1 ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}
                >
                  💡 Check in daily to maintain your streak and earn bonus points!
                </List.Item>
                <List.Item
                  className={`text-xs py-1 ${
                    checkInData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                  }`}
                >
                  🎯 Streak bonus: +2 points per day (max +20)
                </List.Item>
              </List>
            </div>
          </Card>
        </div>
      </div>
    </Popup>
  );
}
