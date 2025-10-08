import { call, put, takeEvery, Effect } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { API_CALL, generateSignature } from 'auth-fingerprint';
import {
  SwapActionTypes,
  SwapRequestAction,
  FetchSwapOptionsRequestAction,
  FetchSwapHistoryRequestAction,
  SwapOption,
  SwapTransaction
} from './types';
import {
  swapSuccess,
  swapFailure,
  fetchSwapOptionsSuccess,
  fetchSwapOptionsFailure,
  fetchSwapHistorySuccess,
  fetchSwapHistoryFailure,
  setShowProcessing,
  setShowResult
} from './actions';
import { getCurrentUser } from '@/lib/api';

 

 

// Swap saga
function* swapSaga(action: SwapRequestAction): Generator<Effect, void, any> {
  try {
    const { telegramId, fromAmount, toCurrency, toAmount } = action.payload;

    // Show processing popup
    yield put(setShowProcessing(true));


    const { hash , signature , timestamp } = generateSignature(
      JSON.stringify({ telegramId, fromAmount, toCurrency, toAmount }),
      process.env.NEXTAUTH_SECRET || 'app'
    );


    // Call swap API
    const { response , status }=  yield call(API_CALL ,{ method: 'POST', url: '/swap', body: {   hash , signature , timestamp }})
 
    if (status === 201) {
      // Create transaction object
      const transaction: SwapTransaction = {
        id: response.transactionId,
        telegramId,
        fromAmount,
        toCurrency,
        toAmount,
        conversionRate: toAmount / fromAmount,
        status: 'completed',
        transactionId: response.transactionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      yield put(swapSuccess(response.transactionId, transaction));
      
      // Show success toast
      toast.success(`Swap completed! Transaction ID: ${response.transactionId}`);
    } else {
      yield put(swapFailure(
        response.message || 'Swap failed. Please try again.',
        response.errorCode || 'UNKNOWN_ERROR'
      ));
      
      // Show error toast
      toast.error(response.message || 'Swap failed. Please try again.');
    }

    // Hide processing and show result
    yield put(setShowProcessing(false));
    yield put(setShowResult(true));

  } catch (error: any) {
    console.error('Swap API error:', error);
    
    yield put(swapFailure(
      'Network error. Please check your connection and try again.',
      'NETWORK_ERROR'
    ));
 
    // Hide processing and show result
    yield put(setShowProcessing(false));
    yield put(setShowResult(true));
  }
}

// Fetch swap options saga
function* fetchSwapOptionsSaga(action: FetchSwapOptionsRequestAction): Generator<Effect, void, any> {
  
    const { response , status  } = yield call( API_CALL ,{ method: 'GET', url: '/swap/options' });
    
  
    if (status === 200) {
      yield put(fetchSwapOptionsSuccess(response.swapOptions));
    } else {
      yield put(fetchSwapOptionsFailure(response.message || 'Failed to fetch swap options'));
    }
  
}

// Fetch swap history saga
function* fetchSwapHistorySaga( )  {
  
    const tg = getCurrentUser();
    const  { hash , signature , timestamp } = generateSignature(JSON.stringify({ ...tg }), process.env.NEXTAUTH_SECRET || 'app');
    const { response , status } = yield call( API_CALL ,{ method: 'GET', url: `/swap/history` , params : { hash , signature , timestamp } });
    
    if (status === 200) {
      yield put(fetchSwapHistorySuccess(response.transactions));
    } else {
      yield put(fetchSwapHistoryFailure(response.message || 'Failed to fetch swap history'));
    }
  
}

// Root swap saga
export function* swapRootSaga(): Generator<Effect, void, unknown> {
  yield takeEvery(SwapActionTypes.SWAP_REQUEST, swapSaga);
  yield takeEvery(SwapActionTypes.FETCH_SWAP_OPTIONS_REQUEST, fetchSwapOptionsSaga);
  yield takeEvery(SwapActionTypes.FETCH_SWAP_HISTORY_REQUEST, fetchSwapHistorySaga);
}
