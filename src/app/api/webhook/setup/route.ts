import { NextRequest, NextResponse } from 'next/server';
import { setupWebhook, removeWebhook, getWebhookInfo } from '@/lib/telegram/webhook';

// POST - Set up webhook
export async function POST(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN not configured' },
        { status: 500 }
      );
    }
    
    if (!appUrl) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_APP_URL not configured' },
        { status: 500 }
      );
    }
    
    const webhookUrl = `${appUrl}/api/webhook/telegram`;
    const success = await setupWebhook(botToken, webhookUrl);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook set up successfully',
        webhookUrl
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to set up webhook' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Webhook setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove webhook
export async function DELETE(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN not configured' },
        { status: 500 }
      );
    }
    
    const success = await removeWebhook(botToken);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook removed successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove webhook' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Webhook removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get webhook info
export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN not configured' },
        { status: 500 }
      );
    }
    
    const info = await getWebhookInfo(botToken);
    
    return NextResponse.json({
      success: true,
      webhookInfo: info
    });
    
  } catch (error) {
    console.error('Webhook info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
