import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  CoinActionTypes,
  FetchCoinsRequestAction,
  FetchConversionRatesRequestAction,
} from './coinTypes';
import {
  fetchCoinsSuccess,
  fetchCoinsFailure,
  fetchConversionRatesSuccess,
  fetchConversionRatesFailure,
} from './coinActions';

function* fetchCoinsSaga(action: FetchCoinsRequestAction): Generator {
  try {
    const response: Response = (yield call(fetch, '/api/coins')) as any;
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    const data: any = (yield call([response, 'json'])) as any;
    
    if (data.success) {
      yield put(fetchCoinsSuccess(data.coins || []));
    } else {
      throw new Error(data.error || 'Failed to fetch coins');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(fetchCoinsFailure(error.message));
    } else {
      toast.error('Failed to fetch coins');
      yield put(fetchCoinsFailure('Failed to fetch coins'));
    }
  }
}

function* fetchConversionRatesSaga(action: FetchConversionRatesRequestAction): Generator {
  try {
    const response: Response = (yield call(fetch, '/api/conversion-rates')) as any;
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversion rates');
    }
    
    const data: any = (yield call([response, 'json'])) as any;
    
    if (data.success) {
      yield put(
        fetchConversionRatesSuccess(
          data.pepeConversionRates || {},
          data.usdRates || {}
        )
      );
    } else {
      throw new Error(data.error || 'Failed to fetch conversion rates');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(fetchConversionRatesFailure(error.message));
    } else {
      toast.error('Failed to fetch conversion rates');
      yield put(fetchConversionRatesFailure('Failed to fetch conversion rates'));
    }
  }
}

export function* coinSaga() {
  yield takeLatest(CoinActionTypes.FETCH_COINS_REQUEST, fetchCoinsSaga);
  yield takeLatest(CoinActionTypes.FETCH_CONVERSION_RATES_REQUEST, fetchConversionRatesSaga);
}
