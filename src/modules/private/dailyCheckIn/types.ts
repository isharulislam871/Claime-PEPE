export interface DailyCheckInData {
  id: string;
  userId: string;
  streak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  canCheckIn: boolean;
  nextCheckInTime: string | null;
  rewardEarned: number;
  streakBonus: number;
}

export interface CheckInReward {
  baseReward: number;
  streakBonus: number;
  totalReward: number;
  newStreak: number;
}

export interface DailyCheckInState {
  checkInData: DailyCheckInData | null;
  loading: boolean;
  error: string | null;
  lastCheckInResult: CheckInReward | null;
  isCheckingIn: boolean;
}

export enum DailyCheckInActionTypes {
  FETCH_CHECK_IN_DATA_REQUEST = 'FETCH_CHECK_IN_DATA_REQUEST',
  FETCH_CHECK_IN_DATA_SUCCESS = 'FETCH_CHECK_IN_DATA_SUCCESS',
  FETCH_CHECK_IN_DATA_FAILURE = 'FETCH_CHECK_IN_DATA_FAILURE',
  PERFORM_CHECK_IN_REQUEST = 'PERFORM_CHECK_IN_REQUEST',
  PERFORM_CHECK_IN_SUCCESS = 'PERFORM_CHECK_IN_SUCCESS',
  PERFORM_CHECK_IN_FAILURE = 'PERFORM_CHECK_IN_FAILURE',
  RESET_CHECK_IN_ERROR = 'RESET_CHECK_IN_ERROR',
  CLEAR_CHECK_IN_RESULT = 'CLEAR_CHECK_IN_RESULT'
}

export type DailyCheckInAction =
  | { type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_REQUEST }
  | { type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_SUCCESS; payload: DailyCheckInData }
  | { type: DailyCheckInActionTypes.FETCH_CHECK_IN_DATA_FAILURE; payload: string }
  | { type: DailyCheckInActionTypes.PERFORM_CHECK_IN_REQUEST }
  | { type: DailyCheckInActionTypes.PERFORM_CHECK_IN_SUCCESS; payload: { checkInData: DailyCheckInData; reward: CheckInReward } }
  | { type: DailyCheckInActionTypes.PERFORM_CHECK_IN_FAILURE; payload: string }
  | { type: DailyCheckInActionTypes.RESET_CHECK_IN_ERROR }
  | { type: DailyCheckInActionTypes.CLEAR_CHECK_IN_RESULT };
