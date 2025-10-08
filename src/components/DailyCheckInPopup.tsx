'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Card, List, Button, Badge, ProgressBar , Skeleton  } from 'antd-mobile';
import { CheckCircleOutline, StarOutline, CloseOutline, PlayOutline, EyeOutline, CalendarOutline } from 'antd-mobile-icons';
import { CheckCircleOutlined, GiftOutlined, TrophyOutlined, CrownOutlined, FireOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { LoadAds } from '@/lib/ads';
import { selectAdsSettings, selectCheckInData, selectCheckInLoading, selectIsCheckingIn, selectCheckInError, selectLastCheckInResult, fetchCheckInDataRequest, performCheckInRequest, clearCheckInResult, selectIsDailyCheckInOpen, closePopup } from '@/modules';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
 
 
export default function DailyCheckInPopup( ) {
  const dispatch = useDispatch();
  const AdsSettings = useSelector(selectAdsSettings);
  const checkInData = useSelector(selectCheckInData);
  const loading = useSelector(selectCheckInLoading);
  const isCheckingIn = useSelector(selectIsCheckingIn);
  const error = useSelector(selectCheckInError);
  const lastCheckInResult = useSelector(selectLastCheckInResult);
  const isOpen = useSelector(selectIsDailyCheckInOpen);
  const onClose = () => {
    dispatch(closePopup('isDailyCheckInOpen'))
  };
   
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
    
    try {
      // Show ads first
   /*    if (AdsSettings?.monetagEnabled) {
        await LoadAds(AdsSettings.monetagZoneId);
      } else if (AdsSettings?.enableGigaPubAds) {
        // Check if showGiga method exists and call it safely
        if (typeof window !== 'undefined' && window && 'showGiga' in window && typeof (window as any).showGiga === 'function') {
          await (window as any).showGiga();
        }
      } */
      
      // Check if showAdexora method exists and call it safely
      if (typeof window !== 'undefined' && window && 'showAdexora' in window && typeof window.showAdexora === 'function') {
        await window.showAdexora!();
      }
      // After ads are shown, dispatch the check-in request
      dispatch(performCheckInRequest());
    } catch (error) {
      console.error('Error showing ads:', error);
      // Still proceed with check-in even if ads fail
      dispatch(performCheckInRequest());
    }
  }, [checkInData?.canCheckIn, isCheckingIn, dispatch, AdsSettings]);

 

  const getStreakReward = useCallback(() => {
    if (!checkInData) return 10;
    const baseReward = 10;
    const streakBonus = Math.min(checkInData.streak * 2, 20);
    return baseReward + streakBonus;
  }, [checkInData]);

  const getDayReward = useCallback((dayIndex: number) => {
    // Match the API route reward calculation logic
    const baseReward = 10;
    const streakBonus = Math.min(dayIndex * 2, 20);
    return baseReward + streakBonus;
  }, []);

  const getCurrentCycleDay = useCallback(() => {
    if (!checkInData) return 0;
    return (checkInData.streak % 7) || (checkInData.streak > 0 ? 7 : 0);
  }, [checkInData]);

  const getCycleProgress = useCallback(() => {
    const currentDay = getCurrentCycleDay();
    return (currentDay / 7) * 100;
  }, [getCurrentCycleDay]);

  // Show loading state if data is not loaded yet
  if (!checkInData && loading) {
    return (
      <Popup
        visible={isOpen}
        onMaskClick={onClose}
        position='bottom'
        bodyStyle={{ height: '100vh', backgroundColor: 'var(--popup-bg)' }}
        className="dark"
      >
        <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
          {/* Header Skeleton */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <Skeleton.Title animated style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(250,204,21,0.3)' }} />
                <div>
                  <Skeleton.Title animated style={{ width: 140, height: 24, backgroundColor: 'rgba(107,114,128,0.2)' }} className="dark:!bg-white/20" />
                  <Skeleton.Paragraph animated lineCount={1} style={{ width: 120, height: 16, backgroundColor: 'rgba(107,114,128,0.15)', marginTop: 4 }} className="dark:!bg-white/15" />
                </div>
              </div>
              <Skeleton.Title animated style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(107,114,128,0.1)' }} className="dark:!bg-white/10" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
              {/* Progress bar skeleton */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton.Title animated style={{ width: 120, height: 18, backgroundColor: 'rgba(107,114,128,0.2)' }} className="dark:!bg-white/20" />
                  <Skeleton.Title animated style={{ width: 60, height: 16, backgroundColor: 'rgba(107,114,128,0.15)' }} className="dark:!bg-white/15" />
                </div>
                <Skeleton.Title animated style={{ width: '100%', height: 12, borderRadius: 6, backgroundColor: 'rgba(250,204,21,0.2)' }} />
              </div>

              {/* 7-day grid skeleton */}
              <div className="mb-8">
                <Skeleton.Title animated style={{ width: 100, height: 20, backgroundColor: 'rgba(107,114,128,0.2)', marginBottom: 16 }} className="dark:!bg-white/20" />
                <div className="grid grid-cols-7 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton.Title animated style={{ width: 48, height: 48, borderRadius: 12, margin: '0 auto 8px', backgroundColor: 'rgba(107,114,128,0.1)' }} className="dark:!bg-white/10" />
                      <Skeleton.Paragraph animated lineCount={1} style={{ width: 32, height: 12, margin: '0 auto', backgroundColor: 'rgba(107,114,128,0.15)' }} className="dark:!bg-white/15" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats skeleton */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Skeleton.Title animated style={{ width: 48, height: 28, margin: '0 auto 8px', backgroundColor: 'rgba(107,114,128,0.2)' }} className="dark:!bg-white/20" />
                    <Skeleton.Paragraph animated lineCount={1} style={{ width: 80, height: 14, margin: '0 auto', backgroundColor: 'rgba(107,114,128,0.15)' }} className="dark:!bg-white/15" />
                  </div>
                ))}
              </div>

              <Skeleton.Title animated style={{ width: '100%', height: 64, borderRadius: 12, backgroundColor: 'rgba(250,204,21,0.2)' }} />
            </div>
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
      bodyStyle={{ height: '100vh', backgroundColor: 'var(--popup-bg)' }}
      className="dark"
    >
      <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
        {/* Header - Binance Style */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <CrownOutlined className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-bitcount">Daily Check-in</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-edu-hand">Earn rewards every day</p>
              </div>
            </div>
            <Button
              size='small'
              onClick={onClose}
              className="!p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border-none bg-transparent"
            >
              <CloseOutline className="text-gray-600 dark:text-gray-400 text-lg" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
            
            {/* Cycle Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-900 dark:text-white font-semibold text-sm font-bitcount">Weekly Progress</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium font-edu-hand">{getCurrentCycleDay()}/7 days</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${getCycleProgress()}%` }}
                />
              </div>
            </div>

            {/* 7-Day Streak Grid */}
            <div className="mb-8">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 text-sm font-bitcount">
                Daily Rewards
              </h3>
              <div className="grid grid-cols-7 gap-3">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const dayNumber = dayIndex + 1;
                  const currentCycleDay = getCurrentCycleDay();
                  const isCompleted = dayNumber <= currentCycleDay;
                  const isToday = dayNumber === currentCycleDay + (displayData.canCheckIn ? 1 : 0);
                  const reward = getDayReward(dayIndex);
                  
                  return (
                    <div key={dayIndex} className="text-center">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 border-2
                        ${isCompleted 
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-yellow-500 shadow-lg' 
                          : isToday && displayData.canCheckIn
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-600 dark:text-yellow-400 animate-pulse'
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircleOutlined className="text-lg" />
                        ) : (
                          dayNumber
                        )}
                      </div>
                      <div className={`text-xs font-semibold font-bitcount ${
                        isCompleted ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        +{reward}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1 font-bitcount">
                  <FireOutlined className="text-base text-orange-500" />
                  {displayData.streak}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium font-edu-hand">Current Streak</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1 font-bitcount">
                  <TrophyOutlined className="text-base text-blue-500" />
                  {displayData.totalCheckIns}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium font-edu-hand">Total Check-ins</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-1 font-bitcount">
                  <GiftOutlined className="text-base text-yellow-500" />
                  {getStreakReward()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium font-edu-hand">Today's Reward</div>
              </div>
            </div>

            {/* Claim Button */}
            <Button
              block
              size="large"
              disabled={!displayData.canCheckIn || isCheckingIn}
              loading={isCheckingIn}
              onClick={handleCheckIn}
              className={`
                font-bold rounded-xl border-none h-14 text-sm transition-all duration-300
                ${displayData.canCheckIn 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isCheckingIn ? (
                <span className="flex items-center justify-center gap-2 font-bitcount">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Claiming Reward...</span>
                </span>
              ) : displayData.canCheckIn ? (
                <span className="flex items-center justify-center gap-2 font-bitcount">
                  <GiftOutlined className="text-base" />
                  Claim {getStreakReward()} Points
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 font-bitcount">
                  <CheckCircleOutlined className="text-base" />
                  Already Claimed Today
                </span>
              )}
            </Button>

            {/* Streak Achievement */}
            {displayData.streak >= 7 && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <CrownOutlined className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-yellow-600 dark:text-yellow-400 font-bold text-sm font-great-vibes">Streak Master!</div>
                    <div className="text-gray-600 dark:text-gray-300 text-xs font-edu-hand">
                      {displayData.streak} days streak - Keep it up! 🔥
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 space-y-2">
              <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 font-edu-hand">
                <span className="text-yellow-500 text-sm">💡</span>
                <span>Check in daily to maintain your streak and unlock higher rewards</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 font-edu-hand">
                <span className="text-yellow-500 text-sm">🎯</span>
                <span>Complete 7-day cycles to earn maximum rewards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
