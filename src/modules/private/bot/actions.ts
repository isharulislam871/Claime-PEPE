import { BotActionTypes, BotConfig } from './types';

// Fetch bot config actions
export const fetchBotConfigRequest = () => ({
  type: BotActionTypes.FETCH_BOT_CONFIG_REQUEST as const
});

export const fetchBotConfigSuccess = (config: BotConfig) => ({
  type: BotActionTypes.FETCH_BOT_CONFIG_SUCCESS as const,
  payload: config
});

export const fetchBotConfigFailure = (error: string) => ({
  type: BotActionTypes.FETCH_BOT_CONFIG_FAILURE as const,
  payload: error
});

// Update bot config actions
export const updateBotConfigRequest = (config: Partial<BotConfig>) => ({
  type: BotActionTypes.UPDATE_BOT_CONFIG_REQUEST as const,
  payload: config
});

export const updateBotConfigSuccess = (config: BotConfig) => ({
  type: BotActionTypes.UPDATE_BOT_CONFIG_SUCCESS as const,
  payload: config
});

export const updateBotConfigFailure = (error: string) => ({
  type: BotActionTypes.UPDATE_BOT_CONFIG_FAILURE as const,
  payload: error
});
