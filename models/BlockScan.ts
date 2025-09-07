import mongoose from 'mongoose';

export interface IBlockScan extends mongoose.Document {
  _id: string;
  network: string;
  contractAddress: string;
  lastProcessedBlock: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlockScanSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  lastProcessedBlock: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});
 

export default mongoose.models.BlockScan || mongoose.model<IBlockScan>('BlockScan', BlockScanSchema);
