'use client';

import React, { useState, useEffect } from 'react';
import { Popup, Card, List, Badge, ProgressBar, Empty } from 'antd-mobile';
import { CloseOutline, CheckCircleOutline, RightOutline, StarOutline } from 'antd-mobile-icons';
import { UnorderedListOutlined,  TwitterOutlined, YoutubeOutlined, InstagramOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Button } from 'antd';

interface TaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCompleted?: (taskId: string, reward: number) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'telegram' | 'twitter' | 'youtube' | 'instagram' | 'website';
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  completed: boolean;
  verificationRequired: boolean;
}

interface TaskProgress {
  taskId: string;
  started: boolean;
  verified: boolean;
  completedAt: string | null;
}

export default function TaskPopup({ isOpen, onClose, onTaskCompleted }: TaskPopupProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskProgress, setTaskProgress] = useState<{ [key: string]: TaskProgress }>({});
  const [verifyingTask, setVerifyingTask] = useState<string | null>(null);
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    // Initialize tasks
    const initialTasks: Task[] = []

    
    // Load saved progress
    const savedProgress = localStorage.getItem('taskProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setTaskProgress(progress);
      
      // Update task completion status
      const updatedTasks = initialTasks.map(task => ({
        ...task,
        completed: progress[task.id]?.verified || false
      }));
      setTasks(updatedTasks);
    } else {
      setTasks(initialTasks);
    }
  }, [isOpen]);

  function TelegramOutlined({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        role="img"
        aria-label="Telegram"
        {...props}
      >
        {/* stylized paper-plane outline */}
        <path d="M21 3 3.5 10.5l4 1.6L12 21l3-5 5-12z" />
        {/* inner detail line */}
        <path d="M21 3 10 13" />
      </svg>
    );
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'telegram': return  <TelegramOutlined className="text-blue-500 text-xl" />; {/* <TelegramOutlined className="text-blue-500 text-xl" /> */};
      case 'twitter': return <TwitterOutlined className="text-blue-400 text-xl" />;
      case 'youtube': return <YoutubeOutlined className="text-red-500 text-xl" />;
      case 'instagram': return <InstagramOutlined className="text-pink-500 text-xl" />;
      default: return <UnorderedListOutlined className="text-blue-600 text-xl" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'telegram': return 'bg-blue-100';
      case 'twitter': return 'bg-blue-100';
      case 'youtube': return 'bg-red-100';
      case 'instagram': return 'bg-pink-100';
      default: return 'bg-blue-100';
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

  const handleStartTask = (task: Task) => {
    // Open the task URL
    window.open(task.url, '_blank');
    
    // Update progress
    const newProgress = {
      ...taskProgress,
      [task.id]: {
        taskId: task.id,
        started: true,
        verified: false,
        completedAt: null
      }
    };
    setTaskProgress(newProgress);
    localStorage.setItem('taskProgress', JSON.stringify(newProgress));
    
    toast.info('Task started! Complete the action and click verify.');
  };

  const handleVerifyTask = async (task: Task) => {
    if (!taskProgress[task.id]?.started) {
      toast.error('Please start the task first!');
      return;
    }

    setVerifyingTask(task.id);
    setVerificationProgress(0);

    try {
      // Simulate verification process with progress
      const verificationSteps = [
        'Checking task completion...',
        'Validating action...',
        'Confirming verification...',
        'Awarding points...'
      ];

      for (let i = 0; i < verificationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setVerificationProgress((i + 1) * 25);
        
        if (i < verificationSteps.length - 1) {
          toast.info(verificationSteps[i]);
        }
      }

      // Mark task as completed
      const newProgress = {
        ...taskProgress,
        [task.id]: {
          ...taskProgress[task.id],
          verified: true,
          completedAt: new Date().toISOString()
        }
      };
      setTaskProgress(newProgress);
      localStorage.setItem('taskProgress', JSON.stringify(newProgress));

      // Update task completion status
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, completed: true } : t
        )
      );

      // Call callback if provided
      if (onTaskCompleted) {
        onTaskCompleted(task.id, task.reward);
      }

      toast.success(`Task verified! +${task.reward} points earned! 🎉`);
      
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifyingTask(null);
      setVerificationProgress(0);
    }
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getTotalRewards = () => {
    return tasks.filter(task => task.completed).reduce((sum, task) => sum + task.reward, 0);
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
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UnorderedListOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Social Tasks</h2>
                <p className="text-sm text-gray-500">Complete tasks to earn points</p>
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
          {/* Progress Summary */}
          <Card className="mb-4 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="p-4 text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <UnorderedListOutlined className="text-2xl text-black" />
                </div>
                
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1 text-black ">
                    Task Progress
                  </div>
                  <div className="text-sm text-black/80">
                    {tasks.length > 0 ? `${getCompletedTasksCount()} of ${tasks.length} tasks completed` : 'No tasks available'}
                  </div>
                </div>

                <Badge 
                  content={`${getCompletedTasksCount()}/${tasks.length}`}
                  color="warning"
                />
              </div>

              <div className="mb-4">
                <ProgressBar
                  percent={tasks.length > 0 ? (getCompletedTasksCount() / tasks.length) * 100 : 0}
                  className="mb-2"
                />
                <div className="text-xs text-black/80 text-center">
                  {getTotalRewards()} points earned from completed tasks
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 text-black/10 rounded-lg">
                  <div className="text-xl font-bold text-black">
                    {getCompletedTasksCount()}
                  </div>
                  <div className="text-xs text-black/80">
                    Completed
                  </div>
                </div>

                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-xl font-bold text-black">
                    {getTotalRewards()}
                  </div>
                  <div className="text-xs text-black/80">
                    Points Earned
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Task List */}
          <Card title="Available Tasks" className="mb-4">
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    task.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${getTaskColor(task.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getTaskIcon(task.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                        {task.completed && (
                          <CheckCircleOutline className="text-green-500 text-lg flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge 
                          content={getDifficultyIcon(task.difficulty)} 
                          color={getDifficultyColor(task.difficulty)}
                        />
                        <Badge content={task.estimatedTime} color="primary" />
                        <Badge content={`+${task.reward} pts`} color="success" />
                      </div>

                      <div className="flex items-center gap-2">
                        {!task.completed ? (
                          <>
                            {!taskProgress[task.id]?.started ? (
                              <Button
                                color="primary"
                                size="small"
                                onClick={() => handleStartTask(task)}
                                className="rounded-lg"
                              >
                                Start Task
                                <RightOutline className="ml-1" />
                              </Button>
                            ) : (
                              <Button
                                color="green"
                                size="small"
                                loading={verifyingTask === task.id}
                                onClick={() => handleVerifyTask(task)}
                                className="rounded-lg"
                              >
                                {verifyingTask === task.id ? 'Verifying...' : 'Verify'}
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                            <span className="text-green-700 text-sm font-medium">✓ Completed</span>
                          </div>
                        )}
                      </div>

                      {verifyingTask === task.id && (
                        <div className="mt-3">
                          <ProgressBar
                            percent={verificationProgress}
                            className="mb-2"
                          />
                          <div className="text-center text-sm text-blue-600 font-medium">
                            Verifying task completion... {verificationProgress}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Empty
                    description="No tasks available"
                    imageStyle={{ height: 60 }}
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Check back later for new tasks to earn points!
                  </p>
                </div>
              )}
            </div>
          </Card>

         
        </div>
      </div>
    </Popup>
  );
}
