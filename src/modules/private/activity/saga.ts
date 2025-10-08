import { call, put, takeEvery } from 'redux-saga/effects';
import { 
  ActivityActionTypes,
  FetchActivitiesRequestAction,
  Activity,
  ActivityPagination,
  ActivityStats
} from './types';
import {
  fetchActivitiesSuccess,
  fetchActivitiesFailure
} from './actions';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import { getCurrentUser } from '@/lib/api';

// Saga workers
function* fetchActivitiesSaga(action: FetchActivitiesRequestAction) {
  try {
    const filters = action.payload;
    const currentUser = getCurrentUser();
    // Build params object for API_CALL
    const params: any = {
      telegramId: currentUser?.telegramId
    };

     
    // Add optional filters
    if (filters.type) params.type = filters.type;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const { response, status }: TypeApiPromise = yield call(API_CALL, {
      url: '/user/activity',
      method: 'GET',
      params
    });

    
    
    if (status === 200 && response) {
      const result = {
        activities: response.activities || response.result?.result?.activities || [],
        pagination: response.result?.result?.pagination || { currentPage: 1, totalPages: 1, totalCount: 0, hasNextPage: false },
        stats: response.stats || response.result?.result?.stats || {}
      };
      
      yield put(fetchActivitiesSuccess(result));
    } else {
      throw new Error(response?.error || response?.message?.error || 'Failed to fetch activities');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchActivitiesFailure(errorMessage));
  }
}

// Watcher saga
export function* activitySaga() {
  yield takeEvery(ActivityActionTypes.FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga);
}
