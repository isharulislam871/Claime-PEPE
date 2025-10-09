import { PopupState, PopupAction, PopupActionTypes } from './types';

const initialState: PopupState = {
  isOpenProfile: false,
  isOpenWithdraw: false,
  isInviteFriendsEarn: false,
  isHistoryOpen: false,
  isSwapOpen: false,
  isSwapHistoryOpen: false,
  isSwapHistoryDetailsOpen: false,
  isDailyCheckInOpen: false,
  isAdWatchOpen: false,
  isTaskPopupOpen: false,
  isRegistrationBlockedPopupVisible: false,
  isMinimumInvitesPopupVisible: false,
  isPaymentSuspendedPopupVisible: false,
  isRewardsPopupVisible: false,
  isShopPopupVisible: false,
  isVoucherPopupVisible: false,
  isLeaderboardPopupVisible: false,
  isEarningCenterPopupVisible: false,
  isSupportPopupVisible: false,
  isAppLaunchCountdownVisible: false,
  isBannedUserPopupVisible: false,
  isSuspendedUserPopupVisible: false,
};

export const popupReducer = (state = initialState, action: PopupAction): PopupState => {
  switch (action.type) {
    case PopupActionTypes.OPEN_POPUP:
      return {
        ...state,
        [action.payload]: true,
      };

    case PopupActionTypes.CLOSE_POPUP:
      return {
        ...state,
        [action.payload]: false,
      };

    case PopupActionTypes.CLOSE_ALL_POPUPS:
      return {
        ...initialState,
      };

    case PopupActionTypes.TOGGLE_POPUP:
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };

    default:
      return state;
  }
};
