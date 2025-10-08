import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BotConfig } from '@/models/BotConfig';


export async function GET() {
  try {
    await connectDB();
    
    let botConfig = await BotConfig.findOne();
    
    if (!botConfig) {
      // Create default configuration if none exists
      botConfig = new BotConfig({
        botToken: '',
        status: 'stopped',
        lastUpdated: new Date(),
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
