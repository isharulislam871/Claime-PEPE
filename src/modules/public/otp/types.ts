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

export interface OTPVerificationRequest {
  
  type: 'login' | 'register' | 'password-reset';
  otp: string;
  email?: string;
  callbackUrl?: string;
   
}

export interface OTPResendRequest {
 
  type: 'login' | 'register' | 'password-reset';
  email?: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  token?: string;
  redirectUrl?: string;
}

export interface OTPResendResponse {
  success: boolean;
  message: string;
  newHash?: string;
  expiresAt?: string;
}

export interface OTPState {
  isVerifying: boolean;
  isResending: boolean;
  error: string | null;
  timeLeft: number;
  canResend: boolean;
  verificationSuccess: boolean;
  lastResendTime: number | null;
}

// Verify OTP actions
export interface VerifyOTPRequestAction {
  type: typeof VERIFY_OTP_REQUEST;
  payload: OTPVerificationRequest;
}

export interface VerifyOTPSuccessAction {
  type: typeof VERIFY_OTP_SUCCESS;
  payload: OTPVerificationResponse;
}

export interface VerifyOTPFailureAction {
  type: typeof VERIFY_OTP_FAILURE;
  payload: string;
}

// Resend OTP actions
export interface ResendOTPRequestAction {
  type: typeof RESEND_OTP_REQUEST;
  payload: OTPResendRequest;
}

export interface ResendOTPSuccessAction {
  type: typeof RESEND_OTP_SUCCESS;
  payload: OTPResendResponse;
}

export interface ResendOTPFailureAction {
  type: typeof RESEND_OTP_FAILURE;
  payload: string;
}

// Utility actions
export interface ClearOTPErrorAction {
  type: typeof CLEAR_OTP_ERROR;
}

export interface ResetOTPStateAction {
  type: typeof RESET_OTP_STATE;
}

export interface SetOTPTimerAction {
  type: typeof SET_OTP_TIMER;
  payload: number;
}

export type OTPAction =
  | VerifyOTPRequestAction
  | VerifyOTPSuccessAction
  | VerifyOTPFailureAction
  | ResendOTPRequestAction
  | ResendOTPSuccessAction
  | ResendOTPFailureAction
  | ClearOTPErrorAction
  | ResetOTPStateAction
  | SetOTPTimerAction;
