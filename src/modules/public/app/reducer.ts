import { AppState, AppAction, AppActionTypes } from './types';

const initialState: AppState = {
  isInitialized: false,
  isInitializing: false,
  maintenanceStatus: null,
  telegramWebAppReady: false,
  writeAccessGranted: false,
  error: null,
};

export const appReducer = (state = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case AppActionTypes.INITIALIZE_APP:
      return {
        ...state,
        isInitializing: true,
        error: null,
      };

    case AppActionTypes.INITIALIZE_APP_SUCCESS:
      return {
        ...state,
        isInitialized: true,
        isInitializing: false,
        error: null,
      };

    case AppActionTypes.INITIALIZE_APP_FAILURE:
      return {
        ...state,
        isInitializing: false,
        error: action.payload,
      };

    case AppActionTypes.CHECK_MAINTENANCE_SUCCESS:
      return {
        ...state,
        maintenanceStatus: action.payload,
      };

    case AppActionTypes.CHECK_MAINTENANCE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case AppActionTypes.TELEGRAM_WEBAPP_READY:
      return {
        ...state,
        telegramWebAppReady: true,
      };

    case AppActionTypes.TELEGRAM_WRITE_ACCESS_GRANTED:
      return {
        ...state,
        writeAccessGranted: action.payload,
      };

    case AppActionTypes.RESET_APP_STATE:
      return initialState;

    default:
      return state;
  }
};
