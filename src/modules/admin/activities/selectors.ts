import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { AdminActivitiesState } from './types';

// Base selector
const selectAdminActivitiesState = (state: RootState): AdminActivitiesState =>
  state.admin.activities;

// Basic selectors
export const selectActivities = createSelector(
  [selectAdminActivitiesState],
  (state) => state.activities
);

export const selectActivitiesLoading = createSelector(
  [selectAdminActivitiesState],
  (state) => state.loading
);

export const selectActivitiesError = createSelector(
  [selectAdminActivitiesState],
  (state) => state.error
);

export const selectActivitiesPagination = createSelector(
  [selectAdminActivitiesState],
  (state) => state.pagination
);

export const selectActivitiesSummary = createSelector(
  [selectAdminActivitiesState],
  (state) => state.summary
);

export const selectActivityFilters = createSelector(
  [selectAdminActivitiesState],
  (state) => state.filters
);

// UI State selectors
export const selectSearchText = createSelector(
  [selectAdminActivitiesState],
  (state) => state.searchText
);

export const selectTypeFilter = createSelector(
  [selectAdminActivitiesState],
  (state) => state.typeFilter
);

export const selectDateRange = createSelector(
  [selectAdminActivitiesState],
  (state) => state.dateRange
);

// Computed selectors
export const selectTypeStatsForDisplay = createSelector(
  [selectActivitiesSummary],
  (summary) => {
    return summary.typeBreakdown.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }
);

export const selectHasActiveFilters = createSelector(
  [selectSearchText, selectTypeFilter, selectDateRange],
  (searchText, typeFilter, dateRange) => {
    return searchText !== '' || typeFilter !== 'all' || dateRange !== null;
  }
);

export const selectCurrentFilters = createSelector(
  [selectSearchText, selectTypeFilter, selectDateRange],
  (searchText, typeFilter, dateRange) => {
    const filters: any = {};
    
    if (typeFilter !== 'all') {
      filters.type = typeFilter;
    }
    
    if (searchText) {
      filters.username = searchText;
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      filters.startDate = dateRange[0];
      filters.endDate = dateRange[1];
    }
    
    return filters;
  }
);
