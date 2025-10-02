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

// Saga workers
function* fetchCheckInDataSaga(): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();
    const { hash , timestamp , signature } = generateSignature(JSON.stringify({ userId : currentUser?.telegramId }), process.env.NEXTAUTH_SECRET || 'app')
    const  { response , status }= yield  call(API_CALL, { url : '/dailyCheckIn' , method : 'GET' , params : { hash , signature , timestamp } })
    if(status === 200){
      yield put(fetchCheckInDataSuccess(response));
      return;
    }
    yield put(fetchCheckInDataFailure(response.error || 'Failed to fetch check-in data'));
  } catch (error) {
    yield put(fetchCheckInDataFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

function* performCheckInSaga(): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();
    const { hash , timestamp , signature } = generateSignature(JSON.stringify({ userId : currentUser?.telegramId }), process.env.NEXTAUTH_SECRET || 'app')
    const  { response , status }= yield  call(API_CALL, { url : '/dailyCheckIn' , method : 'POST' , body : { hash , signature , timestamp }  })
    if(status === 200){
      yield put(performCheckInSuccess(response));
      return;
    }
    yield put(performCheckInFailure(response.error || 'Failed to perform check-in'));
  } catch (error) {
    yield put(performCheckInFailure(error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Root saga
export function* dailyCheckInSaga() {
  yield takeEvery(DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_REQUEST, fetchCheckInDataSaga);
  yield takeEvery(DailyCheckInActionTypes.PERFORM_CHECK_IN_REQUEST, performCheckInSaga);
}
