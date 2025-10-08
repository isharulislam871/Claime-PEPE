import { NextRequest, NextResponse } from 'next/server';
import { BotConfig } from '@/models/BotConfig';
import dbConnect from '@/lib/mongodb';
import { getChatMember } from '@/lib/telegram/webhook';
import Task from '@/models/Task';
import User from '@/models/User';
import Activity from '@/models/Activity';

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;
}

 


export async function POST(request: NextRequest) {
  try {
    const { userId, channelId } = await request.json();

    if (!userId || !channelId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: userId and channelId'
      }, { status: 400 });
    }

    // Connect to database and get bot configuration
    await dbConnect();
    
    const botConfig = await BotConfig.findOne({ status: 'running' });
    
    if (!botConfig || !botConfig.botToken) {
      return NextResponse.json({
        success: false,
        error: 'Bot configuration not found or bot is not running'
      }, { status: 500 });
    }
 
    const chatMember = await getChatMember(botConfig.botToken, channelId, userId);
     
    if (!chatMember) {
      return NextResponse.json({
        success: true,
        isMember: false,
        status: 'not_found',
        message: 'User not found in channel or error occurred'
      });
    }

    // Check membership status
    const isMember = ['creator', 'administrator', 'member'].includes(chatMember.status);
    const isRestricted = chatMember.status === 'restricted';
    const hasLeft = ['left', 'kicked'].includes(chatMember.status);

    return NextResponse.json({
      success: true,
      isMember,
      status: chatMember.status,
      userInfo: {
        id: chatMember.user.id,
        firstName: chatMember.user.first_name,
        username: chatMember.user.username,
        isBot: chatMember.user.is_bot
      },
      message: isMember 
        ? 'User is a member of the channel'
        : hasLeft 
        ? 'User has left or been removed from the channel'
        : isRestricted
        ? 'User is restricted in the channel'
        : 'User is not a member of the channel'
    });

  } catch (error) {
    console.error('Error checking channel membership:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

 
