'use client';

import { ReactNode, useState } from 'react';
import { DefaultLoadingFallback } from './LoadingFallback';

import SupportPopup from './SupportPopup';
import NewHome from './NewHome';
import RewardsPopup from './RewardsPopup';
import NewProfile from './NewProfile';
import NewWithdrawal from './NewWithdrawal';

import InviteFriendsEarn from './InviteFriendsEarn';

import WithdrawHistoryPopup from './WithdrawHistoryPopup';


import NewSwap from './NewSwap';
import DailyCheckInPopup from './DailyCheckInPopup';
import AdWatchPopup from './AdWatchPopup';
import TaskPopup from './TaskPopup';

import NewRegistrationBlockedPopup from './NewRegistrationBlockedPopup';
import MinimumInvitesRequiredPopup from './MinimumInvitesRequiredPopup';
import SuspendAllPaymentServicesPopup from './SuspendAllPaymentServicesPopup';

import ShopPopup from './ShopPopup';
import LeaderboardPopup from './LeaderboardPopup';
import VoucherPopup from './VoucherPopup';
import EarningCenterPopup from './EarningCenterPopup';

import AppLaunchCountdownPopup from './AppLaunchCountdownPopup';




export default function MainWrapper({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);


  setTimeout(() => {
    setLoading(false);
  }, 1000 * 5);

  return (
    <>
      {
        loading ? <DefaultLoadingFallback /> : (
          <>
            <NewHome />
            <RewardsPopup />
            <SupportPopup />
            <NewProfile />
            <NewWithdrawal />
            <InviteFriendsEarn />
            < WithdrawHistoryPopup />
            < ShopPopup />
            < LeaderboardPopup />
            <VoucherPopup />
            <EarningCenterPopup />
            < MinimumInvitesRequiredPopup
            />
            < SuspendAllPaymentServicesPopup />
            < NewSwap />
            < DailyCheckInPopup />
            < AdWatchPopup />
            < TaskPopup />
            < NewRegistrationBlockedPopup />

            <AppLaunchCountdownPopup />

            {children}

          </>
        )
      }
    </>
  );
}
