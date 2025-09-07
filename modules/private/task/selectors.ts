import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Task Selectors
export const selectTasks = (state: RootState) => state.private.task.tasks;

export const selectTaskStatus = (state: RootState) => state.private.task.taskStatus;

export const selectTasksLoading = (state: RootState) => state.private.task.loading;

export const selectTaskError = (state: RootState) => state.private.task.error;

// Ads Selectors
export const selectAds = (state: RootState) => state.private.task.ads;

export const selectAdStats = (state: RootState) => state.private.task.adStats;

export const selectAdsLoading = (state: RootState) => state.private.task.adsLoading;

// Computed Selectors
export const selectCompletedTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.completed)
);

export const selectPendingTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => !task.completed)
);

export const selectTasksByType = createSelector(
  [selectTasks, (state: RootState, taskType: string) => taskType],
  (tasks, taskType) => tasks.filter(task => task.type === taskType)
);

export const selectIsTaskCompleted = createSelector(
  [selectTaskStatus, (state: RootState, taskId: string) => taskId],
  (taskStatus, taskId) => taskStatus?.completedTasks?.includes(taskId) || false
);
