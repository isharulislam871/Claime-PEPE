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

interface AdsSettings {
  enableGigaPubAds: boolean;
  gigaPubAppId: string;
  defaultAdsReward: number;
  adsWatchLimit: number;
  adsRewardMultiplier: number;
  minWatchTime: number;
  vpnRequired: boolean;
  vpnNotAllowed: boolean;
}

export default function Home() {
  const [adsSettings, setAdsSettings] = useState<AdsSettings | null>(null);
  const [vpnDetected, setVpnDetected] = useState(false);
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const dispatch = useDispatch();
  
 
  useEffect(()=>{
     dispatch(fetchBotConfigRequest())
  }, [dispatch])

  const checkVpnStatus = async () => {
    try {
      const response = await fetch('/api/vpn/detect');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.isVpn) {
          setVpnDetected(true);
        }
      }
    } catch (error) {
      console.error('VPN check failed:', error);
    }
  };

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
      <AppInitializer 
        
        setAdsSettings={setAdsSettings}
        checkVpnStatus={checkVpnStatus}
      />

      {/* Handle user status (ban/suspend) or render main app */}
      <UserStatusHandler>
        <div className="min-h-screen bg-gray-50 pb-20 overflow-hidden">
          {/* Load ads script conditionally */}
          <AdsScriptLoader />

           
          {/* <VpnManager 
            vpnDetected={vpnDetected}
            setVpnDetected={setVpnDetected}
          /> */}
          {!showTelegramPopup && <NewHome />}
          <TelegramOpenPopup visible={showTelegramPopup} />
          
          
        </div>
      </UserStatusHandler>
    </>
  );
}
