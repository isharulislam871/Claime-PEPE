import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'social' | 'special' | 'video' | 'survey' | 'quiz';
  category: string;
  url?: string;
  duration?: string;
  maxCompletions: number;
  currentCompletions: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  requirements?: {
    minLevel?: number;
    countries?: string[];
    platforms?: string[];
  };
}

const TaskSchema = new Schema<ITask>({
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
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['daily', 'social', 'special', 'video', 'survey', 'quiz'],
    default: 'social'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  maxCompletions: {
    type: Number,
    required: true,
    min: 1,
    default: 1000
  },
  currentCompletions: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'completed', 'draft'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    trim: true
  },
  requirements: {
    minLevel: {
      type: Number,
      min: 0
    },
    countries: [{
      type: String,
      trim: true
    }],
    platforms: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  collection: 'tasks'
});

 

// Instance methods
TaskSchema.methods.isAvailable = function(): boolean {
  return this.status === 'active' && this.currentCompletions < this.maxCompletions;
};

TaskSchema.methods.incrementCompletion = function(): void {
  this.currentCompletions += 1;
  if (this.currentCompletions >= this.maxCompletions) {
    this.status = 'completed';
  }
};

// Static methods
TaskSchema.statics.findActiveTasks = function() {
  return this.find({ status: 'active' }).sort({ createdAt: -1 });
};

TaskSchema.statics.findByType = function(type: string) {
  return this.find({ type, status: 'active' }).sort({ createdAt: -1 });
};

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
