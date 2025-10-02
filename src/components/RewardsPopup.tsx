'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Popup, Button, Card, ProgressBar, Badge, Toast, Skeleton, Empty } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { StarOutlined, TrophyOutlined, GiftOutlined, CheckCircleOutlined, FireOutlined, PlayCircleOutlined, LockOutlined, UnlockOutlined, DollarOutlined, ThunderboltOutlined, CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/modules/store';
import {
  closePopup,
  selectIsRewardsPopupVisible,
  selectCurrentUser,
  fetchRewardsRequest,
  unlockAchievementRequest,
  claimRewardRequest,
  selectAchievements,
  selectRewardsStats,
  selectRewardsLoading,
  selectRewardsError,
  selectUnlockingAchievement,
  selectClaimingReward
} from '@/modules';



export default function RewardsPopup() {
  const [showingAds, setShowingAds] = useState(false);
  const fetchedRef = useRef(false);

  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(selectIsRewardsPopupVisible);
  const user = useSelector(selectCurrentUser);

  // Redux selectors
  const achievements = useSelector(selectAchievements);
  const stats = useSelector(selectRewardsStats);
  const loading = useSelector(selectRewardsLoading);
  const error = useSelector(selectRewardsError);
  const unlockingAchievement = useSelector(selectUnlockingAchievement);
  const claimingReward = useSelector(selectClaimingReward);



  // Fetch rewards when component mounts or popup opens (prevent duplicate calls)
  useEffect(() => {
    if (isOpen && !fetchedRef.current && !loading) {
      fetchedRef.current = true;
      dispatch(fetchRewardsRequest());
    }

    // Reset fetch flag when popup closes
    if (!isOpen) {
      fetchedRef.current = false;
    }
  }, [isOpen, dispatch, loading]);

  const onClose = useCallback(() => {
    dispatch(closePopup('isRewardsPopupVisible'));
  }, [dispatch]);

  // Memoize icon mapping for achievements
  const getAchievementIcon = useCallback((achievementId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'first-task': <CrownOutlined className="text-yellow-400" />,
      'task-master': <TrophyOutlined className="text-blue-400" />,
      'daily-streak': <ThunderboltOutlined className="text-orange-400" />,
      'referral-king': <TeamOutlined className="text-purple-400" />,
      'ad-watcher': <GiftOutlined className="text-pink-400" />,
      'point-collector': <DollarOutlined className="text-yellow-400" />
    };
    return iconMap[achievementId] || <StarOutlined className="text-gray-400" />;
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }, []);

  const handleClaimReward = useCallback((achievementId: string) => {
    if (!claimingReward) {

      // Check if showAdexora method exists and call it safely
      if (typeof window !== 'undefined' && window && 'showAdexora' in window && typeof window.showAdexora === 'function') {
        window.showAdexora?.();
      }
      dispatch(claimRewardRequest(achievementId));

    }
  }, [dispatch, claimingReward]);

  const handleAdsClick = useCallback((achievementId: string) => {
    if (showingAds || unlockingAchievement) return;

    setShowingAds(true);
    // Simulate watching ads

    // Check if showAdexora method exists and call it safely
    if (typeof window !== 'undefined' && window && 'showAdexora' in window && typeof window.showAdexora === 'function') {
      window.showAdexora?.();
    }

    setTimeout(() => {
      setShowingAds(false);

      dispatch(unlockAchievementRequest(achievementId));


    }, 3000); // Reduced from 15 seconds for demo
  }, [dispatch, showingAds, unlockingAchievement]);

  const refreshRewards = useCallback(() => {
    if (!loading) {
      fetchedRef.current = false;
      dispatch(fetchRewardsRequest());
    }
  }, [dispatch, loading]);

  const renderAchievementCard = useCallback((achievement: any) => {
    const isClaimed = achievement.claimed;
    const isUnlocked = achievement.unlockedAt !== null;
    const canClaim = achievement.completed && !isClaimed && isUnlocked;
    const needsAds = achievement.requiresAds && achievement.completed && !isUnlocked && !isClaimed;
    const isLocked = achievement.completed && !isUnlocked && !isClaimed;

    return (
      <Card
        key={achievement.id}
        className="mb-2"
        style={{
          background: '#2b2b2b',
          border: '1px solid #3c3c3c',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${'bg-gray-600'
              }`}>
              {isClaimed ? (
                <CheckCircleOutlined className="text-white text-lg" />
              ) : isUnlocked ? (
                <UnlockOutlined className="text-white text-lg" />
              ) : isLocked ? (
                <LockOutlined className="text-white text-lg" />
              ) : (
                <div className="text-gray-300 text-lg">{getAchievementIcon(achievement.id)}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <h4 className={`font-semibold mr-2 text-sm ${isClaimed ? 'text-yellow-400' : 'text-gray-300'
                    }`}>{achievement.title}</h4>
                  {isClaimed && (
                    <Badge content="CLAIMED" style={{
                      backgroundColor: '#F0B90B',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '8px',
                      padding: '1px 4px'
                    }} />
                  )}
                  {isUnlocked && !isClaimed && (
                    <Badge content="READY" style={{
                      backgroundColor: '#00d4aa',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '8px',
                      padding: '1px 4px'
                    }} />
                  )}
                  {isLocked && (
                    <Badge content="LOCKED" style={{
                      backgroundColor: '#cf304a',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '8px',
                      padding: '1px 4px'
                    }} />
                  )}
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                  +{formatNumber(achievement.reward)} PTS
                </div>
              </div>
              <p className={`text-xs mb-2 ${isClaimed ? 'text-gray-400' :
                  isUnlocked ? 'text-gray-700' : 'text-gray-500'
                }`}>{achievement.description}</p>
              <div className="flex items-center">
                <ProgressBar
                  percent={(achievement.progress / achievement.total) * 100}
                  style={{
                    '--fill-color': '#F0B90B',
                    '--track-color': '#404040',
                    flex: 1,
                    marginRight: '8px',
                    height: '4px'
                  }}
                />
                <span className={`text-xs font-medium ${isClaimed ? 'text-gray-400' :
                    isUnlocked ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                  {achievement.progress}/{achievement.total}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-2">
            {needsAds && (
              <Button
                size="small"
                onClick={() => handleAdsClick(achievement.id)}
                disabled={showingAds}
                style={{
                  background: 'linear-gradient(135deg, #cf304a 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  minWidth: '60px'
                }}
              >
                <PlayCircleOutlined style={{ fontSize: '8px' }} />
                {showingAds ? 'WATCH' : 'WATCH'}
              </Button>
            )}

            {canClaim && (
              <Button
                size="small"
                onClick={() => handleClaimReward(achievement.id)}
                style={{
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  minWidth: '50px'
                }}
              >
                <GiftOutlined style={{ fontSize: '8px' }} />
                CLAIM
              </Button>
            )}

            {isClaimed && (
              <div className="text-xs text-yellow-400 font-bold flex items-center justify-center gap-1">
                <CheckCircleOutlined style={{ fontSize: '8px' }} />
                DONE
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }, [getAchievementIcon, formatNumber, handleAdsClick, handleClaimReward, showingAds]);



  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      bodyStyle={{
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#0b0e11',
        overflow: 'auto'
      }}
    >
      <div className="p-4">
        {/* Binance-style Header */}
        <div className="relative mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <TrophyOutlined className="text-black text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black mb-0">REWARDS CENTER</h2>
                  <p className="text-black text-opacity-70 font-medium text-xs">Watch ads to unlock & claim points</p>
                </div>
              </div>
              <Button
                fill="none"
                size="small"
                onClick={onClose}
                style={{
                  padding: '6px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '6px',
                  border: 'none'
                }}
              >
                <CloseOutline fontSize={18} color="black" />
              </Button>
            </div>
          </div>
        </div>

        {/* Binance-style Stats Overview */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {loading ? (
            // Skeleton loading for stats cards
            <>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600">
                <Skeleton.Title animated style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                <Skeleton.Title animated style={{ width: '40px', height: '18px', margin: '0 auto 4px' }} />
                <Skeleton.Title animated style={{ width: '60px', height: '12px', margin: '0 auto' }} />
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600">
                <Skeleton.Title animated style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                <Skeleton.Title animated style={{ width: '40px', height: '18px', margin: '0 auto 4px' }} />
                <Skeleton.Title animated style={{ width: '60px', height: '12px', margin: '0 auto' }} />
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600">
                <Skeleton.Title animated style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} />
                <Skeleton.Title animated style={{ width: '40px', height: '18px', margin: '0 auto 4px' }} />
                <Skeleton.Title animated style={{ width: '60px', height: '12px', margin: '0 auto' }} />
              </div>
            </>
          ) : (
            <>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-yellow-400">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-md flex items-center justify-center mx-auto mb-1">
                  <DollarOutlined className="text-black text-xs" />
                </div>
                <div className="text-lg font-bold text-yellow-400">{formatNumber(stats.totalPoints)}</div>
                <div className="text-xs text-gray-400 font-medium">TOTAL PTS</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-green-400">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-md flex items-center justify-center mx-auto mb-1">
                  <CheckCircleOutlined className="text-white text-xs" />
                </div>
                <div className="text-lg font-bold text-green-400">{stats.completedAchievements}</div>
                <div className="text-xs text-gray-400 font-medium">COMPLETED</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-blue-400">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md flex items-center justify-center mx-auto mb-1">
                  <ThunderboltOutlined className="text-white text-xs" />
                </div>
                <div className="text-lg font-bold text-blue-400">{stats.totalAchievements - stats.completedAchievements}</div>
                <div className="text-xs text-gray-400 font-medium">IN PROGRESS</div>
              </div>
            </>
          )}
        </div>

        {/* Binance-style Ads Overlay */}
        {showingAds && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-lg text-center shadow-2xl max-w-xs mx-4">
              <div className="bg-black rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlayCircleOutlined className="text-2xl text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">WATCHING ADS</h3>
              <p className="text-black text-opacity-70 mb-4 font-medium text-sm">Unlock your points by watching this ad</p>
              <div className="flex justify-center items-center space-x-1 mb-3">
                <div className="animate-bounce w-2 h-2 bg-black rounded-full"></div>
                <div className="animate-bounce w-2 h-2 bg-black rounded-full" style={{ animationDelay: '0.1s' }}></div>
                <div className="animate-bounce w-2 h-2 bg-black rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="text-black font-bold text-sm">Loading...</div>
            </div>
          </div>
        )}

        {/* Binance-style Achievements Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-md flex items-center justify-center mr-2">
                <TrophyOutlined className="text-black text-xs" />
              </div>
              <h3 className="text-lg font-bold text-yellow-400">YOUR ACHIEVEMENTS</h3>
            </div>
            <Badge
              content={`${stats.completedAchievements}/${stats.totalAchievements}`}
              style={{
                backgroundColor: '#F0B90B',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '10px',
                padding: '2px 6px'
              }}
            />
          </div>

          {loading ? (
            // Skeleton loading for achievement cards
            <div className="space-y-2">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="mb-2" style={{ background: '#2b2b2b', border: '1px solid #3c3c3c', borderRadius: '8px' }}>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center flex-1">
                      <Skeleton.Title animated style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '12px' }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Skeleton.Title animated style={{ width: '120px', height: '14px' }} />
                          <Skeleton.Title animated style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                        </div>
                        <Skeleton.Paragraph lineCount={1} animated style={{ marginBottom: '8px' }} />
                        <div className="flex items-center">
                          <Skeleton.Title animated style={{ flex: 1, height: '4px', marginRight: '8px' }} />
                          <Skeleton.Title animated style={{ width: '30px', height: '12px' }} />
                        </div>
                      </div>
                    </div>
                    <Skeleton.Title animated style={{ width: '50px', height: '20px', borderRadius: '4px' }} />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400">Error: {error}</div>
              <Button
                size="small"
                onClick={refreshRewards}
                style={{ marginTop: '8px', backgroundColor: '#F0B90B', color: 'black' }}
              >
                Retry
              </Button>
            </div>
          ) : achievements.length === 0 ? (
            // Empty state when no achievements
            <div className="text-center" style={{ padding: '40px 20px' }}>
              <Empty
                imageStyle={{ width: 80, height: 80 }}
                description={
                  <div className="text-center">
                    <div className="text-gray-400 text-sm mb-2">No achievements available</div>
                    <div className="text-gray-500 text-xs">Complete tasks to unlock achievements and earn rewards!</div>
                  </div>
                }
              />
              <Button
                size="small"
                onClick={refreshRewards}
                style={{ backgroundColor: '#F0B90B', color: 'black', border: 'none', marginTop: '16px' }}
              >
                Refresh
              </Button>
            </div>
          ) : (
            achievements.map(renderAchievementCard)
          )}
        </div>
      </div>
    </Popup>
  );
}
