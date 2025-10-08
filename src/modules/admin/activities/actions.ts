import {
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_FAILURE,
  SET_ACTIVITY_FILTERS,
  CLEAR_ACTIVITY_ERROR,
  SET_SEARCH_TEXT,
  SET_TYPE_FILTER,
  SET_DATE_RANGE,
  CLEAR_FILTERS,
  FetchActivitiesRequestAction,
  FetchActivitiesSuccessAction,
  FetchActivitiesFailureAction,
  SetActivityFiltersAction,
  ClearActivityErrorAction,
  SetSearchTextAction,
  SetTypeFilterAction,
  SetDateRangeAction,
  ClearFiltersAction,
  Activity,
  ActivityFilters,
  ActivityPagination,
  ActivitySummary,
} from './types';

// Fetch Activities Actions
export const fetchActivitiesRequest = (
  page?: number,
  limit?: number,
  filters?: ActivityFilters
): FetchActivitiesRequestAction => ({
  type: FETCH_ACTIVITIES_REQUEST,
  payload: { page, limit, filters },
});

export const fetchActivitiesSuccess = (
  activities: Activity[],
  pagination: ActivityPagination,
  summary: ActivitySummary
): FetchActivitiesSuccessAction => ({
  type: FETCH_ACTIVITIES_SUCCESS,
  payload: { activities, pagination, summary },
});

export const fetchActivitiesFailure = (error: string): FetchActivitiesFailureAction => ({
  type: FETCH_ACTIVITIES_FAILURE,
  payload: error,
});

// Filter Actions
export const setActivityFilters = (filters: ActivityFilters): SetActivityFiltersAction => ({
  type: SET_ACTIVITY_FILTERS,
  payload: filters,
});

export const clearActivityError = (): ClearActivityErrorAction => ({
  type: CLEAR_ACTIVITY_ERROR,
});

// UI State Actions
export const setSearchText = (searchText: string): SetSearchTextAction => ({
  type: SET_SEARCH_TEXT,
  payload: searchText,
});

export const setTypeFilter = (typeFilter: string): SetTypeFilterAction => ({
  type: SET_TYPE_FILTER,
  payload: typeFilter,
});

export const setDateRange = (dateRange: [string, string] | null): SetDateRangeAction => ({
  type: SET_DATE_RANGE,
  payload: dateRange,
});

export const clearFilters = (): ClearFiltersAction => ({
  type: CLEAR_FILTERS,
});
