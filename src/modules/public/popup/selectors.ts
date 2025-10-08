import { RootState } from '../../store';
import { PopupState, PopupType } from './types';

// Base selector
export const selectPopupState = (state: RootState): PopupState => state.public.popup;

// Generic popup selector
export const selectPopupIsOpen = (popupType: PopupType) => (state: RootState): boolean =>
  selectPopupState(state)[popupType];

// Specific popup selectors
export const selectIsProfileOpen = (state: RootState): boolean =>
  selectPopupState(state).isOpenProfile;

export const selectIsWithdrawOpen = (state: RootState): boolean =>
  selectPopupState(state).isOpenWithdraw;

export const selectIsInviteFriendsOpen = (state: RootState): boolean =>
  selectPopupState(state).isInviteFriendsEarn;

export const selectIsHistoryOpen = (state: RootState): boolean =>
  selectPopupState(state).isHistoryOpen;

export const selectIsSwapOpen = (state: RootState): boolean =>
  selectPopupState(state).isSwapOpen;

export const selectIsSwapHistoryOpen = (state: RootState): boolean =>
  selectPopupState(state).isSwapHistoryOpen;

export const selectIsDailyCheckInOpen = (state: RootState): boolean =>
  selectPopupState(state).isDailyCheckInOpen;

export const selectIsAdWatchOpen = (state: RootState): boolean =>
  selectPopupState(state).isAdWatchOpen;

export const selectIsTaskPopupOpen = (state: RootState): boolean =>
  selectPopupState(state).isTaskPopupOpen;

export const selectIsRegistrationBlockedPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isRegistrationBlockedPopupVisible;

export const selectIsMinimumInvitesPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isMinimumInvitesPopupVisible;

export const selectIsPaymentSuspendedPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isPaymentSuspendedPopupVisible;

export const selectIsRewardsPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isRewardsPopupVisible;

export const selectIsShopPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isShopPopupVisible;

export const selectIsVoucherPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isVoucherPopupVisible;

export const selectIsLeaderboardPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isLeaderboardPopupVisible;

export const selectIsEarningCenterPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isEarningCenterPopupVisible;

export const selectIsSupportPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isSupportPopupVisible;

export const selectIsAppLaunchCountdownVisible = (state: RootState): boolean =>
  selectPopupState(state).isAppLaunchCountdownVisible;

export const selectIsBannedUserPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isBannedUserPopupVisible;

export const selectIsSuspendedUserPopupVisible = (state: RootState): boolean =>
  selectPopupState(state).isSuspendedUserPopupVisible;

// Utility selector to check if any popup is open
export const selectIsAnyPopupOpen = (state: RootState): boolean => {
  const popupState = selectPopupState(state);
  return Object.values(popupState).some(isOpen => isOpen);
};
