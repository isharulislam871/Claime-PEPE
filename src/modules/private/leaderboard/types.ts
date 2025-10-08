export interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardState {
  leaderboardData: LeaderboardUser[];
  currentUserRank: LeaderboardUser | null;
  loading: boolean;
  error: string | null;
  period: 'weekly' | 'monthly' | 'all-time';
  totalUsers: number;
}

export enum LeaderboardActionTypes {
  FETCH_LEADERBOARD_REQUEST = 'FETCH_LEADERBOARD_REQUEST',
  FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS',
  FETCH_LEADERBOARD_FAILURE = 'FETCH_LEADERBOARD_FAILURE',
  SET_LEADERBOARD_PERIOD = 'SET_LEADERBOARD_PERIOD',
  CLEAR_LEADERBOARD_ERROR = 'CLEAR_LEADERBOARD_ERROR',
}

export interface FetchLeaderboardRequestAction {
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_REQUEST;
  payload: {
    period: 'weekly' | 'monthly' | 'all-time';
    userId?: string;
    limit?: number;
  };
}

export interface FetchLeaderboardSuccessAction {
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_SUCCESS;
  payload: {
    leaderboard: LeaderboardUser[];
    currentUserRank: LeaderboardUser | null;
    period: 'weekly' | 'monthly' | 'all-time';
    totalUsers: number;
  };
}

export interface FetchLeaderboardFailureAction {
  type: LeaderboardActionTypes.FETCH_LEADERBOARD_FAILURE;
  payload: string;
}

export interface SetLeaderboardPeriodAction {
  type: LeaderboardActionTypes.SET_LEADERBOARD_PERIOD;
  payload: 'weekly' | 'monthly' | 'all-time';
}

export interface ClearLeaderboardErrorAction {
  type: LeaderboardActionTypes.CLEAR_LEADERBOARD_ERROR;
}

export type LeaderboardAction =
  | FetchLeaderboardRequestAction
  | FetchLeaderboardSuccessAction
  | FetchLeaderboardFailureAction
  | SetLeaderboardPeriodAction
  | ClearLeaderboardErrorAction;
