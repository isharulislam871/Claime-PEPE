import { call, put, takeLatest, select, Effect } from 'redux-saga/effects';
import { UserActionTypes, User, UserStats } from './types';
import {
  watchAdRequest,
  watchAdSuccess,
  watchAdFailure,
  claimDailyCheckIn,
  claimDailyCheckInSuccess,
  claimDailyCheckInFailure,
  spinWheelRequest,
  spinWheelFailure,
  fetchUserStats,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserStatsSuccess,
  fetchUserStatsFailure,
  updateUserStatus,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  createUserSuccess,
  createUserFailure,
  createUserRequest,
  
} from './actions';
import { RootState } from '../../store';
 
import { toast } from 'react-toastify';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import { getCurrentUser } from '@/lib/api';
import { generateSignature } from 'auth-fingerprint'

// API response types
interface UsersResponse {
  users: User[];
  total: number;
}

// API functions
const fetchUsersFromAPI = async (page: number, filters: Record<string, unknown>): Promise<UsersResponse> => {
  const response = await fetch(`/api/admin/users?page=${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters)
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const fetchUserStatsFromAPI = async (): Promise<UserStats> => {
  const response = await fetch('/api/admin/users/stats');
  if (!response.ok) throw new Error('Failed to fetch user stats');
  return response.json();
};

const updateUserStatusAPI = async (id: string, isActive: boolean): Promise<User> => {
  const response = await fetch(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive })
  });
  if (!response.ok) throw new Error('Failed to update user status');
  return response.json();
};

 

 

// Saga workers
function* fetchUsersSaga(): Generator<Effect, void, unknown> {
  try {
    const state = (yield select()) as RootState;
    const { currentPage, filters } = state.private.user;
    const response = (yield call(fetchUsersFromAPI, currentPage, filters)) as UsersResponse;
    yield put(fetchUsersSuccess(response.users, response.total));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchUsersFailure(error.message));
    } else {
      yield put(fetchUsersFailure('An unknown error occurred'));
    }
  }
}

function* fetchUserStatsSaga(): Generator<Effect, void, unknown> {
  try {
    const stats = (yield call(fetchUserStatsFromAPI)) as UserStats;
    yield put(fetchUserStatsSuccess(stats));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchUserStatsFailure(error.message));
    } else {
      yield put(fetchUserStatsFailure('An unknown error occurred'));
    }
  }
}

function* updateUserStatusSaga(action: ReturnType<typeof updateUserStatus>): Generator<Effect, void, unknown> {
  try {
    const { id, isActive } = action.payload;
    const updatedUser = (yield call(updateUserStatusAPI, id, isActive)) as User;
    yield put(updateUserStatusSuccess(updatedUser));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(updateUserStatusFailure(error.message));
    } else {
      yield put(updateUserStatusFailure('An unknown error occurred'));
    }
  }
}
 

function* createUserSaga(action: ReturnType<typeof createUserRequest>): Generator {
  try {
    const userData = action.payload;
   const { hash  , signature , timestamp } = generateSignature( JSON.stringify(userData)  , process.env.NEXTAUTH_SECRET || 'app')
    
   
    const { response, status }: any = (yield call(API_CALL, {
      url: "/users",
      method: "POST",
      body:  { hash,  signature , timestamp  } ,
    })) as TypeApiPromise;

    if (status === 200 || status === 201) {
      yield put(createUserSuccess(response?.result?.users));
      return;
    } 
    yield put(createUserFailure({ error : response?.error, code : response?.code, registeredIP : response?.registeredIP, currentIP : response?.currentIP}));

  } catch (error: any) {
    toast.error(error.message || "Unexpected error");
    yield put(createUserFailure(error.message));
  }
}

// Root saga
export function* userSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(UserActionTypes.FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(UserActionTypes.FETCH_USER_STATS_REQUEST, fetchUserStatsSaga);
  yield takeLatest(UserActionTypes.UPDATE_USER_STATUS_REQUEST, updateUserStatusSaga);
  yield takeLatest(UserActionTypes.CREATE_USER_REQUEST, createUserSaga);
}
