export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  status: 'active' | 'ban' | 'suspend';
  banReason?: string;
  createdAt: string;
  balance: number;
  lastLoginAt?: string;
  profilePicUrl?: string;
  telegramUsername?: string;
  totalEarned?: number;
  referralEarnings?: number;
  adsWatchedToday?: number;
  tasksCompletedToday?: number;
  referralCount?: number;
  lastTaskTimestamp?: string;
  referredBy?: string;
  telegramId?: string;
  lastSpinDate?: string;
  referralCode?: string;
  // Daily Check-in fields
  dailyCheckInStreak?: number;
  totalCheckIns?: number;
  lastCheckInDate?: string;
  dailyCheckInRewardEarned?: number;
}

export interface SpinWheelState {
  canSpin: boolean;
  lastSpinDate: string | null;
  loading: boolean;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  registeredIP: string | null;
  code: string;
  currentIP: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  filters: {
    status?: 'active' | 'inactive';
    search?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  stats: UserStats;
  spinWheel: SpinWheelState;
}

export enum UserActionTypes {
  FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE',
  FETCH_USER_STATS_REQUEST = 'FETCH_USER_STATS_REQUEST',
  FETCH_USER_STATS_SUCCESS = 'FETCH_USER_STATS_SUCCESS',
  FETCH_USER_STATS_FAILURE = 'FETCH_USER_STATS_FAILURE',
  UPDATE_USER_STATUS_REQUEST = 'UPDATE_USER_STATUS_REQUEST',
  UPDATE_USER_STATUS_SUCCESS = 'UPDATE_USER_STATUS_SUCCESS',
  UPDATE_USER_STATUS_FAILURE = 'UPDATE_USER_STATUS_FAILURE',
  SET_USER_FILTERS = 'SET_USER_FILTERS',
  WATCH_AD_REQUEST = 'WATCH_AD_REQUEST',
  WATCH_AD_SUCCESS = 'WATCH_AD_SUCCESS',
  WATCH_AD_FAILURE = 'WATCH_AD_FAILURE',
  CLAIM_DAILY_CHECKIN_REQUEST = 'CLAIM_DAILY_CHECKIN_REQUEST',
  CLAIM_DAILY_CHECKIN_SUCCESS = 'CLAIM_DAILY_CHECKIN_SUCCESS',
  CLAIM_DAILY_CHECKIN_FAILURE = 'CLAIM_DAILY_CHECKIN_FAILURE',
  SPIN_WHEEL_REQUEST = 'SPIN_WHEEL_REQUEST',
  SPIN_WHEEL_SUCCESS = 'SPIN_WHEEL_SUCCESS',
  SPIN_WHEEL_FAILURE = 'SPIN_WHEEL_FAILURE',
  CREATE_USER_REQUEST = 'CREATE_USER_REQUEST',
  CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE = 'CREATE_USER_FAILURE',
  VERIFY_IP_REQUEST = 'VERIFY_IP_REQUEST',
  VERIFY_IP_SUCCESS = 'VERIFY_IP_SUCCESS',
  VERIFY_IP_FAILURE = 'VERIFY_IP_FAILURE',
  SET_CURRENT_IP = 'SET_CURRENT_IP',
  SET_REGISTERED_IP = 'SET_REGISTERED_IP',
  SET_VERIFICATION_CODE = 'SET_VERIFICATION_CODE',
}

export type UserAction =
  | { type: UserActionTypes.FETCH_USERS_REQUEST }
  | { type: UserActionTypes.FETCH_USERS_SUCCESS; payload: { users: User[]; total: number } }
  | { type: UserActionTypes.FETCH_USERS_FAILURE; payload: string }
  | { type: UserActionTypes.FETCH_USER_STATS_REQUEST }
  | { type: UserActionTypes.FETCH_USER_STATS_SUCCESS; payload: UserStats }
  | { type: UserActionTypes.FETCH_USER_STATS_FAILURE; payload: string }
  | { type: UserActionTypes.UPDATE_USER_STATUS_REQUEST; payload: { id: string; isActive: boolean } }
  | { type: UserActionTypes.UPDATE_USER_STATUS_SUCCESS; payload: User }
  | { type: UserActionTypes.UPDATE_USER_STATUS_FAILURE; payload: string }
  | { type: UserActionTypes.SET_USER_FILTERS; payload: UserState['filters'] }
  | { type: UserActionTypes.WATCH_AD_REQUEST }
  | { type: UserActionTypes.WATCH_AD_SUCCESS; payload: any }
  | { type: UserActionTypes.WATCH_AD_FAILURE; payload: string }
  | { type: UserActionTypes.CLAIM_DAILY_CHECKIN_REQUEST }
  | { type: UserActionTypes.CLAIM_DAILY_CHECKIN_SUCCESS; payload: any }
  | { type: UserActionTypes.CLAIM_DAILY_CHECKIN_FAILURE; payload: string }
  | { type: UserActionTypes.SPIN_WHEEL_REQUEST }
  | { type: UserActionTypes.SPIN_WHEEL_SUCCESS; payload: { reward: number } }
  | { type: UserActionTypes.SPIN_WHEEL_FAILURE; payload: string }
  | { type: UserActionTypes.CREATE_USER_REQUEST; payload: any }
  | { type: UserActionTypes.CREATE_USER_SUCCESS; payload: User }
  | { type: UserActionTypes.CREATE_USER_FAILURE; payload:  { error: string; code : string; registeredIP : string; currentIP : string } }
  | { type: UserActionTypes.VERIFY_IP_REQUEST }
  | { type: UserActionTypes.VERIFY_IP_SUCCESS; payload: { verified: boolean; message: string } }
  | { type: UserActionTypes.VERIFY_IP_FAILURE; payload: string }
  | { type: UserActionTypes.SET_CURRENT_IP; payload: string }
  | { type: UserActionTypes.SET_REGISTERED_IP; payload: string }
  | { type: UserActionTypes.SET_VERIFICATION_CODE; payload: string };
