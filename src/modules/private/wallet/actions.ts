import { FetchWalletRequest, FetchWalletResponse } from './types';

// Action types
export const FETCH_WALLET_REQUEST = 'wallet/fetchWalletRequest';
export const FETCH_WALLET_SUCCESS = 'wallet/fetchWalletSuccess';
export const FETCH_WALLET_FAILURE = 'wallet/fetchWalletFailure';
export const CLEAR_WALLET_DATA = 'wallet/clearWalletData';
export const REFRESH_WALLET = 'wallet/refreshWallet';

// Action interfaces
export interface FetchWalletRequestAction {
  type: typeof FETCH_WALLET_REQUEST;
  payload: FetchWalletRequest;
  [key: string]: any;
}

export interface FetchWalletSuccessAction {
  type: typeof FETCH_WALLET_SUCCESS;
  payload: FetchWalletResponse['data'];
  [key: string]: any;
}

export interface FetchWalletFailureAction {
  type: typeof FETCH_WALLET_FAILURE;
  payload: string;
  [key: string]: any;
}

export interface ClearWalletDataAction {
  type: typeof CLEAR_WALLET_DATA;
  [key: string]: any;
}

export interface RefreshWalletAction {
  type: typeof REFRESH_WALLET;
  payload: FetchWalletRequest;
  [key: string]: any;
}

// Union type for all wallet actions
export type WalletActionTypes = 
  | FetchWalletRequestAction
  | FetchWalletSuccessAction
  | FetchWalletFailureAction
  | ClearWalletDataAction
  | RefreshWalletAction;

// Action creators
export const fetchWalletRequest = (payload: FetchWalletRequest): FetchWalletRequestAction => ({
  type: FETCH_WALLET_REQUEST,
  payload,
});

export const fetchWalletSuccess = (payload: FetchWalletResponse['data']): FetchWalletSuccessAction => ({
  type: FETCH_WALLET_SUCCESS,
  payload,
});

export const fetchWalletFailure = (payload: string): FetchWalletFailureAction => ({
  type: FETCH_WALLET_FAILURE,
  payload,
});

export const clearWalletData = (): ClearWalletDataAction => ({
  type: CLEAR_WALLET_DATA,
});

export const refreshWallet = (payload: FetchWalletRequest): RefreshWalletAction => ({
  type: REFRESH_WALLET,
  payload,
});
