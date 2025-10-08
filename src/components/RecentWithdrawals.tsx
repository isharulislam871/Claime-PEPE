'use client';

import React, { Dispatch, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popup,
  List,
  Button,
  Empty,
  SpinLoading
} from 'antd-mobile';
import { 
  CloseOutline,
  HistogramOutline,
  CheckOutline,
  ClockCircleOutline,
  RedoOutline,
  CloseCircleOutline,
  UpCircleOutline
} from 'antd-mobile-icons';
 
import { 
  selectRecentWithdrawals,
  selectWithdrawalsLoading,
  selectWithdrawalsError,
  selectIsRecentWithdrawalsOpen,
  setRecentWithdrawalsOpen,
  fetchWithdrawals,
  clearError
} from '@/modules';
 
import { CopyFilled } from '@ant-design/icons';

interface RecentWithdrawalsProps {
  
  isOpen : any;
  onClose : any;
}

export default function RecentWithdrawals({  isOpen , onClose }: RecentWithdrawalsProps) {
  const dispatch = useDispatch();
  const withdrawalHistory = useSelector(selectRecentWithdrawals);
  const loading = useSelector(selectWithdrawalsLoading);
  const error = useSelector(selectWithdrawalsError);
 
  useEffect(() => {
    
      dispatch(fetchWithdrawals());
   
  }, [isOpen, dispatch]);

  const handleClose = () => {
    dispatch(setRecentWithdrawalsOpen(false));
    if (error) {
      dispatch(clearError());
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckOutline />;
      case 'pending':
        return <ClockCircleOutline />;
      case 'processing':
        return <RedoOutline />;
      default:
        return <CloseCircleOutline />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Binance-style Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <UpCircleOutline className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Withdrawal History</h2>
                <p className="text-sm text-gray-500">Track your recent withdrawals</p>
              </div>
            </div>
            <Button 
              fill='none' 
              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutline className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-2">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl mx-2 mt-4">
              <SpinLoading color='primary'   />
              <p className="text-gray-500 mt-4">Loading withdrawals...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-6 text-center mx-2 mt-4 shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloseCircleOutline className="text-red-500 text-2xl" />
              </div>
              <p className="text-red-600 font-semibold mb-2">Error loading withdrawals</p>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <Button 
                color='primary' 
                size='large'
                onClick={() => { dispatch(fetchWithdrawals()); }}
                className="!rounded-lg"
              >
                Try Again
              </Button>
            </div>
          ) : withdrawalHistory.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center mx-2 mt-4 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HistogramOutline className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No withdrawals yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your withdrawal history will appear here once you make your first transaction.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {withdrawalHistory.map((withdrawal) => (
                <div key={withdrawal._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                        <img 
                          src={withdrawal.coinLogo }                         
                          alt={`${withdrawal.currency} Token`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-900">
                            -{withdrawal.amount.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {withdrawal.currency}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(withdrawal.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                      withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(withdrawal.status)}
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 pt-3 border-t border-gray-50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Network</span>
                      <span className="font-medium text-gray-900">{withdrawal.method.toLocaleUpperCase()}</span>
                    </div>
                    
                    {withdrawal.walletId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">To Address</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-700">
                            {withdrawal.walletId.slice(0, 6)}...{withdrawal.walletId.slice(-4)}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(withdrawal.walletId || '')}
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <CloseOutline className="text-xs" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {withdrawal.transactionId && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-medium">Transaction Hash</span>
                          <button 
                            onClick={() => copyToClipboard(withdrawal.transactionId as any)}
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <CopyFilled className="text-xs" />
                          </button>
                        </div>
                        <div className="font-mono text-xs text-gray-700 mt-1 break-all">
                          {withdrawal.transactionId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 p-4">
          <Button 
            block 
            size='large'
            onClick={onClose}
            className="!bg-gray-900 !text-white !rounded-xl !font-semibold hover:!bg-gray-800 transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </Popup>
  );
}
