import { call, put, takeEvery } from 'redux-saga/effects';
import { WITHDRAWALS_FETCH_REQUEST } from './constants';
import { fetchWithdrawalsSuccess, fetchWithdrawalsFailure } from './actions';
 
import { encrypt } from '@/lib/authlib';
import { getCurrentUser } from '@/lib/api';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import { toast } from 'react-toastify';

 

function* fetchWithdrawalsSaga( ): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();
    const hash = encrypt(currentUser.telegramId);

     const{ response , status } : any = yield call(API_CALL, { url : '/withdrawals' , params : { hash }});
    if(status === 200){
        yield put(fetchWithdrawalsSuccess(response?.withdrawals));
        return;
     }
     toast.error(response?.error || 'Failed to fetch withdrawals');
     yield put(fetchWithdrawalsFailure(response?.error || 'Failed to fetch withdrawals'));
  } catch (error: any) {
    yield put(fetchWithdrawalsFailure(error.message || 'Failed to fetch withdrawals'));
  }
}

export function* withdrawalsSaga(): Generator<any, void, any> {
  yield takeEvery(WITHDRAWALS_FETCH_REQUEST, fetchWithdrawalsSaga);
}
