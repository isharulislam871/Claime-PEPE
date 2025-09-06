'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popup,
  Card,
  List,
  Badge,
  SpinLoading,
  Tabs,
  Empty,
  PullToRefresh
} from 'antd-mobile';
import { 
  CloseOutline,
  RightOutline,
  PlayOutline,
  CheckOutline,
  CheckCircleOutline,
  StarOutline,
  EyeOutline
} from 'antd-mobile-icons';
 
import { fetchActivitiesRequest, selectActivities, selectAdsSettingsState, selectCurrentUser, watchAdRequest } from '@/modules';
import { 
  selectTasks,
  selectTasksLoading,
  selectTaskStatus,
  selectAds,
  selectAdsLoading,
  fetchTasksRequest,
  fetchAdsRequest,
  selectAdStats,
 
} from '@/modules/private/task';
import { DollarOutlined, GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Progress } from 'antd';
import { toast } from 'react-toastify';
import { timeAgo } from '@/lib/timeAgo';
import AdHistoryPopup from './AdHistoryPopup';


interface NewEarnProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  url?: string;
  isCompleted?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

 

export default function NewEarn({ isOpen, onClose }: NewEarnProps) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const tasks = useSelector(selectTasks);
  const tasksLoading = useSelector(selectTasksLoading);
  const taskStatus = useSelector(selectTaskStatus);
  const adStats = useSelector(selectAdStats);
  const adsLoading = useSelector(selectAdsLoading);

  const [activeTab, setActiveTab] = useState('tasks');
  const [refreshing, setRefreshing] = useState(false);
  const [showAdHistoryPopup, setShowAdHistoryPopup] = useState(false);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);
  const adsseting = useSelector(selectAdsSettingsState);
  const activities :any[] = useSelector(selectActivities);

  useEffect(()=>{
    dispatch(fetchTasksRequest());
    dispatch(fetchAdsRequest());
    dispatch(fetchActivitiesRequest({ type : 'ad_view' , limit : 10 }))
  } ,[ dispatch ])

 
  
  const handleRefresh = async () => {
    
    try {
      // Refresh tasks and ads data
      dispatch(fetchTasksRequest());
      dispatch(fetchAdsRequest());
      dispatch(fetchActivitiesRequest({ type : 'ad_view' }))
      
      // Add a small delay to show the refresh animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data');
    } 
  }; 
  const dailyProgress = {
    tasksCompleted: taskStatus?.tasksCompletedToday || 0,  
    tasksLimit: tasks.length,
    adsWatched: adStats?.todayAdsViewed || 0,
    adsLimit: adsseting.settings?.adsWatchLimit || 0
  };

  const handleTaskComplete = async (task: Task) => {
    if (completingTask) return;
    
    setCompletingTask(task._id);
    try {
      if (task.url) {
        window.open(task.url, '_blank');
      }
      
      // Mock completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success( `+${task.reward} points earned!`)
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setCompletingTask(null);
    }
  };

  const handleWatchAd = async () => {
    if (watchingAd) return;
    
   
    setWatchingAd(true);
    try {
      // Trigger ad display
      if (window?.showGiga) {
        await window.showGiga();
        dispatch(watchAdRequest());
      } else {
        toast.error('Ad service not available');
      }
    } catch (error) {
      toast.error('Failed to watch ad');
    } finally {
      setWatchingAd(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'primary';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  

  const renderTasksTab = () => (
    <div className="space-y-4">
      {/* Daily Progress */}
      <Card title="Daily Progress" className="mb-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Tasks Completed</span>
              <span className="text-sm font-semibold">
                {dailyProgress.tasksCompleted}/{dailyProgress.tasksLimit}
              </span>
            </div>
            <Progress 
              percent={(dailyProgress.tasksCompleted / dailyProgress.tasksLimit) * 100}
              strokeColor="#10b981"
               
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Ads Watched</span>
              <span className="text-sm font-semibold">
                {dailyProgress.adsWatched}/{dailyProgress.adsLimit}
              </span>
            </div>
            <Progress 
              percent={(dailyProgress.adsWatched / dailyProgress.adsLimit) * 100}
              strokeColor="#f59e0b"
            />
          </div>
        </div>
      </Card>

      {/* Available Tasks */}
      <Card title="Available Tasks">
        {tasksLoading ? (
          <div className="flex justify-center py-8">
            <SpinLoading color='primary' />
          </div>
        ) : (
          <List>
            {tasks.map((task: any) => (
              <List.Item
                key={task.id}
                prefix={
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrophyOutlined className="text-blue-600 text-lg" />
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        content={getDifficultyIcon(task.difficulty)}
                        color={getDifficultyColor(task.difficulty)}
                      />
                      <span className="text-xs text-gray-500">
                        ~{task.estimatedTime}
                      </span>
                      <span className="text-green-600 font-semibold text-sm">
                        +{task.reward} pts
                      </span>
                    </div>
                  </div>
                }
                extra={
                  <Button
                    size="small"
                    color="primary"
                    loading={completingTask === task._id}
                    onClick={() => handleTaskComplete(task)}
                    disabled={task.isCompleted}
                  >
                    {task.isCompleted ? (
                      <CheckOutline />
                    ) : completingTask === task._id ? (
                      'Completing...'
                    ) : (
                      'Start'
                    )}
                  </Button>
                }
              >
                <div className="font-semibold">{task.title}</div>
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </div>
  );

  const handleCheckIn = () => {
    window?.showGiga?.().then((e)=>{
      ///dispatch(checkInRequest());
      toast.info('api not created =>>> sooon')
    })
  }

  const handleSpin = () => {
    window?.showGiga?.().then((e)=>{
      ///dispatch(checkInRequest());
      toast.info('api not created =>>> sooon')
    })
  }
    

  const renderAdsTab = () => (
    <div className="space-y-4">
     
      {/* Ad Rewards Info */}
 
      {/* Watch Ad Button */}
      {/* Enhanced Binance-style Watch Ad Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-1 shadow-xl">
        <div className="relative bg-white rounded-xl p-6">
          {/* Header with animated icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <PlayOutline className="text-white text-2xl" />
              </div>
              {!watchingAd && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
            </div>
          </div>

          {/* Reward Display */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">₿</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  + {adsseting.settings?.defaultAdsReward}
                </span>
                <span className="text-gray-600 font-medium">Points</span>
              </div>
              <div className="text-sm text-gray-500">Per advertisement watched</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Progress</span>
              <span className="text-sm font-bold text-gray-900">
                {dailyProgress.adsWatched}/{dailyProgress.adsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              
            </div>
          </div>

          {/* Main Action Button */}
          <div className="space-y-3">
            {dailyProgress.adsWatched >= dailyProgress.adsLimit ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleOutline className="text-gray-400 text-xl" />
                </div>
                <div className="text-gray-500 font-medium mb-2">Daily Limit Reached</div>
                <div className="text-sm text-gray-400">Come back tomorrow for more rewards!</div>
              </div>
            ) : (
              <>
                <Button
                  block
                  size="large"
                  loading={watchingAd}
                  onClick={handleWatchAd}
                  className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 !border-none !text-white !font-bold !text-lg !h-14 !rounded-xl hover:!from-yellow-500 hover:!to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {watchingAd ? (
                    <div className="flex items-center justify-center gap-2">
                      <SpinLoading color="white" />
                      <span>Loading Advertisement...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <PlayOutline className="text-xl" />
                      <span>Watch & Earn Now</span>
                    </div>
                  )}
                </Button>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-blue-600 font-bold text-lg">{dailyProgress.adsLimit - dailyProgress.adsWatched}</div>
                    <div className="text-blue-500 text-xs">Remaining</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
                    <div className="text-green-600 font-bold text-lg">{ user?.balance || 0}</div>
                    <div className="text-green-500 text-xs">Earned Today</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center border border-purple-200">
                    <div className="text-purple-600 font-bold text-lg">{(dailyProgress.adsLimit - dailyProgress.adsWatched) * Number(adsseting.settings?.defaultAdsReward) }</div>
                    <div className="text-purple-500 text-xs">Potential</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Ads refresh every 24 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad History */}
      <Card 
        title="Recent Ad Rewards"
        extra={
          <span 
            className="text-blue-600 text-sm cursor-pointer hover:text-blue-800"
            onClick={() => setShowAdHistoryPopup(true)}
          >
            View All Ad History
          </span>
        }
      >
        <List>
          {activities.map((_data, index) => (
            <List.Item
              key={index}
              prefix={
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckOutline className="text-green-600" />
                </div>
              }
              extra={
                <span className="text-green-600 font-semibold">+{_data.reward } pts</span>
              }
            >
              <div>
                <div className="font-semibold">Video Ad Watched</div>
                <div className="text-sm text-gray-600">
                <span>{timeAgo(_data.createdAt)}</span>
                </div>
              </div>
            </List.Item>
          ))}
          
          {dailyProgress.adsWatched === 0 && (
            <div className="text-center py-8 text-gray-500">
             <Empty /> 
            </div>
          )}
        </List>
      </Card>
    </div>
  );

  const renderBonusTab = () => (
    <div className="space-y-4">
      {/* Daily Check-in */}
      <Card title="Daily Bonus" className="mb-4">
        <List>
          <List.Item
            prefix={
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <GiftOutlined className="text-orange-600 text-lg" />
              </div>
            }
            description="Claim your daily login bonus"
            extra={
              <Button size="small" color='blue' onClick={handleCheckIn}>
                Claim
              </Button>
            }
          >
            Daily Check-in
          </List.Item>
          
          <List.Item
            prefix={
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <StarOutline className="text-purple-600 text-lg" />
              </div>
            }
            description="Spin the wheel for random rewards"
            extra={
              <Button size="small" color="primary">
                Spin
              </Button>
            }
          >
            Lucky Wheel
          </List.Item>
        </List>
      </Card>

      {/* Achievements */}
      <Card title="Achievements">
        <List>
          <List.Item
            prefix={
              <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                <TrophyOutlined className="text-yellow-600" />
              </div>
            }
            description="Complete 10 tasks"
            extra={
              <Badge content="3/10" color="primary" />
            }
          >
            Task Master
          </List.Item>
          
          <List.Item
            prefix={
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <EyeOutline className="text-blue-600" />
              </div>
            }
            description="Watch 50 ads"
            extra={
              <Badge content="12/50" color="primary" />
            }
          >
            Ad Watcher
          </List.Item>
        </List>
      </Card>
    </div>
  );

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
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarOutlined className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Earn Points</h2>
                <p className="text-sm text-gray-500">Complete tasks and watch ads</p>
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

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.Tab title="Tasks" key="tasks" />
            <Tabs.Tab title="Watch Ads" key="ads" />
            <Tabs.Tab title="Bonus" key="bonus" />
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PullToRefresh
            onRefresh={handleRefresh}
             >
          
            <div className="px-4 py-4">
              {activeTab === 'tasks' && renderTasksTab()}
              {activeTab === 'ads' && renderAdsTab()}
              {activeTab === 'bonus' && renderBonusTab()}
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Ad History Popup */}
      <AdHistoryPopup
        visible={showAdHistoryPopup}
        onClose={() => setShowAdHistoryPopup(false)}

      />
    </Popup>
  );
}
