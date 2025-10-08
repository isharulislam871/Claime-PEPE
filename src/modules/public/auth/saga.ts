'use client';

import { call, put, takeLatest, Effect, all, fork, delay } from 'redux-saga/effects';
import { API_CALL } from '@/lib/client';
import { generateSignature } from 'auth-fingerprint';
import { getCurrentUser } from '@/lib/api';
import { toast } from 'react-toastify';
import {
  CREATE_USER_REQUEST,
  FETCH_USER_REQUEST,
  UPDATE_USER_REQUEST
} from './constants';
import {
  CreateUserRequestAction,
  FetchUserRequestAction,
  UpdateUserRequestAction,
  User,
} from './types';
import {
  createUserSuccess,
  createUserFailure,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserSuccess,
  updateUserFailure,
  fetchUserRequest,
  createUserRequest,
} from './actions';
import { openBannedUserPopup, openSuspendedUserPopup } from '../popup';
import { fetchAdsSettingsRequest } from '../adsSettings';
import { fetchQuickActionsRequest } from '@/modules/private';

// Create user saga
function* createUserSaga(): Generator<Effect, void, unknown> {
  const tg = getCurrentUser();
  
  const { hash, signature, timestamp } = generateSignature(
    JSON.stringify({ ...tg }),
    process.env.NEXTAUTH_SECRET || 'app'
  );

  const { response, status }: any = yield call(API_CALL, {
    url: '/auth',
    method: 'POST',
    body: {   hash, signature, timestamp }
  });

  if ( status === 201) {
    yield put(fetchUserRequest())
  } else {
    const errorMessage = response?.message || 'Failed to create user';
    yield put(createUserFailure(errorMessage));
    toast.error(errorMessage);
  }
}

// Update user saga
function* updateUserSaga(action: UpdateUserRequestAction): Generator<Effect, void, unknown> {
  const userData = action.payload;
  
  const { hash, signature, timestamp } = generateSignature(
    JSON.stringify(userData),
    process.env.NEXTAUTH_SECRET || ''
  );

  const { response, status }: any = yield call(API_CALL, {
    url: `/auth/${userData.id}`,
    method: 'PUT',
    body: {  hash, signature, timestamp }
  });

  if (status === 200) {
    const user: User = response.user;
    yield put(updateUserSuccess(user));
    toast.success('User updated successfully');
  } else {
    const errorMessage = response?.message || 'Failed to update user';
    yield put(updateUserFailure(errorMessage));
    toast.error(errorMessage);
  }
}

// Fetch user saga
function* fetchUserSaga( ): Generator<Effect, void, unknown> {
  const tg = getCurrentUser()
  const { hash, signature, timestamp } = generateSignature(JSON.stringify({  ...tg }), process.env.NEXTAUTH_SECRET || 'app');

    
  const { response, status }: any = yield call(API_CALL, {
    url: `/auth`,
    method: 'GET',
    params: { hash, signature, timestamp }
  });

  if (status === 200) {
    const user: User = response.users;
    yield delay(6000)
    if(user.status === 'ban') {
      yield put(openBannedUserPopup())
    }
    if(user.status === 'suspend') {
      yield put(openSuspendedUserPopup())
    }
    yield put(fetchAdsSettingsRequest());
    yield put(fetchQuickActionsRequest())
    yield put(fetchUserSuccess(user));
    return;
  } 
  
  if (status === 404) {
    yield put(createUserRequest());
    return;
  } 
   
}

// Watcher Sagas
function* watchCreateUser() {
  yield takeLatest(CREATE_USER_REQUEST, createUserSaga);
}

function* watchFetchUser() {
  yield takeLatest(FETCH_USER_REQUEST, fetchUserSaga);
}

function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER_REQUEST, updateUserSaga);
}

// Root auth saga
export function* authSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(watchCreateUser),
    fork(watchFetchUser),
    fork(watchUpdateUser),
  ]);
}
