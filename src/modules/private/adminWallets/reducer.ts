import { AdminWalletsState, AdminWalletsAction } from './types';

const initialState: AdminWalletsState = {
  wallets: [],
  transactions: [],
  loading: false,
  transactionsLoading: false,
  syncingBalances: false,
  error: null,
  transactionsError: null,
};

export const adminWalletsReducer = (
  state: AdminWalletsState = initialState,
  action: AdminWalletsAction
): AdminWalletsState => {
  switch (action.type) {
    // Fetch wallets
    case 'FETCH_WALLETS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_WALLETS_SUCCESS':
      return {
        ...state,
        loading: false,
        wallets: action.payload,
        error: null,
      };
    case 'FETCH_WALLETS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Sync balances
    case 'SYNC_BALANCES_REQUEST':
      return {
        ...state,
        syncingBalances: true,
        error: null,
      };
    case 'SYNC_BALANCES_SUCCESS':
      return {
        ...state,
        syncingBalances: false,
        error: null,
      };
    case 'SYNC_BALANCES_FAILURE':
      return {
        ...state,
        syncingBalances: false,
        error: action.payload,
      };

    // Create wallet
    case 'CREATE_WALLET_REQUEST':
      return {
        ...state,
        error: null,
      };
    case 'CREATE_WALLET_SUCCESS':
      return {
        ...state,
        wallets: [...state.wallets, action.payload],
        error: null,
      };
    case 'CREATE_WALLET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    // Update wallet
    case 'UPDATE_WALLET_REQUEST':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_WALLET_SUCCESS':
      return {
        ...state,
        wallets: state.wallets.map(wallet =>
          wallet._id === action.payload._id ? action.payload : wallet
        ),
        error: null,
      };
    case 'UPDATE_WALLET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    // Delete wallet
    case 'DELETE_WALLET_REQUEST':
      return {
        ...state,
        error: null,
      };
    case 'DELETE_WALLET_SUCCESS':
      return {
        ...state,
        wallets: state.wallets.filter(wallet => wallet._id !== action.payload),
        error: null,
      };
    case 'DELETE_WALLET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    // Generate wallet
    case 'GENERATE_WALLET_REQUEST':
      return {
        ...state,
        error: null,
      };
    case 'GENERATE_WALLET_SUCCESS':
      return {
        ...state,
        error: null,
      };
    case 'GENERATE_WALLET_FAILURE':
      return {
        ...state,
        error: action.payload,
      };

    // Fetch transactions
    case 'FETCH_TRANSACTIONS_REQUEST':
      return {
        ...state,
        transactionsLoading: true,
        transactionsError: null,
      };
    case 'FETCH_TRANSACTIONS_SUCCESS':
      return {
        ...state,
        transactionsLoading: false,
        transactions: action.payload.transactions,
        transactionsError: null,
      };
    case 'FETCH_TRANSACTIONS_FAILURE':
      return {
        ...state,
        transactionsLoading: false,
        transactionsError: action.payload,
      };

    // Clear error
    case 'CLEAR_ADMIN_WALLETS_ERROR':
      return {
        ...state,
        error: null,
        transactionsError: null,
      };

    default:
      return state;
  }
};
