import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { FetchWalletRequest, FetchWalletResponse } from './types';
import {
  FETCH_WALLET_REQUEST,
  REFRESH_WALLET,
  fetchWalletSuccess,
  fetchWalletFailure,
  RefreshWalletAction,
  FetchWalletRequestAction
} from './actions';

import { generateSignature , API_CALL , APIResponse } from 'auth-fingerprint';
import { getCurrentUser } from '@/lib/api';
 
 

// Saga worker function
function* fetchWalletSaga() {
  try {
    
    
    const currentUser = getCurrentUser();
    const { hash, signature, timestamp } = generateSignature(
      JSON.stringify({ telegramId : currentUser?.telegramId }),
      process.env.NEXTAUTH_SECRET || 'app'
    );

    const { response, status }: APIResponse =  yield call(API_CALL ,{
      url: '/user/wallet',
      method: 'GET',
      params: { hash, signature, timestamp }
    });
  
    if (response.success && response.data) {
      // Dispatch success action with wallet data
      yield put(fetchWalletSuccess(response.data));
    } else {
      // Handle API error response
      const errorMessage = response.message || 'Failed to fetch wallet data';
      yield put(fetchWalletFailure(errorMessage));
    }
  } catch (error) {
    // Handle network or other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchWalletFailure(errorMessage));
  }
}

 

// Root wallet saga
export function* walletSaga() {
  yield takeLatest(FETCH_WALLET_REQUEST, fetchWalletSaga);
   
}
