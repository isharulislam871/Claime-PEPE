'use client';

import React, { useEffect, useState } from 'react';
import {
  Popup,
  List,
  Empty,
  PullToRefresh,
  Image,

} from 'antd-mobile';
import {
  CloseOutline,
  PayCircleOutline
} from 'antd-mobile-icons';

import { useSelector, useDispatch } from 'react-redux';
import { selectRecentWithdrawals, fetchWithdrawals, closePopup, selectIsHistoryOpen } from '@/modules';
import WithdrawHistoryDetailsPopup from './WithdrawHistoryDetailsPopup';
import { Tag } from 'antd';
import { networkNames } from '@/lib/networkIcons';
 

const formatAddress = (address: string) => {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export default function WithdrawHistoryPopup( ) {
  const dispatch = useDispatch();
  const withdrawals = useSelector(selectRecentWithdrawals);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const isHistoryOpen = useSelector(selectIsHistoryOpen);
  

  useEffect(() => {
    dispatch(fetchWithdrawals());
  }, [dispatch])
  const handleRefresh = async () => {
    dispatch(fetchWithdrawals());
  };

  const handleWithdrawalClick = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setDetailsVisible(true);
  };

  const handleDetailsClose = () => {
    setDetailsVisible(false);
    setSelectedWithdrawal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'processing';
       case 'processing':
        return 'processing';
        case 'failed':
        return 'error';
      default:
        return 'default';
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
      default:
        return 'Unknown';
    }
  };


  const onClose = ()=>{
    dispatch(closePopup('isHistoryOpen'))
  }
  return (
    <Popup
      visible={isHistoryOpen}
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
                      onClick={() => handleWithdrawalClick(withdrawal)}
                      prefix={
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          
                          <Image src={withdrawal.coinLogo || ''} alt={`${withdrawal.currency} logo`} width={20} height={20}/>
                        </div>
                      }
                      extra={
                        <div className="text-right">


                          <Tag
                            color={getStatusColor(withdrawal.status || 'pending')}

                          > 
                            {getStatusText(withdrawal.status || 'pending')}
                          </Tag>
                        </div>
                      }
                    >
                      <div>
                        <div className="font-semibold">Withdrawal Request</div>
                        <div className="text-sm text-gray-600">
                         {networkNames[withdrawal.method]}  • {withdrawal.currency || 0}
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
                            ID: {formatAddress(withdrawal.transactionId)}
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

        {/* Withdrawal Details Popup */}
        <WithdrawHistoryDetailsPopup
          visible={detailsVisible}
          onClose={handleDetailsClose}
          withdrawal={selectedWithdrawal}
        />
      </div>
    </Popup>
  );
}
