export interface WithdrawalFormData {
  currency: string;
  network: string;
  address: string;
  amount: string;
  memo?: string;
}

export interface WithdrawalFormState {
  // Form Data
  formData: WithdrawalFormData;
  
  // UI State
  currentStep: number;
  showConfirmation: boolean;
  showProgress: boolean;
  showResult: boolean;
  
  // Result State
  withdrawalSuccess: boolean;
  errorMessage: string;
  errorCode: string;
  
  // Loading State
  loading: boolean;
  error: string | null;
}

export enum WithdrawalFormActionTypes {
  // Form Data Actions
  SET_FORM_DATA = 'SET_FORM_DATA',
  UPDATE_FORM_FIELD = 'UPDATE_FORM_FIELD',
  RESET_FORM = 'RESET_FORM',
  
  // UI State Actions
  SET_CURRENT_STEP = 'SET_CURRENT_STEP',
  SET_SHOW_CONFIRMATION = 'SET_SHOW_CONFIRMATION',
  SET_SHOW_PROGRESS = 'SET_SHOW_PROGRESS',
  SET_SHOW_RESULT = 'SET_SHOW_RESULT',
  
  // Result State Actions
  SET_WITHDRAWAL_SUCCESS = 'SET_WITHDRAWAL_SUCCESS',
  SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE',
  SET_ERROR_CODE = 'SET_ERROR_CODE',
  
  // Clear Actions
  CLEAR_ERROR = 'CLEAR_ERROR',
  CLEAR_RESULT_STATE = 'CLEAR_RESULT_STATE'
}

// Form Data Action Interfaces
export interface SetFormDataAction {
  type: WithdrawalFormActionTypes.SET_FORM_DATA;
  payload: WithdrawalFormData;
}

export interface UpdateFormFieldAction {
  type: WithdrawalFormActionTypes.UPDATE_FORM_FIELD;
  payload: {
    field: keyof WithdrawalFormData;
    value: string;
  };
}

export interface ResetFormAction {
  type: WithdrawalFormActionTypes.RESET_FORM;
}

// UI State Action Interfaces
export interface SetCurrentStepAction {
  type: WithdrawalFormActionTypes.SET_CURRENT_STEP;
  payload: number;
}

export interface SetShowConfirmationAction {
  type: WithdrawalFormActionTypes.SET_SHOW_CONFIRMATION;
  payload: boolean;
}

export interface SetShowProgressAction {
  type: WithdrawalFormActionTypes.SET_SHOW_PROGRESS;
  payload: boolean;
}

export interface SetShowResultAction {
  type: WithdrawalFormActionTypes.SET_SHOW_RESULT;
  payload: boolean;
}

// Result State Action Interfaces
export interface SetWithdrawalSuccessAction {
  type: WithdrawalFormActionTypes.SET_WITHDRAWAL_SUCCESS;
  payload: boolean;
}

export interface SetErrorMessageAction {
  type: WithdrawalFormActionTypes.SET_ERROR_MESSAGE;
  payload: string;
}

export interface SetErrorCodeAction {
  type: WithdrawalFormActionTypes.SET_ERROR_CODE;
  payload: string;
}

// Clear Action Interfaces
export interface ClearErrorAction {
  type: WithdrawalFormActionTypes.CLEAR_ERROR;
}

export interface ClearResultStateAction {
  type: WithdrawalFormActionTypes.CLEAR_RESULT_STATE;
}

export type WithdrawalFormAction =
  | SetFormDataAction
  | UpdateFormFieldAction
  | ResetFormAction
  | SetCurrentStepAction
  | SetShowConfirmationAction
  | SetShowProgressAction
  | SetShowResultAction
  | SetWithdrawalSuccessAction
  | SetErrorMessageAction
  | SetErrorCodeAction
  | ClearErrorAction
  | ClearResultStateAction;
