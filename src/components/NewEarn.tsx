'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popup,
  Button,
  Card,
  List,
  Badge,
  Toast,
  SpinLoading,
  Tabs,
  
} from 'antd-mobile';
import { 
  CloseOutline,
  CheckOutline,
  ClockCircleOutline,
  PlayOutline,
  EyeOutline,
  StarOutline
} from 'antd-mobile-icons';
 
import { selectCurrentUser } from '@/modules';
import { 
  selectTasks,
  selectTasksLoading,
  selectTaskStatus,
  selectAds,
  selectAdsLoading
} from '@/modules/private/task';
import { DollarOutlined, GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { Progress } from 'antd';

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

interface AdReward {
  type: string;
  reward: number;
  available: boolean;
  cooldown?: number;
}

export default function NewEarn({ isOpen, onClose }: NewEarnProps) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const tasks = useSelector(selectTasks);
  const tasksLoading = useSelector(selectTasksLoading);
  const taskStatus = useSelector(selectTaskStatus);
  const ads = useSelector(selectAds);
  const adsLoading = useSelector(selectAdsLoading);

  const [activeTab, setActiveTab] = useState('tasks');
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState(false);

  const dailyProgress = {
    tasksCompleted: 0, //taskStatus?.tasksCompletedToday || 
    tasksLimit: 10,
    adsWatched: user?.adsWatchedToday || 0,
    adsLimit: 5
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
      
      Toast.show({
        content: `+${task.reward} points earned!`,
        icon: 'success'
      });
    } catch (error) {
      Toast.show({
        content: 'Failed to complete task',
        icon: 'fail'
      });
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
        Toast.show({
          content: '+250 points earned!',
          icon: 'success'
        });
      } else {
        Toast.show('Ad service not available');
      }
    } catch (error) {
      Toast.show('Failed to watch ad');
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
                key={task._id}
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

  const renderAdsTab = () => (
    <div className="space-y-4">
      {/* Ad Rewards Info */}
      <Card title="Watch Ads & Earn" className="mb-4">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeOutline className="text-yellow-600 text-2xl" />
          </div>
          <h3 className="text-lg font-bold mb-2">Earn Points by Watching Ads</h3>
          <p className="text-gray-600 text-sm mb-4">
            Watch short video ads to earn instant rewards
          </p>
          <div className="bg-green-50 rounded-lg p-3 mb-4">
            <div className="text-green-600 font-bold text-xl">+250 Points</div>
            <div className="text-green-600 text-sm">Per Ad Watched</div>
          </div>
        </div>
      </Card>

      {/* Watch Ad Button */}
      <Card>
        <div className="text-center py-6">
          <Button
            block
            size="large"
            color="warning"
            loading={watchingAd}
            onClick={handleWatchAd}
            disabled={dailyProgress.adsWatched >= dailyProgress.adsLimit}
            className="mb-4"
          >
            {watchingAd ? (
              'Loading Ad...'
            ) : dailyProgress.adsWatched >= dailyProgress.adsLimit ? (
              'Daily Limit Reached'
            ) : (
              <>
                <PlayOutline className="mr-2" />
                Watch Ad Now
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-600">
            {dailyProgress.adsWatched < dailyProgress.adsLimit ? (
              `${dailyProgress.adsLimit - dailyProgress.adsWatched} ads remaining today`
            ) : (
              'Come back tomorrow for more ads!'
            )}
          </div>
        </div>
      </Card>

      {/* Ad History */}
      <Card title="Recent Ad Rewards">
        <List>
          {[...Array(Math.min(3, dailyProgress.adsWatched))].map((_, index) => (
            <List.Item
              key={index}
              prefix={
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckOutline className="text-green-600" />
                </div>
              }
              extra={
                <span className="text-green-600 font-semibold">+250 pts</span>
              }
            >
              <div>
                <div className="font-semibold">Video Ad Watched</div>
                <div className="text-sm text-gray-600">
                  {new Date(Date.now() - index * 3600000).toLocaleTimeString()}
                </div>
              </div>
            </List.Item>
          ))}
          
          {dailyProgress.adsWatched === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ads watched today
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
              <Button size="small" color="primary">
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
              fill='none' 
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
        <div className="flex-1 overflow-auto px-4 py-4">
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'ads' && renderAdsTab()}
          {activeTab === 'bonus' && renderBonusTab()}
        </div>
      </div>
    </Popup>
  );
}
