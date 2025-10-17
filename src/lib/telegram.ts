import TelegramBot from 'node-telegram-bot-api';
import { BotConfig } from '@/models/BotConfig';
import mongoose from 'mongoose';

class TelegramService {
  private bot: TelegramBot | null = null;
  private botUsername: string = 'Bot';

  constructor() {
    // Bot will be initialized when needed
  }

  private async initializeBot(): Promise<void> {
    if (this.bot) return;

    try {
      // Connect to MongoDB if not already connected
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI || '');
      }

      // Get bot configuration from database
      const botConfig = await BotConfig.findOne().sort({ lastUpdated: -1 });
      
      if (!botConfig || !botConfig.botToken) {
        throw new Error('Bot token not found in database. Please configure the bot first.');
      }

      this.bot = new TelegramBot(botConfig.botToken, { polling: false });
      this.botUsername = botConfig.botUsername || 'Bot';
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
      throw new Error('Failed to initialize Telegram bot. Please check bot configuration.');
    }
  }

  async sendBroadcast(title: string, message: string, type: string, userIds: string[]): Promise<{ success: boolean; delivered: number; failed: number; errors?: string[] }> {
    try {
      await this.initializeBot();
      if (!this.bot) throw new Error('Bot initialization failed');
      
      // Format message based on type
      const formattedMessage = this.formatMessage(title, message, type);
      
      let delivered = 0;
      let failed = 0;
      const errors: string[] = [];

      // Send message to each user individually
      for (const userId of userIds) {
        try {
          await this.bot.sendMessage(userId, formattedMessage, {
            parse_mode: 'HTML',
            disable_web_page_preview: false
          });
          delivered++;
        } catch (error) {
          failed++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`User ${userId}: ${errorMsg}`);
       
        }
      }

      return {
        success: delivered > 0,
        delivered,
        failed,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error in broadcast process:', error);
      return {
        success: false,
        delivered: 0,
        failed: userIds.length,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  async sendMessageToUser(userId: string, title: string, message: string, type: string): Promise<{ success: boolean; messageId?: number; error?: string }> {
    try {
      await this.initializeBot();
      if (!this.bot) throw new Error('Bot initialization failed');
      
      const formattedMessage = this.formatMessage(title, message, type);
      
      const result = await this.bot.sendMessage(userId, formattedMessage, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });

      return {
        success: true,
        messageId: result.message_id
      };
    } catch (error) {
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async sendScheduledBroadcast(title: string, message: string, type: string, scheduledTime: Date): Promise<{ success: boolean; messageId?: number; error?: string }> {
    // For scheduled messages, you might want to use a job queue like Bull or Agenda
    // For now, we'll just validate the scheduled time
    const now = new Date();
    if (scheduledTime <= now) {
      return {
        success: false,
        error: 'Scheduled time must be in the future'
      };
    }

    // In a real implementation, you would queue this message to be sent later
    // For now, we'll return success and handle scheduling in the API
    return {
      success: true
    };
  }

  private formatMessage(title: string, message: string, type: string): string {
    const typeEmojis: { [key: string]: string } = {
      'announcement': '📢',
      'task_notification': '📋',
      'system_update': '⚙️',
      'promotional': '🎯'
    };

    const emoji = typeEmojis[type] || '📢';
    
    return `${emoji} <b>${title}</b>\n\n${message}\n\n🤖 <i>${this.botUsername}</i>`;
  }

  async getUserCount(): Promise<number> {
    // Since we're sending to individual users, we can't get a channel member count
    // This would need to be retrieved from the User database instead
    console.warn('getUserCount is deprecated when sending to individual users');
    return 0;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.initializeBot();
      if (!this.bot) return false;
      
      await this.bot.getMe();
      return true;
    } catch (error) {
      console.error('Telegram connection test failed:', error);
      return false;
    }
  }

  async verifyUser(telegramId: number , channel : string) {
    try {
      await this.initializeBot();
      if (!this.bot) throw new Error('Bot initialization failed');

      const result = await this.bot.getChatMember(channel, telegramId);

      
      if (result.status === 'member' || result.status === 'creator' || result.status === 'administrator') {
        return { success: true , message : 'User is a member of the channel' };
      }
      return { success: false , message : 'User is not a member of the channel' };
        
      
    } catch (error ) {
      if ( error instanceof Error && error.message == 'ETELEGRAM: 400 Bad Request: member list is inaccessible') {
        return { success: false , message :  'User is not a member of the channel' };
      }
      return { success: false , message : error instanceof Error ? error.message : 'Unknown error occurred' };
      
    }
  } 
  
}

export default TelegramService;
