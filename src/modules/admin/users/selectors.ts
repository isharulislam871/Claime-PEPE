import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { AdminUsersState, User } from './types';

// Base selector
const selectAdminUsersState = (state: RootState): AdminUsersState => state.admin.users;

// Data selectors
export const selectUsers = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.users
);

export const selectTotalCount = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.totalCount
);

export const selectPagination = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.pagination
);

export const selectStatusStats = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.statusStats
);

export const selectTotalStats = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.totalStats
);

export const selectUserSegments = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.userSegments
);

// UI state selectors
export const selectSearchText = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.searchText
);

export const selectStatusFilter = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.statusFilter
);

export const selectDateRange = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.dateRange
);

export const selectCurrentPage = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.currentPage
);

export const selectPageSize = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.pageSize
);

// Loading state selectors
export const selectUsersLoading = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.loading
);

export const selectUsersRefreshing = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.refreshing
);

export const selectUsersError = createSelector(
  [selectAdminUsersState],
  (usersState) => usersState.error
);

// Computed selectors
export const selectHasActiveFilters = createSelector(
  [selectSearchText, selectStatusFilter, selectDateRange],
  (searchText, statusFilter, dateRange) => {
    return (
      searchText.length > 0 ||
      statusFilter !== 'all' ||
      (dateRange !== null && dateRange[0] && dateRange[1])
    );
  }
);

export const selectCurrentFilters = createSelector(
  [selectSearchText, selectStatusFilter, selectDateRange],
  (searchText, statusFilter, dateRange) => ({
    searchText,
    statusFilter,
    dateRange,
  })
);

export const selectFilteredUsers = createSelector(
  [selectUsers],
  (users) => users // Server-side filtering, so return users as-is
);

export const selectStatusStatsForDisplay = createSelector(
  [selectStatusStats],
  (statusStats) => {
    return Object.entries(statusStats).map(([status, count]) => ({
      status,
      count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    }));
  }
);

export const selectUsersByStatus = createSelector(
  [selectUsers],
  (users) => {
    return users.reduce((acc: Record<string, User[]>, user) => {
      if (!acc[user.status]) {
        acc[user.status] = [];
      }
      acc[user.status].push(user);
      return acc;
    }, {});
  }
);

export const selectHighValueUsers = createSelector(
  [selectUsers],
  (users) => {
    return users.filter(user => user.totalEarned > 100000);
  }
);

export const selectNewUsers = createSelector(
  [selectUsers],
  (users) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return users.filter(user => 
      new Date(user.createdAt) > thirtyDaysAgo
    );
  }
);

export const selectTopReferrers = createSelector(
  [selectUsers],
  (users) => {
    return [...users]
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 10);
  }
);

export const selectTopEarners = createSelector(
  [selectUsers],
  (users) => {
    return [...users]
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, 10);
  }
);

// Pagination helpers
export const selectCanGoToNextPage = createSelector(
  [selectPagination],
  (pagination) => pagination.hasNextPage
);

export const selectCanGoToPrevPage = createSelector(
  [selectPagination],
  (pagination) => pagination.hasPrevPage
);

export const selectPaginationInfo = createSelector(
  [selectPagination, selectUsers],
  (pagination, users) => ({
    current: pagination.currentPage,
    total: pagination.totalCount,
    pageSize: users.length,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} users`,
  })
);
