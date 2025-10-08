import mongoose from 'mongoose';

export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  estimatedCompletion: string | null;
  lastUpdated: string;
  progress: number;
  currentStep: string;
}

// Define Mongoose schema for maintenance
const maintenanceSchema = new mongoose.Schema({
  _id: { type: String, default: 'system' },
  enabled: { type: Boolean, default: false },
  message: { type: String, default: 'We are currently performing scheduled maintenance to improve our services.' },
  estimatedCompletion: { type: String, default: null },
  lastUpdated: { type: String, default: () => new Date().toISOString() },
  progress: { type: Number, default: 0 },
  currentStep: { type: String, default: 'Preparing maintenance...' }
});

// Create or get existing model
export const Maintenance = mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);