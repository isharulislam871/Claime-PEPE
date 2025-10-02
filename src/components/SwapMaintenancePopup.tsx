'use client';

import React, { useState, useEffect } from 'react';
import {
  Popup,
  Card,
  ProgressBar
} from 'antd-mobile';
import {
  CloseOutline,
  SetOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';

interface SwapMaintenancePopupProps {
  visible: boolean;
  onClose: () => void;
  maintenanceDuration?: number; // Duration in minutes
  startTime?: Date;
}

export default function SwapMaintenancePopup({
  visible,
  onClose,
  maintenanceDuration = 30,
  startTime = new Date()
}: SwapMaintenancePopupProps) {
  
  const [timeLeft, setTimeLeft] = useState(maintenanceDuration * 60); // Convert to seconds
  const [progress, setProgress] = useState(0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getMaintenanceEndTime = () => {
    const endTime = new Date(startTime.getTime() + maintenanceDuration * 60 * 1000);
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!visible) {
      setTimeLeft(maintenanceDuration * 60);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(prev - 1, 0);
        const totalDuration = maintenanceDuration * 60;
        const newProgress = ((totalDuration - newTime) / totalDuration) * 100;
        setProgress(Math.min(newProgress, 100));
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, maintenanceDuration]);

  const isMaintenanceComplete = timeLeft <= 0;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        borderRadius: '0px',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-orange-600">Swap Maintenance</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          
          {/* Maintenance Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SetOutline className="text-orange-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-orange-600 mb-2">
              {isMaintenanceComplete ? 'Maintenance Complete!' : 'Under Maintenance'}
            </h3>
            <p className="text-gray-600">
              {isMaintenanceComplete 
                ? 'Swap service is now available again' 
                : 'We are currently upgrading our swap service for better performance'
              }
            </p>
          </div>

          {!isMaintenanceComplete ? (
            <>
              {/* Countdown Timer */}
              <Card className="mb-6 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
                <div className="text-center py-4">
                  <div className="text-sm text-orange-700 mb-2">Estimated time remaining</div>
                  <div className="text-4xl font-bold text-orange-600 font-mono mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-orange-600">
                    Expected completion: {getMaintenanceEndTime()}
                  </div>
                </div>
              </Card>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Maintenance Progress</span>
                  <span className="text-sm font-bold text-orange-600">{Math.round(progress)}%</span>
                </div>
                
                <ProgressBar 
                  percent={progress} 
                  style={{
                    '--fill-color': 'linear-gradient(90deg, #f97316, #eab308)',
                    '--track-color': '#fed7aa'
                  }}
                />
              </div>

              {/* Maintenance Details */}
              <Card title="What's Being Updated" className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Enhanced security protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Faster transaction processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Database optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">System performance improvements</span>
                  </div>
                </div>
              </Card>

              {/* Alternative Options */}
              <Card title="What You Can Do" className="mb-6">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check back after the maintenance window</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>View your transaction history</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Explore other features in the app</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Set up notifications for when service resumes</span>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Maintenance Complete */}
              <Card className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-xl font-bold text-green-600 mb-2">All Systems Operational</div>
                  <div className="text-sm text-green-700">
                    Swap service is now available with improved performance
                  </div>
                </div>
              </Card>

              {/* New Features */}
              <Card title="What's New" className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">⚡ 50% faster transaction processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">🔒 Enhanced security measures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">📊 Improved rate calculations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">🎯 Better error handling</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Status Notice */}
          <div className={`${
            isMaintenanceComplete 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          } border rounded-lg p-3 mb-4`}>
            <div className="flex items-start gap-2">
              <div className={`text-lg ${
                isMaintenanceComplete ? 'text-green-600' : 'text-orange-600'
              }`}>
                {isMaintenanceComplete ? '✅' : '🔧'}
              </div>
              <div className={`text-sm ${
                isMaintenanceComplete ? 'text-green-800' : 'text-orange-800'
              }`}>
                <div className="font-semibold mb-1">
                  {isMaintenanceComplete ? 'Service Restored' : 'Scheduled Maintenance'}
                </div>
                <div>
                  {isMaintenanceComplete 
                    ? 'Thank you for your patience. You can now use all swap features normally.'
                    : 'We apologize for any inconvenience. This maintenance will improve your experience.'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3 mb-3">
            <Button
              block
              type="default"
              size="large"
              onClick={onClose}
            >
              Close
            </Button>
            {isMaintenanceComplete && (
              <Button
                block
                type="primary"
                size="large"
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-green-600 border-none"
              >
                Try Swap Now
              </Button>
            )}
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">
              {isMaintenanceComplete 
                ? 'All systems operational • Enhanced performance'
                : 'Follow @TaskUpApp for real-time updates'
              }
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
