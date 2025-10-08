import { Wallet, Transaction } from '@/types/wallet';

export interface AdminWalletsState {
  wallets: Wallet[];
  transactions: Transaction[];
  loading: boolean;
  transactionsLoading: boolean;
  syncingBalances: boolean;
  error: string | null;
  transactionsError: string | null;
}

export interface FetchWalletsRequestAction {
  type: 'FETCH_WALLETS_REQUEST';
}

export interface FetchWalletsSuccessAction {
  type: 'FETCH_WALLETS_SUCCESS';
  payload: Wallet[];
}

export interface FetchWalletsFailureAction {
  type: 'FETCH_WALLETS_FAILURE';
  payload: string;
}

export interface SyncBalancesRequestAction {
  type: 'SYNC_BALANCES_REQUEST';
}

export interface SyncBalancesSuccessAction {
  type: 'SYNC_BALANCES_SUCCESS';
  payload: string;
}

export interface SyncBalancesFailureAction {
  type: 'SYNC_BALANCES_FAILURE';
  payload: string;
}

export interface CreateWalletRequestAction {
  type: 'CREATE_WALLET_REQUEST';
  payload: any;
}

export interface CreateWalletSuccessAction {
  type: 'CREATE_WALLET_SUCCESS';
  payload: Wallet;
}

export interface CreateWalletFailureAction {
  type: 'CREATE_WALLET_FAILURE';
  payload: string;
}

export interface UpdateWalletRequestAction {
  type: 'UPDATE_WALLET_REQUEST';
  payload: { id: string; data: any };
}

export interface UpdateWalletSuccessAction {
  type: 'UPDATE_WALLET_SUCCESS';
  payload: Wallet;
}

export interface UpdateWalletFailureAction {
  type: 'UPDATE_WALLET_FAILURE';
  payload: string;
}

export interface DeleteWalletRequestAction {
  type: 'DELETE_WALLET_REQUEST';
  payload: string;
}

export interface DeleteWalletSuccessAction {
  type: 'DELETE_WALLET_SUCCESS';
  payload: string;
}

export interface DeleteWalletFailureAction {
  type: 'DELETE_WALLET_FAILURE';
  payload: string;
}

export interface GenerateWalletRequestAction {
  type: 'GENERATE_WALLET_REQUEST';
  payload: any;
}

export interface GenerateWalletSuccessAction {
  type: 'GENERATE_WALLET_SUCCESS';
  payload: any;
}

export interface GenerateWalletFailureAction {
  type: 'GENERATE_WALLET_FAILURE';
  payload: string;
}

export interface FetchTransactionsRequestAction {
  type: 'FETCH_TRANSACTIONS_REQUEST';
  payload?: { refresh?: boolean };
}

export interface FetchTransactionsSuccessAction {
  type: 'FETCH_TRANSACTIONS_SUCCESS';
  payload: { transactions: Transaction[]; refresh?: boolean };
}

export interface FetchTransactionsFailureAction {
  type: 'FETCH_TRANSACTIONS_FAILURE';
  payload: string;
}

export interface ClearAdminWalletsErrorAction {
  type: 'CLEAR_ADMIN_WALLETS_ERROR';
}

export type AdminWalletsAction =
  | FetchWalletsRequestAction
  | FetchWalletsSuccessAction
  | FetchWalletsFailureAction
  | SyncBalancesRequestAction
  | SyncBalancesSuccessAction
  | SyncBalancesFailureAction
  | CreateWalletRequestAction
  | CreateWalletSuccessAction
  | CreateWalletFailureAction
  | UpdateWalletRequestAction
  | UpdateWalletSuccessAction
  | UpdateWalletFailureAction
  | DeleteWalletRequestAction
  | DeleteWalletSuccessAction
  | DeleteWalletFailureAction
  | GenerateWalletRequestAction
  | GenerateWalletSuccessAction
  | GenerateWalletFailureAction
  | FetchTransactionsRequestAction
  | FetchTransactionsSuccessAction
  | FetchTransactionsFailureAction
  | ClearAdminWalletsErrorAction;
