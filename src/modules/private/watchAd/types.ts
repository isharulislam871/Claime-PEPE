import { 
 
  WATCH_AD_REQUEST,
  WATCH_AD_SUCCESS,
  WATCH_AD_FAILURE,
  CLEAR_AD_ERROR,
  RESET_AD_STATE
} from './constants';

 

export interface AdStats {
  todayAdsViewed: number;
  dailyLimit: number;
  adsLeftToday: number;
  totalAdsViewed: number;
  balance: number;
  nextAdAvailable?: string;
  canWatchAd: boolean;
}

export interface WatchAdResult {
  success: boolean;
  reward: number;
  newBalance: number;
  adsLeftToday: number;
  message: string;
  nextAdAvailable?: string;
}

export interface WatchAdState {
  loading: boolean;
  watching: boolean;
  error: string | null;
}

export type WatchAdAction =
 
  | { type: typeof WATCH_AD_REQUEST;  }
  | { type: typeof WATCH_AD_FAILURE; payload: string }
  | { type: typeof CLEAR_AD_ERROR }
  | { type: typeof RESET_AD_STATE };
