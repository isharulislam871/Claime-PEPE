import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IHistory extends Document {
  userId: string;
  telegramId: string;
  type: 'swap' | 'withdrawal' | 'deposit' | 'transfer' | 'reward' | 'penalty';
  action: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  txHash?: string;
  fromCurrency?: string;
  toCurrency?: string;
  exchangeRate?: number;
  fees?: number;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IHistory>({
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
  type: {
    type: String,
    required: true,
    enum: ['swap', 'withdrawal', 'deposit', 'transfer', 'reward', 'penalty'],
    index: true
  },
  action: {
    type: String,
    required: true,
    maxlength: 200
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 10
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  txHash: {
    type: String,
    sparse: true,
    index: true
  },
  fromCurrency: {
    type: String,
    uppercase: true,
    maxlength: 10
  },
  toCurrency: {
    type: String,
    uppercase: true,
    maxlength: 10
  },
  exchangeRate: {
    type: Number,
    min: 0
  },
  fees: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'history'
});

 

// Instance methods
HistorySchema.methods.markCompleted = function() {
  this.status = 'completed';
  return this.save();
};

HistorySchema.methods.markFailed = function(reason?: string) {
  this.status = 'failed';
  if (reason) {
    this.metadata.failureReason = reason;
  }
  return this.save();
};

// Static methods
HistorySchema.statics.findByTelegramId = function(telegramId: string, type?: string) {
  const query: any = { telegramId };
  if (type) query.type = type;
  return this.find(query).sort({ timestamp: -1 });
};

HistorySchema.statics.findByTransactionId = function(transactionId: string) {
  return this.findOne({ transactionId });
};

HistorySchema.statics.getSwapHistory = function(telegramId: string, limit = 50) {
  return this.find({ telegramId, type: 'swap' })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Export interface for static methods
interface IHistoryModel extends Model<IHistory> {
  findByTelegramId(telegramId: string, type?: string): Promise<IHistory[]>;
  findByTransactionId(transactionId: string): Promise<IHistory | null>;
  getSwapHistory(telegramId: string, limit?: number): Promise<IHistory[]>;
}

const History: IHistoryModel = (mongoose.models.History as IHistoryModel) || 
  mongoose.model<IHistory, IHistoryModel>('History', HistorySchema);

export default History;
