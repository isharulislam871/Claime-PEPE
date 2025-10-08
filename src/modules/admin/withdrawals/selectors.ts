import { RootState } from '@/modules/store';

// Base selector
const selectAdminWithdrawalsState = (state: RootState) => state.admin?.withdrawals;

// Basic selectors
export const selectWithdrawals = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.withdrawals : [];
};

export const selectWithdrawalsLoading = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.loading : false;
};

export const selectWithdrawalsError = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.error : null;
};

export const selectWithdrawalsPagination = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.pagination : null;
};

export const selectWithdrawalsSummary = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.summary : null;
};

export const selectWithdrawalsFilters = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.filters : {};
};

export const selectSelectedWithdrawal = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.selectedWithdrawal : null;
};

// Computed selectors
export const selectStatusStats = (state: RootState) => {
  const summary = selectWithdrawalsSummary(state);
  const stats: { [key: string]: number } = {};
  
  if (summary && summary.statusBreakdown) {
    summary.statusBreakdown.forEach((item: { _id: string; count: number }) => {
      stats[item._id] = item.count;
    });
  }
  
  return stats;
};

export const selectTotalCount = (state: RootState) => {
  const pagination = selectWithdrawalsPagination(state);
  return pagination ? pagination.totalCount : 0;
};

export const selectCurrentPage = (state: RootState) => {
  const pagination = selectWithdrawalsPagination(state);
  return pagination ? pagination.currentPage : 1;
};

export const selectPageSize = (state: RootState) => {
  const pagination = selectWithdrawalsPagination(state);
  return pagination ? pagination.pageSize : 25;
};

export const selectTotalCompletedAmount = (state: RootState) => {
  const summary = selectWithdrawalsSummary(state);
  return summary ? summary.totalCompletedAmount : 0;
};

export const selectPendingWithdrawals = (state: RootState) => {
  const withdrawals = selectWithdrawals(state);
  return withdrawals ? withdrawals.filter((w: any) => w.status === 'pending') : [];
};

export const selectProcessingWithdrawals = (state: RootState) => {
  const withdrawals = selectWithdrawals(state);
  return withdrawals ? withdrawals.filter((w: any) => w.status === 'processing') : [];
};

export const selectCompletedWithdrawals = (state: RootState) => {
  const withdrawals = selectWithdrawals(state);
  return withdrawals ? withdrawals.filter((w: any) => w.status === 'completed') : [];
};

// UI State selectors
export const selectSearchText = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.searchText : '';
};

export const selectStatusFilter = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.statusFilter : 'all';
};

export const selectDateRange = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.dateRange : null;
};

// Computed selectors for filtered data
export const selectFilteredWithdrawals = (state: RootState) => {
  const withdrawals = selectWithdrawals(state);
  const searchText = selectSearchText(state);
  const statusFilter = selectStatusFilter(state);
  const dateRange = selectDateRange(state);
  
  if (!withdrawals) return [];
  
  return withdrawals.filter((withdrawal: any) => {
    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      if (
        !withdrawal.username.toLowerCase().includes(searchLower) &&
        !withdrawal.telegramId.toString().includes(searchLower) &&
        !withdrawal.walletId.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    // Status filter
    if (statusFilter !== 'all' && withdrawal.status !== statusFilter) {
      return false;
    }
    
    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const withdrawalDate = new Date(withdrawal.createdAt);
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      if (withdrawalDate < startDate || withdrawalDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};

// Individual withdrawal selectors
export const selectCurrentWithdrawal = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.currentWithdrawal : null;
};

export const selectCurrentWithdrawalLoading = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.currentWithdrawalLoading : false;
};

export const selectCurrentWithdrawalError = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.currentWithdrawalError : null;
};

export const selectUpdateModalVisible = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.updateModalVisible : false;
};

export const selectConfirmModalVisible = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.confirmModalVisible : false;
};

export const selectUpdating = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.updating : false;
};

export const selectNewStatus = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.newStatus : '';
};

export const selectTransactionId = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.transactionId : '';
};

export const selectFailureReason = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.failureReason : '';
};

export const selectAdminNotes = (state: RootState) => {
  const adminState = selectAdminWithdrawalsState(state);
  return adminState ? adminState.adminNotes : '';
};

// Computed selectors for individual withdrawal
export const selectCanUpdateStatus = (state: RootState) => {
  const newStatus = selectNewStatus(state);
  const transactionId = selectTransactionId(state);
  const failureReason = selectFailureReason(state);
  
  if (newStatus === 'completed' && !transactionId.trim()) {
    return false;
  }
  
  if ((newStatus === 'failed' || newStatus === 'cancelled') && !failureReason.trim()) {
    return false;
  }
  
  return true;
};

export const selectUpdateSummary = (state: RootState) => {
  const currentWithdrawal = selectCurrentWithdrawal(state);
  const newStatus = selectNewStatus(state);
  const transactionId = selectTransactionId(state);
  const failureReason = selectFailureReason(state);
  
  return {
    currentStatus: currentWithdrawal?.status || '',
    newStatus,
    transactionId,
    failureReason
  };
};
