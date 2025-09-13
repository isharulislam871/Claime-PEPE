'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Card, List, Button, Badge, ProgressBar , Skeleton  } from 'antd-mobile';
import { CheckCircleOutline, StarOutline, CloseOutline, PlayOutline, EyeOutline } from 'antd-mobile-icons';
import { CheckCircleOutlined, GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { LoadAds } from '@/lib/ads';
import { selectAdsSettings, selectCheckInData, selectCheckInLoading, selectIsCheckingIn, selectCheckInError, selectLastCheckInResult, fetchCheckInDataRequest, performCheckInRequest, clearCheckInResult } from '@/modules';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

interface DailyCheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
  
}
 

 
export default function DailyCheckInPopup({ isOpen, onClose }: DailyCheckInPopupProps) {
  const dispatch = useDispatch();
  const AdsSettings = useSelector(selectAdsSettings);
  const checkInData = useSelector(selectCheckInData);
  const loading = useSelector(selectCheckInLoading);
  const isCheckingIn = useSelector(selectIsCheckingIn);
  const error = useSelector(selectCheckInError);
  const lastCheckInResult = useSelector(selectLastCheckInResult);
  
  const [showAdBonus, setShowAdBonus] = useState(false);
 
  useEffect(() => {
    if (isOpen && !checkInData) {
      dispatch(fetchCheckInDataRequest());
     
    }
  }, [isOpen, checkInData, dispatch]);

  useEffect(() => {
    if (lastCheckInResult) {
      toast.success(`Check-in successful! Earned ${lastCheckInResult.totalReward} points!`);
    
      // Clear the result after showing success
      setTimeout(() => {
        dispatch(clearCheckInResult());
      }, 3000);
    }
  }, [lastCheckInResult, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCheckIn = useCallback(async () => {
    if (!checkInData?.canCheckIn || isCheckingIn) return;
    
    dispatch(performCheckInRequest());
  }, [checkInData?.canCheckIn, isCheckingIn, dispatch]);

  const handleWatchAd = useCallback(async () => {
    if (AdsSettings?.monetagEnabled) {
      await LoadAds(AdsSettings.monetagZoneId);
    } else if (AdsSettings?.enableGigaPubAds) {
      // Check if showGiga method exists and call it safely
      if (typeof window !== 'undefined' && window && 'showGiga' in window && typeof (window as any).showGiga === 'function') {
        await (window as any).showGiga();
      }
    }
    setShowAdBonus(false);
  }, [AdsSettings]);

  const getStreakReward = useCallback(() => {
    if (!checkInData) return 10;
    const baseReward = 10;
    const streakBonus = Math.min(checkInData.streak * 2, 20);
    return baseReward + streakBonus;
  }, [checkInData]);

  const getStreakBadgeColor = useCallback(() => {
    if (!checkInData) return 'primary';
    if (checkInData.streak >= 7) return 'success';
    if (checkInData.streak >= 3) return 'warning';
    return 'primary';
  }, [checkInData]);

  // Show loading state if data is not loaded yet
  if (!checkInData && loading) {
    return (
      <Popup
        visible={isOpen}
        onMaskClick={onClose}
        position='bottom'
        bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
      >
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Skeleton.Title animated style={{ width: 32, height: 32 }} />
                <div>
                  <Skeleton.Title animated style={{ width: 120, height: 20 }} />
                  <Skeleton.Paragraph animated lineCount={1} style={{ width: 180, height: 14 }} />
                </div>
              </div>
              <Skeleton.Title animated style={{ width: 24, height: 24 }} />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 overflow-auto p-4">
            <Card className="rounded-xl bg-gray-50">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton.Title animated style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div className="flex-1">
                    <Skeleton.Title animated style={{ width: 140, height: 18 }} />
                    <Skeleton.Paragraph animated lineCount={1} style={{ width: 160, height: 14 }} />
                  </div>
                  <Skeleton.Title animated style={{ width: 60, height: 24, borderRadius: 12 }} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center p-3 rounded-lg bg-gray-100">
                      <Skeleton.Title animated style={{ width: 40, height: 24, margin: '0 auto 8px' }} />
                      <Skeleton.Paragraph animated lineCount={1} style={{ width: 80, height: 12, margin: '0 auto' }} />
                    </div>
                  ))}
                </div>

                <Skeleton.Title animated style={{ width: '100%', height: 44, borderRadius: 8 }} />

                <div className="mt-4">
                  <Skeleton.Paragraph animated lineCount={2} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Popup>
    );
  }

  // Default data if not loaded
  const displayData = checkInData || {
    streak: 0,
    totalCheckIns: 0,
    canCheckIn: false
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
            displayData.canCheckIn 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
              : 'bg-gray-50'
          }`}
        >
          <div className="p-4 text-black">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                displayData.canCheckIn 
                  ? 'bg-white/20' 
                  : 'bg-green-50'
              }`}>
                {displayData.canCheckIn ? (
                  <CheckCircleOutlined className="text-2xl text-black" />
                ) : (
                  <CheckCircleOutline className="text-2xl text-green-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-lg font-bold mb-1 ${
                  displayData.canCheckIn ? 'text-black' : 'text-gray-900'
                }`}>
                  Daily Check-in
                </div>
                <div className={`text-sm ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                }`}>
                  {displayData.canCheckIn 
                    ? `Earn ${getStreakReward()} points today!`
                    : 'Come back tomorrow!'
                  }
                </div>
              </div>

              {displayData.streak > 0 && (
                <Badge 
                  content={`${displayData.streak} day${displayData.streak > 1 ? 's' : ''}`}
                  color={getStreakBadgeColor()}
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className={`text-center p-3 rounded-lg ${
                displayData.canCheckIn 
                  ? 'bg-white/10' 
                  : 'bg-gray-100'
              }`}>
                <div className={`text-xl font-bold ${
                  displayData.canCheckIn ? 'text-black' : 'text-gray-900'
                }`}>
                  {displayData.streak}
                </div>
                <div className={`text-xs ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                }`}>
                  Current Streak
                </div>
              </div>

              <div className={`text-center p-3 rounded-lg ${
                displayData.canCheckIn 
                  ? 'bg-white/10' 
                  : 'bg-gray-100'
              }`}>
                <div className={`text-xl font-bold ${
                  displayData.canCheckIn ? 'text-black' : 'text-gray-900'
                }`}>
                  {displayData.totalCheckIns}
                </div>
                <div className={`text-xs ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                }`}>
                  Total Check-ins
                </div>
              </div>

              <div className={`text-center p-3 rounded-lg ${
                displayData.canCheckIn 
                  ? 'bg-white/10' 
                  : 'bg-gray-100'
              }`}>
                <div className={`text-xl font-bold ${
                  displayData.canCheckIn ? 'text-black' : 'text-gray-900'
                }`}>
                  {getStreakReward()}
                </div>
                <div className={`text-xs ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                }`}>
                  Today's Reward
                </div>
              </div>
            </div>

            <Button
              block
              size="large"
              disabled={!displayData.canCheckIn || isCheckingIn}
              loading={isCheckingIn}
              onClick={handleCheckIn}
              className={`font-bold rounded-lg border-none ${
                displayData.canCheckIn 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {isCheckingIn ? 'Checking In...' : displayData.canCheckIn ? 'Check In Now' : 'Already Checked In'}
            </Button>

            {displayData.streak >= 7 && (
              <div className="mt-3 p-2 px-3 rounded-md bg-yellow-200/20 border border-yellow-300/30 flex items-center gap-2">
                <StarOutline className="text-yellow-400 text-base" />
                <span className={`text-xs ${
                  displayData.canCheckIn ? 'text-white' : 'text-gray-900'
                }`}>
                  Amazing! You're on a {displayData.streak}-day streak! 🔥
                </span>
              </div>
            )}

            <List className="mt-4 bg-transparent">
              <List.Item
                className={`text-xs py-1 ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
                }`}
              >
                💡 Check in daily to maintain your streak and earn bonus points!
              </List.Item>
              <List.Item
                className={`text-xs py-1 ${
                  displayData.canCheckIn ? 'text-black/80' : 'text-gray-600'
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
