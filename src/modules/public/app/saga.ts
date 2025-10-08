'use client';

import { call, put, takeLatest, Effect, all, fork } from 'redux-saga/effects';
import { API_CALL, generateSignature } from 'auth-fingerprint';
import { getCurrentUser } from '@/lib/api';
import {
  AppActionTypes,
  MaintenanceStatus,
} from './types';
import {
  initializeAppSuccess,
  initializeAppFailure,
  checkMaintenanceSuccess,
  checkMaintenanceFailure,
  telegramWebAppReady,
  telegramWriteAccessGranted,
} from './actions';

// Maintenance check saga
function* checkMaintenanceSaga(): Generator<Effect, MaintenanceStatus, unknown> {
  try {
    const { hash, signature, timestamp } = generateSignature(
      JSON.stringify(getCurrentUser()),
      process.env.NEXTAUTH_SECRET || ''
    );

    const { response, status }: any = yield call(API_CALL, {
      url: '/maintenance',
      method: 'GET',
      params: { hash, signature, timestamp }
    });

    if (status === 200) {
      const maintenanceStatus: MaintenanceStatus = {
        enabled: response.maintenance?.enabled || false,
        message: response.maintenance?.message,
      };
      yield put(checkMaintenanceSuccess(maintenanceStatus));
      return maintenanceStatus;
    } else {
      yield put(checkMaintenanceFailure('Failed to check maintenance status'));
      return { enabled: false };
    }
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    yield put(checkMaintenanceFailure('Error checking maintenance status'));
    return { enabled: false };
  }
}

// Telegram WebApp initialization saga
function* initializeTelegramWebAppSaga(): Generator<Effect, void, unknown> {
  try {
    const webApp = (window as any).Telegram?.WebApp;
    
    if (webApp) {
      // Initialize Telegram WebApp
      webApp.ready();
      yield put(telegramWebAppReady());

      // Request write access for enhanced user data
      if (webApp.requestWriteAccess) {
        webApp.requestWriteAccess((granted: boolean) => {
          console.log('Write access:', granted ? 'granted' : 'denied');
          if (granted) {
            console.log('App can now access user contact information');
          }
        });
        yield put(telegramWriteAccessGranted(true));
      }
    } else {
      console.warn('Telegram WebApp not available');
      yield put(telegramWriteAccessGranted(false));
    }
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    yield put(telegramWriteAccessGranted(false));
  }
}

// Main app initialization saga
function* initializeAppSaga(): Generator<Effect, void, unknown> {
  try {
    // Check maintenance status first
    const maintenanceStatus = yield call(checkMaintenanceSaga);
    
    // If maintenance is enabled, don't proceed with further initialization
    if ((maintenanceStatus as MaintenanceStatus).enabled) {
      yield put(initializeAppSuccess());
      return;
    }

    // Initialize Telegram WebApp
    yield call(initializeTelegramWebAppSaga);

    // Mark app as successfully initialized
    yield put(initializeAppSuccess());
  } catch (error) {
    console.error('Error initializing app:', error);
    yield put(initializeAppFailure('Failed to initialize app'));
  }
}

// Watcher Sagas
function* watchInitializeApp() {
  yield takeLatest(AppActionTypes.INITIALIZE_APP, initializeAppSaga);
}

function* watchCheckMaintenance() {
  yield takeLatest(AppActionTypes.CHECK_MAINTENANCE, checkMaintenanceSaga);
}

function* watchInitializeTelegramWebApp() {
  yield takeLatest(AppActionTypes.INITIALIZE_TELEGRAM_WEBAPP, initializeTelegramWebAppSaga);
}

// Root app saga
export function* appSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(watchInitializeApp),
    fork(watchCheckMaintenance),
    fork(watchInitializeTelegramWebApp),
  ]);
}
