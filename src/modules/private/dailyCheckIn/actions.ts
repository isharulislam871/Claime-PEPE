import { DailyCheckInActionTypes, DailyCheckInData, CheckInReward } from './types';

export const fetchCheckInDataRequest = () => ({
  type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_REQUEST
});

export const fetchCheckInDataSuccess = (payload: DailyCheckInData) => ({
  type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_SUCCESS,
  payload
});

export const fetchCheckInDataFailure = (payload: string) => ({
  type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_FAILURE,
  payload
});

export const performCheckInRequest = () => ({
  type: DailyCheckInActionTypes.PERFORM_CHECK_IN_REQUEST
});

export const performCheckInSuccess = (payload: { checkInData: DailyCheckInData; reward: CheckInReward }) => ({
  type: DailyCheckInActionTypes.PERFORM_CHECK_IN_SUCCESS,
  payload
});

export const performCheckInFailure = (payload: string) => ({
  type: DailyCheckInActionTypes.PERFORM_CHECK_IN_FAILURE,
  payload
});

export const resetCheckInError = () => ({
  type: DailyCheckInActionTypes.RESET_CHECK_IN_ERROR
});

export const clearCheckInResult = () => ({
  type: DailyCheckInActionTypes.CLEAR_CHECK_IN_RESULT
});
