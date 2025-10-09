'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Popup, Card, List, Button, Badge, ProgressBar, Empty, PullToRefresh , Skeleton } from 'antd-mobile';
import { PayCircleOutline, CloseOutline, EyeOutline, StarOutline, PlayOutline } from 'antd-mobile-icons';
import { 
  TrophyOutlined, 
  BulbOutlined, 
  CalendarOutlined, 
  MobileOutlined, 
  ReloadOutlined,
  GiftOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch  } from 'react-redux';
import { toast } from 'react-toastify';
import { LoadAds } from '@/lib/ads';
import { closePopup, fetchUserRequest, selectAdsDailyLimit, selectAdsSettings, selectAuthLoading, selectIsAdWatchOpen , selectUserAdsWatchedToday, selectUserBalance, watchAdRequest ,   } from '@/modules';
import { formatNumber } from '@/lib/formatNumber';

 



export default function AdWatchPopup( ) {
  
  const dispatch = useDispatch();
 
   
  const AdsSettings = useSelector(selectAdsSettings);
  
  const  limit   = useSelector(selectAdsDailyLimit);
  const  watchedToday   = useSelector(selectUserAdsWatchedToday);
  const balance   = useSelector(selectUserBalance);
  const isLoading   = useSelector(selectAuthLoading);
  

  const onClose = () => {
    dispatch(closePopup('isAdWatchOpen'))
  };

  const isOpen = useSelector(selectIsAdWatchOpen);



 async function showAlternatingAds() {
    // Define all ad providers in rotation
    const ads = ["load", "giga", "adexora"];
  
    // Get last state from localStorage
    let lastAd = localStorage.getItem("lastAd");
  
    // Find index of last shown ad
    let lastIndex = ads.indexOf(lastAd || "");
  
    // Calculate next ad index (rotate)
    let nextIndex = (lastIndex + 1) % ads.length;
    let nextAd = ads[nextIndex];
  
    // Check if multiple ad providers are disabled
    let skippedCount = 0;
    const originalNextAd = nextAd;
    
    // If monetag is disabled and current ad is "load", skip to next ad
    if (nextAd === "load" && !AdsSettings?.monetagEnabled) {
      nextIndex = (nextIndex + 1) % ads.length;
      nextAd = ads[nextIndex];
      skippedCount++;
    }
    
    // If giga ads are disabled and current ad is "giga", skip to next ad
    if (nextAd === "giga" && !AdsSettings?.enableGigaPubAds) {
      nextIndex = (nextIndex + 1) % ads.length;
      nextAd = ads[nextIndex];
      skippedCount++;
    }
    
    // If we've skipped multiple ads, check if we're back to a disabled one
    if (skippedCount > 0 && ((nextAd === "load" && !AdsSettings?.monetagEnabled) || (nextAd === "giga" && !AdsSettings?.enableGigaPubAds))) {
      toast.error('Please setup ads configuration in settings');
      return null;
    }
   
    // Show the next ad
    if (nextAd === "load") {
      if (AdsSettings?.monetagEnabled) {
        console.log("show monetag");
        await LoadAds(AdsSettings?.monetagZoneId as string);
      }
    } else if (nextAd === "giga") {
      console.log("show giga");
      await window.showGiga?.();
    } else if (nextAd === "adexora") {
      console.log("show adexora");
      await window.showAdexora?.();
    }
   
  
    // Save state
    localStorage.setItem("lastAd", nextAd);
  
    return nextAd;
  }

  const handleRefresh = async () => {
      dispatch(fetchUserRequest());
      // Return a resolved promise to satisfy PullToRefresh component
      return Promise.resolve();
  };
  


  const handleWatchAd = async () => {
    if (  getRemainingAds() <= 0) return;
 
      await showAlternatingAds();
      dispatch(watchAdRequest());
   
  };

  const getDailyProgressPercentage = () => {
    
    return Math.round(( watchedToday / limit) * 100);
  };

  const getRemainingAds = () => {
    const dailyLimit =  limit;
    return Math.max(0, dailyLimit - watchedToday);
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <PlayOutline className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-bitcount">Watch Ads</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-edu-hand">Earn points by watching advertisements</p>
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
        <div className="flex-1 overflow-auto">
          <PullToRefresh
            onRefresh={handleRefresh}
            pullingText="Pull to refresh ads"
            canReleaseText="Release to refresh"
            refreshingText="Refreshing ads..."
            completeText="Refresh complete"
          >
            <div className="p-6">
          {/* Daily Progress Card */}
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
            {isLoading ? (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton.Title animated className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton.Title animated className="w-32 h-5 mb-2" />
                    <Skeleton.Title animated className="w-24 h-4" />
                  </div>
                  <Skeleton.Title animated className="w-16 h-6 rounded-full" />
                </div>
                <div className="mb-4">
                  <Skeleton.Title animated className="w-full h-2 rounded-full mb-2" />
                  <Skeleton.Title animated className="w-40 h-3 mx-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg">
                    <Skeleton.Title animated className="w-12 h-6 mx-auto mb-1" />
                    <Skeleton.Title animated className="w-8 h-3 mx-auto" />
                  </div>
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <Skeleton.Title animated className="w-16 h-6 mx-auto mb-1" />
                    <Skeleton.Title animated className="w-8 h-3 mx-auto" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center">
                    <EyeOutline className="text-2xl text-red-600 dark:text-red-400" />
                  </div>

                  <div className="flex-1">
                    <div className="text-base font-bold mb-1 text-gray-900 dark:text-white font-bitcount">
                      Daily Progress
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-edu-hand">
                      {getRemainingAds()} ads remaining today
                    </div>
                  </div>

                  <Badge
                    content={`${  watchedToday }/${ limit}`}
                    color="warning"
                  />
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${getDailyProgressPercentage()}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-edu-hand">
                    {getDailyProgressPercentage()}% of daily limit reached
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-bitcount">
                      { watchedToday }
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-edu-hand">
                      Today
                    </div>            
                  </div>

                  <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-bitcount">
                      {formatNumber(balance || 0)} <span className="text-xs">pts</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-edu-hand">
                      Total
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Watch Ads Button */}
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 font-bitcount">Watch Ads</h3>
            
            {isLoading ? (
              <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Skeleton.Title animated className="w-12 h-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton.Title animated className="w-32 h-5 mb-2" />
                    <Skeleton.Title animated className="w-48 h-4" />
                  </div>
                </div>
              </div>
            ) : (AdsSettings?.monetagEnabled || AdsSettings?.enableGigaPubAds) ? (
              <div>
                <Button
                  block
                  size="large"
                  disabled={  getRemainingAds() <= 0}
                 
                  onClick={handleWatchAd}
                  className={`
                    font-bold rounded-xl border-none h-14 text-sm transition-all duration-300 font-bitcount
                    ${getRemainingAds() > 0
                      ? 'bg-gradient-to-r from-red-400 to-red-500 text-white dark:text-gray-800 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  
                    <span className="flex items-center justify-center gap-2 text-white dark:text-gray-800">
                      <PlayOutline className="text-base" />
                      <span className="font-bitcount text-sm text-white dark:text-gray-800">Play and Watch Ads</span>
                    </span>
                  
                </Button>

              
              </div>
            ) : (
              <div className="text-center py-8">
                <Empty
                  description="No ads available"
                  imageStyle={{ height: 60 }}
                />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 font-edu-hand">
                  Ads are currently disabled or not configured. Check your settings!
                </p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BulbOutlined className="text-yellow-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white font-bitcount">Tips & Guidelines</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <CalendarOutlined className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 font-bitcount">Daily Consistency</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-edu-hand">Watch ads daily to maximize your earnings and unlock bonus rewards</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <GiftOutlined className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 font-bitcount">Bonus Rewards</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-edu-hand">Special rewarded ads unlock after watching 5 regular ads</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <MobileOutlined className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 font-bitcount">Stay Active</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-edu-hand">Keep the app active while watching for full rewards</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <ClockCircleOutlined className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1 font-bitcount">Reset Schedule</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-edu-hand">Daily limit resets at midnight - plan your viewing accordingly</div>
                </div>
              </div>
            </div>
          </div>

            </div>
          </PullToRefresh>
        </div>
      </div>
    </Popup>
  );
}
