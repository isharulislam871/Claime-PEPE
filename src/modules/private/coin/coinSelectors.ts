import { RootState } from '@/modules/store';
import { CoinState } from './coinTypes';

export const selectCoinState = (state: RootState): CoinState => state.private.coin;

export const selectCoins = (state: RootState) => selectCoinState(state).coins;

export const selectActiveCoins = (state: RootState) => 
  selectCoinState(state).coins.filter(coin => coin.isActive);

export const selectPepeConversionRates = (state: RootState) => selectCoinState(state).pepeConversionRates;

export const selectUsdRates = (state: RootState) => selectCoinState(state).usdRates;

export const selectCoinLoading = (state: RootState) => selectCoinState(state).loading;

export const selectCoinError = (state: RootState) => selectCoinState(state).error;
