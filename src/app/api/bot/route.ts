import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    // Create bot instance (polling disabled for webhook mode)
    const bot = new TelegramBot(botToken, { polling: false });
    
    // Get bot information
    const botInfo = await bot.getMe();
    
    return NextResponse.json({
      success: true,
      data: {
        username: botInfo.username,
        firstName: botInfo.first_name,
        id: botInfo.id
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
