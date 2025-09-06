'use client';

import { useEffect, useState } from 'react';
import UserStatusHandler from '@/components/UserStatusHandler';
import AppInitializer from '@/components/AppInitializer';
import VpnManager from '@/components/VpnManager';
import TabManager from '@/components/TabManager';
import AdsScriptLoader from '@/components/AdsScriptLoader';
import { getCurrentUser } from '@/lib/api';
import { useDispatch } from 'react-redux';
import { createUserRequest } from '@/modules';

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
  const dispatch = useDispatch()

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

  useEffect(()=>{
    const currentUser = getCurrentUser();
      dispatch(createUserRequest(currentUser))
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
          <AdsScriptLoader 
            adsSettings={adsSettings}
            vpnDetected={vpnDetected}
          />

           
          {/* <VpnManager 
            vpnDetected={vpnDetected}
            setVpnDetected={setVpnDetected}
          /> */}

          {/* Main tab interface */}
          <TabManager />
        </div>
      </UserStatusHandler>
    </>
  );
}
