'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Card, List, Button, Badge, ProgressBar, Empty } from 'antd-mobile';
import { PayCircleOutline, CloseOutline, EyeOutline, StarOutline } from 'antd-mobile-icons';
import { PlayCircleOutlined, EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { LoadAds } from '@/lib/ads';
import { selectAdsSettings } from '@/modules';
import { useSelector } from 'react-redux';

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

export default function AdWatchPopup({ isOpen, onClose  }: AdWatchPopupProps) {
  const [adData, setAdData] = useState<AdData>({
    dailyAdsWatched: 0,
    totalAdsWatched: 0,
    dailyLimit: 20,
    canWatchAd: true,
    lastAdWatched: null
  });
  const [isWatching, setIsWatching] = useState(false);
  const [watchingAdId, setWatchingAdId] = useState<string | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  const AdsSettings = useSelector(selectAdsSettings);

  const adOptions: AdOption[] = [
    {
      id: 'video-short',
      title: 'Short Video Ad',
      description: 'Watch a 15-second video advertisement',
      reward: 5,
      duration: 15,
      type: 'video',
      available:  AdsSettings?.enableGigaPubAds || false
    },
    {
      id: 'video-medium',
      title: 'Medium Video Ad',
      description: 'Watch a 30-second video advertisement',
      reward: 10,
      duration: 30,
      type: 'video',
      available: AdsSettings?.enableMonetag || false
    }

  ];

  useEffect(() => {
    // Load ad data from localStorage
    const savedData = localStorage.getItem('adWatchData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const today = new Date().toDateString();
      const lastAdDate = data.lastAdWatched ? new Date(data.lastAdWatched).toDateString() : null;

      // Reset daily count if it's a new day
      const dailyAdsWatched = lastAdDate === today ? (data.dailyAdsWatched || 0) : 0;
      const canWatchAd = dailyAdsWatched < 20; // Daily limit

      setAdData({
        dailyAdsWatched,
        totalAdsWatched: data.totalAdsWatched || 0,
        dailyLimit: 20,
        canWatchAd,
        lastAdWatched: data.lastAdWatched
      });
    }
  }, [isOpen]);

  const handleWatchAd = async (ad: AdOption) => {
    if (!adData.canWatchAd || isWatching || !ad.available) return;

    setIsWatching(true);
    setWatchingAdId(ad.id);
    setWatchProgress(0);

    if (ad.id === 'video-medium') {
      if (AdsSettings?.enableMonetag) {
        await LoadAds('9827587');
      } else {
        toast.error('Monetag ad not enabled!');
        setIsWatching(false);
        setWatchingAdId(null);
        return;
      }
    }

    if (ad.id === 'video-short') {
      // Check if showGiga method exists and call it safely
      try {
        if (typeof window !== 'undefined' && window && 'showGiga' in window && typeof (window as any).showGiga === 'function') {
          await (window as any).showGiga();

        }
      } catch (error) {
        console.warn('showGiga method failed:', error);
        // Continue with ad simulation even if showGiga fails
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
      const newDailyCount = adData.dailyAdsWatched + 1;
      const newTotalCount = adData.totalAdsWatched + 1;

      // Update ad data
      const newData = {
        dailyAdsWatched: newDailyCount,
        totalAdsWatched: newTotalCount,
        dailyLimit: 20,
        canWatchAd: newDailyCount < 20,
        lastAdWatched: today
      };

      // Save to localStorage
      localStorage.setItem('adWatchData', JSON.stringify(newData));
      setAdData(newData);

      
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
    return (adData.dailyAdsWatched / adData.dailyLimit) * 100;
  };

  const getRemainingAds = () => {
    return Math.max(0, adData.dailyLimit - adData.dailyAdsWatched);
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
                <PlayCircleOutlined className="text-red-600 text-lg" />
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
        <div className="flex-1 overflow-auto p-4">
          {/* Daily Progress Card */}
          <Card className="mb-4 bg-gradient-to-br from-red-500 to-pink-600">
            <div className="p-4 text-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <EyeOutlined className="text-2xl text-gray-600" />
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
                  content={`${adData.dailyAdsWatched}/${adData.dailyLimit}`}
                  color="warning"
                />
              </div>

              <div className="mb-4">
                <ProgressBar
                  percent={getDailyProgressPercentage()}
                  className="mb-2"
                />
                <div className="text-xs text-text-gray-600 text-center">
                  {adData.dailyAdsWatched} of {adData.dailyLimit} daily ads watched
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 text-gray-600 rounded-lg">
                  <div className="text-xl font-bold text-gray-600">
                    {adData.dailyAdsWatched}
                  </div>
                  <div className="text-xs text-gray-600">
                    Today
                  </div>
                </div>

                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-xl font-bold text-gray-600">
                    {adData.totalAdsWatched}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Ad Options */}
          <Card title="Available Ads" className="mb-4">
            <div className="space-y-3">
              {adOptions.filter(ad => ad.available).length > 0 ? (
                adOptions.filter(ad => ad.available).map((ad) => (
                <div
                  key={ad.id}
                  className={`p-4 rounded-lg border-2 transition-all ${ad.available && adData.canWatchAd
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
                        <PlayCircleOutlined className="text-red-600 text-lg" />
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
          </Card>

          {/* Tips */}
          <Card title="💡 Tips" className="mb-4">
            <List className="bg-transparent">
              <List.Item className="text-xs py-2 text-gray-600">
                🎯 Watch ads daily to maximize your earnings
              </List.Item>
              <List.Item className="text-xs py-2 text-gray-600">
                ⭐ Special rewarded ads unlock after watching 5 regular ads
              </List.Item>
              <List.Item className="text-xs py-2 text-gray-600">
                📱 Keep the app active while watching for full rewards
              </List.Item>
              <List.Item className="text-xs py-2 text-gray-600">
                🔄 Daily limit resets at midnight
              </List.Item>
            </List>
          </Card>

          {!adData.canWatchAd && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="p-4 text-center">
                <div className="text-yellow-600 font-semibold mb-2">
                  Daily Limit Reached! 🎉
                </div>
                <div className="text-sm text-yellow-700">
                  You've watched all available ads for today. Come back tomorrow for more rewards!
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Popup>
  );
}
