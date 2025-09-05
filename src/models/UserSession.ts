import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserSession {
  userId: string;
  socketId: string;
  loginTime: Date;
  logoutTime?: Date;
  sessionDuration?: number;
  status: 'online' | 'offline';
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

type IUserSessionDocument = Document & IUserSession;

interface IUserSessionMethods {
  endSession(): Promise<void>;
  calculateDuration(): number;
}

interface IUserSessionStatics {
  findActiveSession(userId: string): Promise<IUserSessionDocument | null>;
  createSession(sessionData: Partial<IUserSession>): Promise<IUserSessionDocument>;
  endAllUserSessions(userId: string): Promise<void>;
}

type IUserSessionModel = Model<IUserSession, Record<string, never>, IUserSessionMethods> & IUserSessionStatics;

const UserSessionSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  logoutTime: {
    type: Date,
    default: null
  },
  sessionDuration: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'user_sessions'
});

// Instance methods
UserSessionSchema.methods.endSession = async function(): Promise<void> {
  this.logoutTime = new Date();
  this.sessionDuration = this.calculateDuration();
  this.status = 'offline';
  this.isActive = false;
  await this.save();
};

UserSessionSchema.methods.calculateDuration = function(): number {
  const endTime = this.logoutTime || new Date();
  return endTime.getTime() - this.loginTime.getTime();
};

// Static methods
UserSessionSchema.statics.findActiveSession = function(userId: string) {
  return this.findOne({ userId, isActive: true });
};

UserSessionSchema.statics.createSession = function(sessionData: Partial<IUserSession>) {
  return this.create({
    ...sessionData,
    loginTime: new Date(),
    status: 'online',
    isActive: true
  });
};

UserSessionSchema.statics.endAllUserSessions = async function(userId: string) {
  const sessions = await this.find({ userId, isActive: true });
  for (const session of sessions) {
    await session.endSession();
  }
};

// Indexes for efficient querying
UserSessionSchema.index({ userId: 1, isActive: 1 });
UserSessionSchema.index({ socketId: 1 });
UserSessionSchema.index({ loginTime: -1 });

const UserSession: IUserSessionModel = 
  (mongoose.models.UserSession as IUserSessionModel) || 
  mongoose.model<IUserSession, IUserSessionModel>('UserSession', UserSessionSchema);

export default UserSession;
