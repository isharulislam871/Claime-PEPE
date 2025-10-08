import {
  WithdrawalFormActionTypes,
  WithdrawalFormData,
  SetFormDataAction,
  UpdateFormFieldAction,
  ResetFormAction,
  SetCurrentStepAction,
  SetShowConfirmationAction,
  SetShowProgressAction,
  SetShowResultAction,
  SetWithdrawalSuccessAction,
  SetErrorMessageAction,
  SetErrorCodeAction,
  ClearErrorAction,
  ClearResultStateAction
} from './types';

// Form Data Actions
export const setFormData = (formData: WithdrawalFormData): SetFormDataAction => ({
  type: WithdrawalFormActionTypes.SET_FORM_DATA,
  payload: formData
});

export const updateFormField = (field: keyof WithdrawalFormData, value: string): UpdateFormFieldAction => ({
  type: WithdrawalFormActionTypes.UPDATE_FORM_FIELD,
  payload: { field, value }
});

export const resetForm = (): ResetFormAction => ({
  type: WithdrawalFormActionTypes.RESET_FORM
});

// UI State Actions
export const setCurrentStep = (step: number): SetCurrentStepAction => ({
  type: WithdrawalFormActionTypes.SET_CURRENT_STEP,
  payload: step
});

export const setShowConfirmation = (show: boolean): SetShowConfirmationAction => ({
  type: WithdrawalFormActionTypes.SET_SHOW_CONFIRMATION,
  payload: show
});

export const setShowProgress = (show: boolean): SetShowProgressAction => ({
  type: WithdrawalFormActionTypes.SET_SHOW_PROGRESS,
  payload: show
});

export const setShowResult = (show: boolean): SetShowResultAction => ({
  type: WithdrawalFormActionTypes.SET_SHOW_RESULT,
  payload: show
});

// Result State Actions
export const setWithdrawalSuccess = (success: boolean): SetWithdrawalSuccessAction => ({
  type: WithdrawalFormActionTypes.SET_WITHDRAWAL_SUCCESS,
  payload: success
});

export const setErrorMessage = (message: string): SetErrorMessageAction => ({
  type: WithdrawalFormActionTypes.SET_ERROR_MESSAGE,
  payload: message
});

export const setErrorCode = (code: string): SetErrorCodeAction => ({
  type: WithdrawalFormActionTypes.SET_ERROR_CODE,
  payload: code
});

// Clear Actions
export const clearError = (): ClearErrorAction => ({
  type: WithdrawalFormActionTypes.CLEAR_ERROR
});

export const clearResultState = (): ClearResultStateAction => ({
  type: WithdrawalFormActionTypes.CLEAR_RESULT_STATE
});
