import { 
  FETCH_TASKS_REQUEST, 
  FETCH_TASKS_SUCCESS, 
  FETCH_TASKS_FAILURE,
  COMPLETE_TASK_REQUEST,
  COMPLETE_TASK_SUCCESS,
  COMPLETE_TASK_FAILURE
} from './constants';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'social' | 'special' | 'video' | 'survey' | 'quiz';
  category: string;
  completed: boolean;
  url?: string;
  duration?: string;
  progress: {
    current: number;
    max: number;
    percentage: number;
  };
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  completing: boolean;
}

export type TaskAction =
  | { type: typeof FETCH_TASKS_REQUEST }
  | { type: typeof FETCH_TASKS_SUCCESS; payload: { tasks: Task[] } }
  | { type: typeof FETCH_TASKS_FAILURE; payload: string }
  | { type: typeof COMPLETE_TASK_REQUEST; payload: { taskId: string } }
  | { type: typeof COMPLETE_TASK_SUCCESS; payload: { taskId: string } }
  | { type: typeof COMPLETE_TASK_FAILURE; payload: string }
