import { RootState } from '../../store';

export const selectAdminWallets = (state: RootState) => state.private.adminWallets.wallets;

export const selectAdminWalletsLoading = (state: RootState) => state.private.adminWallets.loading;

export const selectAdminWalletsError = (state: RootState) => state.private.adminWallets.error;

export const selectAdminTransactions = (state: RootState) => state.private.adminWallets.transactions;

export const selectAdminTransactionsLoading = (state: RootState) => state.private.adminWallets.transactionsLoading;

export const selectAdminTransactionsError = (state: RootState) => state.private.adminWallets.transactionsError;

export const selectSyncingBalances = (state: RootState) => state.private.adminWallets.syncingBalances;
