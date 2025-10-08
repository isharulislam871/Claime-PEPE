'use client';

import React, { useEffect } from 'react';
import {
  Popup,
  Card,
  Empty,
  Tag,
  Space,
  Divider,
  InfiniteScroll,
  PullToRefresh
} from 'antd-mobile';
import {
  CloseOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  ClockCircleOutline
} from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectCurrentUser, selectIsSwapHistoryOpen } from '@/modules';
import { AppDispatch } from '@/modules/store';
import {
  selectRecentTransactions,
  selectSwapLoading,
  selectSwapError,
  fetchSwapHistoryRequest,
  clearSwapError
} from '../modules/private/swap';
import { toast } from 'react-toastify';

export default function SwapHistoryPopup() {
  const user = useSelector(selectCurrentUser);
  const transactions = useSelector(selectRecentTransactions);
  const loading = useSelector(selectSwapLoading);
  const error = useSelector(selectSwapError);
  const isOpen = useSelector(selectIsSwapHistoryOpen);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
   if (isOpen) {
    dispatch(fetchSwapHistoryRequest());
   }
  }, [dispatch , isOpen ]);

 
  // Handle error display with toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSwapError());
    }
  }, [error, dispatch]);

  const onClose = () => {
    dispatch(closePopup('isSwapHistoryOpen'));
  };

  const handleRefresh = async () => {
    dispatch(fetchSwapHistoryRequest());
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderTransactionCard = (transaction: any) => (
    <Card key={transaction.id} className="mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon(transaction.status)}
          <div>
            <div className="font-medium text-gray-900">
              {formatAmount(transaction.fromAmount)} Points → {transaction.toAmount.toFixed(6)} {transaction.toCurrency.toUpperCase()}
            </div>
            <div className="text-sm text-gray-500">
              Rate: {transaction.conversionRate.toFixed(8)} {transaction.toCurrency.toUpperCase()}/Point
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(transaction.createdAt)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <Tag color={getStatusColor(transaction.status)} className="mb-1">
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Tag>
          {transaction.transactionId && (
            <div className="text-xs text-gray-400 truncate max-w-20">
              ID: {transaction.transactionId.slice(-8)}
            </div>
          )}
        </div>
      </div>
      
      {transaction.errorMessage && transaction.status === 'failed' && (
        <>
          <Divider className="my-2" />
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            <div className="font-medium">Error:</div>
            <div>{transaction.errorMessage}</div>
            {transaction.errorCode && (
              <div className="text-xs mt-1">Code: {transaction.errorCode}</div>
            )}
          </div>
        </>
      )}
    </Card>
  );

  return (
    <Popup
      visible={isOpen}
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
          <h2 className="text-lg font-semibold">Swap History</h2>
          <CloseOutline
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PullToRefresh onRefresh={handleRefresh}>
            <div className="p-4">
              {/* Summary Card */}
              <Card className="mb-4 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Total Swaps</div>
                  <div className="text-2xl font-bold text-cyan-600">
                    {transactions.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {transactions.filter(t => t.status === 'completed').length} completed • {' '}
                    {transactions.filter(t => t.status === 'pending').length} pending • {' '}
                    {transactions.filter(t => t.status === 'failed').length} failed
                  </div>
                </div>
              </Card>

              {/* Transactions List */}
              {loading && transactions.length === 0 ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                <div>
                  {transactions.map(renderTransactionCard)}
                  <InfiniteScroll loadMore={handleRefresh} hasMore={false}>
                    {transactions.length > 10 && (
                      <div className="text-center text-gray-500 text-sm py-4">
                        No more transactions
                      </div>
                    )}
                  </InfiniteScroll>
                </div>
              ) : (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{ height: 120 }}
                  description={
                    <Space direction="vertical" className="text-center">
                      <div className="text-gray-500">No swap history yet</div>
                      <div className="text-sm text-gray-400">
                        Your completed swaps will appear here
                      </div>
                    </Space>
                  }
                />
              )}
            </div>
          </PullToRefresh>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">
              Swaps are processed instantly • Transaction history is updated in real-time
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
