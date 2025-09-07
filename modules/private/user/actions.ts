import { UserActionTypes, User, UserStats, UserState } from './types';

export const fetchUsers = () => ({
  type: UserActionTypes.FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users: User[], total: number) => ({
  type: UserActionTypes.FETCH_USERS_SUCCESS,
  payload: { users, total }
});

export const fetchUsersFailure = (error: string) => ({
  type: UserActionTypes.FETCH_USERS_FAILURE,
  payload: error
});

export const fetchUserStats = () => ({
  type: UserActionTypes.FETCH_USER_STATS_REQUEST
});

export const fetchUserStatsSuccess = (stats: UserStats) => ({
  type: UserActionTypes.FETCH_USER_STATS_SUCCESS,
  payload: stats
});

export const fetchUserStatsFailure = (error: string) => ({
  type: UserActionTypes.FETCH_USER_STATS_FAILURE,
  payload: error
});

export const updateUserStatus = (id: string, isActive: boolean) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_REQUEST,
  payload: { id, isActive }
});

export const updateUserStatusSuccess = (user: User) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_SUCCESS,
  payload: user
});

export const updateUserStatusFailure = (error: string) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_FAILURE,
  payload: error
});

export const setUserFilters = (filters: UserState['filters']) => ({
  type: UserActionTypes.SET_USER_FILTERS,
  payload: filters
});

export const watchAdRequest = () => ({
  type: UserActionTypes.WATCH_AD_REQUEST
});

export const watchAdSuccess = (data: any) => ({
  type: UserActionTypes.WATCH_AD_SUCCESS,
  payload: data
});

export const watchAdFailure = (error: string) => ({
  type: UserActionTypes.WATCH_AD_FAILURE,
  payload: error
});

export const claimDailyCheckIn = () => ({
  type: UserActionTypes.CLAIM_DAILY_CHECKIN_REQUEST
});

export const claimDailyCheckInSuccess = (data: any) => ({
  type: UserActionTypes.CLAIM_DAILY_CHECKIN_SUCCESS,
  payload: data
});

export const claimDailyCheckInFailure = (error: string) => ({
  type: UserActionTypes.CLAIM_DAILY_CHECKIN_FAILURE,
  payload: error
});

export const spinWheel = (reward: number) => ({
  type: UserActionTypes.SPIN_WHEEL_SUCCESS,
  payload: { reward }
});

export const spinWheelRequest = () => ({
  type: UserActionTypes.SPIN_WHEEL_REQUEST
});

export const spinWheelFailure = (error: string) => ({
  type: UserActionTypes.SPIN_WHEEL_FAILURE,
  payload: error
});

export const createUserRequest = (userData: any) => ({
  type: UserActionTypes.CREATE_USER_REQUEST,
  payload: userData
});

export const createUserSuccess = (user: User) => ({
  type: UserActionTypes.CREATE_USER_SUCCESS,
  payload: user
});

export const createUserFailure = ( payload : { error: string; code : string; registeredIP : string; currentIP : string } ) => ({
  type: UserActionTypes.CREATE_USER_FAILURE,
  payload 
});

// IP Verification Actions
export const verifyIpRequest = () => ({
  type: UserActionTypes.VERIFY_IP_REQUEST
});

export const verifyIpSuccess = (verified: boolean, message: string) => ({
  type: UserActionTypes.VERIFY_IP_SUCCESS,
  payload: { verified, message }
});

export const verifyIpFailure = (error: string) => ({
  type: UserActionTypes.VERIFY_IP_FAILURE,
  payload: error
});

export const setCurrentIp = (ip: string) => ({
  type: UserActionTypes.SET_CURRENT_IP,
  payload: ip
});

export const setRegisteredIp = (ip: string) => ({
  type: UserActionTypes.SET_REGISTERED_IP,
  payload: ip
});

export const setVerificationCode = (code: string) => ({
  type: UserActionTypes.SET_VERIFICATION_CODE,
  payload: code
});
 