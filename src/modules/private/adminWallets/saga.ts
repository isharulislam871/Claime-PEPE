import { call, put, takeEvery, Effect } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  fetchWalletsSuccess,
  fetchWalletsFailure,
  syncBalancesSuccess,
  syncBalancesFailure,
  createWalletSuccess,
  createWalletFailure,
  updateWalletSuccess,
  updateWalletFailure,
  deleteWalletSuccess,
  deleteWalletFailure,
  generateWalletSuccess,
  generateWalletFailure,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchWalletsRequest,
} from './actions';
import {
  FetchWalletsRequestAction,
  SyncBalancesRequestAction,
  CreateWalletRequestAction,
  UpdateWalletRequestAction,
  DeleteWalletRequestAction,
  GenerateWalletRequestAction,
  FetchTransactionsRequestAction,
} from './types';

// API calls
function* fetchWalletsApi(): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, '/api/admin/wallets');
  if (!response.ok) {
    throw new Error('Failed to fetch wallets');
  }
  const data: any = yield call([response, 'json']);
  return data.wallets || [];
}

function* syncBalancesApi(): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, '/api/admin/wallets/sync-balances');
  if (!response.ok) {
    throw new Error('Failed to sync balances');
  }
  const data: any = yield call([response, 'json']);
  return data.message;
}

function* createWalletApi(walletData: any): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, '/api/admin/wallets', {
    method: 'POST',
    body: JSON.stringify(walletData),
  });
  if (!response.ok) {
    const errorData: any = yield call([response, 'json']);
    throw new Error(errorData.error || 'Failed to create wallet');
  }
  const data: any = yield call([response, 'json']);
  return data.wallet;
}

function* updateWalletApi(id: string, walletData: any): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, `/api/admin/wallets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(walletData),
  });
  if (!response.ok) {
    const errorData: any = yield call([response, 'json']);
    throw new Error(errorData.error || 'Failed to update wallet');
  }
  const data: any = yield call([response, 'json']);
  return data.wallet;
}

function* deleteWalletApi(id: string): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, `/api/admin/wallets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData: any = yield call([response, 'json']);
    throw new Error(errorData.error || 'Failed to delete wallet');
  }
  return id;
}

function* generateWalletApi(walletData: any): Generator<Effect, any, any> {
  const response: Response = yield call(fetch, '/api/admin/wallets/generate', {
    method: 'POST',
    body: JSON.stringify(walletData),
  });
  if (!response.ok) {
    const errorData: any = yield call([response, 'json']);
    throw new Error(errorData.error || 'Failed to generate wallet');
  }
  const data: any = yield call([response, 'json']);
  return data.wallet;
}

function* fetchTransactionsApi(refresh?: boolean): Generator<Effect, any, any> {
  const url = refresh 
    ? '/api/admin/wallets/transactions?refresh=true' 
    : '/api/admin/wallets/transactions';
  
  const response: Response = yield call(fetch, url);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const data: any = yield call([response, 'json']);
  return data.transactions || [];
}

// Saga workers
function* fetchWalletsSaga(action: FetchWalletsRequestAction): Generator<Effect, void, any> {
  try {
    const wallets = yield call(fetchWalletsApi);
    yield put(fetchWalletsSuccess(wallets));
  } catch (error: any) {
    yield put(fetchWalletsFailure(error.message));
    toast.error('Failed to fetch wallets');
  }
}

function* syncBalancesSaga(action: SyncBalancesRequestAction): Generator<Effect, void, any> {
  try {
    const message = yield call(syncBalancesApi);
    yield put(syncBalancesSuccess(message));
    toast.success(message);
    // Refresh wallets after sync
    yield put(fetchWalletsRequest());
  } catch (error: any) {
    yield put(syncBalancesFailure(error.message));
    toast.error('Failed to sync balances');
  }
}

function* createWalletSaga(action: CreateWalletRequestAction): Generator<Effect, void, any> {
  try {
    const wallet = yield call(createWalletApi, action.payload);
    yield put(createWalletSuccess(wallet));
    toast.success('Wallet created successfully');
  } catch (error: any) {
    yield put(createWalletFailure(error.message));
    toast.error(error.message || 'Failed to create wallet');
  }
}

function* updateWalletSaga(action: UpdateWalletRequestAction): Generator<Effect, void, any> {
  try {
    const wallet = yield call(updateWalletApi, action.payload.id, action.payload.data);
    yield put(updateWalletSuccess(wallet));
    toast.success('Wallet updated successfully');
  } catch (error: any) {
    yield put(updateWalletFailure(error.message));
    toast.error(error.message || 'Failed to update wallet');
  }
}

function* deleteWalletSaga(action: DeleteWalletRequestAction): Generator<Effect, void, any> {
  try {
    const id = yield call(deleteWalletApi, action.payload);
    yield put(deleteWalletSuccess(id));
    toast.success('Wallet deleted successfully');
  } catch (error: any) {
    yield put(deleteWalletFailure(error.message));
    toast.error(error.message || 'Failed to delete wallet');
  }
}

function* generateWalletSaga(action: GenerateWalletRequestAction): Generator<Effect, void, any> {
  try {
    const wallet = yield call(generateWalletApi, action.payload);
    yield put(generateWalletSuccess(wallet));
    toast.success('Wallet generated successfully!');
  } catch (error: any) {
    yield put(generateWalletFailure(error.message));
    toast.error(error.message || 'Failed to generate wallet');
  }
}

function* fetchTransactionsSaga(action: FetchTransactionsRequestAction): Generator<Effect, void, any> {
  try {
    const refresh = action.payload?.refresh;
    const transactions = yield call(fetchTransactionsApi, refresh);
    yield put(fetchTransactionsSuccess(transactions, refresh));
    
    if (refresh) {
      toast.success('Transactions refreshed from blockchain');
    }
  } catch (error: any) {
    yield put(fetchTransactionsFailure(error.message));
    toast.error('Failed to fetch transactions');
  }
}

// Watcher saga
export function* adminWalletsSaga(): Generator<Effect, void, unknown> {
  yield takeEvery('FETCH_WALLETS_REQUEST', fetchWalletsSaga);
  yield takeEvery('SYNC_BALANCES_REQUEST', syncBalancesSaga);
  yield takeEvery('CREATE_WALLET_REQUEST', createWalletSaga);
  yield takeEvery('UPDATE_WALLET_REQUEST', updateWalletSaga);
  yield takeEvery('DELETE_WALLET_REQUEST', deleteWalletSaga);
  yield takeEvery('GENERATE_WALLET_REQUEST', generateWalletSaga);
  yield takeEvery('FETCH_TRANSACTIONS_REQUEST', fetchTransactionsSaga);
}
