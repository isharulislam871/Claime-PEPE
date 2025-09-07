import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { FetchWalletRequest, FetchWalletResponse } from './types';
import {
  fetchWalletRequest,
  fetchWalletSuccess,
  fetchWalletFailure,
  refreshWallet
} from './actions';

// API call function
async function fetchWalletApi(userId: string): Promise<FetchWalletResponse> {
  try {
    const response = await fetch(`/api/user/wallet?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FetchWalletResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Wallet API call failed:', error);
    throw error;
  }
}

// Saga worker function
function* fetchWalletSaga(action: PayloadAction<FetchWalletRequest>) {
  try {
    const { userId } = action.payload;
    
    // Call the API
    const response: FetchWalletResponse = yield call(fetchWalletApi, userId);
    
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

// Refresh wallet saga (same as fetch but triggered by refresh action)
function* refreshWalletSaga(action: PayloadAction<FetchWalletRequest>) {
  yield* fetchWalletSaga(action);
}

// Root wallet saga
export function* walletSaga() {
  yield takeLatest(fetchWalletRequest.type, fetchWalletSaga);
  yield takeLatest(refreshWallet.type, refreshWalletSaga);
}
