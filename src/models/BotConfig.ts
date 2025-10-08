import mongoose from 'mongoose';

// Bot configuration schema
const botConfigSchema = new mongoose.Schema({
  botToken: { type: String, required: true },
  botUsername: String,
  webhookUrl: String,
  autoStart: { type: Boolean, default: true },
  status: { type: String, enum: ['running', 'stopped'], default: 'stopped' },
  lastUpdated: { type: Date, default: Date.now },
  webhookActive: { type: Boolean, default: false },
   
});

export const BotConfig = mongoose.models.BotConfig || mongoose.model('BotConfig', botConfigSchema);