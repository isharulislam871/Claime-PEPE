'use client';

import React, { useState, useEffect } from 'react';
import { Popup } from 'antd-mobile';
import { CloseOutline, CheckCircleOutline, RightOutline } from 'antd-mobile-icons';
import { DollarOutlined, PlayCircleOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';
import TelegramOutlined from './TelegramOutlined';
import { LoadAds } from '@/lib/ads';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration?: string;
  type: string;
  completed: boolean;
  url: string;
}

interface TaskDetailPopupProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
  getDifficultyIcon: (type: string) => React.ReactNode;
}




export async function showAlternatingAds(zoneId: string, userId: number, dispatch: any, watchAdRequest: any) {
  // Define all ad providers in rotation
  const ads = ["load", "giga"];

  // Get last state from localStorage
  let lastAd = localStorage.getItem("lastAd");

  // Find index of last shown ad
  let lastIndex = ads.indexOf(lastAd || "");

  // Calculate next ad index (rotate)
  let nextIndex = (lastIndex + 1) % ads.length;
  let nextAd = ads[nextIndex];

  // Show the next ad
  if (nextAd === "load") {
    await LoadAds(zoneId);
  } else if (nextAd === "giga") {
    await window.showGiga?.();
  }

  // Dispatch ad watch request
  dispatch(watchAdRequest(userId));

  // Save state
  localStorage.setItem("lastAd", nextAd);

  return nextAd;
}

