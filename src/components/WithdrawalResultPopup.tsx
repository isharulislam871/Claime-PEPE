'use client';

import React from 'react';
import {
  Popup,
  Card,
  Divider
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectCreatedWithdrawal, selectCreateWithdrawalSuccess } from '@/modules';

interface WithdrawalResultPopupProps {
  visible: boolean;
  onClose: () => void;
  onRetry?: () => void;

  currency: string;
  network: string;
  amount: string;
  address: string;
  networkIcon: string;
  transactionHash?: string;
  errorMessage?: string;
  errorCode?: string;
}

export default function WithdrawalResultPopup({
  visible,
  onClose,
  onRetry,
  
  currency,
  network,
  amount,
  address,
  networkIcon,
  transactionHash,
  errorMessage,
  errorCode
}: WithdrawalResultPopupProps) {
  
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const selectWithdrawal  = useSelector(selectCreatedWithdrawal)

  console.log(selectWithdrawal)

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
          <h2 className="text-xl font-bold text-gray-900">
            {selectWithdrawal?.status === 'completed' 
              ? 'Withdrawal Successful' 
              : selectWithdrawal?.status === 'processing'
              ? 'Withdrawal Processing'
              : selectWithdrawal?.status === 'pending'
              ? 'Withdrawal Pending'
              : selectWithdrawal?.status === 'failed'
              ? 'Withdrawal Failed'
              : 'Withdrawal Status'
            }
          </h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer text-xl"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          
          {selectWithdrawal?.status === 'processing' ? (
            <>
              {/* Processing Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Processing...</h3>
                <p className="text-gray-600">Your withdrawal is being processed on the blockchain</p>
              </div>

              {/* Processing Summary */}
              <Card className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="text-center py-2">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Processing</div>
                    <div className="text-xl font-bold text-gray-900">
                      {amount} {currency}
                    </div>
                  </div>
                  
                  <div className="text-3xl mb-3">⏳</div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">To {network}</div>
                    <div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {formatAddress(address)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Processing Details */}
              <Card title="Transaction Details" className="mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {selectWithdrawal?.transactionId || 'Generating...'}
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
                    <span className="font-semibold">{networkIcon} {network}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-mono text-sm">{formatAddress(address)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-blue-600">🔄 Processing</span>
                  </div>
                </div>
              </Card>

              {/* Processing Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 text-lg">⏳</div>
                  <div className="text-sm text-blue-800">
                    <div className="font-semibold mb-1">Transaction Processing</div>
                    <div>Your {currency} withdrawal is being processed. This usually takes 24-48 Hours depending on network congestion.</div>
                  </div>
                </div>
              </div>
            </>
          ) : selectWithdrawal?.status === 'completed' ? (
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
                      {formatAddress(selectWithdrawal?.transactionId as string)}
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
                    <span className="font-semibold">{networkIcon} {network}</span>
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
          ) : selectWithdrawal?.status === 'pending' ? (
            <>
              {/* Pending Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-yellow-600 text-4xl">⏰</div>
                </div>
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">Pending</h3>
                <p className="text-gray-600">Your withdrawal is waiting to be processed</p>
              </div>

              {/* Pending Summary */}
              <Card className="mb-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100">
                <div className="text-center py-2">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Pending Withdrawal</div>
                    <div className="text-xl font-bold text-gray-900">
                      {amount} {currency}
                    </div>
                  </div>
                  
                  <div className="text-3xl mb-3">⏰</div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">To {network}</div>
                    <div className="text-sm font-mono text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      {formatAddress(address)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pending Details */}
              <Card title="Transaction Details" className="mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Request ID:</span>
                    <span className="font-mono text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      {selectWithdrawal?._id || 'N/A'}
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
                    <span className="font-semibold">{networkIcon} {network}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-mono text-sm">{formatAddress(address)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-yellow-600">⏰ Pending</span>
                  </div>
                </div>
              </Card>

              {/* Pending Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-600 text-lg">⏰</div>
                  <div className="text-sm text-yellow-800">
                    <div className="font-semibold mb-1">Withdrawal Queued</div>
                    <div>Your {currency} withdrawal request is in queue. It will be processed shortly.</div>
                  </div>
                </div>
              </div>
            </>
          ) : selectWithdrawal?.status === 'failed' ? (
            <>
              {/* Failed Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-red-600 text-4xl">❌</div>
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Failed</h3>
                <p className="text-gray-600">Your withdrawal could not be processed</p>
              </div>

              {/* Failed Summary */}
              <Card className="mb-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
                <div className="text-center py-2">
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Failed Withdrawal</div>
                    <div className="text-xl font-bold text-gray-900">
                      {amount} {currency}
                    </div>
                  </div>
                  
                  <div className="text-3xl mb-3">💸</div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">To {network}</div>
                    <div className="text-sm font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
                      {formatAddress(address)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Error Details */}
              <Card title="Error Details" className="mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Error:</span>
                    <span className="font-semibold text-red-600">Transaction Failed</span>
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
                    <span className="font-semibold">{networkIcon} {network}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-red-600">❌ Failed</span>
                  </div>
                </div>
              </Card>

              {/* Failure Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-red-600 text-lg">⚠️</div>
                  <div className="text-sm text-red-800">
                    <div className="font-semibold mb-1">Transaction Failed</div>
                    <div>Your {currency} has been refunded to your account. Please check your balance and try again.</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Error Animation/Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-red-600 text-4xl">❌</div>
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Withdrawal Failed</h3>
                <p className="text-gray-600">Your withdrawal could not be completed</p>
              </div>

              {/* Error Details */}
              <Card title="Error Details" className="mb-4 border-red-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Error Code:</span>
                    <span className="font-mono text-sm font-semibold text-red-600">
                      {errorCode || 'WITHDRAWAL_ERROR_001'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{new Date().toLocaleString()}</span>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <div className="text-gray-600 mb-2">Error Message:</div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-800 text-sm">
                        {errorMessage || 'The withdrawal transaction failed due to insufficient network fees or network congestion. Please try again later.'}
                      </p>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Attempted Amount:</span>
                    <span className="font-semibold">{amount} {currency}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Target Network:</span>
                    <span className="font-semibold">{networkIcon} {network}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-red-600">❌ Failed</span>
                  </div>
                </div>
              </Card>

              {/* Troubleshooting */}
              <Card title="Troubleshooting" className="mb-4">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check your account balance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Verify the destination address is correct</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Ensure the network is not congested</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Try again with a smaller amount</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>•</span>
                    <span>Contact support if the problem persists</span>
                  </div>
                </div>
              </Card>

              {/* Error Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-red-600 text-lg">⚠️</div>
                  <div className="text-sm text-red-800">
                    <div className="font-semibold mb-1">No Funds Deducted</div>
                    <div>Your account balance remains unchanged. No fees were charged for this failed transaction.</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3 mb-3">
            {true ? null : (
              <>
                <Button
                  block
                  danger
                  size="large"
                  onClick={onClose}
                >
                  Close
                </Button>
                {onRetry && (
                  <Button
                    block
                    type="primary"
                    size="large"
                    onClick={onRetry}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 border-none"
                  >
                    Try Again
                  </Button>
                )}
              </>
            )}
          </div>

          
        </div>
      </div>
    </Popup>
  );
}
