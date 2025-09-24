import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/modules/store';

// Base selector for app state
const selectAppState = (state: RootState) => state.public.app;

// Memoized selectors using reselect
export const selectIsInitialized = createSelector(
  [selectAppState],
  (appState) => appState.isInitialized
);

export const selectIsInitializing = createSelector(
  [selectAppState],
  (appState) => appState.isInitializing
);

export const selectMaintenanceStatus = createSelector(
  [selectAppState],
  (appState) => appState.maintenanceStatus
);

export const selectTelegramWebAppReady = createSelector(
  [selectAppState],
  (appState) => appState.telegramWebAppReady
);

export const selectWriteAccessGranted = createSelector(
  [selectAppState],
  (appState) => appState.writeAccessGranted
);

export const selectAppError = createSelector(
  [selectAppState],
  (appState) => appState.error
);

// Composite selectors
export const selectIsMaintenanceEnabled = createSelector(
  [selectMaintenanceStatus],
  (maintenanceStatus) => maintenanceStatus?.enabled || false
);

export const selectMaintenanceMessage = createSelector(
  [selectMaintenanceStatus],
  (maintenanceStatus) => maintenanceStatus?.message
);

export const selectAppInitializationState = createSelector(
  [selectIsInitialized, selectIsInitializing, selectAppError],
  (isInitialized, isInitializing, error) => ({
    isInitialized,
    isInitializing,
    error,
  })
);

export const selectTelegramState = createSelector(
  [selectTelegramWebAppReady, selectWriteAccessGranted],
  (telegramWebAppReady, writeAccessGranted) => ({
    telegramWebAppReady,
    writeAccessGranted,
  })
);

// Complete app state selector
export const selectCompleteAppState = createSelector(
  [selectAppState],
  (appState) => appState
);
