import {
  PromotionsActionTypes,
  FetchPromotionsRequestAction,
  FetchPromotionsSuccessAction,
  FetchPromotionsFailureAction,
  ClearPromotionsErrorAction,
  Promotion
} from './types';

export const fetchPromotionsRequest = (): FetchPromotionsRequestAction => ({
  type: PromotionsActionTypes.FETCH_PROMOTIONS_REQUEST,
});

export const fetchPromotionsSuccess = (promotions: Promotion[]): FetchPromotionsSuccessAction => ({
  type: PromotionsActionTypes.FETCH_PROMOTIONS_SUCCESS,
  payload: { promotions },
});

export const fetchPromotionsFailure = (error: string): FetchPromotionsFailureAction => ({
  type: PromotionsActionTypes.FETCH_PROMOTIONS_FAILURE,
  payload: error,
});

export const clearPromotionsError = (): ClearPromotionsErrorAction => ({
  type: PromotionsActionTypes.CLEAR_PROMOTIONS_ERROR,
});
