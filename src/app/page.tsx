'use client';
 
import { useEffect, useState } from 'react';
import UserStatusHandler from '@/components/UserStatusHandler';
import AppInitializer from '@/components/AppInitializer';
 

import AdsScriptLoader from '@/components/AdsScriptLoader';
import { getCurrentUser } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { createUserRequest,   fetchAdsSettingsRequest, fetchBotConfigRequest, selectBotConfig } from '@/modules';
import NewHome from '@/components/NewHome';
import TelegramOpenPopup from '@/components/TelegramOpenPopup';

 

export default function Home() {
  
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const dispatch = useDispatch();
  
 
  useEffect(()=>{
     dispatch(fetchBotConfigRequest())
  }, [dispatch])

  

  // Check if user is in Telegram WebApp
  const checkTelegramStatus = () => {
     
     /*  const isInTelegram = typeof window !== 'undefined' && 
        window.Telegram?.WebApp?.initDataUnsafe?.user;
    
      if (!isInTelegram) {
        setShowTelegramPopup(true);
      } */
    
  };
 
  useEffect(()=>{
      const currentUser = getCurrentUser();
      dispatch(createUserRequest(currentUser));
      dispatch(fetchAdsSettingsRequest());
      
      // Check Telegram status after component mounts
      checkTelegramStatus();
  }, [ dispatch ])

   
  return (
    <>
      {/* Initialize app and handle setup */}
      <AppInitializer  />

      {/* Handle user status (ban/suspend) or render main app */}
      <UserStatusHandler>
        <div className="min-h-screen bg-gray-50 pb-20 overflow-hidden">
          {/* Load ads script conditionally */}
          <AdsScriptLoader />
 
          {!showTelegramPopup && <NewHome />}
          <TelegramOpenPopup visible={showTelegramPopup} />
          
          
        </div>
      </UserStatusHandler>
    </>
  );
}
