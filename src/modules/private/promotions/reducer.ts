import { PromotionsState, PromotionsAction, PromotionsActionTypes } from './types';

const initialState: PromotionsState = {
  promotions: [],
  loading: false,
  error: null,
};

export const promotionsReducer = (
  state: PromotionsState = initialState,
  action: PromotionsAction
): PromotionsState => {
  switch (action.type) {
    case PromotionsActionTypes.FETCH_PROMOTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PromotionsActionTypes.FETCH_PROMOTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        promotions: action.payload.promotions,
        error: null,
      };

    case PromotionsActionTypes.FETCH_PROMOTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case PromotionsActionTypes.CLEAR_PROMOTIONS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
