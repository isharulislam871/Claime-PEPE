import { RootState } from '@/modules/store';
import { AuthState } from './types';

// Base selector
const selectAuthState = (state: RootState): AuthState => state.public.auth;

// Basic selectors
export const selectCurrentUser = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.user;
};

export const selectIsAuthenticated = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.isAuthenticated;
};

export const selectAuthLoading = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.isLoading;
};

export const selectIsCreatingUser = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.isCreating;
};

export const selectIsFetchingUser = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.isFetching;
};

export const selectAuthError = (state: RootState) => {
  const auth = selectAuthState(state);
  return auth.error;
};

// Computed selectors
export const selectUserTelegramId = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.id;
};

export const selectUserBalance = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.balance || 0;
};

export const selectUserTotalEarned = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.totalEarned || 0;
};

export const selectUserReferralCode = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.referralCode;
};

export const selectUserReferralCount = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.referralCount || 0;
};

export const selectIsUserActive = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.status === 'active';
};

export const selectIsUserBanned = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.status === 'ban';
};

export const selectIsUserSuspended = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.status === 'suspend';
};

export const selectCurrentUsertatus = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.status || 'unknown';
};

export const selectUserDisplayName = (state: RootState) => {
  const user = selectCurrentUser(state);
  if (!user) return '';
  return user.username || `User ${user.id}`;
};

export const selectUserInitials = (state: RootState) => {
  const user = selectCurrentUser(state);
  if (!user) return '';
  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }
  return 'U';
};

export const selectCanWithdraw = (state: RootState) => {
  const user = selectCurrentUser(state);
  if (!user) return false;
  return user.status === 'active' && user.balance > 0;
};

export const selectHasError = (state: RootState) => {
  const error = selectAuthError(state);
  return !!error;
};

// Additional selectors for new User interface
export const selectUserReferralEarnings = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.referralEarnings || 0;
};

export const selectUserTotalAdsViewed = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.totalAdsViewed || 0;
};

export const selectUserTotalRefers = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.totalRefers || 0;
};

export const selectUserBanReason = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.banReason;
};

export const selectUserAdsWatchedToday = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.adsWatchedToday || 0;
};

export const selectUserDailyCheckInStreak = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.dailyCheckInStreak || 0;
};

export const selectUserTotalSpins = (state: RootState) => {
  const user = selectCurrentUser(state);
  return user?.totalSpins || 0;
};
