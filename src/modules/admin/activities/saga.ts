import { call, put, takeEvery, Effect } from 'redux-saga/effects';
import { API_CALL } from 'auth-fingerprint';
import {
  FETCH_ACTIVITIES_REQUEST,
  FetchActivitiesRequestAction,
} from './types';
import {
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
} from './actions';

function* fetchActivitiesSaga(action: FetchActivitiesRequestAction): Generator<Effect, void, any> {
  try {
    const { page = 1, limit = 100, filters = {} } = action.payload;
    
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const { response }= yield call(API_CALL, {
      method: 'GET',
      url: `/admin/activities?${params}`,
    });

    if (response.success && response.data) {
      yield put(fetchActivitiesSuccess(
        response.data.activities,
        response.data.pagination,
        response.data.summary
      ));
    } else {
      throw new Error(response.message || 'Failed to fetch activities');
    }
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    yield put(fetchActivitiesFailure(error.message || 'Failed to fetch activities'));
  }
}

export function* adminActivitiesSaga(): Generator<Effect, void, unknown> {
  yield takeEvery(FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga);
}
