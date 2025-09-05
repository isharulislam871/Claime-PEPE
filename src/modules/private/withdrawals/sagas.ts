import { call, put, takeEvery } from 'redux-saga/effects';
import { WITHDRAWALS_FETCH_REQUEST } from './constants';
import { fetchWithdrawalsSuccess, fetchWithdrawalsFailure } from './actions';
import { FetchWithdrawalsPayload } from './types';

// Mock API call - replace with actual API endpoint
const fetchWithdrawalsAPI = async (telegramId: string) => {
  // Replace this with your actual API call
  const response = await fetch(`/api/withdrawals/${telegramId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch withdrawals');
  }
  return response.json();
};

function* fetchWithdrawalsSaga(action: { type: string; payload: FetchWithdrawalsPayload }): Generator<any, void, any> {
  try {
    const { telegramId } = action.payload;
    const withdrawals = yield call(fetchWithdrawalsAPI, telegramId);
    yield put(fetchWithdrawalsSuccess(withdrawals));
  } catch (error: any) {
    yield put(fetchWithdrawalsFailure(error.message || 'Failed to fetch withdrawals'));
  }
}

export function* withdrawalsSaga(): Generator<any, void, any> {
  yield takeEvery(WITHDRAWALS_FETCH_REQUEST, fetchWithdrawalsSaga);
}
