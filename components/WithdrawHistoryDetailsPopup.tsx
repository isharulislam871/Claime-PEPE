'use client';

import React from 'react';
import {
  Popup,
  Card,
  Badge,
  Button,
  Divider,
  Space
} from 'antd-mobile';
import {
  CloseOutline,
  PayCircleOutline,
  CheckCircleOutline,
  ClockCircleOutline,
  ExclamationCircleOutline,
  
} from 'antd-mobile-icons';
import { timeAgo } from '@/lib/timeAgo';
import { CopyOutlined, CopyrightOutlined } from '@ant-design/icons';

interface WithdrawalDetails {
  id: string;
  amount: number;
  currency: string;
  network: string;
  address: string;
  status: string;
  networkFee: number;
  transactionId?: string;
  failureReason?: string;
  createdAt: Date;
  processedAt?: Date;
  method?: string;
}

interface WithdrawHistoryDetailsPopupProps {
  visible: boolean;
  onClose: () => void;
  withdrawal: WithdrawalDetails | null;
}

export default function WithdrawHistoryDetailsPopup({ 
  visible, 
  onClose, 
  withdrawal 
}: WithdrawHistoryDetailsPopupProps) {
  
  if (!withdrawal) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutline className="text-green-600" />;
      case 'pending':
        return <ClockCircleOutline className="text-yellow-600" />;
      case 'processing':
        return <ClockCircleOutline className="text-blue-600" />;
      case 'failed':
      case 'cancelled':
        return <ExclamationCircleOutline className="text-red-600" />;
      default:
        return <PayCircleOutline className="text-gray-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };

  const canCancel = withdrawal.status === 'pending';

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
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <h2 className="text-lg font-semibold">Withdrawal Details</h2>
          <CloseOutline
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Status Card */}
          <Card className="rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {getStatusIcon(withdrawal.status)}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    ${withdrawal.amount?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {withdrawal.currency} Withdrawal
                  </div>
                </div>
              </div>
              <Badge
                content={getStatusText(withdrawal.status)}
                className={`text-xs px-3 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}
              />
            </div>
          </Card>

          {/* Transaction Details */}
          <Card className="rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Transaction Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{withdrawal.method || 'Crypto'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium">{withdrawal.network}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span className="font-medium">${withdrawal.networkFee?.toFixed(4) || '0.0000'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Amount:</span>
                  <span className="font-medium text-green-600">
                    ${(withdrawal.amount - withdrawal.networkFee)?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Destination</h3>
              
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Wallet Address:</div>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="font-mono text-sm truncate flex-1">
                      {withdrawal.address}
                    </span>
                    <CopyOutlined 
                      className="text-blue-600 cursor-pointer ml-2"
                      onClick={() => copyToClipboard(withdrawal.address)}
                    />
                  </div>
                </div>
                
                {withdrawal.transactionId && (
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Transaction ID:</div>
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="font-mono text-sm truncate flex-1">
                        {withdrawal.transactionId}
                      </span>
                      <CopyrightOutlined 
                        className="text-blue-600 cursor-pointer ml-2"
                        onClick={() => copyToClipboard(withdrawal.transactionId!)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="rounded-lg">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Timeline</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-medium">
                    {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Ago:</span>
                  <span className="font-medium">{timeAgo(withdrawal.createdAt)}</span>
                </div>
                
                {withdrawal.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span className="font-medium">
                      {new Date(withdrawal.processedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Failure Reason (if applicable) */}
          {withdrawal.failureReason && (
            <Card className="rounded-lg border-red-200">
              <div className="space-y-2">
                <h3 className="font-semibold text-red-600">Failure Reason</h3>
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  {withdrawal.failureReason}
                </p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2 pb-4">
            {canCancel && (
              <Button 
                block 
                color="danger" 
                fill="outline"
                onClick={() => {
                  // Handle cancel withdrawal
                  console.log('Cancel withdrawal:', withdrawal.id);
                }}
              >
                Cancel Withdrawal
              </Button>
            )}
            
            {withdrawal.status === 'failed' && (
              <Button 
                block 
                color="primary"
                onClick={() => {
                  // Handle retry withdrawal
                  console.log('Retry withdrawal:', withdrawal.id);
                }}
              >
                Retry Withdrawal
              </Button>
            )}
            
            {withdrawal.transactionId && (
              <Button 
                block 
                fill="outline"
                onClick={() => {
                  // Open blockchain explorer
                  const explorerUrl = `https://etherscan.io/tx/${withdrawal.transactionId}`;
                  window.open(explorerUrl, '_blank');
                }}
              >
                View on Blockchain
              </Button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
