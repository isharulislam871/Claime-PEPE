import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog {
  userId: string;
  type: 'user_login' | 'user_logout' | 'ad_viewed' | 'task_completed' | 'withdrawal_request' | 'spin_wheel';
  data: any;
  timestamp: Date;
  sessionDuration?: number;
  ipAddress?: string;
  userAgent?: string;
}

type IActivityLogDocument = Document & IActivityLog;

const ActivityLogSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['user_login', 'user_logout', 'ad_viewed', 'task_completed', 'withdrawal_request', 'spin_wheel'],
    index: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  sessionDuration: {
    type: Number,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'activity_logs'
});

 
const ActivityLog: Model<IActivityLogDocument> = 
  (mongoose.models.ActivityLog as Model<IActivityLogDocument>) || 
  mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
