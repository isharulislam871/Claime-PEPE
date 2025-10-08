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
import { User } from './types';

// Create user actions
export const createUserRequest = () => ({
  type: CREATE_USER_REQUEST,
});

export const createUserSuccess = (user: User) => ({
  type: CREATE_USER_SUCCESS,
  payload: user,
});

export const createUserFailure = (error: string) => ({
  type: CREATE_USER_FAILURE,
  payload: error,
});

// Fetch user actions
export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST,
 
});

export const fetchUserSuccess = (user: User) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

export const fetchUserFailure = (error: string) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

// Update user actions
export const updateUserRequest = (userData: Partial<User>) => ({
  type: UPDATE_USER_REQUEST,
  payload: userData,
});

export const updateUserSuccess = (user: User) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

export const updateUserFailure = (error: string) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

// Clear actions
export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const resetAuthState = () => ({
  type: RESET_AUTH_STATE,
});
