'use client';

import Script from 'next/script';

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

interface AdsScriptLoaderProps {
  adsSettings: AdsSettings | null;
  vpnDetected: boolean;
}

export default function AdsScriptLoader({ adsSettings, vpnDetected }: AdsScriptLoaderProps) {
  if (!adsSettings?.enableGigaPubAds || !adsSettings?.gigaPubAppId || vpnDetected) {
    return null;
  }

  return (

    <> <Script
      src={`https://ad.gigapub.tech/script?id=${adsSettings.gigaPubAppId}`}
      strategy="afterInteractive"
      onLoad={() => {
        console.log('GigaPub ads script loaded successfully');
      }}
      onError={(e) => {
        console.error('Failed to load GigaPub ads script:', e);
      }}
    />

      <Script src='//libtl.com/sdk.js' data-zone='9827587' data-sdk='show_9827587'   onLoad={() => {
        console.log('Monetag  ads script loaded successfully');
      }}/>
    </>

  );
}
