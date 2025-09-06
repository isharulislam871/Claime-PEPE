'use client';

import React, { useState } from 'react';
import { 
  Popup,
  List,
  Empty,
  PullToRefresh,
  Badge
} from 'antd-mobile';
import { 
  CloseOutline,
  PayCircleOutline
} from 'antd-mobile-icons';
import { timeAgo } from '@/lib/timeAgo';
import { useSelector, useDispatch } from 'react-redux';
import { selectRecentWithdrawals , fetchWithdrawals  } from '@/modules';

interface WithdrawHistoryPopupProps {
  visible: boolean;
  onClose: () => void;
}

export default function WithdrawHistoryPopup({ visible, onClose }: WithdrawHistoryPopupProps) {
  const dispatch = useDispatch();
  const withdrawals = useSelector(selectRecentWithdrawals);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchWithdrawals());
    // Simulate network delay for better UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
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
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
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
          <h2 className="text-lg font-semibold">Withdrawal History</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PullToRefresh
            onRefresh={handleRefresh}
          >
            <div className="p-4">
              {withdrawals.length > 0 ? (
                <List>
                  {withdrawals.map((withdrawal, index) => (
                    <List.Item
                      key={index}
                      prefix={
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <PayCircleOutline className="text-blue-600" />
                        </div>
                      }
                      extra={
                        <div className="text-right">
                          <div className="text-blue-600 font-semibold">
                            ${withdrawal.amount?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-xs text-gray-500">{timeAgo(withdrawal.createdAt)}</div>
                          <Badge 
                            content={getStatusText(withdrawal.status || 'pending')}
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(withdrawal.status || 'pending')}`}
                          />
                        </div>
                      }
                    >
                      <div>
                        <div className="font-semibold">Withdrawal Request</div>
                        <div className="text-sm text-gray-600">
                          {withdrawal.method || 'PayPal'} • {withdrawal.currency || 0} points converted
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {withdrawal.transactionId && (
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {withdrawal.transactionId}
                          </div>
                        )}
                      </div>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Empty description="No withdrawal history found" />
                  <p className="text-gray-500 text-sm mt-2">
                    Make your first withdrawal to see your transaction history
                  </p>
                </div>
              )}
            </div>
          </PullToRefresh>
        </div>

         
      </div>
    </Popup>
  );
}
