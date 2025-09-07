import { RootState } from '../../store';

export const selectRecentWithdrawals = (state: RootState) => 
  state.private.withdrawals.recentWithdrawals;

export const selectWithdrawalsLoading = (state: RootState) => 
  state.private.withdrawals.loading;

export const selectWithdrawalsError = (state: RootState) => 
  state.private.withdrawals.error;

export const selectIsRecentWithdrawalsOpen = (state: RootState) => 
  state.private.withdrawals.isRecentWithdrawalsOpen;

// New withdrawal creation selectors
export const selectCreateWithdrawalLoading = (state: RootState) => 
  state.private.withdrawals.createLoading;

export const selectCreateWithdrawalError = (state: RootState) => 
  state.private.withdrawals.createError;

export const selectCreateWithdrawalSuccess = (state: RootState) => 
  state.private.withdrawals.createSuccess;

export const selectCreatedWithdrawal = (state: RootState) => 
  state.private.withdrawals.createdWithdrawal;
