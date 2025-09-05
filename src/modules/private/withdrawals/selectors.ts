import { RootState } from '../../store';

export const selectRecentWithdrawals = (state: RootState) => 
  state.private.withdrawals.recentWithdrawals;

export const selectWithdrawalsLoading = (state: RootState) => 
  state.private.withdrawals.loading;

export const selectWithdrawalsError = (state: RootState) => 
  state.private.withdrawals.error;

export const selectIsRecentWithdrawalsOpen = (state: RootState) => 
  state.private.withdrawals.isRecentWithdrawalsOpen;
