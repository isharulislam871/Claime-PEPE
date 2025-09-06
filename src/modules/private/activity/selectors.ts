import { RootState } from '../../store';

// Activity selectors
export const selectActivityState = (state: RootState) => state.private.activity;

export const selectActivities = (state: RootState) => 
  state.private.activity.activities;

export const selectActivitiesLoading = (state: RootState) => 
  state.private.activity.loading;

export const selectActivitiesError = (state: RootState) => 
  state.private.activity.error;

export const selectActivityPagination = (state: RootState) => 
  state.private.activity.pagination;

export const selectActivityStats = (state: RootState) => 
  state.private.activity.stats;

export const selectActivityFilters = (state: RootState) => 
  state.private.activity.filters;

// Computed selectors
export const selectActivitiesByType = (state: RootState, type: string) => 
  state.private.activity.activities.filter((activity : any) => activity.type === type);

export const selectTotalRewardEarned = (state: RootState) => 
  state.private.activity.activities.reduce((total : any, activity : any) => total + activity.reward, 0);

export const selectActivityCount = (state: RootState) => 
  state.private.activity.activities.length;

export const selectRecentActivities = (state: RootState, limit: number = 10) => 
  state.private.activity.activities.slice(0, limit);

export const selectActivityStatsByType = (state: RootState, type: string) => 
  state.private.activity.stats[type] || { count: 0, totalReward: 0 };

export const selectHasMoreActivities = (state: RootState) => 
  state.private.activity.pagination?.hasNextPage ?? false;

 

export const selectTotalActivitiesCount = (state: RootState) => 
  state.private.activity.pagination?.totalCount ?? 0;
