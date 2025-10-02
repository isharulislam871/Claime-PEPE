'use client';

import React, { useState, useEffect } from 'react';
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
import Image from 'next/image';
import { networkIcons, networkNames, NotFoundIcon } from '@/lib/networkIcons';

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

interface CoinPrice {
  usd: number;
  usd_24h_change: number;
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
  const [coinPrice, setCoinPrice] = useState<CoinPrice | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // CoinGecko API mapping for common currencies
  const getCoinGeckoId = (currency: string): string => {
    const mapping: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'USDC': 'usd-coin',
      'BNB': 'binancecoin',
      'PEPE': 'pepe',
      'DOGE': 'dogecoin',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'SOL': 'solana',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'XRP': 'ripple',
      'TRX': 'tron',
      'SHIB': 'shiba-inu'
    };
    return mapping[currency.toUpperCase()] || currency.toLowerCase();
  };

  // Fetch price from CoinGecko API
  const fetchCoinPrice = async (currency: string) => {
    if (!currency) return;
    
    setPriceLoading(true);
    setPriceError(null);
    
    try {
      const coinId = getCoinGeckoId(currency);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data[coinId]) {
        setCoinPrice({
          usd: data[coinId].usd,
          usd_24h_change: data[coinId].usd_24h_change || 0
        });
      } else {
        throw new Error('Currency not found');
      }
    } catch (error) {
      console.error('Error fetching coin price:', error);
      setPriceError('Failed to fetch price');
      setCoinPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  // Fetch price when component mounts or currency changes
  useEffect(() => {
    if (visible && withdrawal?.currency) {
      fetchCoinPrice(withdrawal.currency);
    }
  }, [visible, withdrawal?.currency]);

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
                    {withdrawal.amount?.toFixed(8) || '0.00'} {withdrawal.currency}
                  </div>
                  <div className="text-sm text-gray-600">
                    {priceLoading ? (
                      <span className="animate-pulse">Loading price...</span>
                    ) : coinPrice ? (
                      <div className="flex items-center space-x-2">
                        <span>${(withdrawal.amount * coinPrice.usd).toFixed(2)} USD</span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          coinPrice.usd_24h_change >= 0 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {coinPrice.usd_24h_change >= 0 ? '+' : ''}{coinPrice.usd_24h_change.toFixed(2)}%
                        </span>
                      </div>
                    ) : priceError ? (
                      <span className="text-red-500 text-xs">{priceError}</span>
                    ) : (
                      <span>{withdrawal.currency} Withdrawal</span>
                    )}
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
                  <span className="font-medium">{'Crypto'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>

                  <span className="flex items-center gap-2 font-medium">
                    <Image
                      alt={withdrawal.network}
                      src={networkIcons[withdrawal.network] }
                      width={20}
                      height={20}
                    />
                    {networkNames[withdrawal.network]}
                  </span>

                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span className="font-medium">${withdrawal.networkFee?.toFixed(4) || '0.0000'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Net Amount:</span>
                  <span className="font-medium text-green-600">
                    {coinPrice ? 
                      `$${((withdrawal.amount - withdrawal.networkFee) * coinPrice.usd).toFixed(2)} USD` :
                      `${(withdrawal.amount - withdrawal.networkFee)?.toFixed(8) || '0.00000000'} ${withdrawal.currency}`
                    }
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
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded min-h-fit max-h-32 overflow-y-auto break-words">
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



            {withdrawal.transactionId && (
              <Button
                block
                fill="outline"
                color="primary"
                onClick={() => {
                  // Open blockchain explorer
                  const explorerUrl = `https://bscscan.com/tx/${withdrawal.transactionId}`;
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
