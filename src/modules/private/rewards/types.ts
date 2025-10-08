export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  category: 'daily' | 'milestone' | 'special';
  requiresAds?: boolean;
  unlockedAt?: string | null;
  claimedAt?: string | null;
}

export interface RewardsStats {
  totalPoints: number;
  completedAchievements: number;
  claimedAchievements: number;
  totalAchievements: number;
}

export interface RewardsState {
  achievements: Achievement[];
  stats: RewardsStats;
  loading: boolean;
  error: string | null;
  unlockingAchievement: string | null;
  claimingReward: string | null;
}

export enum RewardsActionTypes {
  FETCH_REWARDS_REQUEST = 'FETCH_REWARDS_REQUEST',
  FETCH_REWARDS_SUCCESS = 'FETCH_REWARDS_SUCCESS',
  FETCH_REWARDS_FAILURE = 'FETCH_REWARDS_FAILURE',
  
  UNLOCK_ACHIEVEMENT_REQUEST = 'UNLOCK_ACHIEVEMENT_REQUEST',
  UNLOCK_ACHIEVEMENT_SUCCESS = 'UNLOCK_ACHIEVEMENT_SUCCESS',
  UNLOCK_ACHIEVEMENT_FAILURE = 'UNLOCK_ACHIEVEMENT_FAILURE',
  
  CLAIM_REWARD_REQUEST = 'CLAIM_REWARD_REQUEST',
  CLAIM_REWARD_SUCCESS = 'CLAIM_REWARD_SUCCESS',
  CLAIM_REWARD_FAILURE = 'CLAIM_REWARD_FAILURE',
  
  CLEAR_REWARDS_ERROR = 'CLEAR_REWARDS_ERROR'
}

export interface FetchRewardsRequestAction {
  type: RewardsActionTypes.FETCH_REWARDS_REQUEST;
 
}

export interface FetchRewardsSuccessAction {
  type: RewardsActionTypes.FETCH_REWARDS_SUCCESS;
  payload: {
    achievements: Achievement[];
    stats: RewardsStats;
  };
}

export interface FetchRewardsFailureAction {
  type: RewardsActionTypes.FETCH_REWARDS_FAILURE;
  payload: string;
}

export interface UnlockAchievementRequestAction {
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_REQUEST;
  payload: {  achievementId: string };
}

export interface UnlockAchievementSuccessAction {
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_SUCCESS;
  payload: {
    achievements: Achievement[];
    stats: RewardsStats;
  };
}

export interface UnlockAchievementFailureAction {
  type: RewardsActionTypes.UNLOCK_ACHIEVEMENT_FAILURE;
  payload: string;
}

export interface ClaimRewardRequestAction {
  type: RewardsActionTypes.CLAIM_REWARD_REQUEST;
  payload: {   achievementId: string };
}

export interface ClaimRewardSuccessAction {
  type: RewardsActionTypes.CLAIM_REWARD_SUCCESS;
  payload: {
    achievements: Achievement[];
    stats: RewardsStats;
    reward: number;
    newBalance: number;
  };
}

export interface ClaimRewardFailureAction {
  type: RewardsActionTypes.CLAIM_REWARD_FAILURE;
  payload: string;
}

export interface ClearRewardsErrorAction {
  type: RewardsActionTypes.CLEAR_REWARDS_ERROR;
}

export type RewardsAction =
  | FetchRewardsRequestAction
  | FetchRewardsSuccessAction
  | FetchRewardsFailureAction
  | UnlockAchievementRequestAction
  | UnlockAchievementSuccessAction
  | UnlockAchievementFailureAction
  | ClaimRewardRequestAction
  | ClaimRewardSuccessAction
  | ClaimRewardFailureAction
  | ClearRewardsErrorAction;
