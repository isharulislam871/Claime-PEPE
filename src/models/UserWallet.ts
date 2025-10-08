import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUserWalletMethods {
  addBalance(amount: number): Promise<IUserWallet>;
  deductBalance(amount: number): Promise<IUserWallet>;
  lockBalance(amount: number): Promise<IUserWallet>;
  unlockBalance(amount: number): Promise<IUserWallet>;
  processSwap(amount: number): Promise<IUserWallet>;
}

export interface IUserWallet extends Document, IUserWalletMethods {
  userId: string;
  telegramId: string;
  walletAddress: string;
  currency: string;
  balance: number;
  lockedBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalSwaps: number;
  isActive: boolean;
  metadata: Record<string, any>;
  lastTransactionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserWalletSchema = new Schema<IUserWallet>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  telegramId: {
    type: String,
    required: true,
    index: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lockedBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDeposits: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWithdrawals: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSwaps: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  lastTransactionAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true,
  collection: 'user_wallets'
});

// Compound indexes for efficient querying
UserWalletSchema.index({ telegramId: 1, currency: 1 });
UserWalletSchema.index({ userId: 1, currency: 1 });
UserWalletSchema.index({ walletType: 1, isActive: 1 });

// Instance methods
UserWalletSchema.methods.addBalance = function(amount: number) {
  this.balance += amount;
  this.totalDeposits += amount;
  this.lastTransactionAt = new Date();
  return this.save();
};

UserWalletSchema.methods.deductBalance = function(amount: number) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  this.totalWithdrawals += amount;
  this.lastTransactionAt = new Date();
  return this.save();
};

UserWalletSchema.methods.lockBalance = function(amount: number) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance to lock');
  }
  this.balance -= amount;
  this.lockedBalance += amount;
  return this.save();
};

UserWalletSchema.methods.unlockBalance = function(amount: number) {
  if (this.lockedBalance < amount) {
    throw new Error('Insufficient locked balance');
  }
  this.lockedBalance -= amount;
  this.balance += amount;
  return this.save();
};

UserWalletSchema.methods.processSwap = function(amount: number) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance for swap');
  }
  this.balance -= amount;
  this.totalSwaps += amount;
  this.lastTransactionAt = new Date();
  return this.save();
};

// Static methods
UserWalletSchema.statics.findByTelegramId = function(telegramId: string, currency?: string) {
  const query: any = { telegramId, isActive: true };
  if (currency) query.currency = currency.toUpperCase();
  return this.find(query);
};

UserWalletSchema.statics.findWallet = function(telegramId: string, currency: string) {
  return this.findOne({ 
    telegramId, 
    currency: currency.toUpperCase(), 
    isActive: true 
  });
};

UserWalletSchema.statics.createWallet = function(walletData: Partial<IUserWallet>) {
  return this.create({
    ...walletData,
    walletAddress: walletData.walletAddress || `${walletData.currency?.toLowerCase()}_wallet_${walletData.telegramId}`,
    currency: walletData.currency?.toUpperCase(),
  });
};

UserWalletSchema.statics.getTotalBalance = function(telegramId: string) {
  return this.aggregate([
    { $match: { telegramId, isActive: true } },
    { $group: { 
      _id: null, 
      totalBalance: { $sum: '$balance' },
      totalLocked: { $sum: '$lockedBalance' }
    }}
  ]);
};

// Export interface for static methods
interface IUserWalletModel extends Model<IUserWallet> {
  findByTelegramId(telegramId: string, currency?: string): Promise<IUserWallet[]>;
  findWallet(telegramId: string, currency: string): Promise<IUserWallet | null>;
  createWallet(walletData: Partial<IUserWallet>): Promise<IUserWallet>;
  getTotalBalance(telegramId: string): Promise<any[]>;
}

const UserWallet: IUserWalletModel = (mongoose.models.UserWallet as IUserWalletModel) || 
  mongoose.model<IUserWallet, IUserWalletModel>('UserWallet', UserWalletSchema);

export default UserWallet;
