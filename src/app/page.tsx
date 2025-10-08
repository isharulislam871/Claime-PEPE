'use client';

import { useEffect, useState, lazy } from 'react';
import SuspenseWrapper from '@/components/MainWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/modules/store';
import { createUserRequest, fetchAdsSettingsRequest, fetchQuickActionsRequest, fetchUserRequest, initializeApp, initializeTelegramWebApp, checkMaintenance } from '@/modules';

// Lazy load heavy components for better performance
const UserStatusHandler = lazy(() => import('@/components/UserStatusHandler'));
const AdsScriptLoader = lazy(() => import('@/components/AdsScriptLoader'));


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();



  useEffect(() => {
    // Initialize the app with proper sequence
    dispatch(initializeApp());
    dispatch(checkMaintenance());
    dispatch(initializeTelegramWebApp());
    dispatch(fetchUserRequest());
  }, [dispatch])


  return (
    <SuspenseWrapper  >
      <UserStatusHandler>
        <AdsScriptLoader />
      </UserStatusHandler>
    </SuspenseWrapper>
  );
}
