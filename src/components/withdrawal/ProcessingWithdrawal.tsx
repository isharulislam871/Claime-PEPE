'use client';

import React from 'react';
import { Card, Divider } from 'antd-mobile';
import { networkIcons } from '@/lib/networkIcons';
import { WithdrawalStatusProps } from './types';

export default function ProcessingWithdrawal({
  currency,
  network,
  amount,
  address,
  formatAddress,
  withdrawal
}: WithdrawalStatusProps) {
  return (
    <>
      {/* Processing Animation/Icon */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <h3 className="text-2xl font-bold text-blue-600 mb-2">Processing...</h3>
        <p className="text-gray-600">Your withdrawal is being processed on the blockchain</p>
      </div>

      {/* Processing Summary */}
      <Card className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="text-center py-2">
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Processing</div>
            <div className="text-xl font-bold text-gray-900">
              {amount} {currency}
            </div>
          </div>
          
          <div className="text-3xl mb-3">⏳</div>
          
          <div className="mb-2">
            <div className="text-sm text-gray-600 mb-1">To {network}</div>
            <div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {formatAddress(address)}
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Details */}
      <Card title="Transaction Details" className="mb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {withdrawal?.transactionId || 'Generating...'}
            </span>
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
            <span className="text-gray-600">Destination:</span>
            <span className="font-mono text-sm">{formatAddress(address)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-blue-600">🔄 Processing</span>
          </div>
        </div>
      </Card>

      {/* Processing Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 text-lg">⏳</div>
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-1">Transaction Processing</div>
            <div>Your {currency} withdrawal is being processed. This usually takes 24-48 Hours depending on network congestion.</div>
          </div>
        </div>
      </div>
    </>
  );
}
