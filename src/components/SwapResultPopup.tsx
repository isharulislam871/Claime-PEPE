'use client';

import React from 'react';
import {
  Popup,
  Card,
  Divider,
  Image
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';
import { coinIcons } from '@/lib/networkIcons';

interface SwapResultPopupProps {
  visible: boolean;
  onClose: () => void;
  onRetry?: () => void;
  success: boolean;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  currencyLabel: string;
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
}

export default function SwapResultPopup({
  visible,
  onClose,
  onRetry,
  success,
  fromAmount,
  toCurrency,
  toAmount,
  currencyLabel,
  transactionId,
  errorMessage,
  errorCode
}: SwapResultPopupProps) {
  
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCrypto = (num: number) => {
    return num.toFixed(8);
  };

  const generateTransactionId = () => {
    return transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

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
          <h2 className="text-xl font-bold text-gray-900">
            {success ? 'Swap Successful' : 'Swap Failed'}
          </h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          
          {success ? (
            <>
              {/* Success Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckOutline className="text-green-600 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
                <p className="text-gray-600">Your swap has been completed successfully</p>
              </div>

              {/* Transaction Summary */}
              <Card className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="text-center py-2">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">You swapped</div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatNumber(fromAmount)} Points
                    </div>
                  </div>
                  
                  <div className="text-3xl mb-3">↓</div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">You received</div>
                    <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-2">
                      <Image src={coinIcons[toCurrency.toLowerCase()]} alt={toCurrency} width={24} height={24} />
                      {formatCrypto(toAmount)} {toCurrency.toUpperCase()}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transaction Details */}
              <Card title="Transaction Details" className="mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm font-semibold">{generateTransactionId()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold">{new Date().toLocaleString()}</span>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">From:</span>
                    <span className="font-semibold">{formatNumber(fromAmount)} Points</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">To:</span>
                    <div className="font-semibold flex items-center gap-2">
                      <Image src={coinIcons[toCurrency.toLowerCase()]} alt={toCurrency} width={20} height={20} />
                      <span>{currencyLabel}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Received:</span>
                    <span className="font-bold text-green-600">
                      {formatCrypto(toAmount)} {toCurrency.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <CheckOutline />
                      Completed
                    </span>
                  </div>
                </div>
              </Card>

              {/* Success Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-green-600 text-lg">
                    <CheckOutline />
                  </div>
                  <div className="text-sm text-green-800">
                    <div className="font-semibold mb-1">Transaction Complete</div>
                    <div>Your {currencyLabel} has been added to your wallet. The transaction is now complete and cannot be reversed.</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Error Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-red-600 text-4xl">❌</div>
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Swap Failed</h3>
                <p className="text-gray-600">Your swap could not be completed</p>
              </div>

              {/* Error Details */}
              <Card title="Error Details" className="mb-4 border-red-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Error Code:</span>
                    <span className="font-mono text-sm font-semibold text-red-600">
                      {errorCode || 'SWAP_ERROR_001'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{new Date().toLocaleString()}</span>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <div className="text-gray-600 mb-2">Error Message:</div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-800 text-sm">
                        {errorMessage || 'The swap transaction failed due to a network error. Please check your connection and try again.'}
                      </p>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Attempted Amount:</span>
                    <span className="font-semibold">{formatNumber(fromAmount)} Points</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Target Currency:</span>
                    <div className="font-semibold flex items-center gap-2">
                      <Image src={coinIcons[toCurrency.toLowerCase()]} alt={toCurrency} width={20} height={20} />
                      <span>{currencyLabel}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-red-600">❌ Failed</span>
                  </div>
                </div>
              </Card>

              {/* Troubleshooting */}
              <Card title="Troubleshooting" className="mb-4">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check your internet connection</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Ensure you have sufficient points balance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Try again in a few minutes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Contact support if the problem persists</span>
                  </div>
                </div>
              </Card>

              {/* Error Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-red-600 text-lg">⚠️</div>
                  <div className="text-sm text-red-800">
                    <div className="font-semibold mb-1">No Charges Applied</div>
                    <div>Your points balance remains unchanged. No fees were charged for this failed transaction.</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3 mb-3">
            {success ? null : (
              <>
                <Button
                  block
                  danger
                  size="large"
                  onClick={onClose}
                >
                  Close
                </Button>
                {onRetry && (
                  <Button
                    block
                    type="primary"
                    size="large"
                    onClick={onRetry}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 border-none"
                  >
                    Try Again
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500">
              {success 
                ? 'Transaction completed successfully • Secure & encrypted'
                : 'Need help? Contact our support team'
              }
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
