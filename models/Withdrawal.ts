import mongoose, { Schema, Document, Model } from 'mongoose';

interface IWithdrawalMethods {
  canCancel(): boolean;
  markAsProcessing(): void;
  markAsCompleted(transactionId?: string): void;
  markAsFailed(reason: string): void;
}

interface IWithdrawalStatics {
  findByUserId(userId: string, limit?: number): Promise<IWithdrawalDocument[]>;
  findByTelegramId(telegramId: string, limit?: number): Promise<IWithdrawalDocument[]>;
  findPending(): Promise<IWithdrawalDocument[]>;
  getTotalWithdrawn(userId: string): Promise<{ _id: null; total: number }[]>;
}

type IWithdrawalDocument = Document<unknown, Record<string, never>, IWithdrawal> & IWithdrawal & IWithdrawalMethods;
type IWithdrawalModel = Model<IWithdrawal, Record<string, never>, IWithdrawalMethods> & IWithdrawalStatics;

export interface IWithdrawal {
  _id?: string;
  id?: string;
  userId: string;
  telegramId: string;
  username: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  network: string;
  address: string;
  memo?: string;
  networkFee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  failureReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema: Schema = new Schema({
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
  username: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    default : 0
  },
  method: {
    type: String,
    required: true,
   
  },
  walletId: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    default: 'PEPE',
    uppercase: true
  },
  network: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  memo: {
    type: String,
    default: ''
  },
  networkFee: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  transactionId: {
    type: String,
    default: null,
    sparse: true
  },
  failureReason: {
    type: String,
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'withdrawals'
});
 
// Instance methods
WithdrawalSchema.methods.canCancel = function(): boolean {
  return this.status === 'pending';
};

WithdrawalSchema.methods.markAsProcessing = function(): void {
  this.status = 'processing';
  this.processedAt = new Date();
};

WithdrawalSchema.methods.markAsCompleted = function(transactionId?: string): void {
  this.status = 'completed';
  this.processedAt = new Date();
  if (transactionId) {
    this.transactionId = transactionId;
  }
};

WithdrawalSchema.methods.markAsFailed = function(reason: string): void {
  this.status = 'failed';
  this.failureReason = reason;
  this.processedAt = new Date();
};

// Static methods
WithdrawalSchema.statics.findByUserId = function(userId: string, limit: number = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

WithdrawalSchema.statics.findByTelegramId = function(telegramId: string, limit: number = 10) {
  return this.find({ telegramId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

WithdrawalSchema.statics.findPending = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 });
};

WithdrawalSchema.statics.getTotalWithdrawn = function(userId: string) {
  return this.aggregate([
    { $match: { userId, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
};

 
// Prevent model re-compilation during development
const Withdrawal: IWithdrawalModel = (mongoose.models.Withdrawal as IWithdrawalModel) || mongoose.model<IWithdrawal, IWithdrawalModel>('Withdrawal', WithdrawalSchema);

export default Withdrawal;
