'use client';

import { useEffect, useState } from 'react';
import { selectCurrentUser  } from '@/modules';
import { useSelector } from 'react-redux';

interface UserStatusHandlerProps {
  children: React.ReactNode;
}

export default function UserStatusHandler({ children }: UserStatusHandlerProps) {
  const user = useSelector(selectCurrentUser);
  
  const [isOnline, setIsOnline] = useState(true);
  // Network Detection
  useEffect(() => {
    // Network status detection
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const NetworkStatusBanner = () => (
    !isOnline && (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
          </svg>
          <span>You're offline. Some features may be limited.</span>
        </div>
      </div>
    )
  );

  

  // If no user is logged in, render children (let auth handle it)
  if (!user) {
    return <>{children}</>;
  }
  
 
 
  // Active user - render children
  return (
    <>
      <NetworkStatusBanner />
      {children}
    </>
  );
}
