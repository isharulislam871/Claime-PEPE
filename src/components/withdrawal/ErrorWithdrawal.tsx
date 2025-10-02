'use client';

import React from 'react';
import { Card, Divider, Image } from 'antd-mobile';
import { networkIcons } from '@/lib/networkIcons';
import { WithdrawalStatusProps } from './types';

export default function ErrorWithdrawal({
  currency,
  network,
  amount,
  address,
  formatAddress,
  errorMessage,
  errorCode
}: WithdrawalStatusProps) {
  return (
    <>
      {/* Error Animation/Icon */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-red-600 text-4xl">❌</div>
        </div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">Withdrawal Failed</h3>
        <p className="text-gray-600">Your withdrawal could not be completed</p>
      </div>

      {/* Error Details */}
      <Card title="Error Details" className="mb-4 border-red-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Error Code:</span>
            <span className="font-mono text-sm font-semibold text-red-600">
              {errorCode || 'WITHDRAWAL_ERROR_001'}
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
                {errorMessage || 'The withdrawal transaction failed due to insufficient network fees or network congestion. Please try again later.'}
              </p>
            </div>
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Attempted Amount:</span>
            <span className="font-semibold">{amount} {currency}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Target Network:</span>
            <span className="font-semibold flex items-center gap-2">
              <Image src={networkIcons[network.toLowerCase()]} height={24} width={24}/> 
              {network?.toUpperCase()}
            </span>
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
            <span>Check your account balance</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Verify the destination address is correct</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Ensure the network is not congested</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>Try again with a smaller amount</span>
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
            <div className="font-semibold mb-1">No Funds Deducted</div>
            <div>Your account balance remains unchanged. No fees were charged for this failed transaction.</div>
          </div>
        </div>
      </div>
    </>
  );
}
