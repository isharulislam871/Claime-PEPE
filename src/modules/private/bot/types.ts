export interface BotConfig {
  id?: string;
  botToken: string;
  botUsername: string;
  webhookUrl: string;
  isActive: boolean;
  createdAt?: Date;
  username : string;
  updatedAt?: Date;
}

export interface BotState {
  config: BotConfig | null;
  loading: boolean;
  error: string | null;
}

export enum BotActionTypes {
  FETCH_BOT_CONFIG_REQUEST = 'FETCH_BOT_CONFIG_REQUEST',
  FETCH_BOT_CONFIG_SUCCESS = 'FETCH_BOT_CONFIG_SUCCESS',
  FETCH_BOT_CONFIG_FAILURE = 'FETCH_BOT_CONFIG_FAILURE',
  UPDATE_BOT_CONFIG_REQUEST = 'UPDATE_BOT_CONFIG_REQUEST',
  UPDATE_BOT_CONFIG_SUCCESS = 'UPDATE_BOT_CONFIG_SUCCESS',
  UPDATE_BOT_CONFIG_FAILURE = 'UPDATE_BOT_CONFIG_FAILURE'
}

export type BotAction =
  | { type: BotActionTypes.FETCH_BOT_CONFIG_REQUEST }
  | { type: BotActionTypes.FETCH_BOT_CONFIG_SUCCESS; payload: BotConfig }
  | { type: BotActionTypes.FETCH_BOT_CONFIG_FAILURE; payload: string }
  | { type: BotActionTypes.UPDATE_BOT_CONFIG_REQUEST; payload: Partial<BotConfig> }
  | { type: BotActionTypes.UPDATE_BOT_CONFIG_SUCCESS; payload: BotConfig }
  | { type: BotActionTypes.UPDATE_BOT_CONFIG_FAILURE; payload: string };
