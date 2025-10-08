import { 
  ActivityActionTypes, 
  ActivityFilters,
  Activity,
  ActivityPagination,
  ActivityStats
} from './types';

// Fetch activities actions
export const fetchActivitiesRequest = (filters: ActivityFilters) => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_REQUEST,
  payload: filters
});

export const fetchActivitiesSuccess = (payload: {
  activities: Activity[];
  pagination: ActivityPagination;
  stats: ActivityStats;
}) => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_SUCCESS,
  payload
});

export const fetchActivitiesFailure = (error: string) => ({
  type: ActivityActionTypes.FETCH_ACTIVITIES_FAILURE,
  payload: error
});

// Filter actions
export const setActivityFilters = (filters: ActivityFilters) => ({
  type: ActivityActionTypes.SET_ACTIVITY_FILTERS,
  payload: filters
});

// Clear actions
export const clearActivities = () => ({
  type: ActivityActionTypes.CLEAR_ACTIVITIES
});

// Reset error action
export const resetActivityError = () => ({
  type: ActivityActionTypes.RESET_ACTIVITY_ERROR
});
