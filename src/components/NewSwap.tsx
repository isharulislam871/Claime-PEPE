'use client';

import React, { useState } from 'react';
import {
  Popup,
  Button,
  Card,
  Input,
  Selector,
  Toast,
  Space,
  Divider
} from 'antd-mobile';
import {
  CloseOutline,
  RightOutline
} from 'antd-mobile-icons';
import { SwapOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules';
import { 
  selectCoins,
  selectPepeConversionRates,
  selectUsdRates
} from '../modules/private/coin';
import CurrencySelection from './CurrencySelection';
import PointSelection from './PointSelection';
import SwapConfirmationPopup from './SwapConfirmationPopup';

interface NewSwapProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SwapOption {
  label: string;
  value: string;
  rate: number;
  icon: string;
  description: string;
}

export default function NewSwap({ isOpen, onClose }: NewSwapProps) {
  const user = useSelector(selectCurrentUser);
  const coins = useSelector(selectCoins);
  const pepeRates = useSelector(selectPepeConversionRates);
  const usdRates = useSelector(selectUsdRates);
  const [fromAmount, setFromAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('usdt');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);


 
  // Helper functions for CurrencySelection
  const getAvailableBalance = (currency: string): number => {
    // Convert user points to currency balance
    const pointsBalance = user?.balance || 0;
    const swapOption = swapOptions.find(opt => opt.value === currency.toLowerCase());
    return pointsBalance * (swapOption?.rate || 0);
  };

  const getUsdValue = (currency: string, amount: number): string => {
    if (currency.toLowerCase() === 'usd') return amount.toFixed(2);
    const swapOption = swapOptions.find(opt => opt.value === currency.toLowerCase());
    if (!swapOption) return '0.00';
    // For crypto, use approximate USD values
    const usdValue = amount * (swapOption.value === 'btc' ? 45000 : swapOption.value === 'eth' ? 2500 : 1);
    return usdValue.toFixed(2);
  };

  const getCurrencyLogo = (currency: string): string => {
    const logos: { [key: string]: string } = {
      usd: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      btc: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      eth: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      usdt: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    };
    return logos[currency.toLowerCase()] || logos.usd;
  };

  const swapOptions: SwapOption[] = [
    {
      label: 'USD',
      value: 'usd',
      rate: 0.000025, // 1 point = $0.000025 (40,000 points = $1)
      icon: '💵',
      description: '40,000 pts = $1.00'
    },
    {
      label: 'Bitcoin (BTC)',
      value: 'btc',
      rate: 0.0000000006, // Approximate rate
      icon: '₿',
      description: '~1.67M pts = 0.001 BTC'
    },
    {
      label: 'Ethereum (ETH)',
      value: 'eth',
      rate: 0.000000015, // Approximate rate
      icon: 'Ξ',
      description: '~66.7K pts = 0.001 ETH'
    },
    {
      label: 'USDT',
      value: 'usdt',
      rate: 0.000025,
      icon: '₮',
      description: '40,000 pts = 1 USDT'
    }
  ];

  const selectedOption = swapOptions.find(option => option.value === selectedCurrency);
  const pointsToSwap = parseInt(fromAmount) || 0;
  const convertedAmount = pointsToSwap * (selectedOption?.rate || 0);

  const handleSwap = () => {
    if (!fromAmount || pointsToSwap <= 0) {
      Toast.show({
        content: 'Please enter a valid amount',
        icon: 'fail'
      });
      return;
    }

    if (pointsToSwap > (user?.balance || 0)) {
      Toast.show({
        content: 'Insufficient points balance',
        icon: 'fail'
      });
      return;
    }

    if (pointsToSwap < 1000) {
      Toast.show({
        content: 'Minimum swap amount is 1,000 points',
        icon: 'fail'
      });
      return;
    }

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmSwap = async () => {
    setIsSwapping(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Toast.show({
        content: `Successfully swapped ${pointsToSwap} points to ${convertedAmount.toFixed(8)} ${selectedOption?.label}`,
        icon: 'success'
      });
      
      setFromAmount('');
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      Toast.show({
        content: 'Swap failed. Please try again.',
        icon: 'fail'
      });
    } finally {
      setIsSwapping(false);
    }
  };

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
          <h2 className="text-lg font-semibold">Swap Points</h2>
          <CloseOutline 
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Balance Card */}
          <Card className="mb-4 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-cyan-600">
                {(user?.balance || 0).toLocaleString()} Points
              </div>
            </div>
          </Card>

          {/* Swap Form */}
          <Card title="Swap Details" className="mb-4">
            <Space direction="vertical" className="w-full">
              {/* From Amount */}
              <PointSelection
                selectedAmount={fromAmount}
                onAmountChange={setFromAmount}
                title="From (Points)"
                className="mb-0"
                minAmount={1000}
                maxAmount={user?.balance || 0}
              />

              {/* Swap Icon */}
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <SwapOutlined className="text-cyan-600" />
                </div>
              </div>

              {/* To Currency */}
              <CurrencySelection
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                getAvailableBalance={getAvailableBalance}
                getUsdValue={getUsdValue}
                getCurrencyLogo={getCurrencyLogo}
                title="To Currency"
                className="mb-0"
              />

              {/* Conversion Preview */}
              {pointsToSwap > 0 && selectedOption && (
                <Card className="bg-gray-50 border-none">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">You will receive</div>
                    <div className="text-xl font-bold text-green-600">
                      {selectedOption.icon} {convertedAmount.toFixed(8)} {selectedOption.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Rate: 1 point = {selectedOption.rate} {selectedOption.label}
                    </div>
                  </div>
                </Card>
              )}
            </Space>
          </Card>

          {/* Swap Rates */}
          <Card title="Current Rates" className="mb-4">
            <div className="space-y-3">
              {swapOptions.map((option) => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {option.rate} {option.label}
                    </div>
                    <div className="text-xs text-gray-500">per point</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Button
            block
            color="primary"
            size="large"
            onClick={handleSwap}
            loading={isSwapping}
            disabled={!fromAmount || pointsToSwap <= 0 || pointsToSwap > (user?.balance || 0)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 border-none font-semibold"
          >
            {isSwapping ? 'Swapping...' : `Swap ${pointsToSwap.toLocaleString()} Points`}
          </Button>
          
          <div className="text-center mt-2">
            <div className="text-xs text-gray-500">
              Swaps are processed instantly • No fees applied
            </div>
          </div>
        </div>
      </div>

      {/* Swap Confirmation Popup */}
      <SwapConfirmationPopup
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSwap}
        fromAmount={pointsToSwap}
        toCurrency={selectedCurrency}
        toAmount={convertedAmount}
        conversionRate={selectedOption?.rate || 0}
        currencyIcon={selectedOption?.icon || '💰'}
        currencyLabel={selectedOption?.label || selectedCurrency}
        isLoading={isSwapping}
      />
    </Popup>
  );
}
