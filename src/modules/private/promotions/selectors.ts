import { RootState } from '../../store';
import { Promotion } from './types';

export const selectPromotions = (state: RootState) => state.private.promotions.promotions;

export const selectPromotionsLoading = (state: RootState) => state.private.promotions.loading;

export const selectPromotionsError = (state: RootState) => state.private.promotions.error;

export const selectActivePromotions = (state: RootState) => 
  state.private.promotions.promotions.filter((promotion: Promotion) => promotion.isActive !== false);

export const selectPromotionsState = (state: RootState) => state.private.promotions;
