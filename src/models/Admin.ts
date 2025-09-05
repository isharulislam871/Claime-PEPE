import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

interface IAdminMethods {
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

interface IAdminStatics {
  findByUsername(username: string): Promise<IAdminDocument | null>;
  findByEmail(email: string): Promise<IAdminDocument | null>;
  authenticate(identifier: string, password: string): Promise<IAdminDocument | null>;
}

type IAdminDocument = Document<unknown, Record<string, never>, IAdmin> & IAdmin & IAdminMethods;
type IAdminModel = Model<IAdmin, Record<string, never>, IAdminMethods> & IAdminStatics;

export interface IAdmin {
  username: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  permissions: string[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  permissions: [{
    type: String,
    enum: [
      'view_dashboard',
      'manage_users',
      'manage_broadcasts',
      'manage_withdrawals',
      'view_analytics',
      'manage_admins',
      'system_settings'
    ]
  }],
  createdBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'admins'
});

 

// Virtual for account lock status
AdminSchema.virtual('isLocked').get(function(this: IAdminDocument) {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Pre-save middleware to hash password
AdminSchema.pre('save', async function(this: IAdminDocument, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hash = crypto.createHash('sha256').update(this.password).digest('hex');
    this.password = hash
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to set default permissions based on role
AdminSchema.pre('save', function(this: IAdminDocument, next) {
  if (!this.isModified('role') && this.permissions.length > 0) return next();
  
  switch (this.role) {
    case 'super_admin':
      this.permissions = [
        'view_dashboard',
        'manage_users',
        'manage_broadcasts',
        'manage_withdrawals',
        'view_analytics',
        'manage_admins',
        'system_settings'
      ];
      break;
    case 'admin':
      this.permissions = [
        'view_dashboard',
        'manage_users',
        'manage_broadcasts',
        'manage_withdrawals',
        'view_analytics'
      ];
      break;
    case 'moderator':
      this.permissions = [
        'view_dashboard',
        'manage_users',
        'view_analytics'
      ];
      break;
  }
  next();
});

 
AdminSchema.methods.generateAuthToken = function(): string {
  // In a real app, use JWT or similar
  return Buffer.from(`${this._id}:${Date.now()}`).toString('base64');
};

// Static methods
AdminSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ username, isActive: true });
};

AdminSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

AdminSchema.statics.authenticate = async function(identifier: string, password: string) {
  // Try to find by username or email
  const admin = await this.findOne({
    $or: [
      { username: identifier },
      { email: identifier.toLowerCase() }
    ],
    isActive: true
  });

  if (!admin) {
    return null;
  }

  // Check if account is locked
  if (admin.isLocked) {
    return null;
  }

 
};

// Prevent model re-compilation during development
const Admin: IAdminModel = (mongoose.models.Admin as IAdminModel) || mongoose.model<IAdmin, IAdminModel>('Admin', AdminSchema);

export default Admin;
