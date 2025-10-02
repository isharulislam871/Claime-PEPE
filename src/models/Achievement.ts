import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'milestone' | 'special';
  reward: number;
  requiresAds: boolean;
  conditions: {
    type: 'task_count' | 'daily_streak' | 'referral_count' | 'ads_watched' | 'points_earned';
    target: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAchievement {
  telegramId: string;
  achievementId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  unlockedAt?: Date;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['daily', 'milestone', 'special'],
    required: true
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  requiresAds: {
    type: Boolean,
    default: false
  },
  conditions: {
    type: {
      type: String,
      enum: ['task_count', 'daily_streak', 'referral_count', 'ads_watched', 'points_earned'],
      required: true
    },
    target: {
      type: Number,
      required: true,
      min: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'achievements'
});

const UserAchievementSchema: Schema = new Schema({
  telegramId: {
    type: String,
    required: true,
    index: true
  },
  achievementId: {
    type: String,
    required: true,
    index: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  claimed: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'user_achievements'
});

// Compound index for efficient queries
UserAchievementSchema.index({ telegramId: 1, achievementId: 1 }, { unique: true });

// Prevent model re-compilation during development
export const Achievement: Model<IAchievement> = (mongoose.models.Achievement as Model<IAchievement>) || 
  mongoose.model<IAchievement>('Achievement', AchievementSchema);

export const UserAchievement: Model<IUserAchievement> = (mongoose.models.UserAchievement as Model<IUserAchievement>) || 
  mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);
