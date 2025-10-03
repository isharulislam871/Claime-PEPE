import { PopupActionTypes, PopupType, OpenPopupAction, ClosePopupAction, CloseAllPopupsAction, TogglePopupAction } from './types';

export const openPopup = (popupType: PopupType): OpenPopupAction => ({
  type: PopupActionTypes.OPEN_POPUP,
  payload: popupType,
});

export const closePopup = (popupType: PopupType): ClosePopupAction => ({
  type: PopupActionTypes.CLOSE_POPUP,
  payload: popupType,
});

export const closeAllPopups = (): CloseAllPopupsAction => ({
  type: PopupActionTypes.CLOSE_ALL_POPUPS,
});

export const togglePopup = (popupType: PopupType): TogglePopupAction => ({
  type: PopupActionTypes.TOGGLE_POPUP,
  payload: popupType,
});

// Convenience action creators for specific popups
export const openProfilePopup = () => openPopup('isOpenProfile');
export const closeProfilePopup = () => closePopup('isOpenProfile');

export const openWithdrawPopup = () => openPopup('isOpenWithdraw');
export const closeWithdrawPopup = () => closePopup('isOpenWithdraw');

export const openInviteFriendsPopup = () => openPopup('isInviteFriendsEarn');
export const closeInviteFriendsPopup = () => closePopup('isInviteFriendsEarn');

export const openHistoryPopup = () => openPopup('isHistoryOpen');
export const closeHistoryPopup = () => closePopup('isHistoryOpen');

export const openSwapPopup = () => openPopup('isSwapOpen');
export const closeSwapPopup = () => closePopup('isSwapOpen');

export const openDailyCheckInPopup = () => openPopup('isDailyCheckInOpen');
export const closeDailyCheckInPopup = () => closePopup('isDailyCheckInOpen');

export const openAdWatchPopup = () => openPopup('isAdWatchOpen');
export const closeAdWatchPopup = () => closePopup('isAdWatchOpen');

export const openTaskPopup = () => openPopup('isTaskPopupOpen');
export const closeTaskPopup = () => closePopup('isTaskPopupOpen');

export const openRegistrationBlockedPopup = () => openPopup('isRegistrationBlockedPopupVisible');
export const closeRegistrationBlockedPopup = () => closePopup('isRegistrationBlockedPopupVisible');

export const openMinimumInvitesPopup = () => openPopup('isMinimumInvitesPopupVisible');
export const closeMinimumInvitesPopup = () => closePopup('isMinimumInvitesPopupVisible');

export const openPaymentSuspendedPopup = () => openPopup('isPaymentSuspendedPopupVisible');
export const closePaymentSuspendedPopup = () => closePopup('isPaymentSuspendedPopupVisible');

export const openRewardsPopup = () => openPopup('isRewardsPopupVisible');
export const closeRewardsPopup = () => closePopup('isRewardsPopupVisible');

export const openShopPopup = () => openPopup('isShopPopupVisible');
export const closeShopPopup = () => closePopup('isShopPopupVisible');

export const openVoucherPopup = () => openPopup('isVoucherPopupVisible');
export const closeVoucherPopup = () => closePopup('isVoucherPopupVisible');

export const openLeaderboardPopup = () => openPopup('isLeaderboardPopupVisible');
export const closeLeaderboardPopup = () => closePopup('isLeaderboardPopupVisible');

export const openEarningCenterPopup = () => openPopup('isEarningCenterPopupVisible');
export const closeEarningCenterPopup = () => closePopup('isEarningCenterPopupVisible');

export const openSupportPopup = () => openPopup('isSupportPopupVisible');
export const closeSupportPopup = () => closePopup('isSupportPopupVisible');

export const openAppLaunchCountdownPopup = () => openPopup('isAppLaunchCountdownVisible');
export const closeAppLaunchCountdownPopup = () => closePopup('isAppLaunchCountdownVisible');

export const openBannedUserPopup = () => openPopup('isBannedUserPopupVisible');
export const closeBannedUserPopup = () => closePopup('isBannedUserPopupVisible');

export const openSuspendedUserPopup = () => openPopup('isSuspendedUserPopupVisible');
export const closeSuspendedUserPopup = () => closePopup('isSuspendedUserPopupVisible');
