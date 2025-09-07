import { createReducer } from '@reduxjs/toolkit';
import { WalletState } from './types';
import {
  fetchWalletRequest,
  fetchWalletSuccess,
  fetchWalletFailure,
  clearWalletData,
  refreshWallet
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

export const walletReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchWalletRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(refreshWallet, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchWalletSuccess, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload) {
        state.user = action.payload.user;
        state.wallets = action.payload.wallets;
        state.totalBalance = action.payload.totalBalance;
        state.recentTransactions = action.payload.recentTransactions;
      }
    })
    .addCase(fetchWalletFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(clearWalletData, (state) => {
      return initialState;
    });
});
