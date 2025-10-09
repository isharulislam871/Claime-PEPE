export interface PopupState {
  isOpenProfile: boolean;
  isOpenWithdraw: boolean;
  isInviteFriendsEarn: boolean;
  isHistoryOpen: boolean;
  isSwapOpen: boolean;
  isSwapHistoryOpen: boolean;
  isSwapHistoryDetailsOpen: boolean;
  isDailyCheckInOpen: boolean;
  isAdWatchOpen: boolean;
  isTaskPopupOpen: boolean;
  isRegistrationBlockedPopupVisible: boolean;
  isMinimumInvitesPopupVisible: boolean;
  isPaymentSuspendedPopupVisible: boolean;
  isRewardsPopupVisible: boolean;
  isShopPopupVisible: boolean;
  isVoucherPopupVisible: boolean;
  isLeaderboardPopupVisible: boolean;
  isEarningCenterPopupVisible: boolean;
  isSupportPopupVisible: boolean;
  isAppLaunchCountdownVisible: boolean;
  isBannedUserPopupVisible: boolean;
  isSuspendedUserPopupVisible: boolean;
}

export enum PopupActionTypes {
  OPEN_POPUP = 'popup/OPEN_POPUP',
  CLOSE_POPUP = 'popup/CLOSE_POPUP',
  CLOSE_ALL_POPUPS = 'popup/CLOSE_ALL_POPUPS',
  TOGGLE_POPUP = 'popup/TOGGLE_POPUP',
}

export type PopupType = keyof PopupState;

export interface OpenPopupAction {
  type: PopupActionTypes.OPEN_POPUP;
  payload: PopupType;
  [key: string]: any;
}

export interface ClosePopupAction {
  type: PopupActionTypes.CLOSE_POPUP;
  payload: PopupType;
  [key: string]: any;
}

export interface CloseAllPopupsAction {
  type: PopupActionTypes.CLOSE_ALL_POPUPS;
  [key: string]: any;
}

export interface TogglePopupAction {
  type: PopupActionTypes.TOGGLE_POPUP;
  payload: PopupType;
  [key: string]: any;
}

export type PopupAction =
  | OpenPopupAction
  | ClosePopupAction
  | CloseAllPopupsAction
  | TogglePopupAction;
