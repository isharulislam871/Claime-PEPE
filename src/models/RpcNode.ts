import mongoose from 'mongoose';

export interface IRpcNode extends mongoose.Document {
  _id: string;
  name: string;
  url: string;
  network: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  lastChecked?: Date;
  status: 'online' | 'offline' | 'error';
  responseTime?: number;
  blockHeight?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RpcNodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid RPC URL format'
    }
  },
  network: {
    type: String,
    required: true,
    enum: ['eth-main', 'sepolia', 'bsc-mainnet', 'bsc-testnet'],
    default: 'bsc-mainnet'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  lastChecked: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'error'],
    default: 'offline'
  },
  responseTime: {
    type: Number,
    default: null
  },
  blockHeight: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

 
export default mongoose.models.RpcNode || mongoose.model<IRpcNode>('RpcNode', RpcNodeSchema);
