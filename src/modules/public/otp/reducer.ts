import {
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  CLEAR_OTP_ERROR,
  RESET_OTP_STATE,
  SET_OTP_TIMER,
  OTP_TIMER_DURATION
} from './constants';

import { 
  OTPState, 
  OTPAction, 
  VerifyOTPFailureAction, 
  ResendOTPFailureAction, 
  SetOTPTimerAction 
} from './types';

const initialState: OTPState = {
  isVerifying: false,
  isResending: false,
  error: null,
  timeLeft: OTP_TIMER_DURATION,
  canResend: false,
  verificationSuccess: false,
  lastResendTime: null
};

export const otpReducer = (state = initialState, action: OTPAction): OTPState => {
  switch (action.type) {
    case VERIFY_OTP_REQUEST:
      return {
        ...state,
        isVerifying: true,
        error: null,
        verificationSuccess: false
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        isVerifying: false,
        error: null,
        verificationSuccess: true
      };

    case VERIFY_OTP_FAILURE:
      return {
        ...state,
        isVerifying: false,
        error: (action as VerifyOTPFailureAction).payload,
        verificationSuccess: false
      };

    case RESEND_OTP_REQUEST:
      return {
        ...state,
        isResending: true,
        error: null
      };

    case RESEND_OTP_SUCCESS:
      return {
        ...state,
        isResending: false,
        error: null,
        timeLeft: OTP_TIMER_DURATION,
        canResend: false,
        lastResendTime: Date.now()
      };

    case RESEND_OTP_FAILURE:
      return {
        ...state,
        isResending: false,
        error: (action as ResendOTPFailureAction).payload
      };

    case SET_OTP_TIMER:
      return {
        ...state,
        timeLeft: (action as SetOTPTimerAction).payload,
        canResend: (action as SetOTPTimerAction).payload <= 0
      };

    case CLEAR_OTP_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_OTP_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
};
