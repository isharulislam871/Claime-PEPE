// Activity types
export interface Activity {
  _id: string;
  telegramId: string;
  type: 'ad_view' | 'task_complete' | 'referral' | 'bonus' | 'withdrawal' | 'login' | 'other' | 'ad_view_home' | 'api';
  description: string;
  reward: number;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityStats {
  [key: string]: {
    count: number;
    totalReward: number;
  };
}

export interface ActivityPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ActivityFilters {
  
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  pagination: ActivityPagination | null;
  stats: ActivityStats;
  filters: ActivityFilters | null;
}

export enum ActivityActionTypes {
  FETCH_ACTIVITIES_REQUEST = 'FETCH_ACTIVITIES_REQUEST',
  FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVITIES_SUCCESS',
  FETCH_ACTIVITIES_FAILURE = 'FETCH_ACTIVITIES_FAILURE',
  SET_ACTIVITY_FILTERS = 'SET_ACTIVITY_FILTERS',
  CLEAR_ACTIVITIES = 'CLEAR_ACTIVITIES',
  RESET_ACTIVITY_ERROR = 'RESET_ACTIVITY_ERROR'
}

export interface FetchActivitiesRequestAction {
  type: ActivityActionTypes.FETCH_ACTIVITIES_REQUEST;
  payload: ActivityFilters;
}

export interface FetchActivitiesSuccessAction {
  type: ActivityActionTypes.FETCH_ACTIVITIES_SUCCESS;
  payload: {
    activities: Activity[];
    pagination: ActivityPagination;
    stats: ActivityStats;
  };
}

export interface FetchActivitiesFailureAction {
  type: ActivityActionTypes.FETCH_ACTIVITIES_FAILURE;
  payload: string;
}

export interface SetActivityFiltersAction {
  type: ActivityActionTypes.SET_ACTIVITY_FILTERS;
  payload: ActivityFilters;
}

export interface ClearActivitiesAction {
  type: ActivityActionTypes.CLEAR_ACTIVITIES;
}

export interface ResetActivityErrorAction {
  type: ActivityActionTypes.RESET_ACTIVITY_ERROR;
}

export type ActivityAction =
  | FetchActivitiesRequestAction
  | FetchActivitiesSuccessAction
  | FetchActivitiesFailureAction
  | SetActivityFiltersAction
  | ClearActivitiesAction
  | ResetActivityErrorAction;
