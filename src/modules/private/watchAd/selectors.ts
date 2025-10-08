import { RootState } from '../../store';

  
export const selectAdsLoading = (state: RootState) => state.private.watchAd.loading;

export const selectAdWatching = (state: RootState) => state.private.watchAd.watching;

export const selectAdError = (state: RootState) => state.private.watchAd.error;
 
 