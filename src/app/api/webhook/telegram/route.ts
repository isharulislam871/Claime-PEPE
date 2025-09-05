import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateUniqueReferralCode } from '@/lib/utils/referralCode';

// Webhook handler for Telegram updates
export async function POST(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }

    // Create bot instance without polling (webhook mode)
    const bot = new TelegramBot(botToken, { polling: false });
    
    // Parse the incoming update
    const update = await request.json();
    
    // Handle different types of updates
    if (update.message) {
      await handleMessage(bot, update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(bot, update.callback_query);
    }
    
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle incoming messages
async function handleMessage(bot: TelegramBot, message: any) {
  const chatId = message.chat.id;
  const userId = message.from.id.toString();
  const text = message.text;
  
  await dbConnect();
  
  // Handle /start command with referral code
  if (text && text.startsWith('/start')) {
    
    await handleStartCommand(bot, chatId, userId, message.from);
    return;
  }
  
  // Handle other commands
  switch (text) {
    case '/help':
      await bot.sendMessage(chatId, 
        '🚀 Welcome to TaskUp!\n\n' +
        '📱 Use /webapp to open the Mini App\n' +
        '🎁 Invite friends and earn rewards\n' +
        '💰 Complete tasks to earn crypto\n\n' +
        'Commands:\n' +
        '/webapp - Open TaskUp Mini App\n' +
        '/referral - Get your referral link\n' +
        '/balance - Check your balance'
      );
      break;
      
    case '/webapp':
      await sendWebAppButton(bot, chatId);
      break;
      
    case '/referral':
      await handleReferralCommand(bot, chatId, userId);
      break;
      
    case '/balance':
      await handleBalanceCommand(bot, chatId, userId);
      break;
      
    default:
      await bot.sendMessage(chatId, 
        '🤖 Use /help to see available commands or /webapp to open TaskUp!'
      );
  }
}

// Handle /start command with referral processing
async function handleStartCommand( bot: TelegramBot,  chatId: number,  userId: string, userInfo: any) {
  try {
    // Check if user exists
    let user = await User.findOne({ telegramId: userId });
    const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app-url.com';
    if (!user) {
      await sendWebAppButton(bot, chatId);
    } else {
      // Check user status
      if (user.status === 'ban') {
        await bot.sendMessage(chatId, 
          `❌ Your account has been banned.\n\n` +
          `Reason: ${user.banReason || 'Violation of terms of service'}\n\n` +
          `Please contact support if you believe this is an error.`
        );
        return; // Don't send Mini App button for banned users
      }
      
      if (user.status === 'suspend') {
        await bot.sendMessage(chatId, 
          `⚠️ Your account is temporarily suspended.\n\n` +
          `Reason: ${user.banReason || 'Under review'}\n\n` +
          `Please wait for the suspension to be lifted or contact support.`
        );
        return; // Don't send Mini App button for suspended users
      }
      
      // Welcome back existing user
      await bot.sendMessage(chatId, 
        `👋 Welcome back, ${userInfo.first_name}!\n\n` +
        `💰 Balance: ${user.balance} PEPE\n` +
        `🎁 Referrals: ${user.referralCount}\n\n` +
        `📱 Ready to earn more?`,
        {
          reply_markup: {
            inline_keyboard: [[
              {
                text: '📱 Open TaskUp',
                web_app: { url: webAppUrl }
              }
            ]]
          }
        }
      );
    }
    
 
    
  } catch (error) {
    console.error('Start command error:', error);
    await bot.sendMessage(chatId, 
      '❌ Something went wrong. Please try again later.'
    );
  }
}

// Send Web App button
async function sendWebAppButton(bot: TelegramBot, chatId: number) {
  const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app-url.com';
  
  await bot.sendMessage(chatId, 
    '🚀 Open TaskUp Mini App to start earning!', 
    {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '📱 Open TaskUp',
            web_app: { url: webAppUrl }
          }
        ]]
      }
    }
  );
}

// Handle referral command
async function handleReferralCommand(bot: TelegramBot, chatId: number, userId: string) {
  try {
    const user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      await bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
      return;
    }
    
    const botInfo = await bot.getMe();
    const referralLink = `https://t.me/${botInfo.username}?startapp=${user.referralCode}`;
    
    await bot.sendMessage(chatId, 
      `🎁 Your Referral Information:\n\n` +
      `🔗 Referral Link: ${referralLink}\n` +
      `💎 Your Code: ${user.referralCode}\n` +
      `👥 Total Referrals: ${user.referralCount}\n` +
      `💰 Referral Earnings: ${user.referralEarnings} PEPE\n\n` +
      `Share your link and earn 10% of your friends' earnings forever!`,
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: '📤 Share Referral Link',
              url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('🚀 Join TaskUp and earn crypto by completing simple tasks!')}`
            }
          ]]
        }
      }
    );
  } catch (error) {
    console.error('Referral command error:', error);
    await bot.sendMessage(chatId, '❌ Error retrieving referral information.');
  }
}

// Handle balance command
async function handleBalanceCommand(bot: TelegramBot, chatId: number, userId: string) {
  try {
    const user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      await bot.sendMessage(chatId, '❌ User not found. Please use /start first.');
      return;
    }
    
    await bot.sendMessage(chatId, 
      `💰 Your TaskUp Balance:\n\n` +
      `💎 Current Balance: ${user.balance} PEPE\n` +
      `📈 Total Earned: ${user.totalEarned} PEPE\n` +
      `🎁 Referral Earnings: ${user.referralEarnings} PEPE\n` +
      `👥 Total Referrals: ${user.referralCount}\n\n` +
      `Keep completing tasks to earn more!`
    );
  } catch (error) {
    console.error('Balance command error:', error);
    await bot.sendMessage(chatId, '❌ Error retrieving balance information.');
  }
}

// Handle callback queries (inline button presses)
async function handleCallbackQuery(bot: TelegramBot, callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id.toString();
  const data = callbackQuery.data;
  
  // Acknowledge the callback query
  await bot.answerCallbackQuery(callbackQuery.id);
  
  // Handle different callback data
  switch (data) {
    case 'open_webapp':
      await sendWebAppButton(bot, chatId);
      break;
      
    default:
      await bot.sendMessage(chatId, '🤖 Unknown action.');
  }
}
