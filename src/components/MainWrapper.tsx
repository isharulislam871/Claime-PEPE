'use client';

import { ReactNode, useState } from 'react';
import { DefaultLoadingFallback } from './LoadingFallback';

import NewHome from './NewHome';


import AppLaunchCountdownPopup from './AppLaunchCountdownPopup';
import { useSelector } from 'react-redux';
import { selectAuthLoading } from '@/modules';
import NewWithdrawal from './NewWithdrawal';
import SupportPopup from './SupportPopup';
import InviteFriendsEarn from './InviteFriendsEarn';
import WithdrawHistoryPopup from './WithdrawHistoryPopup';
import RewardsPopup from './RewardsPopup';
import LeaderboardPopup from './LeaderboardPopup';
import EarningCenterPopup from './EarningCenterPopup';
import SuspendAllPaymentServicesPopup from './SuspendAllPaymentServicesPopup';
import MinimumInvitesRequiredPopup from './MinimumInvitesRequiredPopup';
import DailyCheckInPopup from './DailyCheckInPopup';
import NewSwap from './NewSwap';
import SwapHistoryPopup from './SwapHistoryPopup';
import SwapHistoryDetails from './SwapHistoryDetails';
import AdWatchPopup from './AdWatchPopup';
import TaskPopup from './TaskPopup';
import NewRegistrationBlockedPopup from './NewRegistrationBlockedPopup';




export default function MainWrapper({ children }: { children: ReactNode }) {
  const loading = useSelector(selectAuthLoading);

  return (
    <>
      {
        loading ? <DefaultLoadingFallback /> : (
          <>
            <NewHome />
            <RewardsPopup />
            <SupportPopup />

            <NewWithdrawal />
            <InviteFriendsEarn />
            < WithdrawHistoryPopup />

            < LeaderboardPopup />

            <EarningCenterPopup />
            < MinimumInvitesRequiredPopup
            />
            < SuspendAllPaymentServicesPopup />
            < NewSwap />
            < SwapHistoryPopup />
            < SwapHistoryDetails />
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
