'use client';

import { useCallback, useEffect } from 'react';
import { selectCurrentUser, selectUserLoading } from '@/modules';
import { 
  selectTasks, 
  selectTasksLoading, 
  selectAds, 
  selectAdStats, 
  selectAdsLoading,
  fetchTasksRequest,
  completeTaskRequest,
  fetchAdsRequest,
  watchAdRequest
} from '@/modules/private/task';
import Header from './Header';
 
import { useDispatch, useSelector } from 'react-redux';
  

import { Button } from 'antd';
import { ProgressBar } from 'antd-mobile';
 

export default function TasksTab() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const tasks = useSelector(selectTasks);
  const tasksLoading = useSelector(selectTasksLoading);
  const ads = useSelector(selectAds);
  const adsLoading = useSelector(selectAdsLoading);
  const adStats = useSelector(selectAdStats);
 

  useEffect(() => {
    dispatch(fetchTasksRequest());
    dispatch(fetchAdsRequest());
  }, [dispatch]);

  const handleRefresh = async () => {
    dispatch(fetchTasksRequest());
    dispatch(fetchAdsRequest());
  };

  const handleAdView = useCallback(() => {
    if (!user) return;
    
    dispatch(watchAdRequest());
  }, [dispatch, user] );

  const handleTaskComplete = useCallback((taskId: string, taskUrl?: string) => {
    if (!user) return;
 
    dispatch(completeTaskRequest(taskId, taskUrl));
  }, [dispatch, user ]);

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  

   

  return (
    <>
       
        <div className="space-y-4 pt-12 pb-6">
          {/* Enhanced Mobile PWA Status Cards */}
        
         
          {/* Enhanced Mobile Header */}
          <div className="px-4">
            <Header
              title="Earn Rewards"
              subtitle="Complete tasks to earn  Points"
              showBalance={true}
            />
          </div>

          {/* Enhanced Mobile Task Card - Daily Ads */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mx-4 relative overflow-hidden">
            {/* Gradient overlay for mobile enhancement */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-50" />
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Ad Tasks</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Completed: {adStats?.todayAdsViewed || 0} / {adStats?.dailyLimit || 100}</span>
            <span>Ads Left: {adStats?.adsLeftToday || 0}</span>
          </div>
          <ProgressBar
            percent={((adStats?.todayAdsViewed || 0) / (adStats?.dailyLimit || 100)) * 100}
            className="h-2"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Get <span className="font-semibold text-yellow-600">250 Points</span> for each ad view. Tasks reset every 24 hours.
        </p>
            <Button
              onClick={handleAdView}
              disabled={!adStats?.adsLeftToday || adsLoading}
              className={`w-full py-4 px-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                !adStats?.adsLeftToday
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : adsLoading
                    ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                }`}
            
            >
              {adsLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-play-circle"></i>
                  Watch Ad ({adStats?.adsLeftToday || 0} left)
                </>
              )}
            </Button>
          </div>


          {/* Enhanced Mobile Progress Summary */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border mx-4 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-bl from-purple-200 to-transparent rounded-full opacity-30" />
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(task => task.completed).length}
            </div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tasks.filter(task => !task.completed).length}
            </div>
            <div className="text-sm text-gray-600">Tasks Remaining</div>
          </div>
        </div>
        {tasks.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}%</span>
            </div>
            <ProgressBar 
              percent={(tasks.filter(task => task.completed).length / tasks.length) * 100}
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        )}
      </div>

          {/* Enhanced Mobile Available Ads Section */}
          {ads.length > 0 && (
            <div className="space-y-4 px-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Available Ads</h3>
            <div className="text-sm text-gray-600">
              {ads.filter(ad => ad.available).length} ads available
            </div>
          </div>
          <div className="grid gap-4">
            {ads.map((ad) => (
                <div
                  key={ad.id}
                  className={`bg-white rounded-2xl p-5 shadow-lg border transition-all duration-200 relative overflow-hidden ${
                    !ad.available ? 'opacity-60' : 'active:scale-98'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full" />
                <div className="flex items-center gap-4">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ad.type === 'video' ? 'bg-red-100 text-red-800' :
                        ad.type === 'banner' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ad.category}
                      </span>
                      <span className="text-xs text-gray-500">⏱️ {ad.duration}s</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-medium text-yellow-600">+{ad.reward} Points</span>
                      </div>
                        <button
                          onClick={handleAdView}
                          disabled={!ad.available || adsLoading}
                          className={`px-6 py-3 text-sm rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                            !ad.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : adsLoading
                              ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                          }`}
                        >
                        {adsLoading ? (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </div>
                        ) : (
                          <>
                            <i className="fas fa-play mr-1"></i>
                            Watch Ad
                          </>
                        )}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          {/* Enhanced Mobile Bonus Tasks Section */}
          <div className="space-y-4 px-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Available Tasks</h3>
          <div className="text-sm text-gray-600">
            {tasks.filter(task => !task.completed).length} tasks available
          </div>
        </div>
        {tasks.filter(task => task.type !== 'daily').map((task, index) => {
          const completed = task.completed;
          const isLoading = tasksLoading;

          return (
              <div key={task.id} className={`bg-white rounded-2xl p-5 shadow-lg border transition-all duration-200 relative overflow-hidden ${
                completed ? 'opacity-60' : 'active:scale-98'
              }`}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full" />
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.type)}`}>
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.category}
                      </span>
                      {completed && (
                        <div className="flex items-center text-green-500 text-sm">
                          <i className="fas fa-check-circle mr-1"></i>
                          Done
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-medium text-yellow-600">+{task.reward} Points</span>
                      </div>
                      {task.duration && (
                        <span className="text-xs text-gray-500">⏱️ {task.duration}</span>
                      )}
                    </div>
                    {!completed && task.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Completed by users: {task.progress.current}</span>
                          <span>Left: {task.progress.max - task.progress.current}</span>
                        </div>
                        <ProgressBar 
                          percent={task.progress.percentage} 
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {task.url && !completed && (
                      <Button
                        onClick={() => window.open(task.url, '_blank')}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <i className="fab fa-telegram-plane"></i>
                        Join
                      </Button>
                    )}
                    <Button
                      onClick={() => handleTaskComplete(task.id, task.url)}
                      disabled={completed || isLoading}
                      className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all duration-200 ${completed
                          ? 'bg-green-100 text-green-600 cursor-not-allowed'
                          : isLoading
                          ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-sm'
                        }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </div>
                      ) : completed ? (
                        'Completed'
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
           
        
          );
        })}
      </div>

          {/* Enhanced Mobile Daily Reset Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 mx-4 shadow-lg relative overflow-hidden">
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-tl from-blue-200 to-transparent rounded-full opacity-30" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">ℹ️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Daily Reset Information
                </p>
                <p className="text-xs text-blue-600">
                  Tasks reset every 24 hours. Complete them regularly to maximize your earnings!
                </p>
              </div>
            </div>
          </div>
        </div>
  
    </>
  );
}
