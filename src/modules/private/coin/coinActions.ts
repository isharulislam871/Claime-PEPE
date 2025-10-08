import {
  CoinActionTypes,
  FetchCoinsRequestAction,
  FetchCoinsSuccessAction,
  FetchCoinsFailureAction,
  FetchConversionRatesRequestAction,
  FetchConversionRatesSuccessAction,
  FetchConversionRatesFailureAction,
  Coin,
  ConversionRates,
} from './coinTypes';

// Fetch Coins Actions
export const fetchCoinsRequest = (): FetchCoinsRequestAction => ({
  type: CoinActionTypes.FETCH_COINS_REQUEST,
});

export const fetchCoinsSuccess = (coins: Coin[]): FetchCoinsSuccessAction => ({
  type: CoinActionTypes.FETCH_COINS_SUCCESS,
  payload: coins,
});

export const fetchCoinsFailure = (error: string): FetchCoinsFailureAction => ({
  type: CoinActionTypes.FETCH_COINS_FAILURE,
  payload: error,
});

// Fetch Conversion Rates Actions
export const fetchConversionRatesRequest = (): FetchConversionRatesRequestAction => ({
  type: CoinActionTypes.FETCH_CONVERSION_RATES_REQUEST,
});

export const fetchConversionRatesSuccess = (
  pepeConversionRates: ConversionRates,
  usdRates: ConversionRates
): FetchConversionRatesSuccessAction => ({
  type: CoinActionTypes.FETCH_CONVERSION_RATES_SUCCESS,
  payload: {
    pepeConversionRates,
    usdRates,
  },
});

export const fetchConversionRatesFailure = (error: string): FetchConversionRatesFailureAction => ({
  type: CoinActionTypes.FETCH_CONVERSION_RATES_FAILURE,
  payload: error,
});
