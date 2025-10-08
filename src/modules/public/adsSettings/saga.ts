import { call, put, takeEvery } from 'redux-saga/effects';
import { 
  AdsSettingsActionTypes,
  UpdateAdsSettingsRequestAction,
  AdsSettings
} from './types';
import {
  fetchAdsSettingsSuccess,
  fetchAdsSettingsFailure,
  updateAdsSettingsSuccess,
  updateAdsSettingsFailure
} from './actions';

// API call functions
const fetchAdsSettingsAPI = async (): Promise<AdsSettings> => {
  const response = await fetch('/api/ads/settings');
  if (!response.ok) {
    throw new Error('Failed to fetch ads settings');
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch ads settings');
  }
  return data.data;
};

const updateAdsSettingsAPI = async (settings: Partial<AdsSettings>): Promise<AdsSettings> => {
  const response = await fetch('/api/ads/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update ads settings');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to update ads settings');
  }
  
  return data.data;
};

// Saga workers
function* fetchAdsSettingsSaga() {
  try {
    const settings: AdsSettings = yield call(fetchAdsSettingsAPI);
    yield put(fetchAdsSettingsSuccess(settings));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(fetchAdsSettingsFailure(errorMessage));
  }
}

function* updateAdsSettingsSaga(action: UpdateAdsSettingsRequestAction) {
  try {
    const updatedSettings: AdsSettings = yield call(updateAdsSettingsAPI, action.payload);
    yield put(updateAdsSettingsSuccess(updatedSettings));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(updateAdsSettingsFailure(errorMessage));
  }
}

// Watcher saga
export function* adsSettingsSaga() {
  yield takeEvery(AdsSettingsActionTypes.FETCH_ADS_SETTINGS_REQUEST, fetchAdsSettingsSaga);
  yield takeEvery(AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_REQUEST, updateAdsSettingsSaga);
}
