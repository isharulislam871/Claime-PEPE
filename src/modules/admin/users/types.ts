export interface User {
  _id: string;
  telegramId: string;
  username: string;
  telegramUsername?: string;
  balance: number;
  totalEarned: number;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAdsViewed?: number;
  ipAddress?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserSegments {
  activeUsers: number;
  highEarners: number;
  newUsers: number;
}

export interface TotalStats {
  totalEarnings: number;
  totalBalance: number;
  averageEarnings: number;
}

export interface StatusStats {
  [key: string]: number;
}

export interface UserSummary {
  statusBreakdown: Array<{ _id: string; count: number }>;
  totalStats: TotalStats;
  userSegments: UserSegments;
}

export interface Pagination {
  currentPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUsersState {
  // Data state
  users: User[];
  totalCount: number;
  pagination: Pagination;
  statusStats: StatusStats;
  totalStats: TotalStats;
  userSegments: UserSegments;
  
  // UI state
  searchText: string;
  statusFilter: string;
  dateRange: [any, any] | null;
  currentPage: number;
  pageSize: number;
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  
  // Error state
  error: string | null;
}

// Action Types
export const FETCH_USERS_REQUEST = 'admin/users/FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'admin/users/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'admin/users/FETCH_USERS_FAILURE';

export const REFRESH_USERS_REQUEST = 'admin/users/REFRESH_USERS_REQUEST';
export const REFRESH_USERS_SUCCESS = 'admin/users/REFRESH_USERS_SUCCESS';
export const REFRESH_USERS_FAILURE = 'admin/users/REFRESH_USERS_FAILURE';

export const SET_SEARCH_TEXT = 'admin/users/SET_SEARCH_TEXT';
export const SET_STATUS_FILTER = 'admin/users/SET_STATUS_FILTER';
export const SET_DATE_RANGE = 'admin/users/SET_DATE_RANGE';
export const SET_CURRENT_PAGE = 'admin/users/SET_CURRENT_PAGE';
export const SET_PAGE_SIZE = 'admin/users/SET_PAGE_SIZE';

export const CLEAR_FILTERS = 'admin/users/CLEAR_FILTERS';
export const CLEAR_ERROR = 'admin/users/CLEAR_ERROR';

// Action Interfaces
export interface FetchUsersRequestAction {
  type: typeof FETCH_USERS_REQUEST;
  payload: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
  };
}

export interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: {
    users: User[];
    pagination: Pagination;
    summary: UserSummary;
  };
}

export interface FetchUsersFailureAction {
  type: typeof FETCH_USERS_FAILURE;
  payload: {
    error: string;
  };
}

export interface RefreshUsersRequestAction {
  type: typeof REFRESH_USERS_REQUEST;
}

export interface RefreshUsersSuccessAction {
  type: typeof REFRESH_USERS_SUCCESS;
  payload: {
    users: User[];
    pagination: Pagination;
    summary: UserSummary;
  };
}

export interface RefreshUsersFailureAction {
  type: typeof REFRESH_USERS_FAILURE;
  payload: {
    error: string;
  };
}

export interface SetSearchTextAction {
  type: typeof SET_SEARCH_TEXT;
  payload: string;
}

export interface SetStatusFilterAction {
  type: typeof SET_STATUS_FILTER;
  payload: string;
}

export interface SetDateRangeAction {
  type: typeof SET_DATE_RANGE;
  payload: [any, any] | null;
}

export interface SetCurrentPageAction {
  type: typeof SET_CURRENT_PAGE;
  payload: number;
}

export interface SetPageSizeAction {
  type: typeof SET_PAGE_SIZE;
  payload: number;
}

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

export interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}

export type AdminUsersActionTypes =
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | RefreshUsersRequestAction
  | RefreshUsersSuccessAction
  | RefreshUsersFailureAction
  | SetSearchTextAction
  | SetStatusFilterAction
  | SetDateRangeAction
  | SetCurrentPageAction
  | SetPageSizeAction
  | ClearFiltersAction
  | ClearErrorAction;
