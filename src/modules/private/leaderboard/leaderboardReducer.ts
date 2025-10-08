import { LeaderboardState, LeaderboardAction, LeaderboardActionTypes } from './types';

const initialState: LeaderboardState = {
  leaderboardData: [],
  currentUserRank: null,
  loading: false,
  error: null,
  period: 'weekly',
  totalUsers: 0,
};

export const leaderboardReducer = (
  state: LeaderboardState = initialState,
  action: LeaderboardAction
): LeaderboardState => {
  switch (action.type) {
    case LeaderboardActionTypes.FETCH_LEADERBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LeaderboardActionTypes.FETCH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        leaderboardData: action.payload.leaderboard,
        currentUserRank: action.payload.currentUserRank,
        period: action.payload.period,
        totalUsers: action.payload.totalUsers,
      };

    case LeaderboardActionTypes.FETCH_LEADERBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LeaderboardActionTypes.SET_LEADERBOARD_PERIOD:
      return {
        ...state,
        period: action.payload,
      };

    case LeaderboardActionTypes.CLEAR_LEADERBOARD_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
