import {
  RewardsActionTypes,
  FetchRewardsRequestAction,
  FetchRewardsSuccessAction,
  FetchRewardsFailureAction,
  UnlockAchievementRequestAction,
  UnlockAchievementSuccessAction,
  UnlockAchievementFailureAction,
  ClaimRewardRequestAction,
  ClaimRewardSuccessAction,
  ClaimRewardFailureAction,
  ClearRewardsErrorAction,
  Achievement,
  RewardsStats
} from './types';

// Fetch rewards actions
export const fetchRewardsRequest = (): FetchRewardsRequestAction => ({
  type: RewardsActionTypes.FETCH_REWARDS_REQUEST

});

export const fetchRewardsSuccess = (
  achievements: Achievement[],
  stats: RewardsStats
): FetchRewardsSuccessAction => ({
  type: RewardsActionTypes.FETCH_REWARDS_SUCCESS,
  payload: { achievements, stats }
});

export const fetchRewardsFailure = (error: string): FetchRewardsFailureAction => ({
  type: RewardsActionTypes.FETCH_REWARDS_FAILURE,
  payload: error
});

// Unlock achievement actions
export const unlockAchievementRequest = (
  
  achievementId: string
): UnlockAchievementRequestAction => ({
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_REQUEST,
  payload: { achievementId }
});

export const unlockAchievementSuccess = (
  achievements: Achievement[],
  stats: RewardsStats
): UnlockAchievementSuccessAction => ({
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_SUCCESS,
  payload: { achievements, stats }
});

export const unlockAchievementFailure = (error: string): UnlockAchievementFailureAction => ({
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_FAILURE,
  payload: error
});

// Claim reward actions
export const claimRewardRequest = (
  
  achievementId: string
): ClaimRewardRequestAction => ({
  type: RewardsActionTypes.CLAIM_REWARD_REQUEST,
  payload: { achievementId }
});

export const claimRewardSuccess = (
  achievements: Achievement[],
  stats: RewardsStats,
  reward: number,
  newBalance: number
): ClaimRewardSuccessAction => ({
  type: RewardsActionTypes.CLAIM_REWARD_SUCCESS,
  payload: { achievements, stats, reward, newBalance }
});

export const claimRewardFailure = (error: string): ClaimRewardFailureAction => ({
  type: RewardsActionTypes.CLAIM_REWARD_FAILURE,
  payload: error
});

// Clear error action
export const clearRewardsError = (): ClearRewardsErrorAction => ({
  type: RewardsActionTypes.CLEAR_REWARDS_ERROR
});
