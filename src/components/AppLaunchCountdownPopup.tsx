'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Popup  , Footer } from 'antd-mobile';
import { ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectIsAppLaunchCountdownVisible } from '@/modules';

 
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AppLaunchCountdownPopup  = ( ) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closePopup('isAppLaunchCountdownVisible'));
  }
  const isOpen = useSelector(selectIsAppLaunchCountdownVisible);
  
  const launchDate = useMemo(() => new Date('2026-12-31T23:59:59'), []);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const launch = launchDate.getTime();
    const difference = launch - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [launchDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const isLaunched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[#F0B90B]/50">
      <div className="text-3xl sm:text-4xl font-bold text-[#F0B90B] mb-2 tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      onClose={onClose}
      bodyClassName="!p-0 !w-full !h-full !max-w-none !max-h-none !m-0"
      maskClassName="!bg-black/80"
    >
      <div className="bg-[#0B0E11] min-h-screen flex flex-col text-white">
     

        {/* Content */}
        <div className="flex-1 p-8 space-y-8 flex flex-col justify-center overflow-y-auto">
          {!isLaunched ? (
            <>
              {/* Countdown Display */}
              <div className="text-center">
                <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto">
                  <TimeUnit value={timeLeft.days} label="Days" />
                  <TimeUnit value={timeLeft.hours} label="Hours" />
                  <TimeUnit value={timeLeft.minutes} label="Mins" />
                  <TimeUnit value={timeLeft.seconds} label="Secs" />
                </div>
                
                {/* Launch Date Info */}
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[#F0B90B] uppercase tracking-wide">Launch Date</span>
                    <div className="w-3 h-3 bg-[#F0B90B] rounded-full animate-pulse shadow-sm"></div>
                  </div>
                  <p className="text-xl font-bold text-white mb-2">
                    {launchDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-base font-medium text-gray-300">
                    {launchDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* Features Preview */}
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-[#F0B90B] mb-6 uppercase tracking-wide text-center">What's Coming</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#F0B90B] rounded-full shadow-sm"></div>
                    <span className="text-base font-medium text-gray-300">Enhanced user experience</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#F0B90B] rounded-full shadow-sm"></div>
                    <span className="text-base font-medium text-gray-300">New features and improvements</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#F0B90B] rounded-full shadow-sm"></div>
                    <span className="text-base font-medium text-gray-300">Better performance</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#F0B90B] rounded-full shadow-sm"></div>
                    <span className="text-base font-medium text-gray-300">Advanced security features</span>
                  </div>
                </div>
              </div>

            
            </>
          ) : (
            /* Launch Success Message */
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-[#F0B90B] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-bounce">
                <RocketOutlined className="text-black text-4xl" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                🎉 Successfully Launched!
              </h3>
              <p className="text-gray-300 font-medium leading-relaxed text-lg max-w-md mx-auto mb-6">
                The app is now live and ready to use. Thank you for your patience!
              </p>
              
              {/* Success Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3">
                  <div className="text-lg font-bold text-[#F0B90B]">100%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3">
                  <div className="text-lg font-bold text-green-500">✓</div>
                  <div className="text-xs text-gray-400">Ready</div>
                </div>
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-500">🚀</div>
                  <div className="text-xs text-gray-400">Live</div>
                </div>
              </div>
            </div>
          )}

        </div>


        {/* Footer using antd-mobile Footer component */}
        <Footer
          className="!bg-[#1E2329] !border-t !border-[#2B3139] !text-gray-400"
          content={
            <div className="space-y-4 py-2">
              {/* System Status */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 font-medium">System Status: Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F0B90B]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 font-medium">Secure Connection</span>
                </div>
              </div>
              
              {/* Developer Info */}
              <div className="text-center border-t border-[#2B3139] pt-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#F0B90B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#F0B90B] text-sm font-semibold">Developed by</span>
                </div>
                <p className="text-white text-base font-bold mb-1">
                  Mdrijon Hossain Jibon
                </p>
                <p className="text-gray-500 text-xs font-medium">
                  Full Stack Developer
                </p>
              </div>

              {/* Copyright & Links */}
              <div className="text-center border-t border-[#2B3139] pt-3">
                <p className="text-gray-500 text-sm font-medium mb-2">
                  © 2024 TaskUp. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="text-gray-400 hover:text-[#F0B90B] text-sm font-medium transition-colors duration-200">
                    Privacy Policy
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-[#F0B90B] text-sm font-medium transition-colors duration-200">
                    Terms of Service
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-[#F0B90B] text-sm font-medium transition-colors duration-200">
                    Support
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </Popup>
  );
};

export default AppLaunchCountdownPopup;
