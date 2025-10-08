'use client';

import React from 'react';
import { Popup } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { closeSuspendedUserPopup, selectIsSuspendedUserPopupVisible, openSupportPopup, selectCurrentUser ,  } from '@/modules';
import { AppDispatch } from '@/modules/store';

 

export default function SuspendedUserPopup( ) {
  const dispatch = useDispatch<AppDispatch>();
  const visible = useSelector(selectIsSuspendedUserPopupVisible);
  

  const onClose = () => {
    dispatch(closeSuspendedUserPopup());
  };

  const handleContactSupport = () => {

    dispatch(openSupportPopup());
  };

   

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        maxHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        padding: 0
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4" style={{ paddingTop: '1rem' }}>
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Close Button */}
             
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
            {true && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-400 text-sm font-medium mb-1">Suspension Reason</p>
                    <p className="text-amber-300 text-sm">{'user.banReason'}</p>
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

            {/* Action Button */}
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleContactSupport}
            >
              Contact Support
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              TaskUp Security Team • Case ID: {'user?.id?.slice(-8).toUpperCase()'}
            </p>
          </div>
        </div>
      </div>
    </Popup>
  );
}
