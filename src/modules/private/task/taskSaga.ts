import { call, put, takeLatest, Effect } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { FETCH_TASKS_REQUEST, COMPLETE_TASK_REQUEST } from './constants';
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  completeTaskSuccess,
  completeTaskFailure,
} from './actions';
import { getCurrentUser } from '@/lib/api';

import { toast } from 'react-toastify';

import { generateSignature, API_CALL, APIResponse } from 'auth-fingerprint';

// Task Sagas
function* fetchTasksSaga(): SagaIterator {
  try {
    const currentUser = getCurrentUser();
    const { hash, signature, timestamp } = generateSignature(
      JSON.stringify({ telegramId: currentUser?.telegramId }),
      process.env.NEXTAUTH_SECRET || 'app'
    );

    const { response, status } = (yield call(API_CALL, {
      url: '/tasks',
      method: 'GET',
      params: { hash, signature, timestamp }
    })) as APIResponse;
    yield put(fetchTasksSuccess(response?.result?.result?.tasks || []));

  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(fetchTasksFailure(error.message));
    } else {
      toast.error('Failed to load tasks');
      yield put(fetchTasksFailure('An unknown error occurred'));
    }
  }
}

function* completeTaskSaga(action: { type: string; payload: { taskId: string } }): SagaIterator {

  const tg = getCurrentUser();
  const { taskId } = action.payload;
  const { hash, signature, timestamp } = generateSignature(
    JSON.stringify({ ...tg, taskId }),
    process.env.NEXTAUTH_SECRET || 'app'
  );

  const { response, status } = (yield call(API_CALL, {
    url: '/users/tasks',
    method: 'POST',
    body: { hash, taskId, signature, timestamp }
  })) as APIResponse;

  if (status === 200) {
    yield put(completeTaskSuccess(taskId));
    toast.success(response.message as string);
    return;
  }
  yield put(completeTaskFailure((response?.error) || 'Failed to complete task'));
  toast.error((response?.error) || 'Failed to complete task');


}

// Root task saga
export function* taskSaga(): SagaIterator {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeLatest(COMPLETE_TASK_REQUEST, completeTaskSaga);
}
