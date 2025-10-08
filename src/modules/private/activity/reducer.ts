import { 
  ActivityState, 
  ActivityAction, 
  ActivityActionTypes 
} from './types';

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
  pagination: null,
  stats: {},
  filters: null
};

export const activityReducer = (
  state = initialState, 
  action: ActivityAction
): ActivityState => {
  switch (action.type) {
    case ActivityActionTypes.FETCH_ACTIVITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        filters: action.payload
      };

    case ActivityActionTypes.FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        activities: action.payload.activities,
        pagination: action.payload.pagination,
        stats: action.payload.stats,
        error: null
      };

    case ActivityActionTypes.FETCH_ACTIVITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ActivityActionTypes.SET_ACTIVITY_FILTERS:
      return {
        ...state,
        filters: action.payload
      };

    case ActivityActionTypes.CLEAR_ACTIVITIES:
      return {
        ...state,
        activities: [],
        pagination: null,
        stats: {},
        filters: null
      };

    case ActivityActionTypes.RESET_ACTIVITY_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};
