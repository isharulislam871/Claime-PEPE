import {
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  CLEAR_OTP_ERROR,
  RESET_OTP_STATE,
  SET_OTP_TIMER
} from './constants';

import {
  OTPVerificationRequest,
  OTPResendRequest,
  OTPVerificationResponse,
  OTPResendResponse,
  VerifyOTPRequestAction,
  VerifyOTPSuccessAction,
  VerifyOTPFailureAction,
  ResendOTPRequestAction,
  ResendOTPSuccessAction,
  ResendOTPFailureAction,
  ClearOTPErrorAction,
  ResetOTPStateAction,
  SetOTPTimerAction
} from './types';

// Verify OTP Actions
export const verifyOTPRequest = (payload: OTPVerificationRequest): VerifyOTPRequestAction => ({
  type: VERIFY_OTP_REQUEST,
  payload
});

export const verifyOTPSuccess = (payload: OTPVerificationResponse): VerifyOTPSuccessAction => ({
  type: VERIFY_OTP_SUCCESS,
  payload
});

export const verifyOTPFailure = (payload: string): VerifyOTPFailureAction => ({
  type: VERIFY_OTP_FAILURE,
  payload
});

// Resend OTP Actions
export const resendOTPRequest = (payload: OTPResendRequest): ResendOTPRequestAction => ({
  type: RESEND_OTP_REQUEST,
  payload
});

export const resendOTPSuccess = (payload: OTPResendResponse): ResendOTPSuccessAction => ({
  type: RESEND_OTP_SUCCESS,
  payload
});

export const resendOTPFailure = (payload: string): ResendOTPFailureAction => ({
  type: RESEND_OTP_FAILURE,
  payload
});

// Utility Actions
export const clearOTPError = (): ClearOTPErrorAction => ({
  type: CLEAR_OTP_ERROR
});

export const resetOTPState = (): ResetOTPStateAction => ({
  type: RESET_OTP_STATE
});

export const setOTPTimer = (payload: number): SetOTPTimerAction => ({
  type: SET_OTP_TIMER,
  payload
});
