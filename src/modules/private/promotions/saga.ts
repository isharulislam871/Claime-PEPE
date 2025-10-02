import { call, put, takeLatest } from 'redux-saga/effects';
import { PromotionsActionTypes } from './types';
import { fetchPromotionsSuccess, fetchPromotionsFailure } from './actions';

interface ApiResponse {
  success: boolean;
  promotions?: any[];
  message?: string;
}

function* fetchPromotionsSaga() {
  try {
    const response: Response = yield call(fetch, '/api/promotions');
    const data: ApiResponse = yield call([response, 'json']);

    if (data.success && data.promotions) {
      yield put(fetchPromotionsSuccess(data.promotions));
    } else {
      yield put(fetchPromotionsFailure(data.message || 'Failed to load promotions'));
    }
  } catch (error) {
    yield put(fetchPromotionsFailure(
      error instanceof Error ? error.message : 'Failed to load promotions'
    ));
  }
}

export function* promotionsSaga() {
  yield takeLatest(PromotionsActionTypes.FETCH_PROMOTIONS_REQUEST, fetchPromotionsSaga);
}
