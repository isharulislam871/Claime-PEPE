import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  REFRESH_USERS_REQUEST,
  REFRESH_USERS_SUCCESS,
  REFRESH_USERS_FAILURE,
  SET_SEARCH_TEXT,
  SET_STATUS_FILTER,
  SET_DATE_RANGE,
  SET_CURRENT_PAGE,
  SET_PAGE_SIZE,
  CLEAR_FILTERS,
  CLEAR_ERROR,
  FetchUsersRequestAction,
  FetchUsersSuccessAction,
  FetchUsersFailureAction,
  RefreshUsersRequestAction,
  RefreshUsersSuccessAction,
  RefreshUsersFailureAction,
  SetSearchTextAction,
  SetStatusFilterAction,
  SetDateRangeAction,
  SetCurrentPageAction,
  SetPageSizeAction,
  ClearFiltersAction,
  ClearErrorAction,
  User,
  Pagination,
  UserSummary,
} from './types';

// User Operations
export const fetchUsersRequest = (
  page?: number,
  limit?: number,
  filters?: Record<string, any>
): FetchUsersRequestAction => ({
  type: FETCH_USERS_REQUEST,
  payload: { page, limit, filters },
});

export const fetchUsersSuccess = (
  users: User[],
  pagination: Pagination,
  summary: UserSummary
): FetchUsersSuccessAction => ({
  type: FETCH_USERS_SUCCESS,
  payload: { users, pagination, summary },
});

export const fetchUsersFailure = (error: string): FetchUsersFailureAction => ({
  type: FETCH_USERS_FAILURE,
  payload: { error },
});

// Refresh Operations
export const refreshUsersRequest = (): RefreshUsersRequestAction => ({
  type: REFRESH_USERS_REQUEST,
});

export const refreshUsersSuccess = (
  users: User[],
  pagination: Pagination,
  summary: UserSummary
): RefreshUsersSuccessAction => ({
  type: REFRESH_USERS_SUCCESS,
  payload: { users, pagination, summary },
});

export const refreshUsersFailure = (error: string): RefreshUsersFailureAction => ({
  type: REFRESH_USERS_FAILURE,
  payload: { error },
});

// UI State Management
export const setSearchText = (searchText: string): SetSearchTextAction => ({
  type: SET_SEARCH_TEXT,
  payload: searchText,
});

export const setStatusFilter = (statusFilter: string): SetStatusFilterAction => ({
  type: SET_STATUS_FILTER,
  payload: statusFilter,
});

export const setDateRange = (dateRange: [any, any] | null): SetDateRangeAction => ({
  type: SET_DATE_RANGE,
  payload: dateRange,
});

export const setCurrentPage = (page: number): SetCurrentPageAction => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setPageSize = (pageSize: number): SetPageSizeAction => ({
  type: SET_PAGE_SIZE,
  payload: pageSize,
});

// Utility Actions
export const clearFilters = (): ClearFiltersAction => ({
  type: CLEAR_FILTERS,
});

export const clearError = (): ClearErrorAction => ({
  type: CLEAR_ERROR,
});
