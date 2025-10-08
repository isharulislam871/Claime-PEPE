import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { WalletState } from './types';

// Base selector
const selectWalletState = (state: RootState) => state.private.wallet;

// Wallet loading state
export const selectWalletLoading = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.loading
);

// Wallet error state
export const selectWalletError = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.error
);

// User data
export const selectUser = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.user
);

// All wallets
export const selectWallets = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.wallets
);

// Specific wallet by currency
export const selectWalletByCurrency = (currency: string) => createSelector(
  [selectWallets],
  (wallets) => wallets.find(wallet => wallet.currency === currency)
);

// Total balance
export const selectTotalBalance = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.totalBalance
);

// Recent transactions
export const selectRecentTransactions = createSelector(
  [selectWalletState],
  (wallet: WalletState) => wallet.recentTransactions
);

// Points wallet specifically
export const selectPointsWallet = createSelector(
  [selectWallets],
  (wallets) => wallets.find(wallet => wallet.currency === 'POINTS')
);

// Wallet currencies list
export const selectWalletCurrencies = createSelector(
  [selectWallets],
  (wallets) => wallets.map(wallet => wallet.currency)
);

// Total available balance across all wallets
export const selectTotalAvailableBalance = createSelector(
  [selectWallets],
  (wallets) => wallets.reduce((total: number, wallet) => total + wallet.balance, 0)
);

// Check if wallet data is loaded
export const selectIsWalletDataLoaded = createSelector(
  [selectWalletState],
  (wallet: WalletState) => !wallet.loading && wallet.user !== null
);
