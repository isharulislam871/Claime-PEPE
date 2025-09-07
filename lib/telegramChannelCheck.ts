interface ChannelCheckResponse {
  success: boolean;
  isMember: boolean;
  status?: string;
  userInfo?: {
    id: number;
    firstName: string;
    username?: string;
    isBot: boolean;
  };
  message?: string;
  error?: string;
}

export async function checkChannelMembership(
  userId: number, 
  channelId: string
): Promise<ChannelCheckResponse> {
  try {
    const response = await fetch('/api/bot/check-channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        channelId
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking channel membership:', error);
    return {
      success: false,
      isMember: false,
      error: 'Failed to check channel membership'
    };
  }
}

export function getTelegramUserId(): number | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
    return window.Telegram.WebApp.initDataUnsafe.user.id;
  }
  return null;
}

export function getTelegramUser() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}

// Common channel IDs (you can configure these)
export const CHANNELS = {
  MAIN_CHANNEL: '@taskup_channel',
  COMMUNITY: '@taskup_community',
  ANNOUNCEMENTS: '@taskup_news'
};

// Helper function to check multiple channels
export async function checkMultipleChannels(
  userId: number, 
  channelIds: string[]
): Promise<Record<string, ChannelCheckResponse>> {
  const results: Record<string, ChannelCheckResponse> = {};
  
  const promises = channelIds.map(async (channelId) => {
    const result = await checkChannelMembership(userId, channelId);
    results[channelId] = result;
  });

  await Promise.all(promises);
  return results;
}
