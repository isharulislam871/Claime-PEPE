import { call, put, takeEvery, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { API_CALL } from 'auth-fingerprint';
import {
  FETCH_WITHDRAWALS_REQUEST,
  APPROVE_WITHDRAWAL_REQUEST,
  REJECT_WITHDRAWAL_REQUEST,
  FETCH_WITHDRAWAL_DETAILS_REQUEST,
  UPDATE_WITHDRAWAL_STATUS_REQUEST,
  FetchWithdrawalsRequestAction,
  ApproveWithdrawalRequestAction,
  RejectWithdrawalRequestAction,
  FetchWithdrawalDetailsRequestAction,
  UpdateWithdrawalStatusRequestAction
} from './types';
import {
  fetchWithdrawalsSuccess,
  fetchWithdrawalsFailure,
  approveWithdrawalSuccess,
  approveWithdrawalFailure,
  rejectWithdrawalSuccess,
  rejectWithdrawalFailure,
  fetchWithdrawalDetailsSuccess,
  fetchWithdrawalDetailsFailure,
  updateWithdrawalStatusSuccess,
  updateWithdrawalStatusFailure
} from './actions';

// Saga functions
function* fetchWithdrawalsSaga(action: FetchWithdrawalsRequestAction): Generator<any, void, any> {
  const { page, limit, filters } = action.payload;

  const queryParams = new URLSearchParams({
    page: page?.toString() || '1',
    limit: limit?.toString() || '25',
    ...filters
  });

  try {
    const { response, status }: any = yield call(API_CALL, {
      url: `/admin/withdrawals?${queryParams}`,
      method: 'GET'
    });

    if (status === 200 && response.success && response.data) {
      yield put(fetchWithdrawalsSuccess(
        response.data.withdrawals,
        response.data.pagination,
        response.data.summary
      ));
    } else {
      yield put(fetchWithdrawalsFailure(response.error || 'Failed to fetch withdrawals'));
      toast.error(response.error || 'Failed to fetch withdrawals');
    }
  } catch (error: any) {
    yield put(fetchWithdrawalsFailure(error.message || 'Failed to fetch withdrawals'));
    toast.error(error.message || 'Failed to fetch withdrawals');
  }
}

function* approveWithdrawalSaga(action: ApproveWithdrawalRequestAction): Generator<any, void, any> {
  const { withdrawalId, transactionId } = action.payload;

  const { response, status }: any = yield call(API_CALL, {
    url: `/admin/withdrawals/${withdrawalId}/approve`,
    method: 'POST',
    body: { transactionId }
  });

  if (status === 200) {
    yield put(approveWithdrawalSuccess(response.withdrawal));
    toast.success('Withdrawal approved successfully');
  } else {
    yield put(approveWithdrawalFailure(response.message || 'Failed to approve withdrawal'));
    toast.error(response.message || 'Failed to approve withdrawal');
  }
}

function* rejectWithdrawalSaga(action: RejectWithdrawalRequestAction): Generator<any, void, any> {
  const { withdrawalId, reason } = action.payload;

  const { response, status }: any = yield call(API_CALL, {
    url: `/admin/withdrawals/${withdrawalId}/reject`,
    method: 'POST',
    body: { reason }
  });

  if (status === 200) {
    yield put(rejectWithdrawalSuccess(response.withdrawal));
    toast.success('Withdrawal rejected successfully');
  } else {
    yield put(rejectWithdrawalFailure(response.message || 'Failed to reject withdrawal'));
    toast.error(response.message || 'Failed to reject withdrawal');
  }
}

function* fetchWithdrawalDetailsSaga(action: FetchWithdrawalDetailsRequestAction): Generator<any, void, any> {
  const withdrawalId = action.payload;

  try {
    const { response, status }: any = yield call(API_CALL, {
      url: `/admin/withdrawals/${withdrawalId}`,
      method: 'GET'
    });

    if (status === 200 && response.success) {
      yield put(fetchWithdrawalDetailsSuccess(response.data));
    } else {
      yield put(fetchWithdrawalDetailsFailure(response.error || 'Failed to fetch withdrawal details'));
      toast.error(response.error || 'Failed to fetch withdrawal details');
    }
  } catch (error: any) {
    yield put(fetchWithdrawalDetailsFailure(error.message || 'Failed to fetch withdrawal details'));
    toast.error(error.message || 'Failed to fetch withdrawal details');
  }
}

function* updateWithdrawalStatusSaga(action: UpdateWithdrawalStatusRequestAction): Generator<any, void, any> {
  const { withdrawalId, status, transactionId, failureReason, adminNotes } = action.payload;

  try {
    const { response, status: responseStatus }: any = yield call(API_CALL, {
      url: `/admin/update_withdrawal`,
      method: 'POST',
      body: {
        status,
        transactionId: status === 'completed' ? transactionId : undefined,
        failureReason: (status === 'failed' || status === 'cancelled') ? failureReason : undefined,
        adminNotes,
        withdrawalId
      }
    });

    if (responseStatus === 200 && response.success) {
      yield put(updateWithdrawalStatusSuccess(response.withdrawal));
      toast.success('Withdrawal updated successfully');
      
      // Also refresh the withdrawal details to get the latest data
      yield put({ type: FETCH_WITHDRAWAL_DETAILS_REQUEST, payload: withdrawalId });
      
      // Refresh the withdrawals list to update the main table
      yield put({ type: FETCH_WITHDRAWALS_REQUEST, payload: { page: 1, limit: 25 } });
    } else {
      yield put(updateWithdrawalStatusFailure(response.error || 'Failed to update withdrawal'));
      toast.error(response.error || 'Failed to update withdrawal');
    }
  } catch (error: any) {
    yield put(updateWithdrawalStatusFailure(error.message || 'Failed to update withdrawal'));
    toast.error(error.message || 'Failed to update withdrawal');
  }
}

// Root saga
export function* adminWithdrawalsSaga() {
  yield all([
    takeEvery(FETCH_WITHDRAWALS_REQUEST, fetchWithdrawalsSaga),
    takeEvery(APPROVE_WITHDRAWAL_REQUEST, approveWithdrawalSaga),
    takeEvery(REJECT_WITHDRAWAL_REQUEST, rejectWithdrawalSaga),
    takeEvery(FETCH_WITHDRAWAL_DETAILS_REQUEST, fetchWithdrawalDetailsSaga),
    takeEvery(UPDATE_WITHDRAWAL_STATUS_REQUEST, updateWithdrawalStatusSaga)
  ]);
}