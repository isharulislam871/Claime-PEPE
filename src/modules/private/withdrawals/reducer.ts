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
import { WithdrawalsState } from './types';

const initialState: WithdrawalsState = {
  recentWithdrawals: [],
  loading: false,
  error: null,
  isRecentWithdrawalsOpen: false,
  // New withdrawal creation state
  createLoading: false,
  createError: null,
  createSuccess: false,
  createdWithdrawal: null
};

export const withdrawalsReducer = (state = initialState, action: any): WithdrawalsState => {
  switch (action.type) {
    case WITHDRAWALS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case WITHDRAWALS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        recentWithdrawals: action.payload.withdrawals,
        error: null
      };

    case WITHDRAWALS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case WITHDRAWALS_SET_RECENT_OPEN:
      return {
        ...state,
        isRecentWithdrawalsOpen: action.payload.isOpen
      };

    case WITHDRAWALS_CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case WITHDRAWAL_CREATE_REQUEST:
      return {
        ...state,
        createLoading: true,
        createError: null,
        createSuccess: false
      };

    case WITHDRAWAL_CREATE_SUCCESS:
      return {
        ...state,
        createLoading: false,
        createError: null,
        createSuccess: true,
        createdWithdrawal: action.payload.withdrawal,
        // Add the new withdrawal to recent withdrawals
        recentWithdrawals: [action.payload.withdrawal, ...state.recentWithdrawals]
      };

    case WITHDRAWAL_CREATE_FAILURE:
      return {
        ...state,
        createLoading: false,
        createError: action.payload.error,
        createSuccess: false
      };
/* 
    case WITHDRAWAL_CLEAR_CREATE_STATE:
      return {
        ...state,
        createLoading: false,
        createError: null,
        createSuccess: false,
        createdWithdrawal: null
      }; */

    default:
      return state;
  }
};
