import mongoose from 'mongoose';

export interface ICoin extends mongoose.Document {
  _id: string;
  name: string;
  symbol: string;
  decimals: number;
  networks: {
    network: string;
    contractAddress?: string;
    isNative: boolean;
    isActive: boolean;
  }[];
  logoUrl?: string;
  description?: string;
  website?: string;
  coinGeckoId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NetworkConfigSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true,
    enum: ['eth-main', 'sepolia', 'bsc-mainnet', 'bsc-testnet'],

  },
  contractAddress: {
    type: String,
    validate: {
      validator: function (v: string) {
        // Allow empty for native tokens, validate format for contract addresses
        return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid contract address format'
    }
  },
  isNative: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const CoinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  decimals: {
    type: Number,
    required: true,
    min: 0,
    max: 18,
    default: 18
  },
  networks: [NetworkConfigSchema],
  logoUrl: {
    type: String,
    validate: {
      validator: function (v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid logo URL format'
    }
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function (v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid website URL format'
    }
  },
  coinGeckoId: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


export default mongoose.models.Coin || mongoose.model<ICoin>('Coin', CoinSchema);
