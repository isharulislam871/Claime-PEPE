'use client';

import React from 'react';
import { Card, Divider } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';
import { networkIcons } from '@/lib/networkIcons';
import { WithdrawalStatusProps } from './types';

export default function CompletedWithdrawal({
  currency,
  network,
  amount,
  address,
  formatAddress,
  withdrawal
}: WithdrawalStatusProps) {
  return (
    <>
      {/* Success Animation/Icon */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckOutline className="text-green-600 text-4xl" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
        <p className="text-gray-600">Your withdrawal has been processed successfully</p>
      </div>

      {/* Transaction Summary */}
      <Card className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
        <div className="text-center py-2">
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Withdrawn</div>
            <div className="text-xl font-bold text-gray-900">
              {amount} {currency}
            </div>
          </div>
          
          <div className="text-3xl mb-3">📤</div>
          
          <div className="mb-2">
            <div className="text-sm text-gray-600 mb-1">To {network}</div>
            <div className="text-sm font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
              {formatAddress(address)}
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Details */}
      <Card title="Transaction Details" className="mb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction Hash:</span>
            <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {formatAddress(withdrawal?.transactionId as string)}
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
            <span className="font-semibold text-green-600">✅ Confirmed</span>
          </div>
        </div>
      </Card>

      {/* Success Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="text-green-600 text-lg">✅</div>
          <div className="text-sm text-green-800">
            <div className="font-semibold mb-1">Transaction Confirmed</div>
            <div>Your {currency} has been sent to the destination address. The transaction is now on the blockchain and cannot be reversed.</div>
          </div>
        </div>
      </div>
    </>
  );
}
