import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBroadcastMethods {
  canBeDeleted(): boolean;
  markAsDelivered(delivered: number, opened: number, clicked: number): void;
}

interface IBroadcastStatics {
  findByStatus(status: string): Promise<IBroadcastDocument[]>;
  getStats(): Promise<any>;
}

type IBroadcastDocument = Document<unknown, Record<string, never>, IBroadcast> & IBroadcast & IBroadcastMethods;
type IBroadcastModel = Model<IBroadcast, Record<string, never>, IBroadcastMethods> & IBroadcastStatics;

export interface IBroadcast {
  title: string;
  message: string;
  type: 'announcement' | 'task_notification' | 'system_update' | 'promotional';
  audience: 'all' | 'active_users' | 'new_users' | 'pending_withdrawals' | 'high_earners' | 'inactive_users';
  priority: 'low' | 'normal' | 'high';
  totalUsers: number;
  delivered: number;
  opened: number;
  clicked: number;
  status: 'scheduled' | 'sending' | 'completed' | 'failed';
  sentDate?: Date;
  sentBy: string;
  scheduledTime?: Date;
  telegramMessageId?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 4000
  },
  type: {
    type: String,
    enum: ['announcement', 'task_notification', 'system_update', 'promotional'],
    required: true
  },
  audience: {
    type: String,
    enum: ['all', 'active_users', 'new_users', 'pending_withdrawals', 'high_earners', 'inactive_users'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  totalUsers: {
    type: Number,
    default: 0,
    min: 0
  },
  delivered: {
    type: Number,
    default: 0,
    min: 0
  },
  opened: {
    type: Number,
    default: 0,
    min: 0
  },
  clicked: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'sending', 'completed', 'failed'],
    default: 'scheduled'
  },
  sentDate: {
    type: Date,
    default: null
  },
  sentBy: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    default: null
  },
  telegramMessageId: {
    type: Number,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'broadcasts'
});

// Indexes for better query performance
BroadcastSchema.index({ status: 1, createdAt: -1 });
BroadcastSchema.index({ audience: 1 });
BroadcastSchema.index({ scheduledTime: 1 });

// Instance methods
BroadcastSchema.methods.canBeDeleted = function(): boolean {
  return this.status !== 'sending';
};

BroadcastSchema.methods.markAsDelivered = function(delivered: number, opened: number = 0, clicked: number = 0): void {
  this.delivered = delivered;
  this.opened = opened;
  this.clicked = clicked;
  this.status = 'completed';
  this.sentDate = new Date();
};

// Static methods
BroadcastSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

BroadcastSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        scheduled: {
          $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
        },
        sending: {
          $sum: { $cond: [{ $eq: ['$status', 'sending'] }, 1, 0] }
        },
        failed: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        totalDelivered: { $sum: '$delivered' },
        totalUsers: { $sum: '$totalUsers' }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    completed: 0,
    scheduled: 0,
    sending: 0,
    failed: 0,
    totalDelivered: 0,
    totalUsers: 0
  };
};

// Prevent model re-compilation during development
const Broadcast: IBroadcastModel = (mongoose.models.Broadcast as IBroadcastModel) || 
  mongoose.model<IBroadcast, IBroadcastModel>('Broadcast', BroadcastSchema);

export default Broadcast;
