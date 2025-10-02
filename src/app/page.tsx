'use client';
 
import { useEffect, useState, lazy } from 'react';
import SuspenseWrapper from '@/components/MainWrapper';
import { getCurrentUser } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { createUserRequest, fetchAdsSettingsRequest, fetchBotConfigRequest, selectBotConfig } from '@/modules';

// Lazy load heavy components for better performance
const UserStatusHandler = lazy(() => import('@/components/UserStatusHandler'));
const AdsScriptLoader = lazy(() => import('@/components/AdsScriptLoader'));
 
  
export default function Home() {
   const dispatch = useDispatch();
   
  useEffect(()=>{
     dispatch(fetchBotConfigRequest())
  }, [dispatch])

  
  useEffect(()=>{
      const currentUser = getCurrentUser();
      dispatch(createUserRequest(currentUser));
      dispatch(fetchAdsSettingsRequest());
       
    }, [ dispatch ])

   
  return (
    <SuspenseWrapper >
      {/* Handle user status (ban/suspend) or render main app */}
      <UserStatusHandler>
        <div className="min-h-screen bg-gray-50 pb-20 overflow-hidden">
          {/* Load ads script */}
          <AdsScriptLoader />
        </div>
      </UserStatusHandler>
    </SuspenseWrapper>
  );
}
