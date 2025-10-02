import { QuickActionsState, QuickActionsAction, QuickActionsActionTypes } from './types';

const initialState: QuickActionsState = {
  quickActions: [],
  loading: false,
  error: null,
};

export const quickActionsReducer = (
  state: QuickActionsState = initialState,
  action: QuickActionsAction
): QuickActionsState => {
  switch (action.type) {
    case QuickActionsActionTypes.FETCH_QUICK_ACTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case QuickActionsActionTypes.FETCH_QUICK_ACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        quickActions: action.payload,
        error: null,
      };

    case QuickActionsActionTypes.FETCH_QUICK_ACTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case QuickActionsActionTypes.UPDATE_QUICK_ACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case QuickActionsActionTypes.UPDATE_QUICK_ACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        quickActions: state.quickActions.map(quickAction =>
          quickAction.id === action.payload.id ? action.payload : quickAction
        ),
        error: null,
      };

    case QuickActionsActionTypes.UPDATE_QUICK_ACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case QuickActionsActionTypes.CLEAR_QUICK_ACTIONS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
