import { TaskActionTypes, Task, TaskStatus, AdStats } from './types';

// Task Actions
export const fetchTasksRequest = () => ({
  type: TaskActionTypes.FETCH_TASKS_REQUEST
});

export const fetchTasksSuccess = (tasks: Task[], taskStatus: TaskStatus) => ({
  type: TaskActionTypes.FETCH_TASKS_SUCCESS,
  payload: { tasks, taskStatus }
});

export const fetchTasksFailure = (error: string) => ({
  type: TaskActionTypes.FETCH_TASKS_FAILURE,
  payload: error
});

export const completeTaskRequest = (taskId: string, taskUrl?: string) => ({
  type: TaskActionTypes.COMPLETE_TASK_REQUEST,
  payload: { taskId, taskUrl }
});

export const completeTaskSuccess = (data: any) => ({
  type: TaskActionTypes.COMPLETE_TASK_SUCCESS,
  payload: data
});

export const completeTaskFailure = (error: string) => ({
  type: TaskActionTypes.COMPLETE_TASK_FAILURE,
  payload: error
});

// Ads Actions
export const fetchAdsRequest = () => ({
  type: TaskActionTypes.FETCH_ADS_REQUEST
});

export const fetchAdsSuccess = (ads: any[], adStats: AdStats) => ({
  type: TaskActionTypes.FETCH_ADS_SUCCESS,
  payload: { ads, adStats }
});

export const fetchAdsFailure = (error: string) => ({
  type: TaskActionTypes.FETCH_ADS_FAILURE,
  payload: error
});

export const watchAdRequest = () => ({
  type: TaskActionTypes.WATCH_AD_REQUEST
});

export const watchAdSuccess = (data: any) => ({
  type: TaskActionTypes.WATCH_AD_SUCCESS,
  payload: data
});

export const watchAdFailure = (error: string) => ({
  type: TaskActionTypes.WATCH_AD_FAILURE,
  payload: error
});
