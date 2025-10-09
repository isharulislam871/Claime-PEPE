'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Popup, Button, Card, Tabs, Badge, Toast, Skeleton, Empty, Avatar, PullToRefresh, InfiniteScroll, List, Space, Grid, Divider } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { CrownOutlined, TrophyOutlined, StarOutlined, FireOutlined, ThunderboltOutlined, GiftOutlined, RiseOutlined, FallOutlined, SwapOutlined, EyeOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/modules/store';
import {
  closeLeaderboardPopup,
  selectIsLeaderboardPopupVisible,
  selectCurrentUser,
  selectUserTelegramId
} from '@/modules';
import {
  fetchLeaderboardRequest,
  setLeaderboardPeriod,
  selectLeaderboardData,
  selectCurrentUserRank,
  selectLeaderboardLoading,
  selectLeaderboardError,
  selectLeaderboardPeriod,
  selectLeaderboardTotalUsers
} from '@/modules/private/leaderboard';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPopup() {
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [animatingRanks, setAnimatingRanks] = useState<Set<string>>(new Set());
  
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(selectIsLeaderboardPopupVisible);
  const currentUser = useSelector(selectCurrentUser);
  const userTelegramId = useSelector(selectUserTelegramId);
  
  // Leaderboard data
  const leaderboardData = (useSelector(selectLeaderboardData) as LeaderboardUser[]) || [];
  const currentUserRank = useSelector(selectCurrentUserRank) as LeaderboardUser | null;
  const loading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);
  const period = (useSelector(selectLeaderboardPeriod) as 'weekly' | 'monthly' | 'all-time') || 'weekly';
  const totalUsers = (useSelector(selectLeaderboardTotalUsers) as number) || 0;

  // Memoized leaderboard stats
  const leaderboardStats = useMemo(() => {
    if (!leaderboardData.length) return null;
    
    const topUser = leaderboardData[0];
    const averagePoints = Math.round(leaderboardData.reduce((sum, user) => sum + user.points, 0) / leaderboardData.length);
    const yourRank = currentUserRank?.rank || 0;
    const yourPercentile = yourRank > 0 ? Math.round((1 - (yourRank / totalUsers)) * 100) : 0;
    
    return {
      topUser,
      averagePoints,
      yourRank,
      yourPercentile
    };
  }, [leaderboardData, currentUserRank, totalUsers]);

  // Fetch leaderboard data when popup opens
  useEffect(() => {
    if (isOpen && userTelegramId) {
      dispatch(fetchLeaderboardRequest(period, userTelegramId, 50));
    }
  }, [isOpen, period, userTelegramId, dispatch]);

  // Handle error display
  useEffect(() => {
    if (error) {
      Toast.show({
        content: error,
        duration: 3000,
      });
    }
  }, [error]);

  const handleClose = () => {
    dispatch(closeLeaderboardPopup());
  };

  const handlePeriodChange = (key: string) => {
    // Add animation effect when changing periods
    setAnimatingRanks(new Set(leaderboardData.map(user => user.id)));
    dispatch(setLeaderboardPeriod(key as 'weekly' | 'monthly' | 'all-time'));
    
    // Clear animation after delay
    setTimeout(() => {
      setAnimatingRanks(new Set());
    }, 800);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchLeaderboardRequest(period, userTelegramId, 50));
    // Simulate refresh delay for better UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const loadMore = async () => {
    if (leaderboardData.length >= totalUsers) {
      setHasMore(false);
      return;
    }
    // Load more data (this would need API support)
    dispatch(fetchLeaderboardRequest(period, userTelegramId, leaderboardData.length + 20));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <CrownOutlined style={{ color: '#FFD700', fontSize: '20px' }} className="animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        );
      case 2:
        return <TrophyOutlined style={{ color: '#C0C0C0', fontSize: '18px' }} />;
      case 3:
        return <GiftOutlined style={{ color: '#CD7F32', fontSize: '18px' }} />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (rank: number) => {
    // Simulate rank changes for demo (in real app, this would come from API)
    const change = Math.random();
    if (change > 0.7) {
      return <RiseOutlined style={{ color: '#10B981', fontSize: '12px' }} />;
    } else if (change < 0.3) {
      return <FallOutlined style={{ color: '#EF4444', fontSize: '12px' }} />;
    }
    return <SwapOutlined style={{ color: '#6B7280', fontSize: '12px' }} />;
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700, #FFA500)';
      case 2:
        return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)';
      case 3:
        return 'linear-gradient(135deg, #CD7F32, #B8860B)';
      default:
        return 'linear-gradient(135deg, #4A5568, #2D3748)';
    }
  };

  const getUserAvatar = (user: LeaderboardUser) => {
    if (user.avatar) {
      return <Avatar src={user.avatar} style={{ '--size': '40px' }} />;
    }
    
    const initials = user.username ? user.username.charAt(0).toUpperCase() : 'U';
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const colorIndex = user.id.charCodeAt(0) % colors.length;
    
    return (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: colors[colorIndex] }}
      >
        {initials}
      </div>
    );
  };

  const tabItems = [
    {
      key: 'weekly',
      title: (
        <div className="flex items-center gap-1">
          <FireOutlined style={{ fontSize: '14px' }} />
          <span>Weekly</span>
        </div>
      ),
    },
    {
      key: 'monthly',
      title: (
        <div className="flex items-center gap-1">
          <StarOutlined style={{ fontSize: '14px' }} />
          <span>Monthly</span>
        </div>
      ),
    },
    {
      key: 'all-time',
      title: (
        <div className="flex items-center gap-1">
          <TrophyOutlined style={{ fontSize: '14px' }} />
          <span>All Time</span>
        </div>
      ),
    },
  ];

  const renderLeaderboardItem = (user: LeaderboardUser, index: number) => {
    const isTopThree = user.rank <= 3;
    const isCurrentUser = user.isCurrentUser;
    
    return (
      <List.Item
        key={user.id}
        className={`transition-all duration-300 ${
          isCurrentUser ? 'bg-gradient-to-r from-yellow-400/10 to-orange-400/5' : ''
        } ${
          animatingRanks.has(user.id) ? 'animate-pulse' : ''
        } ${
          isTopThree ? 'border-l-4' : ''
        }`}
        style={{
          borderLeftColor: isTopThree ? (
            user.rank === 1 ? '#F0B90B' :
            user.rank === 2 ? '#707A8A' :
            '#CD7F32'
          ) : 'transparent',
          background: isCurrentUser 
            ? 'rgba(240, 185, 11, 0.08)'
            : isTopThree 
              ? '#FFFFFF'
              : '#FAFAFA',
          boxShadow: isTopThree ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
          borderRadius: isCurrentUser ? '12px' : '8px',
          margin: isCurrentUser ? '4px 0' : '2px 0',
          backdropFilter: isTopThree ? 'blur(10px)' : 'none',
        }}
        prefix={
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm relative ${
                isTopThree ? 'shadow-lg' : ''
              }`}
              style={{ 
                background: getRankBadgeColor(user.rank),
                boxShadow: isTopThree ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
              }}
            >
              {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
              {user.rank === 1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping opacity-75" style={{ backgroundColor: '#F0B90B' }}></div>
              )}
            </div>
            
            {/* Avatar */}
            <div className="relative">
              {getUserAvatar(user)}
              {user.rank <= 10 && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: '#02C076', borderColor: '#FFFFFF' }}></div>
              )}
            </div>
          </div>
        }
        extra={
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <ThunderboltOutlined 
                style={{ 
                  color: isTopThree ? '#F0B90B' : '#707A8A', 
                  fontSize: isTopThree ? '18px' : '14px' 
                }} 
                className={isTopThree ? 'animate-pulse' : ''} 
              />
              <span 
                className={`font-bold ${
                  user.rank === 1 ? 'text-xl' :
                  user.rank === 2 ? 'text-lg' :
                  user.rank === 3 ? 'text-lg' :
                  'text-base'
                }`}
                style={{ 
                  color: user.rank === 1 ? '#F0B90B' :
                  user.rank === 2 ? '#707A8A' :
                  user.rank === 3 ? '#CD7F32' :
                  '#1E2329'
                }}
              >
                {formatNumber(user.points)}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1 text-xs">
              <span style={{ color: '#707A8A' }}>points</span>
              {getRankChangeIcon(user.rank)}
            </div>
          </div>
        }
      >
        <div className="py-1">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={`font-semibold ${
                user.rank === 1 ? 'text-lg' : 'text-base'
              }`}
              style={{ 
                color: isCurrentUser ? '#F0B90B' :
                isTopThree ? '#1E2329' : '#474D57'
              }}
            >
              {user.username || `User ${user.id}`}
            </span>
            
            {isCurrentUser && (
              <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
                YOU
              </span>
            )}
            
            {user.rank === 1 && (
              <div className="flex items-center gap-1 animate-bounce">
                <CrownOutlined style={{ color: '#F0B90B', fontSize: '14px' }} />
                <span className="text-xs font-bold" style={{ color: '#F0B90B' }}>
                  CHAMPION
                </span>
              </div>
            )}
            
            {user.rank === 2 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: '#848E9C', backgroundColor: 'rgba(132, 142, 156, 0.1)' }}>
                RUNNER-UP
              </span>
            )}
            
            {user.rank === 3 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: '#CD7F32', backgroundColor: 'rgba(205, 127, 50, 0.1)' }}>
                3RD PLACE
              </span>
            )}
          </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#707A8A' }}>
            <span className="flex items-center gap-1">
              <TeamOutlined style={{ fontSize: '12px' }} />
              Rank #{user.rank} of {formatNumber(totalUsers)}
            </span>
            {isTopThree && (
              <span className="flex items-center gap-1" style={{ color: '#02C076' }}>
                <EyeOutlined style={{ fontSize: '12px' }} />
                Top {Math.round((user.rank / totalUsers) * 100)}%
              </span>
            )}
          </div>
        </div>
      </List.Item>
    );
  };

  const renderCurrentUserRank = () => {
    if (!currentUserRank) return null;

    return (
      <Card
        className="mb-6 relative overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '2px solid #F0B90B',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(240, 185, 11, 0.15)'
        }}
      >
        {/* Animated Background */}
        
        <div className="relative p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div 
                  className="flex items-center justify-center w-14 h-14 rounded-full text-white font-bold text-lg shadow-lg"
                  style={{ background: getRankBadgeColor(currentUserRank.rank) }}
                >
                  {currentUserRank.rank <= 3 ? getRankIcon(currentUserRank.rank) : currentUserRank.rank}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0B90B' }}>
                  <span className="text-xs font-bold" style={{ color: '#0B0E11' }}>★</span>
                </div>
              </div>
              
              <div className="relative">
                {getUserAvatar(currentUserRank)}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2" style={{ backgroundColor: '#02C076', borderColor: '#FFFFFF' }}></div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-xl" style={{ color: '#1E2329' }}>Your Position</span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
                    YOU
                  </span>
                </div>
                <Space direction="vertical" style={{ '--gap': '4px' }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#F0B90B' }}>
                    <TeamOutlined style={{ fontSize: '14px' }} />
                    <span>Rank #{currentUserRank.rank} of {totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#02C076' }}>
                    <RiseOutlined style={{ fontSize: '14px' }} />
                    <span>Top {Math.round((1 - (currentUserRank.rank / totalUsers)) * 100)}% Performer</span>
                  </div>
                </Space>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <ThunderboltOutlined style={{ color: '#F0B90B', fontSize: '20px' }} />
                <span className="font-bold text-2xl" style={{ color: '#1E2329' }}>
                  {formatNumber(currentUserRank.points)}
                </span>
              </div>
              <div className="text-sm font-medium" style={{ color: '#F0B90B' }}>Total Points Earned</div>
              
              {currentUserRank.rank <= 10 && (
                <div className="mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(2, 192, 118, 0.1)' }}>
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#02C076' }}>
                    <EyeOutlined style={{ fontSize: '10px' }} />
                    TOP 10 ELITE
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <Skeleton.Title animated />
                  <Skeleton.Paragraph lineCount={1} animated />
                </div>
                <Skeleton.Title animated style={{ width: '60px' }} />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <Empty
            description={
              <div className="text-gray-400">
                <div>Failed to load leaderboard</div>
                <div className="text-sm mt-1">{error}</div>
              </div>
            }
          />
          <Button
            color="primary"
            className="mt-4"
            onClick={() => {
              dispatch(fetchLeaderboardRequest(period, userTelegramId, 50));
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (!leaderboardData || leaderboardData.length === 0) {
      return (
        <div className="text-center py-8">
          <Empty
            description={
              <div className="text-gray-400">
                <TrophyOutlined style={{ fontSize: '48px', color: '#666' }} />
                <div className="mt-2">No rankings available</div>
                <div className="text-sm">Be the first to earn points!</div>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <div>
          {/* Enhanced Stats Section */}
          {leaderboardStats && (
            <div className="mb-6">
              <Grid columns={3} gap={8}>
                <Grid.Item>
                  <Card 
                    className="text-center p-3" 
                    style={{ 
                      background: '#2B3139', 
                      borderRadius: '8px', 
                      border: '1px solid #2B3139'
                    }}
                  >
                    <div className="text-lg font-bold mb-1" style={{ color: '#F0B90B' }}>
                      {formatNumber(leaderboardStats.averagePoints)}
                    </div>
                    <div className="text-xs flex items-center justify-center gap-1" style={{ color: '#848E9C' }}>
                      <TeamOutlined style={{ fontSize: '10px' }} />
                      Avg Points
                    </div>
                  </Card>
                </Grid.Item>
                
                <Grid.Item>
                  <Card 
                    className="text-center p-3" 
                    style={{ 
                      background: '#2B3139', 
                      borderRadius: '8px', 
                      border: '1px solid #2B3139'
                    }}
                  >
                    <div className="text-lg font-bold mb-1" style={{ color: '#02C076' }}>
                      {leaderboardStats.yourPercentile}%
                    </div>
                    <div className="text-xs flex items-center justify-center gap-1" style={{ color: '#848E9C' }}>
                      <RiseOutlined style={{ fontSize: '10px' }} />
                      Your Rank
                    </div>
                  </Card>
                </Grid.Item>
                
                <Grid.Item>
                  <Card 
                    className="text-center p-3" 
                    style={{ 
                      background: '#2B3139', 
                      borderRadius: '8px', 
                      border: '1px solid #2B3139'
                    }}
                  >
                    <div className="text-lg font-bold mb-1" style={{ color: '#F0B90B' }}>
                      {formatNumber(leaderboardStats.topUser.points)}
                    </div>
                    <div className="text-xs flex items-center justify-center gap-1" style={{ color: '#848E9C' }}>
                      <CrownOutlined style={{ fontSize: '10px' }} />
                      Top Score
                    </div>
                  </Card>
                </Grid.Item>
              </Grid>
            </div>
          )}

          {currentUserRank && renderCurrentUserRank()}
          
          {/* Section Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0B90B' }}>
                <TrophyOutlined style={{ color: '#0B0E11', fontSize: '16px' }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: '#F0B90B' }}>
                Leaderboard Rankings
              </h3>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}></div>
            </div>
            
            <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#707A8A' }}>
              <span className="flex items-center gap-1">
                <CalendarOutlined style={{ fontSize: '12px' }} />
                {period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All Time'}
              </span>
              <span className="flex items-center gap-1">
                <TeamOutlined style={{ fontSize: '12px' }} />
                {totalUsers.toLocaleString()} Total Users
              </span>
              <span className="flex items-center gap-1">
                <EyeOutlined style={{ fontSize: '12px' }} />
                Top {Math.min(50, leaderboardData.length)} Shown
              </span>
            </div>
          </div>
          
          {/* Enhanced List */}
          <List 
            style={{ 
              '--border-inner': 'none',
              '--border-top': 'none',
              '--border-bottom': 'none',
              background: '#FAFAFA'
            }}
          >
            {leaderboardData.map((user: LeaderboardUser, index: number) => {
              // Add separator for top 3
              const items = [renderLeaderboardItem(user, index)];
              
              if (user.rank === 3 && leaderboardData.length > 3) {
                items.push(
                  <div key={`divider-${user.id}`} className="flex items-center my-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}></div>
                    <span className="text-xs px-4 py-2 rounded-full mx-4" style={{ color: '#707A8A', backgroundColor: '#F5F5F5', border: '1px solid #EAECEF' }}>
                      Other Rankings
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}></div>
                  </div>
                );
              }
              
              return items;
            }).flat()}
          </List>
          
          {/* Infinite Scroll */}
          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            {hasMore && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ backgroundColor: '#F5F5F5', border: '1px solid #EAECEF' }}>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F0B90B', borderTopColor: 'transparent' }}></div>
                  <span className="text-sm" style={{ color: '#707A8A' }}>Loading more rankings...</span>
                </div>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </PullToRefresh>
    );
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={handleClose}
      onClose={handleClose}
      position="bottom"
      style={{
        '--z-index': '1000',
        height: '100vh',
        background: '#FAFAFA',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        border: '1px solid #EAECEF',
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b backdrop-blur-xl" style={{ borderColor: '#EAECEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{ 
                background: '#F0B90B',
                boxShadow: '0 4px 12px rgba(240, 185, 11, 0.3)'
              }}
            >
              <TrophyOutlined style={{ color: '#0B0E11', fontSize: '24px' }} />
            </div>
            <div>
              <h2 className="font-bold text-2xl" style={{ color: '#1E2329' }}>
                Leaderboard
              </h2>
              <p className="text-sm flex items-center gap-1" style={{ color: '#707A8A' }}>
                <span>Rankings</span>
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#F0B90B' }}></div>
                <span className="font-medium text-xs px-2 py-0.5 rounded" style={{ color: '#F0B90B', backgroundColor: 'rgba(240, 185, 11, 0.1)' }}>
                  {totalUsers.toLocaleString()} users
                </span>
              </p>
            </div>
          </div>
          
          <Button
            fill="none"
            onClick={handleClose}
            className="transition-all duration-200 hover:scale-110"
            style={{ 
              '--border-width': '1px',
              '--border-color': '#EAECEF',
              '--background-color': '#F5F5F5',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              minWidth: '40px'
            }}
          >
            <CloseOutline style={{ fontSize: '20px', color: '#fff' }} />
          </Button>
        </div>

        {/* Period Tabs */}
        <div className="px-4 pt-4" style={{ backgroundColor: '#FFFFFF' }}>
          <Tabs
            activeKey={period}
            onChange={handlePeriodChange}
            style={{
              '--active-line-color': '#F0B90B',
              '--active-title-color': '#F0B90B',
              '--active-line-height': '3px',
          
            }}
          >
            {tabItems.map(item => (
              <Tabs.Tab 
                title={
                  <div className={`transition-all duration-300 ${
                    period === item.key 
                      ? 'font-semibold' 
                      : 'text-gray-600 hover:text-gray-700'
                  }`}>
                    {item.title}
                  </div>
                } 
                key={item.key} 
              />
            ))}
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {renderContent()}
        </div>
      </div>
    </Popup>
  );
}