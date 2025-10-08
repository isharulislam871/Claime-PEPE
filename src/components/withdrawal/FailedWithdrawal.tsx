'use client';

import React from 'react';
import { Card, Divider } from 'antd-mobile';
import { networkIcons } from '@/lib/networkIcons';
import { WithdrawalStatusProps } from './types';

export default function FailedWithdrawal({
  currency,
  network,
  amount,
  address,
  formatAddress,
  withdrawal
}: WithdrawalStatusProps) {
  return (
    <>
      {/* Failed Animation/Icon */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-red-600 text-4xl">❌</div>
        </div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">Failed</h3>
        <p className="text-gray-600">Your withdrawal could not be processed</p>
      </div>

      {/* Failed Summary */}
      <Card className="mb-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
        <div className="text-center py-2">
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Failed Withdrawal</div>
            <div className="text-xl font-bold text-gray-900">
              {amount} {currency}
            </div>
          </div>
          
          <div className="text-3xl mb-3">💸</div>
          
          <div className="mb-2">
            <div className="text-sm text-gray-600 mb-1">To {network}</div>
            <div className="text-sm font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
              {formatAddress(address)}
            </div>
          </div>
        </div>
      </Card>

      {/* Error Details */}
      <Card title="Error Details" className="mb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Error:</span>
            <span className="font-semibold text-red-600">Transaction Failed</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-semibold">{new Date().toLocaleString()}</span>
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">{amount} {currency}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Network:</span>
            <span className="font-semibold">{networkIcons[network.toLowerCase()]} {network}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-red-600">❌ Failed</span>
          </div>
        </div>
      </Card>

      {/* Failure Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="text-red-600 text-lg">⚠️</div>
          <div className="text-sm text-red-800">
            <div className="font-semibold mb-1">Transaction Failed</div>
            <div>Your {currency} has been refunded to your account. Please check your balance and try again.</div>
          </div>
        </div>
      </div>
    </>
  );
}
