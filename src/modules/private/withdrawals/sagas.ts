import { call, put, takeEvery } from 'redux-saga/effects';
import { WITHDRAWALS_FETCH_REQUEST, WITHDRAWAL_CREATE_REQUEST } from './constants';
import { fetchWithdrawalsSuccess, fetchWithdrawalsFailure, createWithdrawalSuccess, createWithdrawalFailure } from './actions';
 
 
import { getCurrentUser } from '@/lib/api';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import { toast } from 'react-toastify';
import { generateSignature } from 'auth-fingerprint';

 

function* fetchWithdrawalsSaga( ): Generator<any, void, any> {
  try {
    const currentUser = getCurrentUser();
     
    const { hash , signature , timestamp  } = generateSignature(JSON.stringify({ telegramId : currentUser?.telegramId }),  process.env.NEXTAUTH_SECRET || 'app')

     const{ response , status } : any = yield call(API_CALL, { url : '/withdrawals' , params : { hash , signature , timestamp }});
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

function* createWithdrawalSaga(action: any): Generator<any, void, any> {
  try {

    const currentUser = getCurrentUser();
    const { hash , signature , timestamp  } = generateSignature(JSON.stringify({ ...action.payload ,  telegramId : currentUser?.telegramId }) , process.env.NEXTAUTH_SECRET || 'app')
    
    const { response, status }: any = yield call(API_CALL, {
      url: '/withdrawals',
      method: 'POST',
      body: { hash , signature , timestamp  }
    });

    if (status === 201) {
      yield put(createWithdrawalSuccess({
        withdrawal: response.withdrawal,
        message: response.message || 'Withdrawal request submitted successfully'
      }));
      toast.success('Withdrawal request submitted successfully!');
      return;
    }

    toast.error(response?.error || 'Withdrawal request failed');
    yield put(createWithdrawalFailure(response?.error || 'Withdrawal request failed'));
  } catch (error: any) {
    toast.error(error.message || 'Withdrawal failed');
    yield put(createWithdrawalFailure(error.message || 'Withdrawal failed'));
  }
}

export function* withdrawalsSaga(): Generator<any, void, any> {
  yield takeEvery(WITHDRAWALS_FETCH_REQUEST, fetchWithdrawalsSaga);
  yield takeEvery(WITHDRAWAL_CREATE_REQUEST, createWithdrawalSaga);
}
