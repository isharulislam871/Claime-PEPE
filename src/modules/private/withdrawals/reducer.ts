import {
  WITHDRAWALS_FETCH_REQUEST,
  WITHDRAWALS_FETCH_SUCCESS,
  WITHDRAWALS_FETCH_FAILURE,
  WITHDRAWALS_SET_RECENT_OPEN,
  WITHDRAWALS_CLEAR_ERROR
} from './constants';
import { WithdrawalsState } from './types';

const initialState: WithdrawalsState = {
  recentWithdrawals: [],
  loading: false,
  error: null,
  isRecentWithdrawalsOpen: false
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

    default:
      return state;
  }
};
