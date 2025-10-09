import {
  SwapActionTypes,
  SetFromAmountAction,
  SetSelectedCurrencyAction,
  SetShowConfirmationAction,
  SetShowProcessingAction,
  SetShowResultAction,
  SetShowMaintenanceAction,
  ResetSwapFormAction,
  SetSelectedTransactionAction,
  SwapRequestAction,
  SwapSuccessAction,
  SwapFailureAction,
  FetchSwapOptionsRequestAction,
  FetchSwapOptionsSuccessAction,
  FetchSwapOptionsFailureAction,
  FetchSwapHistoryRequestAction,
  FetchSwapHistorySuccessAction,
  FetchSwapHistoryFailureAction,
  ClearSwapErrorAction,
  SwapOption,
  SwapTransaction
} from './types';

// UI Actions
export const setFromAmount = (amount: string): SetFromAmountAction => ({
  type: SwapActionTypes.SET_FROM_AMOUNT,
  payload: amount
});

export const setSelectedCurrency = (currency: string): SetSelectedCurrencyAction => ({
  type: SwapActionTypes.SET_SELECTED_CURRENCY,
  payload: currency
});

export const setShowConfirmation = (show: boolean): SetShowConfirmationAction => ({
  type: SwapActionTypes.SET_SHOW_CONFIRMATION,
  payload: show
});

export const setShowProcessing = (show: boolean): SetShowProcessingAction => ({
  type: SwapActionTypes.SET_SHOW_PROCESSING,
  payload: show
});

export const setShowResult = (show: boolean): SetShowResultAction => ({
  type: SwapActionTypes.SET_SHOW_RESULT,
  payload: show
});

export const setShowMaintenance = (show: boolean): SetShowMaintenanceAction => ({
  type: SwapActionTypes.SET_SHOW_MAINTENANCE,
  payload: show
});

export const resetSwapForm = (): ResetSwapFormAction => ({
  type: SwapActionTypes.RESET_SWAP_FORM
});

export const setSelectedTransaction = (transaction: SwapTransaction | null): SetSelectedTransactionAction => ({
  type: SwapActionTypes.SET_SELECTED_TRANSACTION,
  payload: transaction
});

// Swap Process Actions
export const swapRequest = (
  telegramId: string,
  fromAmount: number,
  toCurrency: string,
  toAmount: number
): SwapRequestAction => ({
  type: SwapActionTypes.SWAP_REQUEST,
  payload: {
    telegramId,
    fromAmount,
    toCurrency,
    toAmount
  }
});

export const swapSuccess = (
  transactionId: string,
  transaction: SwapTransaction
): SwapSuccessAction => ({
  type: SwapActionTypes.SWAP_SUCCESS,
  payload: {
    transactionId,
    transaction
  }
});

export const swapFailure = (
  errorMessage: string,
  errorCode: string
): SwapFailureAction => ({
  type: SwapActionTypes.SWAP_FAILURE,
  payload: {
    errorMessage,
    errorCode
  }
});

// Swap Options Actions
export const fetchSwapOptionsRequest = (): FetchSwapOptionsRequestAction => ({
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_REQUEST
});

export const fetchSwapOptionsSuccess = (
  swapOptions: SwapOption[]
): FetchSwapOptionsSuccessAction => ({
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_SUCCESS,
  payload: {
    swapOptions
  }
});

export const fetchSwapOptionsFailure = (error: string): FetchSwapOptionsFailureAction => ({
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_FAILURE,
  payload: error
});

// Transaction History Actions
export const fetchSwapHistoryRequest = ( ) => ({
  type: SwapActionTypes.FETCH_SWAP_HISTORY_REQUEST,
 
});

export const fetchSwapHistorySuccess = (
  transactions: SwapTransaction[]
): FetchSwapHistorySuccessAction => ({
  type: SwapActionTypes.FETCH_SWAP_HISTORY_SUCCESS,
  payload: {
    transactions
  }
});

export const fetchSwapHistoryFailure = (error: string): FetchSwapHistoryFailureAction => ({
  type: SwapActionTypes.FETCH_SWAP_HISTORY_FAILURE,
  payload: error
});

// Clear Error Action
export const clearSwapError = (): ClearSwapErrorAction => ({
  type: SwapActionTypes.CLEAR_SWAP_ERROR
});
