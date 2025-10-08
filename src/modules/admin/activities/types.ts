export interface Activity {
  _id: string;
  telegramId: string;
  username: string;
  telegramUsername?: string;
  type: string;
  description: string;
  reward: number;
  metadata: Record<string, any>;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilters {
  type?: string;
  username?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityPagination {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

export interface ActivitySummary {
  typeBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  totalRewards: number;
  avgReward: number;
}

export interface AdminActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  pagination: ActivityPagination;
  summary: ActivitySummary;
  filters: ActivityFilters;
  // UI State
  searchText: string;
  typeFilter: string;
  dateRange: [string, string] | null;
}

// Action Types
export const FETCH_ACTIVITIES_REQUEST = 'admin/activities/FETCH_ACTIVITIES_REQUEST';
export const FETCH_ACTIVITIES_SUCCESS = 'admin/activities/FETCH_ACTIVITIES_SUCCESS';
export const FETCH_ACTIVITIES_FAILURE = 'admin/activities/FETCH_ACTIVITIES_FAILURE';

export const SET_ACTIVITY_FILTERS = 'admin/activities/SET_ACTIVITY_FILTERS';
export const CLEAR_ACTIVITY_ERROR = 'admin/activities/CLEAR_ACTIVITY_ERROR';

// UI State Action Types
export const SET_SEARCH_TEXT = 'admin/activities/SET_SEARCH_TEXT';
export const SET_TYPE_FILTER = 'admin/activities/SET_TYPE_FILTER';
export const SET_DATE_RANGE = 'admin/activities/SET_DATE_RANGE';
export const CLEAR_FILTERS = 'admin/activities/CLEAR_FILTERS';

// Action Interfaces
export interface FetchActivitiesRequestAction {
  type: typeof FETCH_ACTIVITIES_REQUEST;
  payload: {
    page?: number;
    limit?: number;
    filters?: ActivityFilters;
  };
}

export interface FetchActivitiesSuccessAction {
  type: typeof FETCH_ACTIVITIES_SUCCESS;
  payload: {
    activities: Activity[];
    pagination: ActivityPagination;
    summary: ActivitySummary;
  };
}

export interface FetchActivitiesFailureAction {
  type: typeof FETCH_ACTIVITIES_FAILURE;
  payload: string;
}

export interface SetActivityFiltersAction {
  type: typeof SET_ACTIVITY_FILTERS;
  payload: ActivityFilters;
}

export interface ClearActivityErrorAction {
  type: typeof CLEAR_ACTIVITY_ERROR;
}

// UI State Action Interfaces
export interface SetSearchTextAction {
  type: typeof SET_SEARCH_TEXT;
  payload: string;
}

export interface SetTypeFilterAction {
  type: typeof SET_TYPE_FILTER;
  payload: string;
}

export interface SetDateRangeAction {
  type: typeof SET_DATE_RANGE;
  payload: [string, string] | null;
}

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

export type AdminActivitiesActionTypes =
  | FetchActivitiesRequestAction
  | FetchActivitiesSuccessAction
  | FetchActivitiesFailureAction
  | SetActivityFiltersAction
  | ClearActivityErrorAction
  | SetSearchTextAction
  | SetTypeFilterAction
  | SetDateRangeAction
  | ClearFiltersAction;
