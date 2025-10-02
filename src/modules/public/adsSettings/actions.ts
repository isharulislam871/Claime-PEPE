import { 
  AdsSettingsActionTypes, 
  AdsSettings
} from './types';

// Fetch ads settings actions
export const fetchAdsSettingsRequest = () => ({
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_REQUEST
});

export const fetchAdsSettingsSuccess = (settings: AdsSettings) => ({
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_SUCCESS,
  payload: settings
});

export const fetchAdsSettingsFailure = (error: string) => ({
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_FAILURE,
  payload: error
});

// Update ads settings actions
export const updateAdsSettingsRequest = (settings: Partial<AdsSettings>) => ({
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_REQUEST,
  payload: settings
});

export const updateAdsSettingsSuccess = (settings: AdsSettings) => ({
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_SUCCESS,
  payload: settings
});

export const updateAdsSettingsFailure = (error: string) => ({
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_FAILURE,
  payload: error
});

// Reset error action
export const resetAdsSettingsError = () => ({
  type: AdsSettingsActionTypes.RESET_ADS_SETTINGS_ERROR
});
