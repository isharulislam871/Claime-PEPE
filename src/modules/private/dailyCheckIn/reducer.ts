import { DailyCheckInState, DailyCheckInAction, DailyCheckInActionTypes } from './types';

const initialState: DailyCheckInState = {
  checkInData: null,
  loading: false,
  error: null,
  lastCheckInResult: null,
  isCheckingIn: false
};

export const dailyCheckInReducer = (
  state: DailyCheckInState = initialState,
  action: DailyCheckInAction
): DailyCheckInState => {
  switch (action.type) {
    case DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        checkInData: action.payload,
        error: null
      };

    case DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case DailyCheckInActionTypes.PERFORM_CHECK_IN_REQUEST:
      return {
        ...state,
        isCheckingIn: true,
        error: null
      };

    case DailyCheckInActionTypes.PERFORM_CHECK_IN_SUCCESS:
      return {
        ...state,
        isCheckingIn: false,
        checkInData: action.payload.checkInData,
        lastCheckInResult: action.payload.reward,
        error: null
      };

    case DailyCheckInActionTypes.PERFORM_CHECK_IN_FAILURE:
      return {
        ...state,
        isCheckingIn: false,
        error: action.payload
      };

    case DailyCheckInActionTypes.RESET_CHECK_IN_ERROR:
      return {
        ...state,
        error: null
      };

    case DailyCheckInActionTypes.CLEAR_CHECK_IN_RESULT:
      return {
        ...state,
        lastCheckInResult: null
      };

    default:
      return state;
  }
};
