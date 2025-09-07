'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MaintenancePopup from './MaintenancePopup';

 
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

interface MaintenanceData {
  enabled: boolean;
  message?: string;
  estimatedDuration?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  affectedServices?: string[];
}

interface AppInitializerProps {
  setAdsSettings: (settings: AdsSettings | null) => void;
  checkVpnStatus: () => Promise<void>;
}

export default function AppInitializer({ 
  setAdsSettings, 
  checkVpnStatus 
}: AppInitializerProps) {
  const router = useRouter();
  const hasInitialized = useRef(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);

  // Memoize the initialization function to prevent recreating on every render
  const initializeApp = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      // Check maintenance status first
      const maintenanceResponse = await fetch('/api/maintenance');
      if (maintenanceResponse.ok) {
        const maintenanceResponseData = await maintenanceResponse.json();
        if (maintenanceResponseData.maintenance.enabled) {
          setMaintenanceOpen(true);
          return;
        }
      }

      // Fetch ads settings
      const adsResponse = await fetch('/api/ads/settings');
      if (adsResponse.ok) {
        const adsData = await adsResponse.json();
        if (adsData.success) {
          setAdsSettings(adsData.data);
          
          // Check VPN if vpnNotAllowed is enabled
          if (adsData.data.vpnNotAllowed) {
            await checkVpnStatus();
          }
        }
      }

      const webApp = window.Telegram?.WebApp;
      
      if (webApp) {
        // Initialize Telegram WebApp
        webApp.ready();
        // Request write access for enhanced user data
        webApp.requestWriteAccess?.((granted) => {
          console.log('Write access:', granted ? 'granted' : 'denied');
          if (granted) {
            console.log('App can now access user contact information');
          }
        });
   
      } else {
        console.warn('Telegram WebApp not available');
    
      }
    } catch (error) {
      console.error('Error initializing Telegram app:', error);
    
    }  
  }, [router,  setAdsSettings, checkVpnStatus]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <>
      <MaintenancePopup 
        isOpen={maintenanceOpen}
        onClose={() => setMaintenanceOpen(false)}
        
      />
    </>
  );
}
