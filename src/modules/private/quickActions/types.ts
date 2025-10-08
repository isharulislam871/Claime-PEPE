export interface QuickActionConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface QuickActionsState {
  quickActions: QuickActionConfig[];
  loading: boolean;
  error: string | null;
}

export enum QuickActionsActionTypes {
  FETCH_QUICK_ACTIONS_REQUEST = 'FETCH_QUICK_ACTIONS_REQUEST',
  FETCH_QUICK_ACTIONS_SUCCESS = 'FETCH_QUICK_ACTIONS_SUCCESS',
  FETCH_QUICK_ACTIONS_FAILURE = 'FETCH_QUICK_ACTIONS_FAILURE',
  UPDATE_QUICK_ACTION_REQUEST = 'UPDATE_QUICK_ACTION_REQUEST',
  UPDATE_QUICK_ACTION_SUCCESS = 'UPDATE_QUICK_ACTION_SUCCESS',
  UPDATE_QUICK_ACTION_FAILURE = 'UPDATE_QUICK_ACTION_FAILURE',
  CLEAR_QUICK_ACTIONS_ERROR = 'CLEAR_QUICK_ACTIONS_ERROR',
}

export interface FetchQuickActionsRequestAction {
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_REQUEST;
}

export interface FetchQuickActionsSuccessAction {
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_SUCCESS;
  payload: QuickActionConfig[];
}

export interface FetchQuickActionsFailureAction {
  type: QuickActionsActionTypes.FETCH_QUICK_ACTIONS_FAILURE;
  payload: string;
}

export interface UpdateQuickActionRequestAction {
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_REQUEST;
  payload: {
    actionId: string;
    enabled: boolean;
  };
}

export interface UpdateQuickActionSuccessAction {
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_SUCCESS;
  payload: QuickActionConfig;
}

export interface UpdateQuickActionFailureAction {
  type: QuickActionsActionTypes.UPDATE_QUICK_ACTION_FAILURE;
  payload: string;
}

export interface ClearQuickActionsErrorAction {
  type: QuickActionsActionTypes.CLEAR_QUICK_ACTIONS_ERROR;
}

export type QuickActionsAction =
  | FetchQuickActionsRequestAction
  | FetchQuickActionsSuccessAction
  | FetchQuickActionsFailureAction
  | UpdateQuickActionRequestAction
  | UpdateQuickActionSuccessAction
  | UpdateQuickActionFailureAction
  | ClearQuickActionsErrorAction;
