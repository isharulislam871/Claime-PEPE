export interface QuickAmount {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface PointSelectionState {
  // UI State
  showAmountSheet: boolean;
  
  // Data State
  quickAmounts: QuickAmount[];
  loading: boolean;
  error: string | null;
}

export enum PointSelectionActionTypes {
  // UI Actions
  SET_SHOW_AMOUNT_SHEET = 'SET_SHOW_AMOUNT_SHEET',
  
  // Quick Amounts Actions
  FETCH_QUICK_AMOUNTS_REQUEST = 'FETCH_QUICK_AMOUNTS_REQUEST',
  FETCH_QUICK_AMOUNTS_SUCCESS = 'FETCH_QUICK_AMOUNTS_SUCCESS',
  FETCH_QUICK_AMOUNTS_FAILURE = 'FETCH_QUICK_AMOUNTS_FAILURE',
  
  // Clear Error
  CLEAR_POINT_SELECTION_ERROR = 'CLEAR_POINT_SELECTION_ERROR'
}

// UI Action Interfaces
export interface SetShowAmountSheetAction {
  type: PointSelectionActionTypes.SET_SHOW_AMOUNT_SHEET;
  payload: boolean;
}

// Quick Amounts Action Interfaces
export interface FetchQuickAmountsRequestAction {
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_REQUEST;
}

export interface FetchQuickAmountsSuccessAction {
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_SUCCESS;
  payload: {
    quickAmounts: QuickAmount[];
  };
}

export interface FetchQuickAmountsFailureAction {
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_FAILURE;
  payload: string;
}

// Clear Error Action Interface
export interface ClearPointSelectionErrorAction {
  type: PointSelectionActionTypes.CLEAR_POINT_SELECTION_ERROR;
}

export type PointSelectionAction =
  | SetShowAmountSheetAction
  | FetchQuickAmountsRequestAction
  | FetchQuickAmountsSuccessAction
  | FetchQuickAmountsFailureAction
  | ClearPointSelectionErrorAction;
