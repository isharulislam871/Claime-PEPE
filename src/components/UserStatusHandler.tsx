'use client';

import { useEffect, useState } from 'react';
import { selectCurrentUser, selectVerificationCode } from '@/modules';
import { useSelector } from 'react-redux';

interface UserStatusHandlerProps {
  children: React.ReactNode;
}

export default function UserStatusHandler({ children }: UserStatusHandlerProps) {
  const user = useSelector(selectCurrentUser);
  const code = useSelector(selectVerificationCode);

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

  
  if (code === 'IP_MISMATCH') {
    return (
      <>
        <NetworkStatusBanner />
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center p-4" style={{ paddingTop: !isOnline ? '3rem' : '1rem' }}>
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Location Verification Required
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-300 text-center mb-6 text-sm">
              We've detected unusual activity from your current location. Please verify your identity.
            </p>

            {/* IP Mismatch Info */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-orange-400 text-sm font-medium mb-1">IP Address Mismatch</p>
                  <p className="text-orange-300 text-sm">Your current IP address doesn't match your registered location. This could indicate:</p>
                  <ul className="text-orange-300 text-xs mt-2 space-y-1 ml-4">
                    <li>• VPN or proxy usage</li>
                    <li>• Travel to a new location</li>
                    <li>• Network configuration changes</li>
                    <li>• Potential security concern</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Account Status</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">
                  Verification Required
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Access Level:</span>
                  <span className="text-orange-400">Restricted</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verification:</span>
                  <span className="text-red-400">Required</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                Verify Location
              </button>
              
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/20">
                Contact Support
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs">
                If you believe this is an error, please contact our support team with your account details.
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-blue-400 text-xs font-medium">Security Notice</p>
                  <p className="text-blue-300 text-xs mt-1">
                    This verification helps protect your account from unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // If no user is logged in, render children (let auth handle it)
  if (!user) {
    return <>{children}</>;
  }
  
  // IP Mismatch user state
 

  // Banned user state
  if (user.status === 'ban') {
    return (
      <>
        <NetworkStatusBanner />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4" style={{ paddingTop: !isOnline ? '3rem' : '1rem' }}>
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Account Restricted
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-300 text-center mb-6 text-sm">
              Your account has been permanently restricted from accessing TaskUp services.
            </p>

            {/* Reason Card */}
            {user.banReason && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm font-medium mb-1">Restriction Reason</p>
                    <p className="text-red-300 text-sm">{user.banReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Support Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Need Help?</p>
                  <p className="text-gray-400 text-xs">Contact our support team if you believe this is an error</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isOnline}
            >
              {isOnline ? 'Contact Support' : 'Offline - Support Unavailable'}
            </button>

            {/* Offline Notice */}
            {!isOnline && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-amber-300 text-xs">
                    You're offline. Support features will be available when you reconnect.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              TaskUp Security Team • Restriction ID: {user?.id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        </div>
      </>
    );
  }

  // Suspended user state
  if (user.status === 'suspend') {
    return (
      <>
        <NetworkStatusBanner />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4" style={{ paddingTop: !isOnline ? '3rem' : '1rem' }}>
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Account Suspended
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-300 text-center mb-6 text-sm">
              Your account access has been temporarily suspended.
            </p>

            {/* Reason Card */}
            {user.banReason && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-400 text-sm font-medium mb-1">Suspension Reason</p>
                    <p className="text-amber-300 text-sm">{user.banReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Temporary Suspension</p>
                    <p className="text-gray-400 text-xs">Your account will be reviewed</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isOnline}
              >
                {isOnline ? 'Contact Support' : 'Offline - Support Unavailable'}
              </button>
              <button 
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isOnline}
              >
                {isOnline ? 'Learn More' : 'Offline - Info Unavailable'}
              </button>
            </div>

            {/* Offline Notice */}
            {!isOnline && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-amber-300 text-xs">
                    You're offline. Features will be available when you reconnect.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              TaskUp Security Team • Case ID: {user?.id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        </div>
      </>
    );
  }

 

  // Active user - render children
  return (
    <>
      <NetworkStatusBanner />
      {children}
    </>
  );
}
