import { call, put, takeLatest, delay, fork, take, cancel } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { toast } from 'react-toastify';
import { API_CALL , generateSignature  }from 'auth-fingerprint';
import {
  VERIFY_OTP_REQUEST,
  RESEND_OTP_REQUEST,
  SET_OTP_TIMER,
  OTP_TIMER_DURATION
} from './constants';
import { signIn } from 'next-auth/react';
import {
  verifyOTPSuccess,
  verifyOTPFailure,
  resendOTPSuccess,
  resendOTPFailure,
  setOTPTimer
} from './actions';

import {
  VerifyOTPRequestAction,
  ResendOTPRequestAction,
  OTPVerificationResponse,
  OTPResendResponse
} from './types';
 

const resendOTPAPI = (data: any) => {
  return API_CALL({
    url: '/api/auth/resend-otp',
    method: 'POST',
    body: data
  });
};

// Timer saga
function* otpTimerSaga(): SagaIterator {
  let timeLeft = OTP_TIMER_DURATION;
  
  while (timeLeft > 0) {
    yield delay(1000);
    timeLeft -= 1;
    yield put(setOTPTimer(timeLeft));
  }
}

// Verify OTP saga
function* verifyOTPSaga(action: VerifyOTPRequestAction): SagaIterator {
  const admin =  JSON.parse(localStorage.getItem('admin') || '{}')

  const { hash , signature , timestamp  } = generateSignature(JSON.stringify( { ...action.payload , email : admin.email }) , process.env.NEXTAUTH_SECRET|| 'app')
    const { response, status } = yield call(API_CALL ,{ url: '/auth/verify-otp',  method: 'POST',  body:  { hash , signature , timestamp } })
  
    if (status === 200 && response.success) {
      yield put(verifyOTPSuccess(response));
      toast.success(response.message || 'OTP verified successfully!');
      
      const  result =  yield call(signIn, 'credentials', {
        ...admin,
        callbackUrl: action.payload.callbackUrl,
        redirect : true
      });
 

      if(result.ok){
        yield put(verifyOTPSuccess(response));
        return;
      }

      yield put(verifyOTPFailure(result.error));
    } else {
      yield put(verifyOTPFailure(response.message || 'OTP verification failed'));
      toast.error(response.error || 'Invalid OTP. Please try again.');
    }
  
}

// Resend OTP saga
function* resendOTPSaga(action: ResendOTPRequestAction): SagaIterator {
  try {
    const { response, status }: any = yield call(resendOTPAPI, action.payload);
    
    if (status === 200 && response.success) {
      yield put(resendOTPSuccess(response));
      toast.success(response.message || 'New OTP sent successfully!');
      
      // Start new timer
      yield fork(otpTimerSaga);
    } else {
      yield put(resendOTPFailure(response.message || 'Failed to resend OTP'));
      toast.error(response.message || 'Failed to resend OTP. Please try again.');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Network error occurred';
    yield put(resendOTPFailure(errorMessage));
    toast.error(errorMessage);
  }
}

// Initialize timer saga
function* initializeTimerSaga(): SagaIterator {
  yield fork(otpTimerSaga);
}

// Root OTP saga
export function* otpSaga(): SagaIterator {
  yield takeLatest(VERIFY_OTP_REQUEST, verifyOTPSaga);
  yield takeLatest(RESEND_OTP_REQUEST, resendOTPSaga);
  yield fork(initializeTimerSaga);
}
