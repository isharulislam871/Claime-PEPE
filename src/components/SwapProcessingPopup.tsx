'use client';

import React, { useState, useEffect } from 'react';
import {
  Popup,
  Card,
  ProgressBar
} from 'antd-mobile';
import {
  CloseOutline
} from 'antd-mobile-icons';
import { SwapOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCoins } from '../modules/private/coin';

interface SwapProcessingPopupProps {
  visible: boolean;
  onClose?: () => void;
  onComplete?: () => void; // Called when countdown ends
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
 
  currencyLabel: string;
  duration?: number; // Duration in seconds
}

export default function SwapProcessingPopup({
  visible,
  onClose,
  onComplete,
  fromAmount,
  toCurrency,
  toAmount,
  duration = 30
}: SwapProcessingPopupProps) {
  
  const coins = useSelector(selectCoins);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Get coin data and logo URL
  const getCoinData = (currency: string) => {
    const coin = coins?.find(coin => 
      coin.symbol?.toLowerCase() === currency.toLowerCase() ||
      coin.name?.toLowerCase() === currency.toLowerCase()
    );
    return coin;
  };

  const getCoinLogoUrl = (currency: string): string | null => {
    const coin = getCoinData(currency);
    return coin?.logoUrl || null;
  };

  const [imageError, setImageError] = useState<string | null>(null);

  const processingSteps = [
    'Validating transaction...',
    'Processing swap request...',
    'Confirming exchange rates...',
    'Finalizing transaction...',
    'Almost done...'
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCrypto = (num: number) => {
    return num.toFixed(8);
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
        
        // Check if countdown has ended
        if (newTime <= 0) {
          setProgress(100);
          setCurrentStep(processingSteps.length - 1);
          
          // Call onComplete callback after a short delay to show completion
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 500);
        }
        
        return Math.max(newTime, 0);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [visible, duration, onComplete]);

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
          <h2 className="text-xl font-bold text-gray-900">Processing Swap</h2>
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
                <SwapOutlined className="text-blue-600 text-4xl animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Swap</h3>
              <p className="text-gray-600">Please wait while we process your transaction</p>
            </div>

            {/* Transaction Summary */}
            <Card className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="text-center py-2">
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Swapping</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatNumber(fromAmount)} Points
                  </div>
                </div>
                
                <div className="text-2xl mb-3">↓</div>
                
                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">To receive</div>
                  <div className="flex items-center justify-center gap-2 text-xl font-bold text-blue-600">
                  
                  
                      <img 
                        src={getCoinLogoUrl(toCurrency)!} 
                        alt={toCurrency}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={() => setImageError(toCurrency)}
                      />
                  
                    <span>{formatCrypto(toAmount)} {toCurrency.toUpperCase()}</span>
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
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Estimated time remaining</div>
                <div className="text-3xl font-bold text-gray-900 font-mono">
                  {Math.ceil(timeLeft)}s
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
                      {index < currentStep ? '✓' : index + 1}
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-green-600 text-lg">🔒</div>
                <div className="text-sm text-green-800">
                  <div className="font-semibold mb-1">Secure Processing</div>
                  <div>Your transaction is being processed securely. Do not close this window.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">
              Processing swap transaction • Secure & encrypted
            </div>
            <div className="text-xs text-gray-400">
              Transaction ID will be generated upon completion
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
