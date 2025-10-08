import { WatchAdState, WatchAdAction } from './types';
import { 
  WATCH_AD_REQUEST
} from './constants';

const initialState: WatchAdState = {
  loading: false,
  watching: false,
  error: null,
};

export const watchAdReducer = (state = initialState, action: WatchAdAction): WatchAdState => {
  switch (action.type) {
    case WATCH_AD_REQUEST:
      return {
        ...state,
        watching: true,
        error: null,
      };
    
    default:
      return state;
  }
};
