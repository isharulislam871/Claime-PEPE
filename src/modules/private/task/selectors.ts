import { RootState } from '../../store';

// Task Selectors
export const selectTasks = (state: RootState) => state.private.task.tasks;


export const selectTasksLoading = (state: RootState) => state.private.task.loading;

export const selectTaskError = (state: RootState) => state.private.task.error;
 