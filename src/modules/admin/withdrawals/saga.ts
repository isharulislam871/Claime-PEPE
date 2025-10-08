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

  const { response, status }: any = yield call(API_CALL, {
    url: `/admin/withdrawals?${queryParams}`,
    method: 'GET'
  });

  console.log(response.data);



  if (status === 200 && response.success && response.data) {
    yield put(fetchWithdrawalsSuccess(
      response.data.withdrawals,
      response.data.pagination,
      response.data.summary
    ));
  } else {
    yield put(fetchWithdrawalsFailure(response.message || 'Failed to fetch withdrawals'));
    toast.error(response.message || 'Failed to fetch withdrawals');
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

  const { response, status }: any = yield call(API_CALL, {
    url: `/admin/withdrawals/${withdrawalId}`,
    method: 'GET'
  });

  if (status === 200 && response.success) {
    yield put(fetchWithdrawalDetailsSuccess(response.withdrawal));
  } else {
    yield put(fetchWithdrawalDetailsFailure(response.message || 'Failed to fetch withdrawal details'));
    toast.error(response.message || 'Failed to fetch withdrawal details');
  }
}

function* updateWithdrawalStatusSaga(action: UpdateWithdrawalStatusRequestAction): Generator<any, void, any> {
  const { withdrawalId, status, transactionId, failureReason, adminNotes } = action.payload;

  const { response, status: responseStatus }: any = yield call(API_CALL, {
    url: '/admin/update_withdrawal',
    method: 'POST',
    body: {
      action: 'update_withdrawal',
      withdrawalId,
      status,
      transactionId: status === 'completed' ? transactionId : undefined,
      failureReason: (status === 'failed' || status === 'cancelled') ? failureReason : undefined,
      adminNotes
    }
  });

  if (responseStatus === 200 && response.success) {
    yield put(updateWithdrawalStatusSuccess(response.withdrawal));
    toast.success('Withdrawal updated successfully');
  } else {
    yield put(updateWithdrawalStatusFailure(response.error || 'Failed to update withdrawal'));
    toast.error(response.error || 'Failed to update withdrawal');
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