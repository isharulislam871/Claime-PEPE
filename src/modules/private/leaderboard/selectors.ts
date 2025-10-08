import { RootState } from '@/modules/store';
import { LeaderboardState } from './types';

export const selectLeaderboard = (state: RootState): LeaderboardState => 
  state.private.leaderboard;

export const selectLeaderboardData = (state: RootState) => 
  selectLeaderboard(state).leaderboardData;

export const selectCurrentUserRank = (state: RootState) => 
  selectLeaderboard(state).currentUserRank;

export const selectLeaderboardLoading = (state: RootState) => 
  selectLeaderboard(state).loading;

export const selectLeaderboardError = (state: RootState) => 
  selectLeaderboard(state).error;

export const selectLeaderboardPeriod = (state: RootState) => 
  selectLeaderboard(state).period;

export const selectLeaderboardTotalUsers = (state: RootState) => 
  selectLeaderboard(state).totalUsers;
