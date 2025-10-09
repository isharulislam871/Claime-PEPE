import { SwapState, SwapAction, SwapActionTypes } from './types';

const initialState: SwapState = {
  // UI State
  fromAmount: '',
  selectedCurrency: '',
  isSwapping: false,
  showConfirmation: false,
  showProcessing: false,
  showResult: false,
  showMaintenance: false,
  
  // Swap Result State
  swapSuccess: false,
  errorMessage: '',
  errorCode: '',
  transactionId: undefined,
  
  // Data State
  swapOptions: [],
  recentTransactions: [],
  selectedTransaction: null,
  loading: false,
  error: null
};

export const swapReducer = (state = initialState, action: SwapAction): SwapState => {
  switch (action.type) {
    // UI Actions
    case SwapActionTypes.SET_FROM_AMOUNT:
      return {
        ...state,
        fromAmount: action.payload
      };

    case SwapActionTypes.SET_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.payload
      };

    case SwapActionTypes.SET_SHOW_CONFIRMATION:
      return {
        ...state,
        showConfirmation: action.payload
      };

    case SwapActionTypes.SET_SHOW_PROCESSING:
      return {
        ...state,
        showProcessing: action.payload
      };

    case SwapActionTypes.SET_SHOW_RESULT:
      return {
        ...state,
        showResult: action.payload
      };

    case SwapActionTypes.SET_SHOW_MAINTENANCE:
      return {
        ...state,
        showMaintenance: action.payload
      };

    case SwapActionTypes.RESET_SWAP_FORM:
      return {
        ...state,
        fromAmount: '',
        selectedCurrency: '',
        showConfirmation: false,
        showProcessing: false,
        showResult: false,
        swapSuccess: false,
        errorMessage: '',
        errorCode: '',
        transactionId: undefined,
        error: null
      };

    case SwapActionTypes.SET_SELECTED_TRANSACTION:
      return {
        ...state,
        selectedTransaction: action.payload
      };

    // Swap Process Actions
    case SwapActionTypes.SWAP_REQUEST:
      return {
        ...state,
        isSwapping: true,
        loading: true,
        error: null,
        errorMessage: '',
        errorCode: ''
      };

    case SwapActionTypes.SWAP_SUCCESS:
      return {
        ...state,
        isSwapping: false,
        loading: false,
        swapSuccess: true,
        transactionId: action.payload.transactionId,
        recentTransactions: [action.payload.transaction, ...state.recentTransactions],
        error: null,
        errorMessage: '',
        errorCode: ''
      };

    case SwapActionTypes.SWAP_FAILURE:
      return {
        ...state,
        isSwapping: false,
        loading: false,
        swapSuccess: false,
        errorMessage: action.payload.errorMessage,
        errorCode: action.payload.errorCode,
        error: action.payload.errorMessage
      };

    // Swap Options Actions
    case SwapActionTypes.FETCH_SWAP_OPTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case SwapActionTypes.FETCH_SWAP_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        swapOptions: action.payload.swapOptions,
        error: null
      };

    case SwapActionTypes.FETCH_SWAP_OPTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Transaction History Actions
    case SwapActionTypes.FETCH_SWAP_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case SwapActionTypes.FETCH_SWAP_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        recentTransactions: action.payload.transactions,
        error: null
      };

    case SwapActionTypes.FETCH_SWAP_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Clear Error
    case SwapActionTypes.CLEAR_SWAP_ERROR:
      return {
        ...state,
        error: null,
        errorMessage: '',
        errorCode: ''
      };

    default:
      return state;
  }
};
