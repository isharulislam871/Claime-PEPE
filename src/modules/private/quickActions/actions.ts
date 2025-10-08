import {
  QuickActionsActionTypes,
  FetchQuickActionsRequestAction,
  FetchQuickActionsSuccessAction,
  FetchQuickActionsFailureAction,
  UpdateQuickActionRequestAction,
  UpdateQuickActionSuccessAction,
  UpdateQuickActionFailureAction,
  ClearQuickActionsErrorAction,
  QuickActionConfig,
} from './types';

export const fetchQuickActionsRequest = (): FetchQuickActionsRequestAction => ({
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_REQUEST,
});

export const fetchQuickActionsSuccess = (
  quickActions: QuickActionConfig[]
): FetchQuickActionsSuccessAction => ({
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_SUCCESS,
  payload: quickActions,
});

export const fetchQuickActionsFailure = (error: string): FetchQuickActionsFailureAction => ({
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_FAILURE,
  payload: error,
});

export const updateQuickActionRequest = (
  actionId: string,
  enabled: boolean
): UpdateQuickActionRequestAction => ({
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_REQUEST,
  payload: { actionId, enabled },
});

export const updateQuickActionSuccess = (
  quickAction: QuickActionConfig
): UpdateQuickActionSuccessAction => ({
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_SUCCESS,
  payload: quickAction,
});

export const updateQuickActionFailure = (error: string): UpdateQuickActionFailureAction => ({
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_FAILURE,
  payload: error,
});

export const clearQuickActionsError = (): ClearQuickActionsErrorAction => ({
  type: QuickActionsActionTypes.CLEAR_QUICK_ACTIONS_ERROR,
});
