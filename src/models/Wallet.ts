import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  address: string;
  privateKey?: string;
  mnemonic?: string;
  type: 'hot' | 'cold';
  currency: string;
  balance: number;
  status: 'active' | 'inactive' | 'maintenance';
  network: string;
  createdAt: Date;
  updatedAt: Date;
  lastTransaction?: Date;
}

const WalletSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  privateKey: {
    type: String,
    required: false,
    
    validate: {
      validator: function(v: string) {
        return !v || /^0x[a-fA-F0-9]{64}$/.test(v);
      },
      message: 'Invalid private key format'
    }
  },
  mnemonic: {
    type: String,
    required: false,
    select: false, // Don't include in queries by default for security
    validate: {
      validator: function(v: string) {
        return !v || v.split(' ').length === 12;
      },
      message: 'Mnemonic must be 12 words'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['hot', 'cold'],
    default: 'hot'
  },
  currency: {
    type: String,
    required: true,
    default: 'USDT'
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  network: {
    type: String,
    required: true,
       enum: ['eth-main', 'sepolia', 'bsc-mainnet', 'bsc-testnet'],
    default: 'bsc-mainnet'
  },
  lastTransaction: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

 

// Static methods
WalletSchema.statics.findByAddress = function(address: string) {
  return this.findOne({ address });
};

WalletSchema.statics.findByType = function(type: 'hot' | 'cold') {
  return this.find({ type, status: 'active' });
};

WalletSchema.statics.getTotalBalance = function(currency: string) {
  return this.aggregate([
    { $match: { currency, status: 'active' } },
    { $group: { _id: null, total: { $sum: '$balance' } } }
  ]);
};

// Instance methods
WalletSchema.methods.updateBalance = function(this: IWallet, amount: number) {
  this.balance = amount;
  this.lastTransaction = new Date();
  return this.save();
};

WalletSchema.methods.deactivate = function(this: IWallet) {
  this.status = 'inactive';
  return this.save();
};

const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;
