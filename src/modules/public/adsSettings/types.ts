// Ads Settings types
export interface AdsSettings {
  _id?: string;
  enableGigaPubAds: boolean;
  gigaPubAppId : string;
  monetagEnabled : boolean;
  monetagZoneId : string;
  adsWatchLimit : number;
  defaultAdsReward : number;
  vpnNotAllowed: boolean;
  minWatchTime : number;
  adsRewardMultiplier : number;
  vpnProvider : string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdsSettingsState {
  settings: AdsSettings | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

export enum AdsSettingsActionTypes {
  FETCH_ADS_SETTINGS_REQUEST = 'FETCH_ADS_SETTINGS_REQUEST',
  FETCH_ADS_SETTINGS_SUCCESS = 'FETCH_ADS_SETTINGS_SUCCESS',
  FETCH_ADS_SETTINGS_FAILURE = 'FETCH_ADS_SETTINGS_FAILURE',
  UPDATE_ADS_SETTINGS_REQUEST = 'UPDATE_ADS_SETTINGS_REQUEST',
  UPDATE_ADS_SETTINGS_SUCCESS = 'UPDATE_ADS_SETTINGS_SUCCESS',
  UPDATE_ADS_SETTINGS_FAILURE = 'UPDATE_ADS_SETTINGS_FAILURE',
  RESET_ADS_SETTINGS_ERROR = 'RESET_ADS_SETTINGS_ERROR'
}

export interface FetchAdsSettingsRequestAction {
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_REQUEST;
}

export interface FetchAdsSettingsSuccessAction {
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_SUCCESS;
  payload: AdsSettings;
}

export interface FetchAdsSettingsFailureAction {
  type: AdsSettingsActionTypes.FETCH_ADS_SETTINGS_FAILURE;
  payload: string;
}

export interface UpdateAdsSettingsRequestAction {
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_REQUEST;
  payload: Partial<AdsSettings>;
}

export interface UpdateAdsSettingsSuccessAction {
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_SUCCESS;
  payload: AdsSettings;
}

export interface UpdateAdsSettingsFailureAction {
  type: AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_FAILURE;
  payload: string;
}

export interface ResetAdsSettingsErrorAction {
  type: AdsSettingsActionTypes.RESET_ADS_SETTINGS_ERROR;
}

export type AdsSettingsAction =
  | FetchAdsSettingsRequestAction
  | FetchAdsSettingsSuccessAction
  | FetchAdsSettingsFailureAction
  | UpdateAdsSettingsRequestAction
  | UpdateAdsSettingsSuccessAction
  | UpdateAdsSettingsFailureAction
  | ResetAdsSettingsErrorAction;
