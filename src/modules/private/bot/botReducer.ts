import { BotState, BotAction, BotActionTypes } from './types';

const initialState: BotState = {
  config: null,
  loading: false,
  error: null
};

export const botReducer = (state = initialState, action: BotAction): BotState => {
  switch (action.type) {
    case BotActionTypes.FETCH_BOT_CONFIG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case BotActionTypes.FETCH_BOT_CONFIG_SUCCESS:
      return {
        ...state,
        loading: false,
        config: action.payload,
        error: null
      };

    case BotActionTypes.FETCH_BOT_CONFIG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case BotActionTypes.UPDATE_BOT_CONFIG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case BotActionTypes.UPDATE_BOT_CONFIG_SUCCESS:
      return {
        ...state,
        loading: false,
        config: action.payload,
        error: null
      };

    case BotActionTypes.UPDATE_BOT_CONFIG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};
