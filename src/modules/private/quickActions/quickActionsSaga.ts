import { call, put, takeEvery, Effect } from 'redux-saga/effects';
import {
  QuickActionsActionTypes,
  FetchQuickActionsRequestAction,
  UpdateQuickActionRequestAction,
} from './types';
import {
  fetchQuickActionsSuccess,
  fetchQuickActionsFailure,
  updateQuickActionSuccess,
  updateQuickActionFailure,
} from './actions';

// API call functions
async function fetchQuickActionsApi() {
  const response = await fetch('/api/quickActions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch quick actions');
  }

  const data = await response.json();
  return data.data; // Return the quick actions array
}

async function updateQuickActionApi(actionId: string, enabled: boolean) {
  const response = await fetch('/api/quickActions', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ actionId, enabled }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update quick action');
  }

  const data = await response.json();
  return data.data; // Return the updated quick action
}

// Saga workers
function* fetchQuickActionsSaga(action: FetchQuickActionsRequestAction): Generator<Effect, void, any> {
  try {
    const quickActions = yield call(fetchQuickActionsApi);
    yield put(fetchQuickActionsSuccess(quickActions));
  } catch (error: any) {
    yield put(fetchQuickActionsFailure(error.message || 'Failed to fetch quick actions'));
  }
}

function* updateQuickActionSaga(action: UpdateQuickActionRequestAction): Generator<Effect, void, any> {
  try {
    const { actionId, enabled } = action.payload;
    const updatedAction = yield call(updateQuickActionApi, actionId, enabled);
    yield put(updateQuickActionSuccess(updatedAction));
  } catch (error: any) {
    yield put(updateQuickActionFailure(error.message || 'Failed to update quick action'));
  }
}

// Watcher saga
export function* quickActionsSaga(): Generator<Effect, void, unknown> {
  yield takeEvery(QuickActionsActionTypes.FETCH_QUICK_ACTIONS_REQUEST, fetchQuickActionsSaga);
  yield takeEvery(QuickActionsActionTypes.UPDATE_QUICK_ACTION_REQUEST, updateQuickActionSaga);
}
