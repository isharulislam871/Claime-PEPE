import TelegramBot from 'node-telegram-bot-api';

class TelegramService {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }

    this.bot = new TelegramBot(token, { polling: false });
  }

  async sendBroadcast(title: string, message: string, type: string, userIds: string[]): Promise<{ success: boolean; delivered: number; failed: number; errors?: string[] }> {
    try {
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
          console.error(`Failed to send message to user ${userId}:`, error);
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
      console.error(`Error sending message to user ${userId}:`, error);
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
    
    return `${emoji} <b>${title}</b>\n\n${message}\n\n🤖 <i>TaskUp Bot</i>`;
  }

  async getUserCount(): Promise<number> {
    // Since we're sending to individual users, we can't get a channel member count
    // This would need to be retrieved from the User database instead
    console.warn('getUserCount is deprecated when sending to individual users');
    return 0;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.bot.getMe();
      return true;
    } catch (error) {
      console.error('Telegram connection test failed:', error);
      return false;
    }
  }
}

export default TelegramService;
