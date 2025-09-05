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

export interface TaskStatus {
  completedTasks: string[];
  lastCompletedDate?: string;
  totalCompleted: number;
}

export interface AdStats {
  todayAdsViewed: number;
  dailyLimit: number;
  adsLeftToday: number;
  totalAdsViewed: number;
}

export interface TaskState {
  tasks: Task[];
  taskStatus: TaskStatus | null;
  loading: boolean;
  error: string | null;
  ads: any[];
  adStats: AdStats | null;
  adsLoading: boolean;
}

export enum TaskActionTypes {
  FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST',
  FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS',
  FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE',
  COMPLETE_TASK_REQUEST = 'COMPLETE_TASK_REQUEST',
  COMPLETE_TASK_SUCCESS = 'COMPLETE_TASK_SUCCESS',
  COMPLETE_TASK_FAILURE = 'COMPLETE_TASK_FAILURE',
  FETCH_ADS_REQUEST = 'FETCH_ADS_REQUEST',
  FETCH_ADS_SUCCESS = 'FETCH_ADS_SUCCESS',
  FETCH_ADS_FAILURE = 'FETCH_ADS_FAILURE',
  WATCH_AD_REQUEST = 'WATCH_AD_REQUEST',
  WATCH_AD_SUCCESS = 'WATCH_AD_SUCCESS',
  WATCH_AD_FAILURE = 'WATCH_AD_FAILURE'
}

export type TaskAction =
  | { type: TaskActionTypes.FETCH_TASKS_REQUEST }
  | { type: TaskActionTypes.FETCH_TASKS_SUCCESS; payload: { tasks: Task[]; taskStatus: TaskStatus } }
  | { type: TaskActionTypes.FETCH_TASKS_FAILURE; payload: string }
  | { type: TaskActionTypes.COMPLETE_TASK_REQUEST; payload: { taskId: string; taskUrl?: string } }
  | { type: TaskActionTypes.COMPLETE_TASK_SUCCESS; payload: any }
  | { type: TaskActionTypes.COMPLETE_TASK_FAILURE; payload: string }
  | { type: TaskActionTypes.FETCH_ADS_REQUEST }
  | { type: TaskActionTypes.FETCH_ADS_SUCCESS; payload: { ads: any[]; adStats: AdStats } }
  | { type: TaskActionTypes.FETCH_ADS_FAILURE; payload: string }
  | { type: TaskActionTypes.WATCH_AD_REQUEST }
  | { type: TaskActionTypes.WATCH_AD_SUCCESS; payload: any }
  | { type: TaskActionTypes.WATCH_AD_FAILURE; payload: string };
