import { 
  FETCH_TASKS_REQUEST, 
  FETCH_TASKS_SUCCESS, 
  FETCH_TASKS_FAILURE,
  COMPLETE_TASK_REQUEST,
  COMPLETE_TASK_SUCCESS,
  COMPLETE_TASK_FAILURE
} from './constants';
import { Task } from './types';

// Fetch Tasks Actions
export const fetchTasksRequest = () => ({
  type: FETCH_TASKS_REQUEST
});

export const fetchTasksSuccess = (tasks: Task[]) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: { tasks }
});

export const fetchTasksFailure = (error: string) => ({
  type: FETCH_TASKS_FAILURE,
  payload: error
});

// Complete Task Actions
export const completeTaskRequest = (taskId: string) => ({
  type: COMPLETE_TASK_REQUEST,
  payload: { taskId }
});

export const completeTaskSuccess = (taskId: string) => ({
  type: COMPLETE_TASK_SUCCESS,
  payload: { taskId }
});

export const completeTaskFailure = (error: string) => ({
  type: COMPLETE_TASK_FAILURE,
  payload: error
});



