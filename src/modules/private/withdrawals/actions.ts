import {
    WITHDRAWALS_FETCH_REQUEST,
    WITHDRAWALS_FETCH_SUCCESS,
    WITHDRAWALS_FETCH_FAILURE,
    WITHDRAWALS_SET_RECENT_OPEN,
    WITHDRAWALS_CLEAR_ERROR,
    WITHDRAWAL_CREATE_REQUEST,
    WITHDRAWAL_CREATE_SUCCESS,
    WITHDRAWAL_CREATE_FAILURE,
    WITHDRAWAL_CLEAR_CREATE_STATE
  } from './constants';
  import {
    FetchWithdrawalsPayload,
    FetchWithdrawalsSuccessPayload,
    FetchWithdrawalsFailurePayload,
    CreateWithdrawalPayload,
    CreateWithdrawalSuccessPayload,
    CreateWithdrawalFailurePayload
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
  
  // New withdrawal creation actions
  export const createWithdrawal = (payload: CreateWithdrawalPayload) => ({
    type: WITHDRAWAL_CREATE_REQUEST,
    payload
  });
  
  export const createWithdrawalSuccess = (payload: CreateWithdrawalSuccessPayload) => ({
    type: WITHDRAWAL_CREATE_SUCCESS,
    payload
  });
  
  export const createWithdrawalFailure = (error: string) => ({
    type: WITHDRAWAL_CREATE_FAILURE,
    payload: { error }
  });
  
  export const clearCreateState = () => ({
    type: WITHDRAWAL_CLEAR_CREATE_STATE
  });