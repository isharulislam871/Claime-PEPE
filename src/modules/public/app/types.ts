export interface MaintenanceStatus {
  enabled: boolean;
  message?: string;
}

export interface AppState {
  isInitialized: boolean;
  isInitializing: boolean;
  maintenanceStatus: MaintenanceStatus | null;
  telegramWebAppReady: boolean;
  writeAccessGranted: boolean;
  error: string | null;
}

export enum AppActionTypes {
  INITIALIZE_APP = 'app/INITIALIZE_APP',
  INITIALIZE_APP_SUCCESS = 'app/INITIALIZE_APP_SUCCESS',
  INITIALIZE_APP_FAILURE = 'app/INITIALIZE_APP_FAILURE',
  CHECK_MAINTENANCE = 'app/CHECK_MAINTENANCE',
  CHECK_MAINTENANCE_SUCCESS = 'app/CHECK_MAINTENANCE_SUCCESS',
  CHECK_MAINTENANCE_FAILURE = 'app/CHECK_MAINTENANCE_FAILURE',
  INITIALIZE_TELEGRAM_WEBAPP = 'app/INITIALIZE_TELEGRAM_WEBAPP',
  TELEGRAM_WEBAPP_READY = 'app/TELEGRAM_WEBAPP_READY',
  TELEGRAM_WRITE_ACCESS_GRANTED = 'app/TELEGRAM_WRITE_ACCESS_GRANTED',
  RESET_APP_STATE = 'app/RESET_APP_STATE',
}

export interface InitializeAppAction {
  type: AppActionTypes.INITIALIZE_APP;
}

export interface InitializeAppSuccessAction {
  type: AppActionTypes.INITIALIZE_APP_SUCCESS;
}

export interface InitializeAppFailureAction {
  type: AppActionTypes.INITIALIZE_APP_FAILURE;
  payload: string;
}

export interface CheckMaintenanceAction {
  type: AppActionTypes.CHECK_MAINTENANCE;
}

export interface CheckMaintenanceSuccessAction {
  type: AppActionTypes.CHECK_MAINTENANCE_SUCCESS;
  payload: MaintenanceStatus;
}

export interface CheckMaintenanceFailureAction {
  type: AppActionTypes.CHECK_MAINTENANCE_FAILURE;
  payload: string;
}

export interface InitializeTelegramWebAppAction {
  type: AppActionTypes.INITIALIZE_TELEGRAM_WEBAPP;
}

export interface TelegramWebAppReadyAction {
  type: AppActionTypes.TELEGRAM_WEBAPP_READY;
}

export interface TelegramWriteAccessGrantedAction {
  type: AppActionTypes.TELEGRAM_WRITE_ACCESS_GRANTED;
  payload: boolean;
}

export interface ResetAppStateAction {
  type: AppActionTypes.RESET_APP_STATE;
}

export type AppAction =
  | InitializeAppAction
  | InitializeAppSuccessAction
  | InitializeAppFailureAction
  | CheckMaintenanceAction
  | CheckMaintenanceSuccessAction
  | CheckMaintenanceFailureAction
  | InitializeTelegramWebAppAction
  | TelegramWebAppReadyAction
  | TelegramWriteAccessGrantedAction
  | ResetAppStateAction;
