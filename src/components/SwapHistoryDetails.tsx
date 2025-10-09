'use client';

import React from 'react';
import {
  Popup,
  Tag,
  Button
} from 'antd-mobile';
import {
  CloseOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  ClockCircleOutline
} from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectIsSwapHistoryDetailsOpen } from '@/modules';
import { AppDispatch } from '@/modules/store';
import {
  selectSelectedTransaction
} from '../modules/private/swap';
import { toast } from 'react-toastify';

export default function SwapHistoryDetails() {
  const selectedTransaction = useSelector(selectSelectedTransaction);
  const isOpen = useSelector(selectIsSwapHistoryDetailsOpen);
  const dispatch = useDispatch<AppDispatch>();

  const onClose = () => {
    dispatch(closePopup('isSwapHistoryDetailsOpen'));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutline className="text-green-500" />;
      case 'failed':
        return <CloseCircleOutline className="text-red-500" />;
      case 'pending':
      default:
        return <ClockCircleOutline className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString();
  };

  if (!selectedTransaction) return null;

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        borderRadius: '0px',
        backgroundColor: 'var(--popup-bg)'
      }}
      className="dark"
    >
      <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                {getStatusIcon(selectedTransaction.status)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-bitcount">Transaction Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-edu-hand">
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)} swap transaction
                </p>
              </div>
            </div>
            <Button
              size='small'
              onClick={onClose}
              className="!p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border-none bg-transparent"
            >
              <CloseOutline className="text-gray-600 dark:text-gray-400 text-lg" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedTransaction.status)}
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white font-bitcount">Status</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-edu-hand">
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </div>
                  </div>
                </div>
                <Tag color={getStatusColor(selectedTransaction.status)} className="text-sm font-bitcount">
                  {selectedTransaction.status.toUpperCase()}
                </Tag>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 font-bitcount">Transaction Summary</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-bitcount">
                    {formatAmount(selectedTransaction.fromAmount)} Points
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mb-2 font-edu-hand">↓</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-bitcount">
                    {selectedTransaction.toAmount.toFixed(6)} {selectedTransaction.toCurrency.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-edu-hand">
                    Rate: {selectedTransaction.conversionRate.toFixed(8)} {selectedTransaction.toCurrency.toUpperCase()}/Point
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 font-bitcount">Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-edu-hand">From Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white font-bitcount">{formatAmount(selectedTransaction.fromAmount)} Points</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-edu-hand">To Amount</span>
                  <span className="font-bold text-gray-900 dark:text-white font-bitcount">{selectedTransaction.toAmount.toFixed(6)} {selectedTransaction.toCurrency.toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-edu-hand">Conversion Rate</span>
                  <span className="font-bold text-gray-900 dark:text-white font-bitcount">{selectedTransaction.conversionRate.toFixed(8)} {selectedTransaction.toCurrency.toUpperCase()}/Point</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-edu-hand">Date & Time</span>
                  <span className="font-bold text-gray-900 dark:text-white font-bitcount">{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                </div>
                
                {selectedTransaction.transactionId && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-edu-hand">Transaction ID</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{selectedTransaction.transactionId}</span>
                      <Button 
                        size="mini" 
                        fill="none"
                        onClick={() => copyToClipboard(selectedTransaction.transactionId!)}
                        className="!p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        📋
                      </Button>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            {/* Status-Specific Information */}
            {selectedTransaction.errorMessage && selectedTransaction.status === 'failed' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CloseCircleOutline className="text-red-500" />
                  <span className="font-bold text-red-700 dark:text-red-400 font-bitcount">Error Details</span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-600 dark:text-red-400 mb-2 font-edu-hand">{selectedTransaction.errorMessage}</div>
                  {selectedTransaction.errorCode && (
                    <div className="text-xs text-red-500 dark:text-red-400 font-mono">Error Code: {selectedTransaction.errorCode}</div>
                  )}
                </div>
              </div>
            )}

            {selectedTransaction.status === 'pending' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <ClockCircleOutline className="text-yellow-500" />
                  <span className="font-bold text-yellow-700 dark:text-yellow-400 font-bitcount">Processing</span>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 font-edu-hand">
                    Your swap is being processed. This usually takes a few minutes to complete.
                  </div>
                </div>
              </div>
            )}

            {selectedTransaction.status === 'completed' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircleOutline className="text-green-500" />
                  <span className="font-bold text-green-700 dark:text-green-400 font-bitcount">Completed Successfully</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="text-sm text-green-600 dark:text-green-400 font-edu-hand">
                    Your swap has been completed successfully. The {selectedTransaction.toCurrency.toUpperCase()} has been transferred to your wallet.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-edu-hand">
              Need help? Contact our support team for assistance
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
