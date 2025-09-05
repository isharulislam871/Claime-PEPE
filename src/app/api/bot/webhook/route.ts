import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
 
import { setupWebhook, removeWebhook, getWebhookInfo , getBotInfo } from '@/lib/telegram/webhook';
import { BotConfig } from '@/models/BotConfig';

 
 
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { action } = await request.json();
    
    if (!['start', 'stop', 'info'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "setup", "remove", or "info"' },
        { status: 400 }
      );
    }

    // Get bot configuration
    let botConfig = await BotConfig.findOne();
    if (!botConfig || !botConfig.botToken) {
      return NextResponse.json(
        { error: 'Bot not configured. Please set bot token first.' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      if(botConfig.status === 'running'){
        return NextResponse.json(
          { error: 'Bot is already running' },
          { status: 400 }
        );
      }
      
      const success = await setupWebhook(botConfig.botToken, botConfig.webhookUrl);
    
      if (success) {
        if(!botConfig.botUsername){
          const info = await getBotInfo(botConfig.botToken);
           botConfig.botUsername = info?.username as any;
        }
        botConfig.status = 'running';
        botConfig.webhookActive = true;
        botConfig.lastUpdated = new Date();
        await botConfig.save();

        return NextResponse.json({
          message: `Bot started successfully with ${botConfig.webhookActive ? 'webhook' : 'polling'}`,
          status: 'running',
          webhookActive: botConfig.webhookActive
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to set up webhook' },
          { status: 500 }
        );
      }
    }

    if (action === 'stop') {
      const success = await removeWebhook(botConfig.botToken);
      if (success) {
         botConfig.webhookActive = false;
         botConfig.status = 'stopped';
        botConfig.lastUpdated = new Date();
        await botConfig.save();

        return NextResponse.json({
          message: 'Bot stopped successfully and webhook removed',
          status: 'stopped'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to remove webhook' },
          { status: 500 }
        );
      }
    }

    if (action === 'info') {
      const info = await getWebhookInfo(botConfig.botToken);
      
      return NextResponse.json({
        success: true,
        webhookInfo: info
      });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
