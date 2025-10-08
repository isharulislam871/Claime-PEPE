import {
  PointSelectionActionTypes,
  SetShowAmountSheetAction,
  FetchQuickAmountsRequestAction,
  FetchQuickAmountsSuccessAction,
  FetchQuickAmountsFailureAction,
  ClearPointSelectionErrorAction,
  QuickAmount
} from './types';

// UI Actions
export const setShowAmountSheet = (show: boolean): SetShowAmountSheetAction => ({
  type: PointSelectionActionTypes.SET_SHOW_AMOUNT_SHEET,
  payload: show
});

// Quick Amounts Actions
export const fetchQuickAmountsRequest = (): FetchQuickAmountsRequestAction => ({
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_REQUEST
});

export const fetchQuickAmountsSuccess = (
  quickAmounts: QuickAmount[]
): FetchQuickAmountsSuccessAction => ({
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_SUCCESS,
  payload: {
    quickAmounts
  }
});

export const fetchQuickAmountsFailure = (error: string): FetchQuickAmountsFailureAction => ({
  type: PointSelectionActionTypes.FETCH_QUICK_AMOUNTS_FAILURE,
  payload: error
});

// Clear Error Action
export const clearPointSelectionError = (): ClearPointSelectionErrorAction => ({
  type: PointSelectionActionTypes.CLEAR_POINT_SELECTION_ERROR
});
