// OTP Verification Action Types
export const VERIFY_OTP_REQUEST = 'VERIFY_OTP_REQUEST';
export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_FAILURE = 'VERIFY_OTP_FAILURE';

// OTP Resend Action Types
export const RESEND_OTP_REQUEST = 'RESEND_OTP_REQUEST';
export const RESEND_OTP_SUCCESS = 'RESEND_OTP_SUCCESS';
export const RESEND_OTP_FAILURE = 'RESEND_OTP_FAILURE';

// Utility Action Types
export const CLEAR_OTP_ERROR = 'CLEAR_OTP_ERROR';
export const RESET_OTP_STATE = 'RESET_OTP_STATE';
export const SET_OTP_TIMER = 'SET_OTP_TIMER';

// OTP Configuration
export const OTP_TIMER_DURATION = 300; // 5 minutes in seconds
export const OTP_RESEND_COOLDOWN = 60; // 1 minute in seconds
