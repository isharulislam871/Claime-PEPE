import { RootState } from '../../store';

// Ads settings selectors
export const selectAdsSettingsState = (state: RootState) => state.public.adsSettings;

export const selectAdsSettings = (state: RootState) => 
  state.public.adsSettings.settings;

export const selectAdsSettingsLoading = (state: RootState) => 
  state.public.adsSettings.loading;

export const selectAdsSettingsUpdating = (state: RootState) => 
  state.public.adsSettings.updating;

export const selectAdsSettingsError = (state: RootState) => 
  state.public.adsSettings.error;

// Computed selectors
export const selectIsAdsEnabled = (state: RootState) => 
  state.public.adsSettings.settings?.enableGigaPubAds ?? false;

export const selectAdsDailyLimit = (state: RootState) => 
  state.public.adsSettings.settings?.adsWatchLimit ?? 0;

export const selectAdsRewardPerAd = (state: RootState) => 
  state.public.adsSettings.settings?.defaultAdsReward ?? 0;

export const selectIsVpnAllowed = (state: RootState) => 
  !(state.public.adsSettings.settings?.vpnNotAllowed ?? false);

export const selectAdsCooldownTime = (state: RootState) => 
  state.public.adsSettings.settings?.minWatchTime ?? 0;
