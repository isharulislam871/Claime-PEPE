import { RootState } from '../../store';
import { PointSelectionState } from './types';

// Base selector
const selectPointSelectionState = (state: RootState): PointSelectionState => 
  state.private.pointSelection;

// UI State Selectors
export const selectShowAmountSheet = (state: RootState): boolean => 
  selectPointSelectionState(state).showAmountSheet;

// Data State Selectors
export const selectQuickAmounts = (state: RootState) => 
  selectPointSelectionState(state).quickAmounts;

export const selectPointSelectionLoading = (state: RootState): boolean => 
  selectPointSelectionState(state).loading;

export const selectPointSelectionError = (state: RootState): string | null => 
  selectPointSelectionState(state).error;

// Computed Selectors
export const selectFilteredQuickAmounts = (
  minAmount?: number, 
  maxAmount?: number
) => (state: RootState) => {
  const quickAmounts = selectQuickAmounts(state);
  
  if (!minAmount && !maxAmount) {
    return quickAmounts;
  }
  
  return quickAmounts.filter(amount => {
    const amountValue = parseInt(amount.id);
    const meetsMin = !minAmount || amountValue >= minAmount;
    const meetsMax = !maxAmount || amountValue <= maxAmount;
    return meetsMin && meetsMax;
  });
};

export const selectQuickAmountById = (id: string) => (state: RootState) => {
  const quickAmounts = selectQuickAmounts(state);
  return quickAmounts.find(amount => amount.id === id);
};
