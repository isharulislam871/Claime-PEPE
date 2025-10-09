export interface SwapOption {
  label: string;
  value: string;
  rate: number;
  icon: string;
  description: string;
}

export interface SwapTransaction {
  id: string;
  telegramId: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  conversionRate: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SwapState {
  // UI State
  fromAmount: string;
  selectedCurrency: string;
  isSwapping: boolean;
  showConfirmation: boolean;
  showProcessing: boolean;
  showResult: boolean;
  showMaintenance: boolean;
  
  // Swap Result State
  swapSuccess: boolean;
  errorMessage: string;
  errorCode: string;
  transactionId?: string;
  
  // Data State
  swapOptions: SwapOption[];
  recentTransactions: SwapTransaction[];
  selectedTransaction: SwapTransaction | null;
  loading: boolean;
  error: string | null;
}

export enum SwapActionTypes {
  // UI Actions
  SET_FROM_AMOUNT = 'SET_FROM_AMOUNT',
  SET_SELECTED_CURRENCY = 'SET_SELECTED_CURRENCY',
  SET_SHOW_CONFIRMATION = 'SET_SHOW_CONFIRMATION',
  SET_SHOW_PROCESSING = 'SET_SHOW_PROCESSING',
  SET_SHOW_RESULT = 'SET_SHOW_RESULT',
  SET_SHOW_MAINTENANCE = 'SET_SHOW_MAINTENANCE',
  RESET_SWAP_FORM = 'RESET_SWAP_FORM',
  
  // Transaction Details Actions
  SET_SELECTED_TRANSACTION = 'SET_SELECTED_TRANSACTION',
  
  // Swap Process Actions
  SWAP_REQUEST = 'SWAP_REQUEST',
  SWAP_SUCCESS = 'SWAP_SUCCESS',
  SWAP_FAILURE = 'SWAP_FAILURE',
  
  // Swap Options Actions
  FETCH_SWAP_OPTIONS_REQUEST = 'FETCH_SWAP_OPTIONS_REQUEST',
  FETCH_SWAP_OPTIONS_SUCCESS = 'FETCH_SWAP_OPTIONS_SUCCESS',
  FETCH_SWAP_OPTIONS_FAILURE = 'FETCH_SWAP_OPTIONS_FAILURE',
  
  // Transaction History Actions
  FETCH_SWAP_HISTORY_REQUEST = 'FETCH_SWAP_HISTORY_REQUEST',
  FETCH_SWAP_HISTORY_SUCCESS = 'FETCH_SWAP_HISTORY_SUCCESS',
  FETCH_SWAP_HISTORY_FAILURE = 'FETCH_SWAP_HISTORY_FAILURE',
  
  // Clear Error
  CLEAR_SWAP_ERROR = 'CLEAR_SWAP_ERROR'
}

// UI Action Interfaces
export interface SetFromAmountAction {
  type: SwapActionTypes.SET_FROM_AMOUNT;
  payload: string;
}

export interface SetSelectedCurrencyAction {
  type: SwapActionTypes.SET_SELECTED_CURRENCY;
  payload: string;
}

export interface SetShowConfirmationAction {
  type: SwapActionTypes.SET_SHOW_CONFIRMATION;
  payload: boolean;
}

export interface SetShowProcessingAction {
  type: SwapActionTypes.SET_SHOW_PROCESSING;
  payload: boolean;
}

export interface SetShowResultAction {
  type: SwapActionTypes.SET_SHOW_RESULT;
  payload: boolean;
}

export interface SetShowMaintenanceAction {
  type: SwapActionTypes.SET_SHOW_MAINTENANCE;
  payload: boolean;
}

export interface ResetSwapFormAction {
  type: SwapActionTypes.RESET_SWAP_FORM;
}

export interface SetSelectedTransactionAction {
  type: SwapActionTypes.SET_SELECTED_TRANSACTION;
  payload: SwapTransaction | null;
}

// Swap Process Action Interfaces
export interface SwapRequestAction {
  type: SwapActionTypes.SWAP_REQUEST;
  payload: {
    telegramId: string;
    fromAmount: number;
    toCurrency: string;
    toAmount: number;
  };
}

export interface SwapSuccessAction {
  type: SwapActionTypes.SWAP_SUCCESS;
  payload: {
    transactionId: string;
    transaction: SwapTransaction;
  };
}

export interface SwapFailureAction {
  type: SwapActionTypes.SWAP_FAILURE;
  payload: {
    errorMessage: string;
    errorCode: string;
  };
}

// Swap Options Action Interfaces
export interface FetchSwapOptionsRequestAction {
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_REQUEST;
}

export interface FetchSwapOptionsSuccessAction {
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_SUCCESS;
  payload: {
    swapOptions: SwapOption[];
  };
}

export interface FetchSwapOptionsFailureAction {
  type: SwapActionTypes.FETCH_SWAP_OPTIONS_FAILURE;
  payload: string;
}

// Transaction History Action Interfaces
export interface FetchSwapHistoryRequestAction {
  type: SwapActionTypes.FETCH_SWAP_HISTORY_REQUEST;
  payload: {
    telegramId: string;
  };
}

export interface FetchSwapHistorySuccessAction {
  type: SwapActionTypes.FETCH_SWAP_HISTORY_SUCCESS;
  payload: {
    transactions: SwapTransaction[];
  };
}

export interface FetchSwapHistoryFailureAction {
  type: SwapActionTypes.FETCH_SWAP_HISTORY_FAILURE;
  payload: string;
}

// Clear Error Action Interface
export interface ClearSwapErrorAction {
  type: SwapActionTypes.CLEAR_SWAP_ERROR;
}

export type SwapAction =
  | SetFromAmountAction
  | SetSelectedCurrencyAction
  | SetShowConfirmationAction
  | SetShowProcessingAction
  | SetShowResultAction
  | SetShowMaintenanceAction
  | ResetSwapFormAction
  | SetSelectedTransactionAction
  | SwapRequestAction
  | SwapSuccessAction
  | SwapFailureAction
  | FetchSwapOptionsRequestAction
  | FetchSwapOptionsSuccessAction
  | FetchSwapOptionsFailureAction
  | FetchSwapHistoryRequestAction
  | FetchSwapHistorySuccessAction
  | FetchSwapHistoryFailureAction
  | ClearSwapErrorAction;
