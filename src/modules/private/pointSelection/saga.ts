import { call, put, takeEvery, Effect } from 'redux-saga/effects';
import {
  PointSelectionActionTypes,
  FetchQuickAmountsRequestAction,
  QuickAmount
} from './types';
import {
  fetchQuickAmountsSuccess,
  fetchQuickAmountsFailure
} from './actions';

// API call function for quick amounts (if needed in the future)
function* callQuickAmountsAPI(): Generator<any, any, any> {
  // This could be used to fetch dynamic quick amounts from an API
  // For now, we'll use the static data from the reducer
  return {
    success: true,
    quickAmounts: [
      { 
        id: '1000', 
        title: '1K Points', 
        description: '1,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      },
      { 
        id: '5000', 
        title: '5K Points', 
        description: '5,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      },
      { 
        id: '10000', 
        title: '10K Points', 
        description: '10,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      },
      { 
        id: '25000', 
        title: '25K Points', 
        description: '25,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      },
      { 
        id: '50000', 
        title: '50K Points', 
        description: '50,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      },
      { 
        id: '100000', 
        title: '100K Points', 
        description: '100,000 points',
        category: 'Fixed Amounts',
        icon: '🎯'
      }
    ]
  };
}

// Fetch quick amounts saga
function* fetchQuickAmountsSaga(action: FetchQuickAmountsRequestAction): Generator<Effect, void, any> {
  try {
    const response = yield call(callQuickAmountsAPI);

    if (response.success) {
      yield put(fetchQuickAmountsSuccess(response.quickAmounts));
    } else {
      yield put(fetchQuickAmountsFailure('Failed to fetch quick amounts'));
    }
  } catch (error: any) {
    console.error('Fetch quick amounts error:', error);
    yield put(fetchQuickAmountsFailure('Failed to fetch quick amounts'));
  }
}

// Root point selection saga
export function* pointSelectionRootSaga(): Generator<Effect, void, unknown> {
  yield takeEvery(PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_REQUEST, fetchQuickAmountsSaga);
}