export default function TaskDetailPopup({
  isOpen,
  task,
  onClose,
  onCompleteTask,
  getDifficultyIcon
}: TaskDetailPopupProps) {
  const [isTaskUnlocked, setIsTaskUnlocked] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [unlockedTasks, setUnlockedTasks] = useState<Set<string>>(new Set());

  // Reset unlock state when task changes or popup opens
  useEffect(() => {
    if (task && isOpen) {
      // Check if this specific task was already unlocked
      const isCurrentTaskUnlocked = unlockedTasks.has(task.id);
      setIsTaskUnlocked(isCurrentTaskUnlocked);
      setIsWatchingAd(false);
    }
  }, [task?.id, isOpen, unlockedTasks]);

  // Reset states when popup closes
  useEffect(() => {
    if (!isOpen) {
      setIsWatchingAd(false);
    }
  }, [isOpen]);

  if (!task) return null;

  // Handle watching ad to unlock task
  const handleWatchAd = async () => {
    if (!task) return;

    setIsWatchingAd(true);

    // Simulate ad watching (3 seconds)
 

    
      // Check if showAdexora method exists and call it safely
      if (typeof window !== 'undefined' && window && 'showAdexora' in window && typeof window.showAdexora === 'function') {
        await window.showAdexora!();
      }
      
    setTimeout(() => {
      setIsTaskUnlocked(true);
      setIsWatchingAd(false);
      // Add this task to the unlocked tasks set
      setUnlockedTasks(prev => new Set([...prev, task.id]));
    }, 1000 * 3);
  };

  // Handle opening the unlocked task
  const handleOpenTask = () => {
    if (isTaskUnlocked) {
      // Here you would typically open the actual task URL or perform the task action
      window.open(task.url, '_blank');
    }
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      bodyStyle={{ height: '100vh', backgroundColor: '#0B0E11' }}
    >
      <div className="flex flex-col h-full bg-[#0B0E11] text-white">
        {/* Header */}
        <div className="bg-[#1E2329] border-b border-[#2B3139]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <TelegramOutlined className="text-[#0088cc] text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Task Details</h2>
                <p className="text-xs text-[#848E9C]">Complete to earn rewards</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#2B3139] hover:bg-[#3C4043] rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <CloseOutline className="text-[#848E9C] text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Task Title */}
            <div>
              <h1 className="text-xl font-bold text-white mb-2">{task.title}</h1>
              <p className="text-sm text-[#848E9C] leading-relaxed">{task.description}</p>
            </div>

            {/* Task Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarOutlined className="text-[#F0B90B] text-lg" />
                  <span className="text-xs text-[#848E9C]">Reward</span>
                </div>
                <p className="text-lg font-bold text-[#F0B90B]">+{task.reward} pts</p>
              </div>

              <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#848E9C] text-lg">⏱</span>
                  <span className="text-xs text-[#848E9C]">Duration</span>
                </div>
                <p className="text-lg font-bold text-white">{task.duration || '5m'}</p>
              </div>
            </div>

            {/* Task Type & Platform */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`flex items-center gap-2 px-3 py-2 bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-lg`}>
                  <TelegramOutlined className="text-[#0088cc] text-lg" />
                  <span className="text-sm font-medium text-white">Telegram Task</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#2B3139] rounded-lg">
                  {getDifficultyIcon(task.type)}
                  <span className="text-sm font-medium text-white">
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Instructions */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#F0B90B]">📋</span>
                Instructions
              </h3>
              <div className="space-y-2 text-sm text-[#848E9C]">
                {!isTaskUnlocked ? (
                  <>
                    <p>• Watch an ad to unlock this task</p>
                    <p>• Click "Watch Ad" button below</p>
                    <p>• After watching, the task will be unlocked</p>
                    <p>• Then you can complete the task and earn rewards!</p>
                  </>
                ) : (
                  <>
                    <p>• Task is now unlocked! Click "Open Task" below</p>
                    <p>• Complete the required action</p>
                    <p>• Return here and click "Mark as Complete"</p>
                    <p>• Earn your reward points!</p>
                  </>
                )}
              </div>
            </div>

            {/* Task Lock Status */}
            {!isTaskUnlocked && !task.completed && (
              <div className="bg-gradient-to-r from-[#F6465D]/10 to-[#F6465D]/5 border border-[#F6465D] rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-[#F6465D] text-lg" />
                  <span className="text-sm font-bold text-[#F6465D]">Task Locked</span>
                </div>
                <p className="text-xs text-[#848E9C] mt-1">Watch an ad to unlock this task</p>
              </div>
            )}

            {/* Task Unlocked Status */}
            {isTaskUnlocked && !task.completed && (
              <div className="bg-gradient-to-r from-[#0ECB81]/10 to-[#0ECB81]/5 border border-[#0ECB81] rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <UnlockOutlined className="text-[#0ECB81] text-lg" />
                  <span className="text-sm font-bold text-[#0ECB81]">Task Unlocked!</span>
                </div>
                <p className="text-xs text-[#848E9C] mt-1">You can now complete this task</p>
              </div>
            )}

            {/* Task Status */}
            {task.completed && (
              <div className="bg-gradient-to-r from-[#0ECB81]/10 to-[#0ECB81]/5 border border-[#0ECB81] rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#0ECB81] rounded-full flex items-center justify-center">
                    <CheckCircleOutline className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-bold text-[#0ECB81]">Task Completed!</span>
                </div>
                <p className="text-xs text-[#848E9C] mt-1">You've earned {task.reward} points</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-[#1E2329] border-t border-[#2B3139]">
          <div className="space-y-3">
            {!task.completed && (
              <>
                {/* Watch Ad Button (shown when task is locked) */}
                {!isTaskUnlocked && (
                  <button
                    onClick={handleWatchAd}
                    disabled={isWatchingAd}
                    className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isWatchingAd
                      ? 'bg-[#2B3139] text-[#848E9C] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#F6465D] to-[#F6465D]/80 hover:from-[#F6465D]/90 hover:to-[#F6465D]/70 text-white'
                      }`}
                  >
                    <PlayCircleOutlined className="text-lg" />
                    {isWatchingAd ? 'Watching Ad...' : 'Watch Ad to Unlock'}
                    {isWatchingAd && <div className="w-4 h-4 border-2 border-[#848E9C] border-t-transparent rounded-full animate-spin ml-2"></div>}
                  </button>
                )}

                {/* Open Task Button (shown when task is unlocked) */}
                {isTaskUnlocked && (
                  <button
                    onClick={handleOpenTask}
                    className="w-full bg-gradient-to-r from-[#0088cc] to-[#0088cc]/80 hover:from-[#0088cc]/90 hover:to-[#0088cc]/70 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <TelegramOutlined className="text-lg" />
                    Open Task
                    <RightOutline className="text-sm" />
                  </button>
                )}

                {/* Mark as Complete Button (shown when task is unlocked) */}
                {isTaskUnlocked && (
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="w-full bg-gradient-to-r from-[#0ECB81] to-[#0ECB81]/80 hover:from-[#0ECB81]/90 hover:to-[#0ECB81]/70 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircleOutline className="text-lg" />
                    Mark as Complete
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="w-full bg-[#2B3139] hover:bg-[#3C4043] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
