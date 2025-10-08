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
  CheckOutline,
  PayCircleOutline
} from 'antd-mobile-icons';
import { SafetyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { networkIcons } from '@/lib/networkIcons';

interface WithdrawalConfirmationPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currency: string;
  network: string;
  amount: string;
  address: string;
  fee?: string;
  estimatedTime?: string;
  loading?: boolean;
}

export default function WithdrawalConfirmationPopup({
  visible,
  onClose,
  onConfirm,
  currency,
  network,
  amount,
  address,
 
  estimatedTime = '24-48 hours',
  loading = false
}: WithdrawalConfirmationPopupProps) {
  
  const formatAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
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
          <h2 className="text-xl font-bold text-gray-900">Confirm Withdrawal</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">

        {/* Withdrawal Summary Card */}
        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <div className="text-center py-2">
            {/* Amount */}
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">You're withdrawing</div>
              <div className="text-2xl font-bold text-gray-900">
                {amount} {currency}
              </div>
            </div>

            {/* Withdrawal Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <PayCircleOutline className="text-blue-600 text-xl" />
              </div>
            </div>

            {/* Network & Address */}
            <div className="mb-2">
              <div className="text-sm text-gray-600 mb-1">To {network} network</div>
              <div className="text-lg font-bold text-green-600 flex items-center justify-center gap-2">
              <Image src={networkIcons[network.toLowerCase()]} height={24} width={24}/>  {formatAddress(address)}
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card title="Transaction Details" className="mb-4">
          <div className="space-y-3">
            <div className="flex justify-be tween items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">{amount} {currency}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network:</span>
              <span className="font-semibold flex items-center gap-2">
                <Image src={networkIcons[network.toLowerCase()]} height={24} width={24}/> {network}
                </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Destination:</span>
              <span className="font-semibold text-sm font-mono">{formatAddress(address)}</span>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network Fee:</span>
              <span className="font-semibold text-orange-600">{Number(0.0000001).toFixed(8)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-semibold">{estimatedTime}</span>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Deducted:</span>
              <span className="font-bold text-blue-600">
                {(parseFloat(amount) + parseFloat('0.0000001')).toFixed(8)} {currency}
              </span>
            </div>
          </div>
        </Card>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 text-lg">⚠️</div>
            <div className="text-sm text-yellow-800">
              <div className="font-semibold mb-1">Security Notice:</div>
              <div>Double-check the destination address. Cryptocurrency transactions cannot be reversed once confirmed.</div>
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              block
              type="primary"
              size="large"
              onClick={onConfirm}
              loading={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 border-none"
            >
              <CheckOutline className="mr-2" />
              {loading ? 'Processing...' : 'Confirm Withdrawal'}
            </Button>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <SafetyOutlined />
              Secure transaction • Protected by encryption
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
