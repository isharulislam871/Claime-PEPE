import { WalletState } from './types';
import {
  FETCH_WALLET_REQUEST,
  FETCH_WALLET_SUCCESS,
  FETCH_WALLET_FAILURE,
  CLEAR_WALLET_DATA,
  REFRESH_WALLET,
  WalletActionTypes
} from './actions';

const initialState: WalletState = {
  loading: false,
  error: null,
  user: null,
  wallets: [],
  totalBalance: {
    available: 0,
    locked: 0
  },
  recentTransactions: []
};

export const walletReducer = (
  state: WalletState = initialState,
  action: WalletActionTypes
): WalletState => {
  switch (action.type) {
    case FETCH_WALLET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case REFRESH_WALLET:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_WALLET_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload?.user || null,
        wallets: action.payload?.wallets || [],
        totalBalance: action.payload?.totalBalance || { available: 0, locked: 0 },
        recentTransactions: action.payload?.recentTransactions || []
      };

    case FETCH_WALLET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_WALLET_DATA:
      return initialState;

    default:
      return state;
  }
};
