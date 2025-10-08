import { TaskState, TaskAction } from './types';
import { 
  FETCH_TASKS_REQUEST, 
  FETCH_TASKS_SUCCESS, 
  FETCH_TASKS_FAILURE,
  COMPLETE_TASK_REQUEST,
  COMPLETE_TASK_SUCCESS,
  COMPLETE_TASK_FAILURE
} from './constants';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  completing: false,
};

export const taskReducer = (state = initialState, action: TaskAction): TaskState => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks
      };
    case FETCH_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case COMPLETE_TASK_REQUEST:
      return {
        ...state,
        completing: true,
        error: null
      };
    case COMPLETE_TASK_SUCCESS:
      return {
        ...state,
        completing: false,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId 
            ? { ...task, completed: true }
            : task
        )
      };
    case COMPLETE_TASK_FAILURE:
      return {
        ...state,
        completing: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};
