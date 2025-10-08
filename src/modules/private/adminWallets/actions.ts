import {
  FetchWalletsRequestAction,
  FetchWalletsSuccessAction,
  FetchWalletsFailureAction,
  SyncBalancesRequestAction,
  SyncBalancesSuccessAction,
  SyncBalancesFailureAction,
  CreateWalletRequestAction,
  CreateWalletSuccessAction,
  CreateWalletFailureAction,
  UpdateWalletRequestAction,
  UpdateWalletSuccessAction,
  UpdateWalletFailureAction,
  DeleteWalletRequestAction,
  DeleteWalletSuccessAction,
  DeleteWalletFailureAction,
  GenerateWalletRequestAction,
  GenerateWalletSuccessAction,
  GenerateWalletFailureAction,
  FetchTransactionsRequestAction,
  FetchTransactionsSuccessAction,
  FetchTransactionsFailureAction,
  ClearAdminWalletsErrorAction,
} from './types';
import { Wallet, Transaction } from '@/types/wallet';

// Wallet actions
export const fetchWalletsRequest = (): FetchWalletsRequestAction => ({
  type: 'FETCH_WALLETS_REQUEST',
});

export const fetchWalletsSuccess = (wallets: Wallet[]): FetchWalletsSuccessAction => ({
  type: 'FETCH_WALLETS_SUCCESS',
  payload: wallets,
});

export const fetchWalletsFailure = (error: string): FetchWalletsFailureAction => ({
  type: 'FETCH_WALLETS_FAILURE',
  payload: error,
});

// Sync balances actions
export const syncBalancesRequest = (): SyncBalancesRequestAction => ({
  type: 'SYNC_BALANCES_REQUEST',
});

export const syncBalancesSuccess = (message: string): SyncBalancesSuccessAction => ({
  type: 'SYNC_BALANCES_SUCCESS',
  payload: message,
});

export const syncBalancesFailure = (error: string): SyncBalancesFailureAction => ({
  type: 'SYNC_BALANCES_FAILURE',
  payload: error,
});

// Create wallet actions
export const createWalletRequest = (data: any): CreateWalletRequestAction => ({
  type: 'CREATE_WALLET_REQUEST',
  payload: data,
});

export const createWalletSuccess = (wallet: Wallet): CreateWalletSuccessAction => ({
  type: 'CREATE_WALLET_SUCCESS',
  payload: wallet,
});

export const createWalletFailure = (error: string): CreateWalletFailureAction => ({
  type: 'CREATE_WALLET_FAILURE',
  payload: error,
});

// Update wallet actions
export const updateWalletRequest = (id: string, data: any): UpdateWalletRequestAction => ({
  type: 'UPDATE_WALLET_REQUEST',
  payload: { id, data },
});

export const updateWalletSuccess = (wallet: Wallet): UpdateWalletSuccessAction => ({
  type: 'UPDATE_WALLET_SUCCESS',
  payload: wallet,
});

export const updateWalletFailure = (error: string): UpdateWalletFailureAction => ({
  type: 'UPDATE_WALLET_FAILURE',
  payload: error,
});

// Delete wallet actions
export const deleteWalletRequest = (id: string): DeleteWalletRequestAction => ({
  type: 'DELETE_WALLET_REQUEST',
  payload: id,
});

export const deleteWalletSuccess = (id: string): DeleteWalletSuccessAction => ({
  type: 'DELETE_WALLET_SUCCESS',
  payload: id,
});

export const deleteWalletFailure = (error: string): DeleteWalletFailureAction => ({
  type: 'DELETE_WALLET_FAILURE',
  payload: error,
});

// Generate wallet actions
export const generateWalletRequest = (data: any): GenerateWalletRequestAction => ({
  type: 'GENERATE_WALLET_REQUEST',
  payload: data,
});

export const generateWalletSuccess = (wallet: any): GenerateWalletSuccessAction => ({
  type: 'GENERATE_WALLET_SUCCESS',
  payload: wallet,
});

export const generateWalletFailure = (error: string): GenerateWalletFailureAction => ({
  type: 'GENERATE_WALLET_FAILURE',
  payload: error,
});

// Transaction actions
export const fetchTransactionsRequest = (refresh?: boolean): FetchTransactionsRequestAction => ({
  type: 'FETCH_TRANSACTIONS_REQUEST',
  payload: { refresh },
});

export const fetchTransactionsSuccess = (
  transactions: Transaction[],
  refresh?: boolean
): FetchTransactionsSuccessAction => ({
  type: 'FETCH_TRANSACTIONS_SUCCESS',
  payload: { transactions, refresh },
});

export const fetchTransactionsFailure = (error: string): FetchTransactionsFailureAction => ({
  type: 'FETCH_TRANSACTIONS_FAILURE',
  payload: error,
});

// Clear error action
export const clearAdminWalletsError = (): ClearAdminWalletsErrorAction => ({
  type: 'CLEAR_ADMIN_WALLETS_ERROR',
});
