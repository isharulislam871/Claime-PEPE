import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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

const BotConfig = mongoose.models.BotConfig || mongoose.model('BotConfig', botConfigSchema);

export async function GET() {
  try {
    await connectDB();
    
    let botConfig = await BotConfig.findOne();
    
    if (!botConfig) {
      // Create default configuration if none exists
      botConfig = new BotConfig({
        botToken: '',
        status: 'stopped',
        lastUpdated: new Date()
      });
      await botConfig.save();
    }

    return NextResponse.json({
      status: botConfig.status,
      lastUpdated: botConfig.lastUpdated,
      configured: !!botConfig.botToken,
      webhookActive: botConfig.webhookActive
    });

  } catch (error) {
    console.error('Bot status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
