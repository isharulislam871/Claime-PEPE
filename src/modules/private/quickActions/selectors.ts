import { RootState } from '../../store';

export const selectQuickActionsState = (state: RootState) => state.private.quickActions;

export const selectQuickActions = (state: RootState) => 
  selectQuickActionsState(state).quickActions;

export const selectQuickActionsLoading = (state: RootState) => 
  selectQuickActionsState(state).loading;

export const selectQuickActionsError = (state: RootState) => 
  selectQuickActionsState(state).error;

export const selectEnabledQuickActions = (state: RootState) => 
  selectQuickActions(state).filter(action => action.enabled);

export const selectQuickActionById = (state: RootState, actionId: string) => 
  selectQuickActions(state).find(action => action.id === actionId);
