import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { API_CALL } from 'auth-fingerprint';
import { message } from 'antd';
import {
  FETCH_USERS_REQUEST,
  REFRESH_USERS_REQUEST,
  FetchUsersRequestAction,
  RefreshUsersRequestAction,
} from './types';
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  refreshUsersSuccess,
  refreshUsersFailure,
} from './actions';
import { RootState } from '../../store';

// Helper function to build query parameters
function buildQueryParams(
  page: number,
  limit: number,
  searchText: string,
  statusFilter: string,
  dateRange: [any, any] | null,
  additionalFilters: Record<string, any> = {}
): URLSearchParams {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchText && { username: searchText }),
    ...additionalFilters,
  });

  // Add date range if selected
  if (dateRange && dateRange[0] && dateRange[1]) {
    params.append('startDate', dateRange[0].toISOString());
    params.append('endDate', dateRange[1].toISOString());
  }

  return params;
}

// Fetch Users Saga
function* fetchUsersSaga(action: FetchUsersRequestAction): Generator<any, void, any> {
  try {
    const { page, limit, filters = {} } = action.payload;
    
    // Get current state for filters
    const state: RootState = yield select();
    const {
      searchText,
      statusFilter,
      dateRange,
      currentPage,
      pageSize,
    } = state.admin.users;

    // Use provided values or fall back to state values
    const actualPage = page || currentPage;
    const actualLimit = limit || pageSize;

    // Build query parameters
    const params = buildQueryParams(
      actualPage,
      actualLimit,
      searchText,
      statusFilter,
      dateRange,
      filters
    );

    // Make API call using API_CALL
    const { response }: any = yield call(API_CALL, {
      method: 'GET',
      url: `/admin/users?${params.toString()}`,
    });

    if (response.success && response.data) {
      yield put(
        fetchUsersSuccess(
          response.data.users,
          response.data.pagination,
          response.data.summary
        )
      );
    } else {
      throw new Error(response.error || 'Failed to fetch users');
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    const errorMessage = error.message || 'Failed to load users';
    
    yield put(fetchUsersFailure(errorMessage));
    message.error(errorMessage);
  }
}

// Refresh Users Saga
function* refreshUsersSaga(action: RefreshUsersRequestAction): Generator<any, void, any> {
  try {
    // Get current state for filters
    const state: RootState = yield select();
    const {
      searchText,
      statusFilter,
      dateRange,
      currentPage,
      pageSize,
    } = state.admin.users;

    // Build query parameters
    const params = buildQueryParams(
      currentPage,
      pageSize,
      searchText,
      statusFilter,
      dateRange
    );

    // Make API call using API_CALL
    const { response }: any = yield call(API_CALL, {
      method: 'GET',
      url: `/api/admin/users?${params.toString()}`,
    });

    if (response.success && response.data) {
      yield put(
        refreshUsersSuccess(
          response.data.users,
          response.data.pagination,
          response.data.summary
        )
      );
      message.success('Users data refreshed successfully');
    } else {
      throw new Error(response.error || 'Failed to refresh users');
    }
  } catch (error: any) {
    console.error('Error refreshing users:', error);
    const errorMessage = error.message || 'Failed to refresh users';
    
    yield put(refreshUsersFailure(errorMessage));
    message.error(errorMessage);
  }
}

// Root Saga
export function* adminUsersSaga(): Generator<any, void, any> {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeEvery(REFRESH_USERS_REQUEST, refreshUsersSaga);
}
