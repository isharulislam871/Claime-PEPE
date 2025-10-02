import { RootState } from '../../store';

export const selectRewardsState = (state: RootState) => state.private.rewards;

export const selectAchievements = (state: RootState) => state.private.rewards.achievements;

export const selectRewardsStats = (state: RootState) => state.private.rewards.stats;

export const selectRewardsLoading = (state: RootState) => state.private.rewards.loading;

export const selectRewardsError = (state: RootState) => state.private.rewards.error;

export const selectUnlockingAchievement = (state: RootState) => state.private.rewards.unlockingAchievement;

export const selectClaimingReward = (state: RootState) => state.private.rewards.claimingReward;

export const selectCompletedAchievements = (state: RootState) => 
  state.private.rewards.achievements.filter(achievement => achievement.completed);

export const selectClaimedAchievements = (state: RootState) => 
  state.private.rewards.achievements.filter(achievement => achievement.claimed);

export const selectUnlockedAchievements = (state: RootState) => 
  state.private.rewards.achievements.filter(achievement => achievement.unlockedAt !== null);
