import { RootState } from '../../store';

// Bot selectors
export const selectBotState = (state: RootState) => state.private.bot;

export const selectBotConfig = (state: RootState) => 
  state.private.bot.config;

export const selectBotLoading = (state: RootState) => 
  state.private.bot.loading;

export const selectBotError = (state: RootState) => 
  state.private.bot.error;

export const selectBotToken = (state: RootState) => 
  state.private.bot.config?.botToken;

export const selectBotUsername = (state: RootState) => 
  state.private.bot.config?.botUsername;

export const selectWebhookUrl = (state: RootState) => 
  state.private.bot.config?.webhookUrl;

export const selectBotIsActive = (state: RootState) => 
  state.private.bot.config?.isActive ?? false;
