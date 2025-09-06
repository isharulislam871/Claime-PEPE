// Coin Types
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  network: string;
  minWithdraw: number;
  maxWithdraw: number;
  fee: number;
  icon?: string;
  logoUrl?: string;
  decimals: number;
  isActive: boolean;
  networks: {
    network: string;
    contractAddress?: string;
    isNative: boolean;
  }[];
}

export interface ConversionRates {
  [coinSymbol: string]: number;
}

export interface CoinState {
  coins: Coin[];
  pepeConversionRates: ConversionRates;
  usdRates: ConversionRates;
  loading: boolean;
  error: string | null;
}

// Action Types
export enum CoinActionTypes {
  FETCH_COINS_REQUEST = 'FETCH_COINS_REQUEST',
  FETCH_COINS_SUCCESS = 'FETCH_COINS_SUCCESS',
  FETCH_COINS_FAILURE = 'FETCH_COINS_FAILURE',
  
  FETCH_CONVERSION_RATES_REQUEST = 'FETCH_CONVERSION_RATES_REQUEST',
  FETCH_CONVERSION_RATES_SUCCESS = 'FETCH_CONVERSION_RATES_SUCCESS',
  FETCH_CONVERSION_RATES_FAILURE = 'FETCH_CONVERSION_RATES_FAILURE',
}

// Action Interfaces
export interface FetchCoinsRequestAction {
  type: CoinActionTypes.FETCH_COINS_REQUEST;
  [key: string]: any;
}

export interface FetchCoinsSuccessAction {
  type: CoinActionTypes.FETCH_COINS_SUCCESS;
  payload: Coin[];
  [key: string]: any;
}

export interface FetchCoinsFailureAction {
  type: CoinActionTypes.FETCH_COINS_FAILURE;
  payload: string;
  [key: string]: any;
}

export interface FetchConversionRatesRequestAction {
  type: CoinActionTypes.FETCH_CONVERSION_RATES_REQUEST;
  [key: string]: any;
}

export interface FetchConversionRatesSuccessAction {
  type: CoinActionTypes.FETCH_CONVERSION_RATES_SUCCESS;
  payload: {
    pepeConversionRates: ConversionRates;
    usdRates: ConversionRates;
  };
  [key: string]: any;
}

export interface FetchConversionRatesFailureAction {
  type: CoinActionTypes.FETCH_CONVERSION_RATES_FAILURE;
  payload: string;
  [key: string]: any;
}

export type CoinAction =
  | FetchCoinsRequestAction
  | FetchCoinsSuccessAction
  | FetchCoinsFailureAction
  | FetchConversionRatesRequestAction
  | FetchConversionRatesSuccessAction
  | FetchConversionRatesFailureAction;
