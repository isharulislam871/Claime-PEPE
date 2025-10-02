import { RewardsState, RewardsAction, RewardsActionTypes } from './types';

const initialState: RewardsState = {
  achievements: [],
  stats: {
    totalPoints: 0,
    completedAchievements: 0,
    claimedAchievements: 0,
    totalAchievements: 0
  },
  loading: false,
  error: null,
  unlockingAchievement: null,
  claimingReward: null
};

export const rewardsReducer = (
  state = initialState,
  action: RewardsAction
): RewardsState => {
  switch (action.type) {
    case RewardsActionTypes.FETCH_REWARDS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case RewardsActionTypes.FETCH_REWARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        achievements: action.payload.achievements,
        stats: action.payload.stats,
        error: null
      };

    case RewardsActionTypes.FETCH_REWARDS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case RewardsActionTypes.UNLOCK_ACHIEVEMENT_REQUEST:
      return {
        ...state,
        unlockingAchievement: action.payload.achievementId,
        error: null
      };

    case RewardsActionTypes.UNLOCK_ACHIEVEMENT_SUCCESS:
      return {
        ...state,
        unlockingAchievement: null,
        achievements: action.payload.achievements,
        stats: action.payload.stats,
        error: null
      };

    case RewardsActionTypes.UNLOCK_ACHIEVEMENT_FAILURE:
      return {
        ...state,
        unlockingAchievement: null,
        error: action.payload
      };

    case RewardsActionTypes.CLAIM_REWARD_REQUEST:
      return {
        ...state,
        claimingReward: action.payload.achievementId,
        error: null
      };

    case RewardsActionTypes.CLAIM_REWARD_SUCCESS:
      return {
        ...state,
        claimingReward: null,
        achievements: action.payload.achievements,
        stats: action.payload.stats,
        error: null
      };

    case RewardsActionTypes.CLAIM_REWARD_FAILURE:
      return {
        ...state,
        claimingReward: null,
        error: action.payload
      };

    case RewardsActionTypes.CLEAR_REWARDS_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};
