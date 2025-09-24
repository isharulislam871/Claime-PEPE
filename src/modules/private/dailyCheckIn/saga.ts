import { call, put, takeEvery, select } from 'redux-saga/effects';
import { DailyCheckInActionTypes } from './types';
import { API_CALL , generateSignature  } from 'auth-fingerprint';
 
import {
  fetchCheckInDataSuccess,
  fetchCheckInDataFailure,
  performCheckInSuccess,
  performCheckInFailure
} from './actions';
import { getCurrentUser } from '@/lib/api';

 
const performCheckInAPI = async () => {
  const response = await fetch('/api/dailyCheckIn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to perform check-in');
  }

  return response.json();
};

// Saga workers
function* fetchCheckInDataSaga(): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();
    const hash = generateSignature(JSON.stringify({ userId : currentUser?.telegramId }), process.env.NEXTAUTH_SECRET || '')
    const  { response , status }= yield  call(API_CALL, { url : '/dailyCheckIn' , method : 'GET'  })
    if(status === 200){
      yield put(fetchCheckInDataSuccess(response.data));
      return;
    }
    yield put(fetchCheckInDataFailure(response.erorr));
  } catch (error) {
    yield put(fetchCheckInDataFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* performCheckInSaga(): Generator<any, void, any> {
  try {
    const result = yield call(performCheckInAPI);
    yield put(performCheckInSuccess(result));
  } catch (error) {
    yield put(performCheckInFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Root saga
export function* dailyCheckInSaga() {
  yield takeEvery(DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_REQUEST, fetchCheckInDataSaga);
  yield takeEvery(DailyCheckInActionTypes.PERFORM_CHECK_IN_REQUEST, performCheckInSaga);
}
