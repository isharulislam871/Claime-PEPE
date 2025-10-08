'use client';

import React, { useState, useEffect } from 'react';
import { Popup , Skeleton } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/modules/store';
 
import {
  selectLeaderboardData,
  selectCurrentUserRank,
  selectLeaderboardLoading,
  selectLeaderboardError,
  selectLeaderboardPeriod,
  fetchLeaderboardRequest,
  setLeaderboardPeriod,
} from '@/modules/private/leaderboard';
import { getCurrentUser } from '@/lib/api';
import { closePopup, selectCurrentUser, selectIsLeaderboardPopupVisible } from '@/modules';
 
 

const LeaderboardPopup = ( ) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux selectors
  const user = useSelector(selectCurrentUser);
  const leaderboardData = useSelector(selectLeaderboardData);
  const currentUserRank = useSelector(selectCurrentUserRank);
  const loading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);
  const activeTab = useSelector(selectLeaderboardPeriod);
  const currentUser = getCurrentUser()

  const isOpen = useSelector(selectIsLeaderboardPopupVisible);

  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(fetchLeaderboardRequest(activeTab, currentUser?.telegramId as any, 10));
    }
    
  }, [isOpen, activeTab, user?.id, dispatch]);

  const handleTabChange = (newTab: 'weekly' | 'monthly' | 'all-time') => {
    dispatch(setLeaderboardPeriod(newTab));
    if (user?.id) {
      dispatch(fetchLeaderboardRequest(newTab, currentUser?.telegramId as any, 10));
    }
  };
const onClose = () => {
  dispatch(closePopup('isLeaderboardPopupVisible'))
};
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="text-yellow-500 text-xl">👑</div>;
      case 2:
        return <div className="text-gray-400 text-xl">🏆</div>;
      case 3:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">3</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{rank}</span>
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#6B7280';
    }
  };

  const formatPoints = (points: number) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points?.toLocaleString();
  };

  const TabButton = ({ 
    tab, 
    label, 
    isActive 
  }: { 
    tab: 'weekly' | 'monthly' | 'all-time'; 
    label: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
          : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        maxHeight: '100vh',
        overflow: 'hidden',
        padding: 0
      }}
    >
      <div className="p-4 bg-white h-full overflow-y-auto" style={{ maxHeight: '90vh' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-purple-600 text-2xl">👑</div>
              <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Time Period Tabs */}
          <div className="flex gap-2 mb-4">
            <TabButton tab="weekly" label="Weekly" isActive={activeTab === 'weekly'} />
            <TabButton tab="monthly" label="Monthly" isActive={activeTab === 'monthly'} />
            <TabButton tab="all-time" label="All Time" isActive={activeTab === 'all-time'} />
          </div>

          {loading ? (
            <div className="space-y-4">
              {/* Top 3 Podium Skeleton */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <Skeleton.Title animated />
                  <div className="flex justify-center items-end gap-4 mt-4">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="text-center">
                        <div className={`relative ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                          <Skeleton 
                            animated 
                            style={{ 
                              width: index === 0 ? '60px' : '48px', 
                              height: index === 0 ? '60px' : '48px',
                              borderRadius: '50%'
                            }} 
                          />
                        </div>
                        <div className="mt-2">
                          <Skeleton.Title animated style={{ fontSize: '14px', marginBottom: '4px' }} />
                          <Skeleton.Title animated style={{ fontSize: '12px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Leaderboard Skeleton */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Skeleton 
                          animated 
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                        />
                        <Skeleton 
                          animated 
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                        />
                        <div>
                          <Skeleton.Title animated style={{ fontSize: '14px', marginBottom: '4px' }} />
                          <Skeleton.Title animated style={{ fontSize: '12px' }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton.Title animated style={{ fontSize: '14px', marginBottom: '4px' }} />
                        <Skeleton.Title animated style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current User Rank Skeleton */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton 
                      animated 
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                    />
                    <div>
                      <Skeleton.Title animated style={{ fontSize: '14px', marginBottom: '4px' }} />
                      <Skeleton.Title animated style={{ fontSize: '12px' }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton.Title animated style={{ fontSize: '16px', marginBottom: '4px' }} />
                    <Skeleton.Title animated style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>

              {/* Rewards Info Skeleton */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="text-center p-3">
                  <Skeleton.Title animated style={{ fontSize: '16px', marginBottom: '8px' }} />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton.Title key={index} animated style={{ fontSize: '12px' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Leaderboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  if (currentUser?.telegramId) {
                    dispatch(fetchLeaderboardRequest(activeTab, currentUser?.telegramId as string, 10));
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
              <p className="text-gray-600">No leaderboard data found for this period.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🏆 Top Performers</h3>
                  <div className="flex justify-center items-end gap-4">
                    {leaderboardData.slice(0, 3).map((user, index) => (
                      <div key={user.id} className="text-center">
                        <div className={`relative ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}>
                          <div 
                            className={`rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'w-15 h-15 text-lg' : 'w-12 h-12 text-sm'
                            }`}
                            style={{ backgroundColor: getRankBadgeColor(user.rank) }}
                          >
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user.username.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="absolute -top-2 -right-2">
                            {getRankIcon(user.rank)}
                          </div>
                        </div>
                        <div className={`mt-2 ${index === 0 ? 'text-base' : 'text-sm'}`}>
                          <div className="font-semibold text-gray-800 truncate max-w-16">
                            {user.username}
                          </div>
                          <div className="text-purple-600 font-bold">
                            {formatPoints(user.points)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(user.rank)}
                        </div>
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: getRankBadgeColor(user.rank) }}
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.username}</div>
                          <div className="text-xs text-gray-500">Rank #{user.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">
                          {formatPoints(user.points)}
                        </div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current User Rank */}
              {currentUserRank && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {currentUserRank.avatar ? (
                            <img src={currentUserRank.avatar} alt={currentUserRank.username} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            currentUserRank.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1 rounded-full font-bold">
                          YOU
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Your Rank</div>
                        <div className="text-sm text-gray-600">#{currentUserRank.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600 text-lg">
                        {formatPoints(currentUserRank.points)}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="text-center p-3">
                  <div className="text-green-600 text-2xl mx-auto mb-2">⭐</div>
                  <h4 className="font-semibold text-gray-800 mb-1">Weekly Rewards</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>🥇 1st Place: 10,000 bonus points</div>
                    <div>🥈 2nd Place: 5,000 bonus points</div>
                    <div>🥉 3rd Place: 2,500 bonus points</div>
                    <div>🏆 Top 10: 1,000 bonus points</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </Popup>
  );
};

export default LeaderboardPopup;
