import { call, put, takeLatest, select, Effect } from 'redux-saga/effects';
import { TaskActionTypes } from './types';
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  completeTaskRequest,
  completeTaskSuccess,
  completeTaskFailure,
  fetchAdsRequest,
  fetchAdsSuccess,
  fetchAdsFailure,
  watchAdRequest,
  watchAdSuccess,
  watchAdFailure
} from './actions';
import { getCurrentUser } from '@/lib/api';
import { encrypt } from '@/lib/authlib';
import { toast } from 'react-toastify';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import axios from 'axios';

// Task Sagas
function* fetchTasksSaga(): Generator<Effect, void, unknown> {
  try {
    const currentUser = getCurrentUser();
    const hash = encrypt(currentUser.telegramId);

    const {response} : TypeApiPromise = (yield call(API_CALL, { url : '/tasks' , params : { hash}})) as any;
    yield put(fetchTasksSuccess(response?.result?.result?.tasks || [], response?.result?.result?.taskStatus || {}));
 
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

function* completeTaskSaga(action: ReturnType<typeof completeTaskRequest>): Generator<Effect, void, unknown> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      yield put(completeTaskFailure('User not found'));
      return;
    }

    const { taskId, taskUrl } = action.payload;

    // If task has URL, open it first (for social tasks)
    if (taskUrl) {
      window.open(taskUrl, '_blank');
      // Add delay for user to complete the action
      yield call(() => new Promise(resolve => setTimeout(resolve, 2000)));
    }

    // Get current tasks to find task details
    const currentState: any = yield select();
    const tasks = currentState.private.task.tasks;
    const task = tasks.find((t: any) => t.id === taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const response = (yield call(axios.post, '/api/users/tasks', {
      telegramId: currentUser.telegramId,
      taskId,
      reward: task.reward,
      taskType: task.type
    })) as any;

    yield put(completeTaskSuccess({ ...response.data, taskId }));
    toast.success(response.data.message);
    
    // Refresh tasks after completion
    yield put(fetchTasksRequest());
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(completeTaskFailure(error.message));
    } else {
      toast.error('Failed to complete task');
      yield put(completeTaskFailure('An unknown error occurred'));
    }
  }
}

// Ads Sagas
function* fetchAdsSaga(): Generator<Effect, void, unknown> {
  try {
    const currentUser = getCurrentUser();
    
    const hash = encrypt(currentUser.telegramId);
  
    const {response , status } : any = (yield call(API_CALL,{ url : '/ads' , params : { hash }})) as any;
    
    if (status === 200) {
 
     yield put(fetchAdsSuccess([] , response.data.userStats));
   
    } else {
      throw new Error(response.data.error || 'Failed to load ads');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(fetchAdsFailure(error.message));
    } else {
      toast.error('Failed to load ads');
      yield put(fetchAdsFailure('An unknown error occurred'));
    }
  }
}

function* watchAdSaga(): Generator<Effect, void, unknown> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      yield put(watchAdFailure('User not found'));
      return;
    }

    const hash = encrypt(currentUser.telegramId);
    const { response, status }: TypeApiPromise = (yield call(API_CALL, { 
      url: '/ads', 
      method: 'POST', 
      body: { hash } 
    })) as any;
 
    if (status === 200) {
      yield put(watchAdSuccess(response));
      // Refresh ads data after watching
      yield put(fetchAdsRequest());
      return;
    }
    
    toast.error(response?.error);
    yield put(watchAdFailure(response?.error));
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(watchAdFailure(error.message));
    } else {
      toast.error('Failed to watch ad');
      yield put(watchAdFailure('Failed to watch ad'));
    }
  }
}

// Root task saga
export function* taskSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(TaskActionTypes.FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeLatest(TaskActionTypes.COMPLETE_TASK_REQUEST, completeTaskSaga);
  yield takeLatest(TaskActionTypes.FETCH_ADS_REQUEST, fetchAdsSaga);
  yield takeLatest(TaskActionTypes.WATCH_AD_REQUEST, watchAdSaga);
}
