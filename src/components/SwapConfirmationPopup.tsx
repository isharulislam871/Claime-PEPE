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
import { SwapOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { coinIcons } from '@/lib/networkIcons';

interface SwapConfirmationPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  conversionRate: number;
  currencyLabel: string;
  isLoading?: boolean;
}

export default function SwapConfirmationPopup({
  visible,
  onClose,
  onConfirm,
  fromAmount,
  toCurrency,
  toAmount,
  conversionRate,
 
  currencyLabel,
  isLoading = false
}: SwapConfirmationPopupProps) {
  
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCrypto = (num: number) => {
    return num.toFixed(8);
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
          <h2 className="text-xl font-bold text-gray-900">Confirm Swap</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">

        {/* Swap Details Card */}
        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <div className="text-center py-2">
            {/* From Amount */}
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">You're swapping</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(fromAmount)} Points
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <SwapOutlined className="text-blue-600 text-lg" />
              </div>
            </div>

            {/* To Amount */}
            <div className="mb-2 text-center">
              <div className="text-sm text-gray-600 mb-1">You will receive</div>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
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
              <span className="text-gray-600">From:</span>
              <span className="font-semibold">{formatNumber(fromAmount)} Points</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To:</span>
              <span className="font-semibold flex items-center gap-2">
                <Image src={coinIcons[toCurrency.toLowerCase()]} alt={toCurrency} width={20} height={20} />
                {currencyLabel}
              </span>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate:</span>
              <span className="font-semibold text-sm">
                1 Point = {conversionRate} {toCurrency.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">You Receive:</span>
              <span className="font-bold text-green-600">
                {formatCrypto(toAmount)} {toCurrency.toUpperCase()}
              </span>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Time:</span>
              <span className="font-semibold">Instant</span>
            </div>
          </div>
        </Card>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 text-lg">⚠️</div>
            <div className="text-sm text-yellow-800">
              <div className="font-semibold mb-1">Important Notice:</div>
              <div>This transaction cannot be reversed once confirmed. Please verify all details before proceeding.</div>
            </div>
          </div>
        </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-3">
            <Button
              block
              danger
              size="large"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              onClick={onConfirm}
              loading={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 border-none"
            >
              <CheckOutline className="mr-2" />
              {isLoading ? 'Processing...' : 'Confirm Swap'}
            </Button>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <div className="text-xs text-gray-500">
              Secure transaction • Protected by encryption
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
