import { RootState } from '../../store';

export const selectDailyCheckInState = (state: RootState) => state.private.dailyCheckIn;

export const selectCheckInData = (state: RootState) => state.private.dailyCheckIn.checkInData;

export const selectCheckInLoading = (state: RootState) => state.private.dailyCheckIn.loading;

export const selectCheckInError = (state: RootState) => state.private.dailyCheckIn.error;

export const selectLastCheckInResult = (state: RootState) => state.private.dailyCheckIn.lastCheckInResult;

export const selectIsCheckingIn = (state: RootState) => state.private.dailyCheckIn.isCheckingIn;

export const selectCanCheckIn = (state: RootState) => 
  state.private.dailyCheckIn.checkInData?.canCheckIn || false;

export const selectCurrentStreak = (state: RootState) => 
  state.private.dailyCheckIn.checkInData?.streak || 0;

export const selectTotalCheckIns = (state: RootState) => 
  state.private.dailyCheckIn.checkInData?.totalCheckIns || 0;
