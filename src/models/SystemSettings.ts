import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISystemSettingsMethods {
  // Add any instance methods here if needed
}

interface ISystemSettingsStatics {
  getSettings(): Promise<ISystemSettingsDocument>;
  updateSettings(updates: Partial<ISystemSettings>): Promise<ISystemSettingsDocument>;
}

type ISystemSettingsDocument = Document<unknown, Record<string, never>, ISystemSettings> & ISystemSettings & ISystemSettingsMethods;
type ISystemSettingsModel = Model<ISystemSettings, Record<string, never>, ISystemSettingsMethods> & ISystemSettingsStatics;

export interface ISystemSettings {
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  allowUserRegistration: boolean;
  referralBonus: number;
  newUserBonus: number;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema({
  platformName: {
    type: String,
    required: true,
    default: 'TaskUp Platform',
    trim: true
  },
  platformDescription: {
    type: String,
    required: true,
    default: 'Earn rewards by completing tasks and referring friends',
    trim: true
  },
  supportEmail: {
    type: String,
    required: true,
    default: 'support@taskup.com',
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  allowUserRegistration: {
    type: Boolean,
    required: true,
    default: true
  },
  referralBonus: {
    type: Number,
    required: true,
    default: 1000,
    min: 0
  },
  newUserBonus: {
    type: Number,
    required: true,
    default: 250,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'systemsettings'
});

// Static methods
SystemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = await this.create({});
  }
  
  return settings;
};

SystemSettingsSchema.statics.updateSettings = async function(updates: Partial<ISystemSettings>) {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create new settings with updates
    settings = await this.create(updates);
  } else {
    // Update existing settings
    Object.assign(settings, updates);
    await settings.save();
  }
  
  return settings;
};

// Ensure only one settings document exists
SystemSettingsSchema.index({}, { unique: true });

// Prevent model re-compilation during development
const SystemSettings: ISystemSettingsModel = (mongoose.models.SystemSettings as ISystemSettingsModel) || 
  mongoose.model<ISystemSettings, ISystemSettingsModel>('SystemSettings', SystemSettingsSchema);

export default SystemSettings;
