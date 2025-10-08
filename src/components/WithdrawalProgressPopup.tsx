'use client';

import React, { useState, useEffect } from 'react';
import {
  Popup,
  Card,
  ProgressBar
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline
} from 'antd-mobile-icons';
import {
  SendOutlined,
  LoadingOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { networkIcons } from '@/lib/networkIcons';

interface WithdrawalProgressPopupProps {
  visible: boolean;
  onClose?: () => void;
  currency: string;
  network: string;
  amount: string;
  address: string;
 
  duration?: number; // Duration in seconds
}

export default function WithdrawalProgressPopup({
  visible,
  onClose,
  currency,
  network,
  amount,
  address,
  
  duration = 60
}: WithdrawalProgressPopupProps) {
  
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    'Validating withdrawal request...',
    'Checking account balance...',
    'Verifying network connectivity...',
    'Processing blockchain transaction...',
    'Confirming transaction details...',
    'Broadcasting to network...',
    'Finalizing withdrawal...'
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  useEffect(() => {
    if (!visible) {
      setTimeLeft(duration);
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        const newProgress = ((duration - newTime) / duration) * 100;
        setProgress(Math.min(newProgress, 100));
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * processingSteps.length);
        setCurrentStep(Math.min(stepIndex, processingSteps.length - 1));
        
        return Math.max(newTime, 0);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [visible, duration, processingSteps.length]);

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
          <h2 className="text-xl font-bold text-gray-900">Processing Withdrawal</h2>
          {onClose && (
            <CloseOutline 
              className="text-gray-500 cursor-pointer text-xl"
              onClick={onClose}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            
            {/* Processing Animation */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <SyncOutlined className="text-4xl text-blue-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Withdrawal</h3>
              <p className="text-gray-600">Please wait while we process your transaction</p>
            </div>

            {/* Transaction Summary */}
            <Card className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="text-center py-2">
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Withdrawing</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {amount} {currency}
                  </div>
                </div>
                
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <SendOutlined className="text-blue-600 text-lg" />
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">To Network</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{networkIcons[network.toLowerCase()]}</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {network}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Address</div>
                  <div className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(address)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              
              <ProgressBar 
                percent={progress} 
                style={{
                  '--fill-color': 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                  '--track-color': '#e5e7eb'
                }}
              />
            </div>

            {/* Countdown Timer */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ClockCircleOutlined className="text-blue-600" />
                  <div className="text-sm text-gray-600">Estimated time remaining</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-mono">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <LoadingOutlined className="text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-800">Current Status</span>
                </div>
                <div className="text-blue-900 font-semibold">
                  {processingSteps[currentStep]}
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            <Card title="Processing Steps" className="mb-6">
              <div className="space-y-3">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < currentStep 
                        ? 'bg-green-500 text-white' 
                        : index === currentStep 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircleOutlined className="text-xs" />
                      ) : index === currentStep ? (
                        <LoadingOutlined className="text-xs animate-spin" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-sm ${
                      index < currentStep 
                        ? 'text-green-600 font-medium' 
                        : index === currentStep 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <SafetyOutlined className="text-blue-600 text-lg" />
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-1">Secure Processing</div>
                  <div>Your withdrawal is being processed securely on the blockchain. Do not close this window.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">
              Processing withdrawal transaction • Blockchain secured
            </div>
            <div className="text-xs text-gray-400">
              Transaction hash will be provided upon completion
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
