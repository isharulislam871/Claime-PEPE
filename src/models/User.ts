import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUserMethods {
  canCompleteTask(): boolean;
  resetDailyTasks(): void;
}

interface IUserStatics {
  findByTelegramId(telegramId: string): Promise<IUserDocument | null>;
  createUser(userData: Partial<IUser>): Promise<IUserDocument>;
}

type IUserDocument = Document<unknown, Record<string, never>, IUser> & IUser & IUserMethods;
type IUserModel = Model<IUser, Record<string, never>, IUserMethods> & IUserStatics;

export interface IUser {
  telegramId: string;
  username: string;
  telegramUsername: string;
  profilePicUrl?: string;
  ipAddress: string;
  userAgent?: string;
  balance: number;
  tasksCompletedToday: number;
  lastTaskTimestamp?: Date;
  totalEarned: number;
  totalAdsViewed: number;
  totalRefers: number;
  joinedBonusTasks: string[];
  referredBy?: string;
  referralEarnings: number;
  referralCode: string;
  referralCount: number;
  status: 'active' | 'ban' | 'suspend';
  banReason?: string;
  lastDailyCheckIn?: Date;
  dailyCheckInStreak: number;
  dailyCheckInCycle: number;
  lastSpinWheel?: Date;
  totalSpins: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  telegramUsername: {
    type: String,
    required: true,
    trim: true
  },
  profilePicUrl: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    default: null
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
 
  referralCode: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  referralCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  tasksCompletedToday: {
    type: Number,
    default: 0,
    min: 0
  },
  lastTaskTimestamp: {
    type: Date,
    default: null
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAdsViewed: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRefers: {
    type: Number,
    default: 0,
    min: 0
  },
  joinedBonusTasks: [{
    type: String
  }],
  referredBy: {
    type: String,
    default: null,
    index: true
  },
  referralEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'ban', 'suspend', 'IP_MISMATCH'],
    default: 'active'
  },
  banReason: {
    type: String,
    default: null
  },
  lastDailyCheckIn: {
    type: Date,
    default: null
  },
  dailyCheckInStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyCheckInCycle: {
    type: Number,
    default: 1,
    min: 1
  },
  lastSpinWheel: {
    type: Date,
    default: null
  },
  totalSpins: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'users'
});


// Instance methods
UserSchema.methods.canCompleteTask = function(): boolean {
  const DAILY_TASK_LIMIT = 100;
  return this.tasksCompletedToday < DAILY_TASK_LIMIT;
};

UserSchema.methods.resetDailyTasks = function(): void {
  const today = new Date();
  const lastTask = this.lastTaskTimestamp;
  
  if (!lastTask || lastTask.toDateString() !== today.toDateString()) {
    this.tasksCompletedToday = 0;
  }
};

// Static methods
UserSchema.statics.findByTelegramId = function(telegramId: string) {
  return this.findOne({ telegramId });
};

UserSchema.statics.createUser = function(userData: Partial<IUser>) {
  return this.create({
    ...userData,
    profilePicUrl: userData.profilePicUrl || `https://i.pravatar.cc/150?u=${userData.telegramId}`
  });
};

 

// Prevent model re-compilation during development
const User: IUserModel = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
