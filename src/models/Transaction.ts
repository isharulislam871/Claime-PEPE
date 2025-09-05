import mongoose from 'mongoose';

export interface ITransaction extends mongoose.Document {
  _id: string;
  walletId: string;
  walletAddress: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: string;
  currency: string;
  network: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  fromAddress?: string;
  toAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  network: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  blockNumber: {
    type: Number
  },
  gasUsed: {
    type: String
  },
  gasPrice: {
    type: String
  },
  fromAddress: {
    type: String,
    lowercase: true
  },
  toAddress: {
    type: String,
    lowercase: true
  }
}, {
  timestamps: true
});
 

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
