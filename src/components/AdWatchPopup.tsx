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
import { toast } from 'react-toastify';
import { LoadAds } from '@/lib/ads';
import { selectAdsSettings, watchAdRequest } from '@/modules';
import { selectAdStats } from '@/modules/private/task/selectors';
import { useSelector, useDispatch  } from 'react-redux';
import { fetchAdsRequest, fetchTasksRequest } from '@/modules/private/task';
import { formatNumber } from '@/lib/formatNumber';

interface AdWatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdData {
  dailyAdsWatched: number;
  totalAdsWatched: number;
  dailyLimit: number;
  canWatchAd: boolean;
  lastAdWatched: string | null;
}

interface AdOption {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration: number;
  type: 'video' | 'banner' | 'rewarded';
  available: boolean;
}

export default function AdWatchPopup({ isOpen, onClose }: AdWatchPopupProps) {
  
  const dispatch = useDispatch();

  const [isWatching, setIsWatching] = useState(false);
  const [watchingAdId, setWatchingAdId] = useState<string | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const AdsSettings = useSelector(selectAdsSettings);
  const adStats = useSelector(selectAdStats);

  useEffect(()=>{
    const loadData = async () => {
      setIsLoading(true);
      dispatch(fetchAdsRequest());
      // Simulate loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    loadData();
  }, [dispatch])

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Add haptic feedback if available
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
      
      // Refresh ads data
      dispatch(fetchAdsRequest());
      dispatch(fetchTasksRequest());
      
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to refresh ads:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const adOptions: AdOption[] = [
    {
      id: 'video-short',
      title: 'Short Video Ad',
      description: 'Watch a 15-second video advertisement',
      reward: AdsSettings?.defaultAdsReward || 0,
      duration: AdsSettings?.minWatchTime || 15,
      type: 'video',
      available: AdsSettings?.enableGigaPubAds || false
    },
    {
      id: 'video-medium',
      title: 'Medium Video Ad',
      description: 'Watch a 30-second video advertisement',
      reward: (AdsSettings?.defaultAdsReward || 0) * (AdsSettings?.adsRewardMultiplier || 1),
      duration: (AdsSettings?.minWatchTime || 15) * 2,
      type: 'video',
      available: AdsSettings?.monetagEnabled || false
    }

  ];


  const handleWatchAd = async (ad: AdOption) => {
    if (  isWatching || !ad.available) return;

    setIsWatching(true);
    setWatchingAdId(ad.id);
    setWatchProgress(0);

    if (ad.id === 'video-medium') {
      if (AdsSettings?.monetagEnabled) {
        await LoadAds(AdsSettings.monetagZoneId);
      } else {
        toast.error('Monetag ad not enabled!');
        setIsWatching(false);
        setWatchingAdId(null);
        return;
      }
    }

    if (ad.id === 'video-short') {
      // Check if showGiga method exists and call it safely
      if (AdsSettings?.enableGigaPubAds) {
        try {
          if (typeof window !== 'undefined' && window && 'showGiga' in window && typeof (window as any).showGiga === 'function') {
            await (window as any).showGiga();

          }
        } catch (error) {
          console.warn('showGiga method failed:', error);
          // Continue with ad simulation even if showGiga fails
        }
      }
    }



    try {
      // Simulate ad watching with progress
      const progressInterval = setInterval(() => {
        setWatchProgress(prev => {
          const newProgress = prev + (100 / ad.duration);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 1000);

      // Wait for ad duration
      await new Promise(resolve => setTimeout(resolve, ad.duration * 1000));

      const today = new Date().toISOString();
      // Dispatch watchAdRequest action to Redux
      dispatch(watchAdRequest());



      toast.success(`Ad watched! +${ad.reward} points earned!`);

    } catch (error) {
      toast.error('Failed to watch ad. Please try again.');
    } finally {
      setIsWatching(false);
      setWatchingAdId(null);
      setWatchProgress(0);
    }
  };

  const getDailyProgressPercentage = () => {
    const watched = adStats?.todayAdsViewed || 0;
    const limit = adStats?.dailyLimit || AdsSettings?.adsWatchLimit || 20;
    return Math.round((watched / limit) * 100);
  };

  const getRemainingAds = () => {
    const dailyLimit = adStats?.dailyLimit || AdsSettings?.adsWatchLimit || 20;
    const watchedToday = adStats?.todayAdsViewed || 0;
    return Math.max(0, dailyLimit - watchedToday);
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
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <PlayOutline className="text-red-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Watch Ads</h2>
                <p className="text-sm text-gray-500">Earn points by watching advertisements</p>
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
        <div className="flex-1 overflow-auto">
          <PullToRefresh
            onRefresh={handleRefresh}
            pullingText="Pull to refresh ads"
            canReleaseText="Release to refresh"
            refreshingText="Refreshing ads..."
            completeText="Refresh complete"
          >
            <div className="p-4">
          {/* Daily Progress Card */}
          <Card className="mb-4 bg-gradient-to-br from-red-500 to-pink-600">
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
              <div className="p-4 text-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <EyeOutline className="text-2xl text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-bold mb-1 text-gray-600">
                      Daily Progress
                    </div>
                    <div className="text-sm text-gray-600">
                      {getRemainingAds()} ads remaining today
                    </div>
                  </div>

                  <Badge
                    content={`${adStats?.todayAdsViewed || 0}/${adStats?.dailyLimit || AdsSettings?.adsWatchLimit || 20}`}
                    color="warning"
                  />
                </div>

                <div className="mb-4">
                  <ProgressBar
                    percent={getDailyProgressPercentage()}
                    className="mb-2"
                  />
                  <div className="text-xs text-gray-600 text-center">
                    {getDailyProgressPercentage()}% of daily limit reached
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 text-gray-600 rounded-lg">
                    <div className="text-xl font-bold text-gray-600">
                      {adStats?.todayAdsViewed || 0}
                    </div>
                    <div className="text-xs text-gray-600">
                      Today
                    </div>            
                  </div>

                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-xl font-bold text-gray-600">
                      {formatNumber(adStats?.balance || 0) } <span className="text-sm">pts</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Total
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Ad Options */}
          <Card title="Available Ads" className="mb-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((index) => (
                  <div key={index} className="p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center gap-3">
                      <Skeleton.Title animated className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Skeleton.Title animated className="w-32 h-5" />
                          <Skeleton.Title animated className="w-4 h-4 rounded" />
                        </div>
                        <Skeleton.Title animated className="w-48 h-4 mb-1" />
                        <div className="flex items-center gap-3">
                          <Skeleton.Title animated className="w-12 h-3" />
                          <Skeleton.Title animated className="w-16 h-3" />
                        </div>
                      </div>
                      <Skeleton.Title animated className="w-12 h-6 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {adOptions.filter(ad => ad.available).length > 0 ? (
                  adOptions.filter(ad => ad.available).map((ad) => (
                    <div
                      key={ad.id}
                      className={`p-4 rounded-lg border-2 transition-all ${ad.available 
                        ? 'border-red-200 bg-red-50 hover:border-red-300 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                        } ${watchingAdId === ad.id ? 'border-red-400 bg-red-100' : ''}`}
                      onClick={() => handleWatchAd(ad)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ad.type === 'rewarded' ? 'bg-yellow-100' : 'bg-red-100'
                          }`}>
                          {ad.type === 'rewarded' ? (
                            <TrophyOutlined className="text-yellow-600 text-lg" />
                          ) : (
                            <PlayOutline className="text-red-600 text-lg" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                            {ad.type === 'rewarded' && (
                              <StarOutline className="text-yellow-500 text-sm" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{ad.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>⏱️ {ad.duration}s</span>
                            <span className="text-green-600 font-semibold">+{ad.reward} points</span>
                          </div>
                        </div>

                        {!ad.available && (
                          <Badge content="Locked" color="default" />
                        )}
                      </div>

                      {watchingAdId === ad.id && (
                        <div className="mt-3">
                          <ProgressBar
                            percent={watchProgress}
                            className="mb-2"
                          />
                          <div className="text-center text-sm text-red-600 font-medium">
                            Watching ad... {Math.ceil((100 - watchProgress) * ad.duration / 100)}s remaining
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Empty
                      description="No ads available"
                      imageStyle={{ height: 60 }}
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      Ads are currently disabled or not configured. Check your settings!
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Tips */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <BulbOutlined className="text-yellow-500" />
                <span>Tips & Guidelines</span>
              </div>
            } 
            className="mb-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CalendarOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Daily Consistency</div>
                  <div className="text-xs text-gray-600">Watch ads daily to maximize your earnings and unlock bonus rewards</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <GiftOutlined className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Bonus Rewards</div>
                  <div className="text-xs text-gray-600">Special rewarded ads unlock after watching 5 regular ads</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <MobileOutlined className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Stay Active</div>
                  <div className="text-xs text-gray-600">Keep the app active while watching for full rewards</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <ClockCircleOutlined className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Reset Schedule</div>
                  <div className="text-xs text-gray-600">Daily limit resets at midnight - plan your viewing accordingly</div>
                </div>
              </div>
            </div>
          </Card>

            </div>
          </PullToRefresh>
        </div>
      </div>
    </Popup>
  );
}
