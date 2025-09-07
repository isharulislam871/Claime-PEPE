import { createAction } from '@reduxjs/toolkit';
import { FetchWalletRequest, FetchWalletResponse } from './types';

// Fetch wallet actions
export const fetchWalletRequest = createAction<FetchWalletRequest>('wallet/fetchWalletRequest');
export const fetchWalletSuccess = createAction<FetchWalletResponse['data']>('wallet/fetchWalletSuccess');
export const fetchWalletFailure = createAction<string>('wallet/fetchWalletFailure');

// Clear wallet data
export const clearWalletData = createAction('wallet/clearWalletData');

// Refresh wallet data
export const refreshWallet = createAction<FetchWalletRequest>('wallet/refreshWallet');
