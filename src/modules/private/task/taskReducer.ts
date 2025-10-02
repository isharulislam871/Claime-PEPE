import { TaskState, TaskActionTypes, TaskAction } from './types';

const initialState: TaskState = {
  tasks: [],
  taskStatus: null,
  loading: false,
  error: null,
  ads: [],
  adStats: null,
  adsLoading: false
};

export const taskReducer = (state = initialState, action: TaskAction): TaskState => {
  switch (action.type) {
    case TaskActionTypes.FETCH_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TaskActionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
        taskStatus: action.payload.taskStatus
      };
    case TaskActionTypes.FETCH_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case TaskActionTypes.COMPLETE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TaskActionTypes.COMPLETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        // Update task completion status
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId ? { ...task, completed: true } : task
        )
      };
    case TaskActionTypes.COMPLETE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Ads Actions
    case TaskActionTypes.FETCH_ADS_REQUEST:
      return {
        ...state,
        adsLoading: true,
        error: null
      };
    case TaskActionTypes.FETCH_ADS_SUCCESS:
      return {
        ...state,
        adsLoading: false,
        ads: action.payload.ads,
        adStats: action.payload.adStats
      };
    case TaskActionTypes.FETCH_ADS_FAILURE:
      return {
        ...state,
        adsLoading: false,
        error: action.payload
      };
    case TaskActionTypes.WATCH_AD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case TaskActionTypes.WATCH_AD_SUCCESS:
      return {
        ...state,
        loading: false,
        // Update ad stats if available
        adStats: action.payload.adStats || state.adStats
      };
    case TaskActionTypes.WATCH_AD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};
