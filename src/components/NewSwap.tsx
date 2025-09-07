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
import SwapResultPopup from './SwapResultPopup';
import SwapProcessingPopup from './SwapProcessingPopup';
import SwapMaintenancePopup from './SwapMaintenancePopup';
import { toast } from 'react-toastify';
import { encrypt } from '@/lib/authlib';
import { getCurrentUser } from '@/lib/api';

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
  const [selectedCurrency, setSelectedCurrency] = useState(coins[0]?.symbol || 'USDT');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Toggle for testing


 
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

   

  // Helper function to get coin icon from coins data
  const getCoinIcon = (currency: string): string => {
    const coin = coins?.find(coin => 
      coin.symbol?.toLowerCase() === currency.toLowerCase() ||
      coin.name?.toLowerCase() === currency.toLowerCase()
    );
    return coin?.icon  || ''
  };

 

  const swapOptions: SwapOption[] = [
    {
      label: 'Bitcoin (BTC)',
      value: 'btc',
      rate: 0.0000000006, // Approximate rate
      icon: getCoinIcon('btc'),
      description: '~1.67M pts = 0.001 BTC'
    },
    {
      label: 'Ethereum (ETH)',
      value: 'eth',
      rate: 0.000000015, // Approximate rate
      icon: getCoinIcon('eth'),
      description: '~66.7K pts = 0.001 ETH'
    },
    {
      label: 'USDT',
      value: 'usdt',
      rate: 0.000025,
      icon: getCoinIcon('usdt'),
      description: '40,000 pts = 1 USDT'
    },
    {
      label: 'BNB',
      value: 'bnb',
      rate: 0.0000018, // Approximate rate
      icon: getCoinIcon('bnb'),
      description: '~555 pts = 0.001 BNB'
    }
  ];
  

  const selectedOption = swapOptions.find(option => option.value === selectedCurrency.toLowerCase());
  const pointsToSwap = parseInt(fromAmount) || 0;
  const convertedAmount = pointsToSwap * (selectedOption?.rate || 0);
 
  
  const handleSwap = () => {
    // Check if maintenance mode is active
    if (isMaintenanceMode) {
      setShowMaintenance(true);
      return;
    }

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
    setShowConfirmation(false);
    setShowProcessing(true);
    const currentUser =  getCurrentUser()
    const userId = encrypt(currentUser?.telegramId);
    try {
      // Call the swap API
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAmount: pointsToSwap,
          toCurrency: selectedCurrency,
          toAmount: convertedAmount,
          userId: userId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSwapSuccess(true);
        setErrorMessage('');
        setErrorCode('');
        setFromAmount(''); // Clear the form on success
        
        // Show success toast
      toast.success(`Swap completed! Transaction ID: ${data.transactionId}`)
      } else {
        setSwapSuccess(false);
        setErrorMessage(data.message || 'Swap failed. Please try again.');
        setErrorCode(data.errorCode || 'UNKNOWN_ERROR');
        
        // Show error toast
        toast.error( data.message || 'Swap failed. Please try again.')
      }
      
      setShowProcessing(false);
      setShowResult(true);
      
    } catch (error) {
      console.error('Swap API error:', error);
      setSwapSuccess(false);
      setErrorMessage('Network error. Please check your connection and try again.');
      setErrorCode('NETWORK_ERROR');
      setShowProcessing(false);
      setShowResult(true);
      
      Toast.show({
        content: 'Network error occurred',
        icon: 'fail',
        duration: 3000
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleRetrySwap = () => {
    setShowResult(false);
    setShowConfirmation(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (swapSuccess) {
      onClose();
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
                defaultAmount="1000"
              />

              {/* Swap Icon */}
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <SwapOutlined className="text-cyan-600" />
                </div>
              </div>

              {/* To Currency */}
              <CurrencySelection
                selectedCurrency={selectedCurrency || 'USDT'}
                onCurrencyChange={setSelectedCurrency}
                getAvailableBalance={getAvailableBalance}
                getUsdValue={getUsdValue}
                title="To Currency"
                className="mb-0"
                defaultCurrency="USDT"
              />
 
           
            </Space>
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
            
          >
            {  isSwapping 
              ? 'Swapping...' 
              : `Swap ${pointsToSwap.toLocaleString()} Points`
            }
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

      {/* Swap Processing Popup */}
      <SwapProcessingPopup
        visible={showProcessing}
        fromAmount={pointsToSwap}
        toCurrency={selectedCurrency}
        toAmount={convertedAmount}
        currencyLabel={selectedOption?.label || selectedCurrency}
        
      />

      {/* Swap Result Popup */}
      <SwapResultPopup
        visible={showResult}
        onClose={handleCloseResult}
        onRetry={handleRetrySwap}
        success={swapSuccess}
        fromAmount={pointsToSwap}
        toCurrency={selectedCurrency}
        toAmount={convertedAmount}
        currencyIcon={selectedOption?.icon || '💰'}
        currencyLabel={selectedOption?.label || selectedCurrency}
        errorMessage={errorMessage}
        errorCode={errorCode}
      />

      {/* Swap Maintenance Popup */}
      <SwapMaintenancePopup
        visible={showMaintenance}
        onClose={() => setShowMaintenance(false)}
        maintenanceDuration={15} // 15 minutes for demo
        startTime={new Date()}
      />
    </Popup>
  );
}
