'use client';

import React from 'react';
import { Card, Divider, Image, Tag } from 'antd-mobile';
import { ClockCircleOutlined, InfoCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { networkIcons } from '@/lib/networkIcons';
import { selectFormData } from '@/modules/private/withdrawalForm';
import { useSelector } from 'react-redux';
import { selectCreatedWithdrawal } from '@/modules';

const formatAddress = (address: string) => {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export default function PendingWithdrawal( ) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formData = useSelector(selectFormData);
  const selectWithdrawal = useSelector(selectCreatedWithdrawal);

  const { currency, network, amount, address } = formData;
  

  return (
    <>
      {/* Status Header - Binance Style */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-orange-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Withdrawal Processing</h3>
              <p className="text-sm text-gray-500">Your request is being processed</p>
            </div>
          </div>
          <Tag color="orange" className="px-3 py-1 text-sm font-medium">
            Pending
          </Tag>
        </div>

        {/* Amount Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Withdrawal Amount</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {amount} {currency}
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
              Network: <Image src={networkIcons[network.toLowerCase()]} height={24} width={24}/> {network?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Submitted</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-3"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-orange-600 font-medium">Processing</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-3"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Transaction Details - Binance Style */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h4>
        
        <div className="space-y-4">
          {/* Request ID */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Request ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-900">
                {selectWithdrawal?._id?.slice(-8) || 'N/A'}
              </span>
              <button 
                onClick={() => copyToClipboard(selectWithdrawal?._id || '')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CopyOutlined className="text-xs" />
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Date & Time</span>
            <span className="text-sm text-gray-900 font-medium">
              {new Date().toLocaleString()}
            </span>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Amount */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="text-sm text-gray-900 font-semibold">
              {amount} {currency}
            </span>
          </div>

          {/* Network */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Network</span>
            <span className="text-sm text-gray-900 font-medium flex items-center gap-1">
            <Image src={networkIcons[network.toLowerCase()]} height={24} width={24}/> {network?.toUpperCase()}
            </span>
          </div>

          {/* Destination Address */}
          <div className="flex items-start justify-between py-2">
            <span className="text-sm text-gray-500">Destination</span>
            <div className="flex items-center gap-2 max-w-[200px]">
              <span className="font-mono text-xs text-gray-900 break-all text-right">
                {formatAddress(address)}
              </span>
              <button 
                onClick={() => copyToClipboard(address)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <CopyOutlined className="text-xs" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-orange-600 font-medium">Processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Notice - Binance Style */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <InfoCircleOutlined className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-semibold text-blue-900 mb-2">Processing Information</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your {currency} withdrawal is being processed by our system</li>
              <li>• Processing time: Usually within 10-30 minutes</li>
              <li>• You will receive a confirmation once completed</li>
              <li>• Transaction hash will be provided after blockchain confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
