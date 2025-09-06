import {
  WITHDRAWALS_FETCH_REQUEST,
  WITHDRAWALS_FETCH_SUCCESS,
  WITHDRAWALS_FETCH_FAILURE,
  WITHDRAWALS_SET_RECENT_OPEN,
  WITHDRAWALS_CLEAR_ERROR
} from './constants';
import {
  FetchWithdrawalsPayload,
  FetchWithdrawalsSuccessPayload,
  FetchWithdrawalsFailurePayload
} from './types';

export const fetchWithdrawals = ( ) => ({
  type: WITHDRAWALS_FETCH_REQUEST,
});

export const fetchWithdrawalsSuccess = (withdrawals: FetchWithdrawalsSuccessPayload['withdrawals']) => ({
  type: WITHDRAWALS_FETCH_SUCCESS,
  payload: { withdrawals }
});

export const fetchWithdrawalsFailure = (error: string) => ({
  type: WITHDRAWALS_FETCH_FAILURE,
  payload: { error }
});

export const setRecentWithdrawalsOpen = (isOpen: boolean) => ({
  type: WITHDRAWALS_SET_RECENT_OPEN,
  payload: { isOpen }
});

export const clearError = () => ({
  type: WITHDRAWALS_CLEAR_ERROR
});
