import { useSelector } from 'react-redux';
import {
  selectIsInitialized,
  selectIsInitializing,
  selectMaintenanceStatus,
  selectTelegramWebAppReady,
  selectWriteAccessGranted,
  selectAppError,
  selectIsMaintenanceEnabled,
  selectMaintenanceMessage,
  selectAppInitializationState,
  selectTelegramState,
  selectCompleteAppState,
} from './selectors';

// Custom hooks for easier usage in components
export const useAppInitialization = () => {
  return useSelector(selectAppInitializationState);
};

export const useMaintenanceStatus = () => {
  const isEnabled = useSelector(selectIsMaintenanceEnabled);
  const message = useSelector(selectMaintenanceMessage);
  const fullStatus = useSelector(selectMaintenanceStatus);
  
  return {
    isEnabled,
    message,
    fullStatus,
  };
};

export const useTelegramState = () => {
  return useSelector(selectTelegramState);
};

export const useAppState = () => {
  return useSelector(selectCompleteAppState);
};

// Individual hooks for specific state pieces
export const useIsAppInitialized = () => useSelector(selectIsInitialized);
export const useIsAppInitializing = () => useSelector(selectIsInitializing);
export const useAppError = () => useSelector(selectAppError);
export const useIsTelegramReady = () => useSelector(selectTelegramWebAppReady);
export const useIsWriteAccessGranted = () => useSelector(selectWriteAccessGranted);
