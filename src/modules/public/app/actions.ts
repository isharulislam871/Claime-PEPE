import {
  AppActionTypes,
  InitializeAppAction,
  InitializeAppSuccessAction,
  InitializeAppFailureAction,
  CheckMaintenanceAction,
  CheckMaintenanceSuccessAction,
  CheckMaintenanceFailureAction,
  InitializeTelegramWebAppAction,
  TelegramWebAppReadyAction,
  TelegramWriteAccessGrantedAction,
  ResetAppStateAction,
  MaintenanceStatus,
} from './types';

// App initialization actions
export const initializeApp = (): InitializeAppAction => ({
  type: AppActionTypes.INITIALIZE_APP,
});

export const initializeAppSuccess = (): InitializeAppSuccessAction => ({
  type: AppActionTypes.INITIALIZE_APP_SUCCESS,
});

export const initializeAppFailure = (error: string): InitializeAppFailureAction => ({
  type: AppActionTypes.INITIALIZE_APP_FAILURE,
  payload: error,
});

// Maintenance check actions
export const checkMaintenance = (): CheckMaintenanceAction => ({
  type: AppActionTypes.CHECK_MAINTENANCE,
});

export const checkMaintenanceSuccess = (maintenanceStatus: MaintenanceStatus): CheckMaintenanceSuccessAction => ({
  type: AppActionTypes.CHECK_MAINTENANCE_SUCCESS,
  payload: maintenanceStatus,
});

export const checkMaintenanceFailure = (error: string): CheckMaintenanceFailureAction => ({
  type: AppActionTypes.CHECK_MAINTENANCE_FAILURE,
  payload: error,
});

// Telegram WebApp actions
export const initializeTelegramWebApp = (): InitializeTelegramWebAppAction => ({
  type: AppActionTypes.INITIALIZE_TELEGRAM_WEBAPP,
});

export const telegramWebAppReady = (): TelegramWebAppReadyAction => ({
  type: AppActionTypes.TELEGRAM_WEBAPP_READY,
});

export const telegramWriteAccessGranted = (granted: boolean): TelegramWriteAccessGrantedAction => ({
  type: AppActionTypes.TELEGRAM_WRITE_ACCESS_GRANTED,
  payload: granted,
});

// Reset action
export const resetAppState = (): ResetAppStateAction => ({
  type: AppActionTypes.RESET_APP_STATE,
});
