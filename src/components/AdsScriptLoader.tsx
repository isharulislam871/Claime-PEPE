'use client';

import { selectAdsSettings } from '@/modules';
import Script from 'next/script';
import { useSelector } from 'react-redux';

export default function AdsScriptLoader() {
  const AdsSettings = useSelector(selectAdsSettings);

  // Don't load scripts if ads are disabled or no settings available
  if (!AdsSettings) {
    return null;
  }

  return (
    <>
      {/* GigaPub Ads Script */}
      {AdsSettings.enableGigaPubAds && AdsSettings.gigaPubAppId && (
        <Script
          src={`https://ad.gigapub.tech/script?id=${AdsSettings.gigaPubAppId}`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('GigaPub ads script loaded successfully');
          }}
          onError={(e) => {
            console.error('Failed to load GigaPub ads script:', e);
          }}
        />
      )}

      {/* Monetag Ads Script */}
      {AdsSettings.monetagEnabled && AdsSettings.monetagZoneId && (
        <Script
          src="//libtl.com/sdk.js"
          data-zone={AdsSettings.monetagZoneId}
          data-sdk={`show_${AdsSettings.monetagZoneId}`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Monetag ads script loaded successfully');
            // Ensure the function is available before calling
            const functionName = `show_${AdsSettings.monetagZoneId}`;
            if (typeof window !== 'undefined' && window[functionName as keyof Window]) {
              console.log(`Monetag function ${functionName} is available`);
            } else {
              console.warn(`Monetag function ${functionName} not found on window`);
            }
          }}
          onError={(e) => {
            console.error('Failed to load Monetag ads script:', e);
          }}
        />
      )}

      <Script src='https://adexora.com/cdn/ads.js?id=310' />
    </>
  );
}
