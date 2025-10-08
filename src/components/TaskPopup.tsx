'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Popup, Card, List, Badge, ProgressBar, Empty, SearchBar, Tabs , PullToRefresh } from 'antd-mobile';
import { CloseOutline, CheckCircleOutline, RightOutline, StarOutline, SearchOutline, FilterOutline } from 'antd-mobile-icons';
import { TrophyOutlined, FireOutlined, DollarOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/modules/store';
import { selectTasks } from '@/modules/private/task/selectors';
import { fetchTasksRequest, completeTaskRequest } from '@/modules/private/task';
 
import TelegramOutlined from './TelegramOutlined';
import TaskDetailPopup from './TaskDetailPopup';
 
import { closePopup, selectIsTaskPopupOpen } from '@/modules';

 

export default function TaskPopup( ) {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  
  // State for task detail popup
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const isOpen = useSelector(selectIsTaskPopupOpen);
  const onClose = () => {
    dispatch(closePopup('isTaskPopupOpen'))
  }
    
  
  useEffect(() => {
    if (isOpen) {
      // Fetch tasks from Redux
      dispatch(fetchTasksRequest());

    }
  }, [isOpen, dispatch]);

  const getDifficultyIcon = (type: string) => {
    switch (type) {
      case 'daily': return <FireOutlined className="text-[#0ECB81]" />;
      case 'social': return <TrophyOutlined className="text-[#F0B90B]" />;
      case 'special': return <StarOutline className="text-[#F6465D]" />;
      default: return <FireOutlined className="text-[#F0B90B]" />;
    }
  };
 
  const getCompletedTasksCount = useCallback(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);

  const getTotalRewards = useCallback(() => {
    return tasks.filter(task => task.completed).reduce((sum, task) => sum + task.reward, 0);
  }, [tasks]);

  // Handle task click to open detail popup
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  
  };

  // Handle closing task detail popup
  const handleCloseTaskDetail = () => {
    setIsTaskDetailOpen(false);
    setSelectedTask(null);
  };

  // Handle completing a task
  const handleCompleteTask = async (taskId: string) => {
    try {
      dispatch(completeTaskRequest(taskId));
      handleCloseTaskDetail();
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      dispatch(fetchTasksRequest());
    } catch (error) {
      toast.error('Failed to refresh tasks');
    }
  };

 
  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#0B0E11' }}
    >
      <div className="flex flex-col h-full bg-[#0B0E11] text-white">
        {/* Header */}
        <div className="bg-[#1E2329] border-b border-[#2B3139]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#F0B90B] to-[#FCD535] rounded-xl flex items-center justify-center shadow-lg">
                <TrophyOutlined className="text-black text-xl font-bold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Task Center</h2>
                <p className="text-xs text-[#848E9C]">Complete tasks to earn rewards</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#2B3139] hover:bg-[#3C4043] rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <CloseOutline className="text-[#848E9C] text-lg" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-[#0ECB81] rounded-full flex items-center justify-center">
                  <CheckCircleOutline className="text-white text-xs" />
                </div>
                <span className="text-xs text-[#848E9C]">Completed:</span>
                <span className="text-xs font-semibold text-[#0ECB81]">{getCompletedTasksCount()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarOutlined className="text-[#F0B90B] text-sm" />
                <span className="text-xs text-[#848E9C]">Earned:</span>
                <span className="text-xs font-semibold text-[#F0B90B]">{getTotalRewards()} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="p-4">
              {/* Task List */}
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${task.completed
                      ? 'border-[#0ECB81] bg-gradient-to-r from-[#0ECB81]/10 to-[#0ECB81]/5'
                      : 'border-[#2B3139] bg-[#1E2329] hover:border-[#F0B90B]/50 hover:shadow-lg hover:shadow-[#F0B90B]/10'
                    }`}
                >
                  {/* Gradient overlay for completed tasks */}
                  {task.completed && (
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#0ECB81]/20 to-transparent rounded-bl-full" />
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 bg-[#0088cc]/10 border border-[#0088cc]/20  rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <div className="text-sm">
                          <TelegramOutlined className="text-[#0088cc] text-xl" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-bold text-white truncate">{task.title}</h3>

                          {task.completed && (
                            <div className="w-5 h-5 bg-[#0ECB81] rounded-full flex items-center justify-center">
                              <CheckCircleOutline className="text-white text-xs" />
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-[#848E9C] mb-3 line-clamp-2 leading-relaxed">{task.description}</p>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-md`}>
                            <div className="text-xs">
                              <TelegramOutlined className="text-[#0088cc] text-xl" />
                            </div>
                            <span className="text-xs font-medium text-white">
                              Telegram
                            </span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#2B3139] rounded-md">
                            <div className="text-xs">
                              {getDifficultyIcon(task.type)}
                            </div>
                            <span className="text-xs font-medium text-white">
                              {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#2B3139] rounded-md">
                            <span className="text-xs text-[#848E9C]">⏱</span>
                            <span className="text-xs font-medium text-white">{task.duration || '5m'}</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-[#F0B90B]/20 to-[#FCD535]/20 rounded-md border border-[#F0B90B]/30">
                            <DollarOutlined className="text-[#F0B90B] text-xs" />
                            <span className="text-xs font-bold text-[#F0B90B]">+{task.reward}</span>
                          </div>
                        </div>
 
                       
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[#2B3139] rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrophyOutlined className="text-[#848E9C] text-lg" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">No Tasks Available</h3>
                <p className="text-[#848E9C] text-xs">
                  Check back later for new tasks!
                </p>
              </div>
                )}
              </div>
            </div>
          </PullToRefresh>
        </div>
      </div>

      {/* Task Detail Popup */}
      <TaskDetailPopup
        isOpen={isTaskDetailOpen}
        task={selectedTask}
        onClose={handleCloseTaskDetail}
        onCompleteTask={handleCompleteTask}
        getDifficultyIcon={getDifficultyIcon}
      />
    </Popup>
  );
}
