import { 
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  CLEAR_AUTH_ERROR,
  LOGOUT_USER,
  RESET_AUTH_STATE
} from './constants';

export interface User {
  id: string;
  username: string;
  telegramUsername?: string;
  referralCode?: string;
  referralCount: number;
  referralEarnings: number;
  balance: number;
  totalEarned: number;
  totalAdsViewed: number;
  totalRefers: number;
  status: 'active' | 'ban' | 'suspend';
  banReason?: string | null;
  adsWatchedToday: number;
  ip?: string;
  profilePicUrl?: string;
  lastDailyCheckIn?: string | Date | null;
  dailyCheckInStreak: number;
  dailyCheckInCycle: number;
  totalSpins: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCreating: boolean;
  isFetching: boolean;
  error: string | null;
}

// Create user actions
export interface CreateUserRequestAction {
  type: typeof CREATE_USER_REQUEST;
}

export interface CreateUserSuccessAction {
  type: typeof CREATE_USER_SUCCESS;
  payload: User;
}

export interface CreateUserFailureAction {
  type: typeof CREATE_USER_FAILURE;
  payload: string;
}

// Fetch user actions
export interface FetchUserRequestAction {
  type: typeof FETCH_USER_REQUEST;
  payload: string; // telegramId
}

export interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: User;
}

export interface FetchUserFailureAction {
  type: typeof FETCH_USER_FAILURE;
  payload: string;
}

// Update user actions
export interface UpdateUserRequestAction {
  type: typeof UPDATE_USER_REQUEST;
  payload: Partial<User>;
}

export interface UpdateUserSuccessAction {
  type: typeof UPDATE_USER_SUCCESS;
  payload: User;
}

export interface UpdateUserFailureAction {
  type: typeof UPDATE_USER_FAILURE;
  payload: string;
}

// Clear actions
export interface ClearAuthErrorAction {
  type: typeof CLEAR_AUTH_ERROR;
}

export interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export interface ResetAuthStateAction {
  type: typeof RESET_AUTH_STATE;
}

export type AuthAction =
  | CreateUserRequestAction
  | CreateUserSuccessAction
  | CreateUserFailureAction
  | FetchUserRequestAction
  | FetchUserSuccessAction
  | FetchUserFailureAction
  | UpdateUserRequestAction
  | UpdateUserSuccessAction
  | UpdateUserFailureAction
  | ClearAuthErrorAction
  | LogoutUserAction
  | ResetAuthStateAction;
