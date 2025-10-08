import {
  AdminActivitiesState,
  AdminActivitiesActionTypes,
  FETCH_ACTIVITIES_REQUEST,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_FAILURE,
  SET_ACTIVITY_FILTERS,
  CLEAR_ACTIVITY_ERROR,
  SET_SEARCH_TEXT,
  SET_TYPE_FILTER,
  SET_DATE_RANGE,
  CLEAR_FILTERS,
} from './types';

const initialState: AdminActivitiesState = {
  activities: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalCount: 0,
    pageSize: 100,
  },
  summary: {
    typeBreakdown: [],
    totalRewards: 0,
    avgReward: 0,
  },
  filters: {},
  // UI State
  searchText: '',
  typeFilter: 'all',
  dateRange: null,
};

export const adminActivitiesReducer = (
  state = initialState,
  action: AdminActivitiesActionTypes
): AdminActivitiesState => {
  switch (action.type) {
    case FETCH_ACTIVITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        activities: action.payload.activities,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
      };

    case FETCH_ACTIVITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        activities: [],
      };

    case SET_ACTIVITY_FILTERS:
      return {
        ...state,
        filters: action.payload,
      };

    case CLEAR_ACTIVITY_ERROR:
      return {
        ...state,
        error: null,
      };

    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    case SET_TYPE_FILTER:
      return {
        ...state,
        typeFilter: action.payload,
      };

    case SET_DATE_RANGE:
      return {
        ...state,
        dateRange: action.payload,
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        searchText: '',
        typeFilter: 'all',
        dateRange: null,
        filters: {},
      };

    default:
      return state;
  }
};
