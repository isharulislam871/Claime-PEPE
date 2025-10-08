import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { setupWebhook, removeWebhook } from '@/lib/telegram/webhook';

// Bot configuration schema
const botConfigSchema = new mongoose.Schema({
  botToken: { type: String, required: true },
  botUsername: String,
  webhookUrl: String,
  autoStart: { type: Boolean, default: true },
  status: { type: String, enum: ['running', 'stopped'], default: 'stopped' },
  lastUpdated: { type: Date, default: Date.now },
  processId: String,
  webhookActive: { type: Boolean, default: false }
});

const BotConfig = mongoose.models.BotConfig || mongoose.model('BotConfig', botConfigSchema);

// In-memory bot instance tracking
let botInstance: TelegramBot | null = null;

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { action } = await request.json();
    
    if (!['start', 'stop'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "start" or "stop"' },
        { status: 400 }
      );
    }

    // Get bot configuration
    let botConfig = await BotConfig.findOne();
    if (!botConfig) {
      return NextResponse.json(
        { error: 'Bot not configured. Please set bot token first.' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      if (botConfig.status === 'running') {
        return NextResponse.json(
          { message: 'Bot is already running', status: 'running' },
          { status: 200 }
        );
      }


     

      return NextResponse.json(
        { message: 'Bot is already running', status: 'running' },
        { status: 200 }
      );

     /*  try {
        // Setup webhook first if webhook URL is configured
        if (botConfig.webhookUrl) {
          const webhookSuccess = await setupWebhook(botConfig.botToken, botConfig.webhookUrl);
          if (webhookSuccess) {
            botConfig.webhookActive = true;
          }
        } else {
          // Auto-generate webhook URL if not set
          const appUrl = process.env.NEXT_PUBLIC_APP_URL;
          if (appUrl) {
            const webhookUrl = `${appUrl}/api/webhook/telegram`;
            const webhookSuccess = await setupWebhook(botConfig.botToken, webhookUrl);
            if (webhookSuccess) {
              botConfig.webhookUrl = webhookUrl;
              botConfig.webhookActive = true;
            }
          }
        }

        // Create bot instance (use webhook mode if active, otherwise polling)
        const usePolling = !botConfig.webhookActive;
        botInstance = new TelegramBot(botConfig.botToken, { polling: usePolling });
        
        // Set up basic bot commands
        botInstance.onText(/\/start/, (msg) => {
          const chatId = msg.chat.id;
          botInstance?.sendMessage(chatId, 'Welcome to TaskUp Crypto App! 🚀\n\nEarn PEPE tokens by completing simple tasks.');
        });

        botInstance.onText(/\/help/, (msg) => {
          const chatId = msg.chat.id;
          botInstance?.sendMessage(chatId, 'Available commands:\n/start - Start using the bot\n/help - Show this help message\n/status - Check your account status');
        });

        botInstance.onText(/\/status/, (msg) => {
          const chatId = msg.chat.id;
          botInstance?.sendMessage(chatId, 'Your TaskUp account is active! 💎\n\nVisit the app to complete tasks and earn PEPE tokens.');
        });

        // Update status in database
        botConfig.status = 'running';
        botConfig.lastUpdated = new Date();
        await botConfig.save();

        return NextResponse.json({
          message: `Bot started successfully with ${botConfig.webhookActive ? 'webhook' : 'polling'}`,
          status: 'running',
          webhookActive: botConfig.webhookActive
        });
      } catch (error) {
        console.error('Error starting bot:', error);
        return NextResponse.json(
          { error: 'Failed to start bot' },
          { status: 500 }
        );
      } */
    }
    console.log(botConfig.status);
    
    return NextResponse.json(
      { message: 'Bot is already running', status: 'running' },
      { status: 200 }
    );
    /* if (action === 'stop') {
      if (botConfig.status === 'stopped') {
        return NextResponse.json(
          { message: 'Bot is already stopped', status: 'stopped' },
          { status: 200 }
        );
      }

      try {
        // Remove webhook if active
        if (botConfig.webhookActive) {
          await removeWebhook(botConfig.botToken);
          botConfig.webhookActive = false;
          botConfig.webhookUrl = '';
        }

        // Stop bot instance if running
        if (botInstance) {
          await botInstance.stopPolling();
          botInstance = null;
        }

        // Update status in database
        botConfig.status = 'stopped';
        botConfig.lastUpdated = new Date();
        await botConfig.save();

        return NextResponse.json({
          message: 'Bot stopped successfully and webhook removed',
          status: 'stopped'
        });
      } catch (error) {
        console.error('Error stopping bot:', error);
        return NextResponse.json(
          { error: 'Failed to stop bot' },
          { status: 500 }
        );
      }
    } */

  } catch (error) {
    console.error('Bot control error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
