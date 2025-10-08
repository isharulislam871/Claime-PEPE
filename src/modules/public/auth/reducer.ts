import { AuthState, AuthAction } from './types';
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

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isCreating: false,
  isFetching: false,
  error: null,
};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    // Create user cases
    case CREATE_USER_REQUEST:
      return {
        ...state,
        isCreating: true,
        isLoading: true,
        error: null,
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isCreating: false,
        isLoading: false,
        error: null,
      };

    case CREATE_USER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isCreating: false,
        isLoading: false,
        error: action.payload,
      };

    // Fetch user cases
    case FETCH_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoading: true,
        error: null,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isFetching: false,
        isLoading: false,
        error: null,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isFetching: false,
        isLoading: false,
        error: action.payload,
      };

    // Update user cases
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // Clear actions
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };

    case RESET_AUTH_STATE:
      return initialState;

    default:
      return state;
  }
};
