import mongoose, { Document, Schema } from 'mongoose';

export interface IAdsSettings extends Document {
  enableGigaPubAds: boolean;
  gigaPubAppId: string;
  defaultAdsReward: number;
  adsWatchLimit: number;
  adsRewardMultiplier: number;
  minWatchTime: number;
  vpnRequired: boolean;
  vpnNotAllowed: boolean;
  vpnProvider: 'vpnapi' | 'ipqualityscore' | 'ip2location' | 'maxmind';
  vpnapiKey: string;
  ipqualityKey: string;
  ip2locationKey: string;
  monetagZoneId: string;
  monetagEnabled: boolean;
  maxmindKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdsSettingsSchema = new Schema<IAdsSettings>({
  enableGigaPubAds: {
    type: Boolean,
    default: true,
    required: true
  },
  gigaPubAppId: {
    type: String,
    default: '',
    trim: true
  },
  defaultAdsReward: {
    type: Number,
    default: 50,
    min: 1,
    max: 1000,
    required: true
  },
  adsWatchLimit: {
    type: Number,
    default: 10,
    min: 1,
    max: 100,
    required: true
  },
  adsRewardMultiplier: {
    type: Number,
    default: 1.0,
    min: 0.1,
    max: 10.0,
    required: true
  },
  minWatchTime: {
    type: Number,
    default: 30,
    min: 5,
    max: 300,
    required: true
  },
  monetagEnabled: {
    type: Boolean,
    default: false,
  },
  monetagZoneId: {
    type: String,
    default: null
  },
  vpnRequired: {
    type: Boolean,
    default: false,

  },
  vpnNotAllowed: {
    type: Boolean,
    default: true,

  },
  vpnProvider: {
    type: String,
    enum: ['vpnapi', 'ipqualityscore', 'ip2location', 'maxmind'],
    default: 'vpnapi',

  },
  vpnapiKey: {
    type: String,
    default: '',
    trim: true
  },
  ipqualityKey: {
    type: String,
    default: '',
    trim: true
  },
  ip2locationKey: {
    type: String,
    default: '',
    trim: true
  },
  maxmindKey: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
});

// Create or export the model
const AdsSettings = mongoose.models.AdsSettings || mongoose.model<IAdsSettings>('AdsSettings', AdsSettingsSchema);

export default AdsSettings;
