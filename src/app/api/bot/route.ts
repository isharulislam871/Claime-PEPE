import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import { BotConfig } from '@/models/BotConfig';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    // Get bot configuration from database
    let botConfig = await BotConfig.findOne();
    
    // If no config exists, create one with environment variables
    if (!botConfig) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!botToken) {
        return NextResponse.json(
          { error: 'Bot token not configured in environment or database' },
          { status: 500 }
        );
      }

      botConfig = new BotConfig({
        botToken,
        status: 'stopped'
      });
      await botConfig.save();
    }

    // Create bot instance (polling disabled for webhook mode)
    const bot = new TelegramBot(botConfig.botToken, { polling: false });
    
    // Get bot information
    const botInfo = await bot.getMe();
    
    // Update bot config with latest info
    botConfig.botUsername = botInfo.username;
    botConfig.lastUpdated = new Date();
    await botConfig.save();
    
    return NextResponse.json({
      success: true,
      data: {
        username: botInfo.username,
        firstName: botInfo.first_name,
        id: botInfo.id,
        status: botConfig.status,
        webhookActive: botConfig.webhookActive,
        autoStart: botConfig.autoStart
      }
    });
    
  } catch (error) {
    console.error('Error getting bot info:', error);
    return NextResponse.json(
      { error: 'Failed to get bot information' },
      { status: 500 }
    );
  }
}
