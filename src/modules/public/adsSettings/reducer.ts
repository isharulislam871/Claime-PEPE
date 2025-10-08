import { 
  AdsSettingsState, 
  AdsSettingsAction, 
  AdsSettingsActionTypes 
} from './types';

const initialState: AdsSettingsState = {
  settings: null,
  loading: false,
  error: null,
  updating: false
};

export const adsSettingsReducer = (
  state = initialState, 
  action: AdsSettingsAction
): AdsSettingsState => {
  switch (action.type) {
    case AdsSettingsActionTypes.FETCH_ADS_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AdsSettingsActionTypes.FETCH_ADS_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload,
        error: null
      };

    case AdsSettingsActionTypes.FETCH_ADS_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_REQUEST:
      return {
        ...state,
        updating: true,
        error: null
      };

    case AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_SUCCESS:
      return {
        ...state,
        updating: false,
        settings: action.payload,
        error: null
      };

    case AdsSettingsActionTypes.UPDATE_ADS_SETTINGS_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload
      };

    case AdsSettingsActionTypes.RESET_ADS_SETTINGS_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};
