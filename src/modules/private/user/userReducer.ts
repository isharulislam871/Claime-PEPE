import { UserState, UserActionTypes, UserAction } from './types';

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {},
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersToday: 0,
  },
  spinWheel: {
    canSpin: true,
    lastSpinDate: null,
    loading: false
  }
};

export const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.WATCH_AD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UserActionTypes.WATCH_AD_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case UserActionTypes.WATCH_AD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case UserActionTypes.SPIN_WHEEL_REQUEST:
      return {
        ...state,
        spinWheel: {
          ...state.spinWheel,
          canSpin: false,
          loading: true
        }
      };
    case UserActionTypes.SPIN_WHEEL_SUCCESS:
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        spinWheel: {
          canSpin: false,
          lastSpinDate: today,
          loading: false
        },
        users: state.users.map(user => 
          user.telegramId ? {
            ...user,
            balance: (user.balance || 0) + action.payload.reward,
            lastSpinDate: today
          } : user
        )
      };
    case UserActionTypes.SPIN_WHEEL_FAILURE:
      return {
        ...state,
        spinWheel: {
          ...state.spinWheel,
          loading: false
        },
        error: action.payload
      };
    case UserActionTypes.CREATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UserActionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
        total: state.total + 1
      };
    case UserActionTypes.CREATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    
    default:
      return state;
  }
};
