import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

interface IAdminMethods {
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
  generateOTP(): string;
  verifyOTP(otp: string): boolean;
  clearOTP(): void;
  readonly isLocked: boolean;
  readonly isAvailable: boolean;
  readonly isRestricted: boolean;
  readonly isOTPValid: boolean;
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
  status: 'active' | 'banned' | 'suspended';
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  otp_code?: string;
  exp_otp?: Date;
  
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
  status: {
    type: String,
    enum: ['active', 'banned', 'suspended'],
    default: 'active'
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
  otp_code: {
    type: String,
    default: null,
    select: false // Don't include in queries by default for security
  },
  exp_otp: {
    type: Date,
    default: null,
    select: false // Don't include in queries by default for security
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

// Virtual for account availability (active and not locked)
AdminSchema.virtual('isAvailable').get(function(this: IAdminDocument) {
  return this.status === 'active' && !(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Virtual for account restrictions
AdminSchema.virtual('isRestricted').get(function(this: IAdminDocument) {
  return this.status === 'banned' || this.status === 'suspended' || (this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Virtual for OTP validity
AdminSchema.virtual('isOTPValid').get(function(this: IAdminDocument) {
  return !!(this.otp_code && this.exp_otp && this.exp_otp.getTime() > Date.now());
});

// Pre-save middleware to hash password
AdminSchema.pre('save', async function(this: IAdminDocument, next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hash = crypto.createHash('sha256').update(this.password).digest('hex');
    this.password = hash;
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

// Instance methods for OTP functionality
AdminSchema.methods.generateOTP = function(): string {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp_code = otp;
  // Set expiration to 10 minutes from now
  this.exp_otp = new Date(Date.now() + 10 * 60 * 1000);
  return otp;
};

AdminSchema.methods.verifyOTP = function(otp: string): boolean {
  if (!this.otp_code || !this.exp_otp) return false;
  if (this.exp_otp.getTime() < Date.now()) return false;
  return this.otp_code === otp;
};

AdminSchema.methods.clearOTP = function(): void {
  this.otp_code = undefined;
  this.exp_otp = undefined;
};

AdminSchema.methods.generateAuthToken = function(): string {
  // In a real app, use JWT or similar
  return Buffer.from(`${this._id}:${Date.now()}`).toString('base64');
};

AdminSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return this.password === hash;
};

 
// Prevent model re-compilation during development
const Admin: IAdminModel = (mongoose.models.Admin as IAdminModel) || mongoose.model<IAdmin, IAdminModel>('Admin', AdminSchema);

export default Admin;
