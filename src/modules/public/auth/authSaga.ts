"use client";

import { call, put, takeLatest, Effect, all, fork } from 'redux-saga/effects';
import { AuthActionTypes, LoginCredentials, User } from './types';
import {  loginSuccess,   loginFailure } from './actions';
import { API_CALL  , generateSignature } from 'auth-fingerprint';
import { getCurrentUser } from '@/lib/api';
 

 
interface AuthResponse {
  success: boolean;
  user: User;
}
 
 

function* loginSaga(action: { type: string; payload: LoginCredentials }): Generator<Effect, void, unknown> {
  const { hash , signature , timestamp } = generateSignature(JSON.stringify(getCurrentUser()), process.env.NEXTAUTH_SECRET || '');
  const { response , status } : any= yield call(API_CALL , ({ url :'/auth' , method : 'GET', body : { hash , signature , timestamp }}));
   
 if (status === 200) {
  yield put(loginSuccess(response.users));
 } else {
  yield put(loginFailure('An unknown error occurred'));
 }
}

function* checkAuthSaga(): Generator<Effect, void, unknown> {

  const { hash , signature , timestamp } = generateSignature(JSON.stringify(getCurrentUser()), process.env.NEXTAUTH_SECRET || '');
  const { response , status } : any = yield call(API_CALL , ({  url : '/user/me/' , method : 'GET', params : { hash , signature , timestamp }}));
  
  if (status === 200) {
    yield put(loginSuccess(response.result.user));
  } else {
    yield put(loginFailure('An unknown error occurred'));
  }
}

 
// Watcher Sagas
function* watchLogin() {
  yield takeLatest(AuthActionTypes.LOGIN_REQUEST, loginSaga);
}
 

function* watchCheckAuth() {
  yield takeLatest(AuthActionTypes.CHECK_AUTH, checkAuthSaga);
}

// Root auth saga
export function* authSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(watchLogin),
    
    fork(watchCheckAuth),
  ]);

  // Initial auth check
  yield call(checkAuthSaga);
}
