export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  color: string;
  actionType?: 'navigate' | 'external' | 'popup' | 'custom';
  actionData?: any;
  isActive?: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
  // Binance-style banner properties
  badge?: string;
  subtitle?: string;
  reward?: string;
  ctaText?: string;
}

export interface PromotionsState {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

export enum PromotionsActionTypes {
  FETCH_PROMOTIONS_REQUEST = 'FETCH_PROMOTIONS_REQUEST',
  FETCH_PROMOTIONS_SUCCESS = 'FETCH_PROMOTIONS_SUCCESS',
  FETCH_PROMOTIONS_FAILURE = 'FETCH_PROMOTIONS_FAILURE',
  
  CLEAR_PROMOTIONS_ERROR = 'CLEAR_PROMOTIONS_ERROR'
}

export interface FetchPromotionsRequestAction {
  type: PromotionsActionTypes.FETCH_PROMOTIONS_REQUEST;
}

export interface FetchPromotionsSuccessAction {
  type: PromotionsActionTypes.FETCH_PROMOTIONS_SUCCESS;
  payload: {
    promotions: Promotion[];
  };
}

export interface FetchPromotionsFailureAction {
  type: PromotionsActionTypes.FETCH_PROMOTIONS_FAILURE;
  payload: string;
}

export interface ClearPromotionsErrorAction {
  type: PromotionsActionTypes.CLEAR_PROMOTIONS_ERROR;
}

export type PromotionsAction =
  | FetchPromotionsRequestAction
  | FetchPromotionsSuccessAction
  | FetchPromotionsFailureAction
  | ClearPromotionsErrorAction;
