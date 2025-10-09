import { RootState } from '../../store';
import { SwapState } from './types';

// Base selector
const selectSwapState = (state: RootState): SwapState => state.private.swap;

// UI State Selectors
export const selectFromAmount = (state: RootState): string => 
  selectSwapState(state).fromAmount;

export const selectSelectedCurrency = (state: RootState): string => 
  selectSwapState(state).selectedCurrency;

export const selectIsSwapping = (state: RootState): boolean => 
  selectSwapState(state).isSwapping;

export const selectShowConfirmation = (state: RootState): boolean => 
  selectSwapState(state).showConfirmation;

export const selectShowProcessing = (state: RootState): boolean => 
  selectSwapState(state).showProcessing;

export const selectShowResult = (state: RootState): boolean => 
  selectSwapState(state).showResult;

export const selectShowMaintenance = (state: RootState): boolean => 
  selectSwapState(state).showMaintenance;

// Swap Result State Selectors
export const selectSwapSuccess = (state: RootState): boolean => 
  selectSwapState(state).swapSuccess;

export const selectSwapErrorMessage = (state: RootState): string => 
  selectSwapState(state).errorMessage;

export const selectSwapErrorCode = (state: RootState): string => 
  selectSwapState(state).errorCode;

export const selectTransactionId = (state: RootState): string | undefined => 
  selectSwapState(state).transactionId;

// Data State Selectors
export const selectSwapOptions = (state: RootState) => 
  selectSwapState(state).swapOptions;

export const selectRecentTransactions = (state: RootState) => 
  selectSwapState(state).recentTransactions;

export const selectSwapLoading = (state: RootState): boolean => 
  selectSwapState(state).loading;

export const selectSwapError = (state: RootState): string | null => 
  selectSwapState(state).error;

// Computed Selectors
export const selectSelectedSwapOption = (state: RootState) => {
  const swapOptions = selectSwapOptions(state);
  const selectedCurrency = selectSelectedCurrency(state);
  return swapOptions.find(option => 
    option.value.toLowerCase() === selectedCurrency.toLowerCase()
  );
};

export const selectPointsToSwap = (state: RootState): number => {
  const fromAmount = selectFromAmount(state);
  return parseInt(fromAmount) || 0;
};

export const selectConvertedAmount = (state: RootState): number => {
  const pointsToSwap = selectPointsToSwap(state);
  const selectedOption = selectSelectedSwapOption(state);
  return pointsToSwap * (selectedOption?.rate || 0);
};

export const selectCanSwap = (state: RootState): boolean => {
  const pointsToSwap = selectPointsToSwap(state);
  const isSwapping = selectIsSwapping(state);
  return pointsToSwap > 0 && !isSwapping;
};

export const selectSwapFormData = (state: RootState) => ({
  fromAmount: selectFromAmount(state),
  selectedCurrency: selectSelectedCurrency(state),
  pointsToSwap: selectPointsToSwap(state),
  convertedAmount: selectConvertedAmount(state),
  selectedOption: selectSelectedSwapOption(state),
  canSwap: selectCanSwap(state)
});

// Transaction Details Selectors
export const selectSelectedTransaction = (state: RootState) => 
  selectSwapState(state).selectedTransaction;
