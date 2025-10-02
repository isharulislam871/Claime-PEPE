import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BotConfig } from '@/models/BotConfig';
 

export async function GET() {
  try {
    await connectDB();
    
    let botConfig = await BotConfig.findOne();
    
    // Also check environment variable as fallback
    const envToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botConfig && envToken) {
      // Create config from environment variable
      botConfig = new BotConfig({
        botToken: envToken,
        status: 'stopped'
      });
      await botConfig.save();
    }
    
    if (!botConfig) {
      return NextResponse.json({
        botToken: '',
        botUsername: '',
        webhookUrl: '',
        autoStart: true,
        status: 'stopped'
      });
    }

    return NextResponse.json({
      botToken: botConfig.botToken  , // Mask token for security
      botUsername: botConfig.botUsername,
      webhookUrl: botConfig.webhookUrl,
      autoStart: botConfig.autoStart,
      status: botConfig.status,
      webhookActive: botConfig.webhookActive || false
    });

  } catch (error) {
    console.error('Bot config get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { botToken, botUsername, webhookUrl, autoStart } = await request.json();
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token is required' },
        { status: 400 }
      );
    }

    // Update or create bot configuration
    const botConfig = await BotConfig.findOneAndUpdate(
      {},
      {
        botToken,
        botUsername,
        webhookUrl,
        autoStart,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: 'Bot configuration saved successfully',
      config: {
        botUsername: botConfig.botUsername,
        webhookUrl: botConfig.webhookUrl,
        autoStart: botConfig.autoStart,
        status: botConfig.status
      }
    });

  } catch (error) {
    console.error('Bot config save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
