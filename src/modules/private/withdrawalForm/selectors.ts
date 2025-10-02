import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { WithdrawalFormState } from './types';

// Base selector
const selectWithdrawalFormState = (state: RootState): WithdrawalFormState => 
  state.private.withdrawalForm;

// Form Data Selectors
export const selectFormData = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.formData
);

export const selectCurrency = createSelector(
  [selectFormData],
  (formData) => formData.currency
);

export const selectNetwork = createSelector(
  [selectFormData],
  (formData) => formData.network
);

export const selectAddress = createSelector(
  [selectFormData],
  (formData) => formData.address
);

export const selectAmount = createSelector(
  [selectFormData],
  (formData) => formData.amount
);

export const selectMemo = createSelector(
  [selectFormData],
  (formData) => formData.memo
);

// UI State Selectors
export const selectCurrentStep = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.currentStep
);

export const selectShowConfirmation = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.showConfirmation
);

export const selectShowProgress = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.showProgress
);

export const selectShowResult = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.showResult
);

// Result State Selectors
export const selectWithdrawalSuccess = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.withdrawalSuccess
);

export const selectErrorMessage = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.errorMessage
);

export const selectErrorCode = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.errorCode
);

// Loading State Selectors
export const selectWithdrawalFormLoading = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.loading
);

export const selectWithdrawalFormError = createSelector(
  [selectWithdrawalFormState],
  (withdrawalFormState) => withdrawalFormState.error
);

// Computed Selectors
export const selectIsFormValid = createSelector(
  [selectFormData],
  (formData) => {
    return !!(
      formData.currency &&
      formData.network &&
      formData.address &&
      formData.amount &&
      parseFloat(formData.amount) > 0
    );
  }
);

export const selectCanProceedToNextStep = createSelector(
  [selectCurrentStep, selectFormData],
  (currentStep, formData) => {
    switch (currentStep) {
      case 0:
        return !!(formData.currency && formData.amount && parseFloat(formData.amount) > 0);
      case 1:
        return !!formData.address;
      case 2:
        return true;
      default:
        return false;
    }
  }
);

export const selectWithdrawalFormSummary = createSelector(
  [selectFormData],
  (formData) => ({
    currency: formData.currency,
    network: formData.network,
    amount: formData.amount,
    address: formData.address,
    memo: formData.memo,
    numericAmount: parseFloat(formData.amount) || 0
  })
);
