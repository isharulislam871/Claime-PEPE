import {
  WithdrawalFormState,
  WithdrawalFormAction,
  WithdrawalFormActionTypes
} from './types';

const initialState: WithdrawalFormState = {
  // Form Data
  formData: {
    currency: '',
    network: '',
    address: '',
    amount: '',
    memo: ''
  },
  
  // UI State
  currentStep: 0,
  showConfirmation: false,
  showProgress: false,
  showResult: false,
  
  // Result State
  withdrawalSuccess: false,
  errorMessage: '',
  errorCode: '',
  
  // Loading State
  loading: false,
  error: null
};

export const withdrawalFormReducer = (
  state: WithdrawalFormState = initialState,
  action: WithdrawalFormAction
): WithdrawalFormState => {
  switch (action.type) {
    // Form Data Actions
    case WithdrawalFormActionTypes.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload
      };

    case WithdrawalFormActionTypes.UPDATE_FORM_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value
        }
      };

    case WithdrawalFormActionTypes.RESET_FORM:
      return {
        ...state,
        formData: initialState.formData,
        currentStep: 0,
        showConfirmation: false,
        showProgress: false,
        showResult: false,
        withdrawalSuccess: false,
        errorMessage: '',
        errorCode: ''
      };

    // UI State Actions
    case WithdrawalFormActionTypes.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case WithdrawalFormActionTypes.SET_SHOW_CONFIRMATION:
      return {
        ...state,
        showConfirmation: action.payload
      };

    case WithdrawalFormActionTypes.SET_SHOW_PROGRESS:
      return {
        ...state,
        showProgress: action.payload
      };

    case WithdrawalFormActionTypes.SET_SHOW_RESULT:
      return {
        ...state,
        showResult: action.payload
      };

    // Result State Actions
    case WithdrawalFormActionTypes.SET_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        withdrawalSuccess: action.payload
      };

    case WithdrawalFormActionTypes.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload
      };

    case WithdrawalFormActionTypes.SET_ERROR_CODE:
      return {
        ...state,
        errorCode: action.payload
      };

    // Clear Actions
    case WithdrawalFormActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        errorMessage: '',
        errorCode: ''
      };

    case WithdrawalFormActionTypes.CLEAR_RESULT_STATE:
      return {
        ...state,
        showResult: false,
        withdrawalSuccess: false,
        errorMessage: '',
        errorCode: ''
      };

    default:
      return state;
  }
};
