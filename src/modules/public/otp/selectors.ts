import { RootState } from '../../store';

export const selectOTPState = (state: RootState) => state.admin.otp;

export const selectIsVerifying = (state: RootState) => selectOTPState(state).isVerifying;

export const selectIsResending = (state: RootState) => selectOTPState(state).isResending;

export const selectOTPError = (state: RootState) => selectOTPState(state).error;

export const selectTimeLeft = (state: RootState) => selectOTPState(state).timeLeft;

export const selectCanResend = (state: RootState) => selectOTPState(state).canResend;

export const selectVerificationSuccess = (state: RootState) => selectOTPState(state).verificationSuccess;

export const selectLastResendTime = (state: RootState) => selectOTPState(state).lastResendTime;

export const selectOTPLoading = (state: RootState) => {
  const otpState = selectOTPState(state);
  return otpState.isVerifying || otpState.isResending;
};
