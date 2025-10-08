import {
  AdminUsersState,
  AdminUsersActionTypes,
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
} from './types';

const initialState: AdminUsersState = {
  // Data state
  users: [],
  totalCount: 0,
  pagination: {
    currentPage: 1,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  statusStats: {},
  totalStats: {
    totalEarnings: 0,
    totalBalance: 0,
    averageEarnings: 0,
  },
  userSegments: {
    activeUsers: 0,
    highEarners: 0,
    newUsers: 0,
  },
  
  // UI state
  searchText: '',
  statusFilter: 'all',
  dateRange: null,
  currentPage: 1,
  pageSize: 500,
  
  // Loading states
  loading: false,
  refreshing: false,
  
  // Error state
  error: null,
};

export const adminUsersReducer = (
  state = initialState,
  action: AdminUsersActionTypes
): AdminUsersState => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USERS_SUCCESS:
      const { users, pagination, summary } = action.payload;
      
      // Transform status breakdown to stats object
      const statusStats = summary.statusBreakdown.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {}
      );

      return {
        ...state,
        loading: false,
        users,
        totalCount: pagination.totalCount,
        pagination,
        statusStats,
        totalStats: summary.totalStats,
        userSegments: summary.userSegments,
        currentPage: pagination.currentPage,
        error: null,
      };

    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case REFRESH_USERS_REQUEST:
      return {
        ...state,
        refreshing: true,
        error: null,
      };

    case REFRESH_USERS_SUCCESS:
      const refreshPayload = action.payload;
      
      // Transform status breakdown to stats object for refresh
      const refreshStatusStats = refreshPayload.summary.statusBreakdown.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {}
      );

      return {
        ...state,
        refreshing: false,
        users: refreshPayload.users,
        totalCount: refreshPayload.pagination.totalCount,
        pagination: refreshPayload.pagination,
        statusStats: refreshStatusStats,
        totalStats: refreshPayload.summary.totalStats,
        userSegments: refreshPayload.summary.userSegments,
        error: null,
      };

    case REFRESH_USERS_FAILURE:
      return {
        ...state,
        refreshing: false,
        error: action.payload.error,
      };

    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    case SET_STATUS_FILTER:
      return {
        ...state,
        statusFilter: action.payload,
      };

    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload,
      };

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload,
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        searchText: '',
        statusFilter: 'all',
        dateRange: null,
        currentPage: 1,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
