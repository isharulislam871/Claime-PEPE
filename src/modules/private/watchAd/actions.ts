import { 
  
  WATCH_AD_REQUEST,
  WATCH_AD_SUCCESS,
  WATCH_AD_FAILURE,
  CLEAR_AD_ERROR,
  RESET_AD_STATE
} from './constants';
 

 
// Watch Ad Actions
export const watchAdRequest = ( ) => ({
  type: WATCH_AD_REQUEST,
 
});

export const watchAdSuccess = ( ) => ({
  type: WATCH_AD_SUCCESS,
});

export const watchAdFailure = (error: string) => ({
  type: WATCH_AD_FAILURE,
  payload: error
});

// Utility Actions
export const clearAdError = () => ({
  type: CLEAR_AD_ERROR
});

export const resetAdState = () => ({
  type: RESET_AD_STATE
});
