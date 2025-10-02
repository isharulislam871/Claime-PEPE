'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Skeleton } from 'antd-mobile';
import { closePopup, selectIsEarningCenterPopupVisible } from '@/modules';
import { useDispatch, useSelector } from 'react-redux';

interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'task' | 'ad' | 'referral' | 'daily' | 'bonus' | 'survey';
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  isCompleted?: boolean;
  isAvailable: boolean;
  icon: string;
  progress?: number;
  maxProgress?: number;
}

interface EarningStats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  completedTasks: number;
  availableTasks: number;
}

 

const EarningCenterPopup  = ( ) => {
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<EarningOpportunity[]>([]);
  const [stats, setStats] = useState<EarningStats | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'task' | 'ad' | 'referral' | 'daily' | 'bonus' | 'survey'>('all');

  // Mock earning opportunities data
  const mockOpportunities: EarningOpportunity[] = [
    {
      id: '1',
      title: 'Watch Video Ads',
      description: 'Watch 5 short video advertisements to earn points',
      reward: 500,
      category: 'ad',
      difficulty: 'easy',
      timeRequired: '2 min',
      isAvailable: true,
      icon: '📺',
      progress: 2,
      maxProgress: 5
    },
    {
      id: '2',
      title: 'Complete Daily Survey',
      description: 'Answer a quick survey about your preferences',
      reward: 1000,
      category: 'survey',
      difficulty: 'easy',
      timeRequired: '3 min',
      isAvailable: true,
      icon: '📋'
    },
    {
      id: '3',
      title: 'Invite 3 Friends',
      description: 'Invite friends to join and earn bonus points',
      reward: 2500,
      category: 'referral',
      difficulty: 'medium',
      timeRequired: '5 min',
      isAvailable: true,
      icon: '👥',
      progress: 1,
      maxProgress: 3
    },
    {
      id: '4',
      title: 'Daily Check-in Streak',
      description: 'Maintain your daily check-in streak for bonus rewards',
      reward: 750,
      category: 'daily',
      difficulty: 'easy',
      timeRequired: '1 min',
      isAvailable: true,
      icon: '📅',
      progress: 7,
      maxProgress: 7,
      isCompleted: true
    },
    {
      id: '5',
      title: 'Complete Profile',
      description: 'Fill out your complete profile information',
      reward: 1500,
      category: 'task',
      difficulty: 'easy',
      timeRequired: '4 min',
      isAvailable: true,
      icon: '👤'
    },
    {
      id: '6',
      title: 'Social Media Share',
      description: 'Share TaskUp on your social media platforms',
      reward: 800,
      category: 'bonus',
      difficulty: 'easy',
      timeRequired: '2 min',
      isAvailable: true,
      icon: '📱'
    },
    {
      id: '7',
      title: 'Weekly Challenge',
      description: 'Complete 20 tasks this week for mega bonus',
      reward: 5000,
      category: 'bonus',
      difficulty: 'hard',
      timeRequired: '7 days',
      isAvailable: true,
      icon: '🏆',
      progress: 12,
      maxProgress: 20
    }
  ];

  const mockStats: EarningStats = {
    todayEarnings: 2500,
    weeklyEarnings: 15750,
    monthlyEarnings: 45200,
    totalEarnings: 125400,
    completedTasks: 47,
    availableTasks: 23
  };

  const dispatch = useDispatch();

  const isOpen = useSelector(selectIsEarningCenterPopupVisible);
  const onClose = () => {
    dispatch(closePopup('isEarningCenterPopupVisible'))
  };
  useEffect(() => {
    if (isOpen) {
      fetchEarningData();
    }
  }, [isOpen, activeCategory]);

  const fetchEarningData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const filteredOpportunities = activeCategory === 'all' 
        ? mockOpportunities 
        : mockOpportunities.filter(opp => opp.category === activeCategory);
      setOpportunities(filteredOpportunities);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching earning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task': return 'bg-blue-100 text-blue-600';
      case 'ad': return 'bg-red-100 text-red-600';
      case 'referral': return 'bg-green-100 text-green-600';
      case 'daily': return 'bg-orange-100 text-orange-600';
      case 'bonus': return 'bg-purple-100 text-purple-600';
      case 'survey': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStartTask = (opportunity: EarningOpportunity) => {
    console.log('Starting task:', opportunity);
    // Handle task start logic here
  };

  const CategoryButton = ({ 
    category, 
    label, 
    isActive 
  }: { 
    category: 'all' | 'task' | 'ad' | 'referral' | 'daily' | 'bonus' | 'survey'; 
    label: string; 
    isActive: boolean 
  }) => (
    <button
      onClick={() => setActiveCategory(category)}
      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap ${
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
      visible={ isOpen }
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div className="p-4 bg-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-purple-600 text-2xl">💰</div>
            <h2 className="text-xl font-bold text-gray-800">Earning Center</h2>
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

        {loading ? (
          <div className="space-y-4">
            {/* Stats Skeleton */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <Skeleton.Title animated style={{ fontSize: '16px', marginBottom: '16px' }} />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton.Title animated style={{ fontSize: '20px', marginBottom: '4px' }} />
                    <Skeleton.Title animated style={{ fontSize: '12px' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities Skeleton */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Skeleton 
                      animated 
                      style={{ width: '40px', height: '40px', borderRadius: '8px' }} 
                    />
                    <div className="flex-1">
                      <Skeleton.Title animated style={{ fontSize: '16px', marginBottom: '8px' }} />
                      <Skeleton.Title animated style={{ fontSize: '14px', marginBottom: '8px' }} />
                      <div className="flex items-center gap-2">
                        <Skeleton 
                          animated 
                          style={{ width: '60px', height: '20px', borderRadius: '10px' }} 
                        />
                        <Skeleton 
                          animated 
                          style={{ width: '80px', height: '20px', borderRadius: '10px' }} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton.Title animated style={{ fontSize: '18px', marginBottom: '8px' }} />
                    <Skeleton 
                      animated 
                      style={{ width: '80px', height: '32px', borderRadius: '8px' }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Earning Stats */}
            {stats && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">📊</span>
                  Your Earnings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.todayEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.weeklyEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.monthlyEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.totalEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <CategoryButton category="all" label="All" isActive={activeCategory === 'all'} />
              <CategoryButton category="task" label="Tasks" isActive={activeCategory === 'task'} />
              <CategoryButton category="ad" label="Ads" isActive={activeCategory === 'ad'} />
              <CategoryButton category="referral" label="Referrals" isActive={activeCategory === 'referral'} />
              <CategoryButton category="daily" label="Daily" isActive={activeCategory === 'daily'} />
              <CategoryButton category="bonus" label="Bonus" isActive={activeCategory === 'bonus'} />
              <CategoryButton category="survey" label="Surveys" isActive={activeCategory === 'survey'} />
            </div>

            {/* Earning Opportunities */}
            <div className="space-y-3">
              {opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Opportunities Available</h3>
                  <p className="text-gray-500">Check back later for new earning opportunities!</p>
                </div>
              ) : (
                opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{opportunity.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(opportunity.category)}`}>
                              {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(opportunity.difficulty)}`}></div>
                            <span className="text-xs text-gray-500">{opportunity.timeRequired}</span>
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                          {opportunity.progress !== undefined && opportunity.maxProgress && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{opportunity.progress}/{opportunity.maxProgress}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(opportunity.progress / opportunity.maxProgress) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-purple-600 mb-2">
                          +{opportunity.reward.toLocaleString()} pts
                        </div>
                        <button
                          onClick={() => handleStartTask(opportunity)}
                          disabled={opportunity.isCompleted}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            opportunity.isCompleted
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {opportunity.isCompleted ? 'Completed' : 'Start'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Earning Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-green-600">💡</span>
                Earning Tips
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Complete daily tasks consistently for streak bonuses</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Invite friends to earn referral rewards</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Watch ads during peak hours for bonus points</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Complete your profile for one-time bonus rewards</span>
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-orange-600">🎯</span>
                Weekly Goals
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Complete 20 tasks</span>
                  <span className="text-sm font-semibold text-orange-600">12/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-orange-600">5,000 pts</span>
                  <span className="text-sm text-gray-500 ml-1">bonus reward</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default EarningCenterPopup;
