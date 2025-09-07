import { CoinState, CoinAction, CoinActionTypes } from './coinTypes';

const initialState: CoinState = {
  coins: [],
  pepeConversionRates: {},
  usdRates: {},
  loading: false,
  error: null,
};

export const coinReducer = (state = initialState, action: CoinAction): CoinState => {
  switch (action.type) {
    case CoinActionTypes.FETCH_COINS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CoinActionTypes.FETCH_COINS_SUCCESS:
      return {
        ...state,
        loading: false,
        coins: action.payload,
        error: null,
      };

    case CoinActionTypes.FETCH_COINS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CoinActionTypes.FETCH_CONVERSION_RATES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CoinActionTypes.FETCH_CONVERSION_RATES_SUCCESS:
      return {
        ...state,
        loading: false,
        pepeConversionRates: action.payload.pepeConversionRates,
        usdRates: action.payload.usdRates,
        error: null,
      };

    case CoinActionTypes.FETCH_CONVERSION_RATES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
