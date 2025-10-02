import {
  LeaderboardActionTypes,
  FetchLeaderboardRequestAction,
  FetchLeaderboardSuccessAction,
  FetchLeaderboardFailureAction,
  SetLeaderboardPeriodAction,
  ClearLeaderboardErrorAction,
  LeaderboardUser,
} from './types';

export const fetchLeaderboardRequest = (
  period: 'weekly' | 'monthly' | 'all-time',
  userId?: string,
  limit?: number
): FetchLeaderboardRequestAction => ({
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_REQUEST,
  payload: { period, userId, limit },
});

export const fetchLeaderboardSuccess = (
  leaderboard: LeaderboardUser[],
  currentUserRank: LeaderboardUser | null,
  period: 'weekly' | 'monthly' | 'all-time',
  totalUsers: number
): FetchLeaderboardSuccessAction => ({
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_SUCCESS,
  payload: { leaderboard, currentUserRank, period, totalUsers },
});

export const fetchLeaderboardFailure = (error: string): FetchLeaderboardFailureAction => ({
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_FAILURE,
  payload: error,
});

export const setLeaderboardPeriod = (period: 'weekly' | 'monthly' | 'all-time'): SetLeaderboardPeriodAction => ({
  type: LeaderboardActionTypes.SET_LEADERBOARD_PERIOD,
  payload: period,
});

export const clearLeaderboardError = (): ClearLeaderboardErrorAction => ({
  type: LeaderboardActionTypes.CLEAR_LEADERBOARD_ERROR,
});
