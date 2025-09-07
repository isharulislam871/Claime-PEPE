import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  telegramId: string;
  type: string;
  description: string;
  reward: number;
  metadata: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  telegramId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ad_view', 'task_complete', 'referral', 'bonus', 'withdrawal', 'login', 'other', 'ad_view_home', 'api', 'swap'],
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  reward: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  
  hash: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'activities'
});

 
// Export the model
const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
