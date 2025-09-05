import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectCurrentUser = (state: RootState) => {
  // Return the first user as current user, or null if no users
  return state.private.user.users.length > 0 ? state.private.user.users[0] : null;
};

export const selectUserBalance = (state: RootState) => {
  const currentUser = selectCurrentUser(state);
  return currentUser?.balance || 0;
};

export const selectUsers = (state: RootState) => state.private.user.users;

export const selectUserLoading = (state: RootState) => state.private.user.loading;

export const selectUserError = (state: RootState) => state.private.user.error;

export const selectUserStats = (state: RootState) => state.private.user.stats;

export const selectUserFilters = (state: RootState) => state.private.user.filters;

export const selectUserTotal = (state: RootState) => state.private.user.total;

export const selectCurrentPage = (state: RootState) => state.private.user.currentPage;

export const selectPageSize = (state: RootState) => state.private.user.pageSize;

export const selectSpinWheel = (state: RootState) => state.private.user.spinWheel;

export const selectEarningSystemsStatus = createSelector(
  [selectCurrentUser, (state: RootState) => state.private.user.loading],
  (currentUser, loading) => ({
    dailyCheckInAvailable: true, // You can implement logic based on user data
    watchAdAvailable: true,
    spinWheelAvailable: true,
    referralsAvailable: true,
    loading,
    adsWatched: currentUser?.adsWatchedToday || 0
  })
);

