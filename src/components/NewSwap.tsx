'use client';

import React, { useEffect } from 'react';
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
  RightOutline,
  UnorderedListOutline
} from 'antd-mobile-icons';
import { SwapOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, openPopup, selectCurrentUser, selectIsSwapOpen } from '@/modules';
import { AppDispatch } from '@/modules/store';
import {
  selectCoins,
   
} from '../modules/private/coin';
import {
  selectFromAmount,
  selectSelectedCurrency,
  selectIsSwapping,
  selectShowConfirmation,
  selectShowProcessing,
  selectShowResult,
  selectShowMaintenance,
  selectSwapSuccess,
  selectSwapErrorMessage,
  selectSwapErrorCode,
  selectTransactionId,
  selectSwapOptions,
  selectSelectedSwapOption,
  selectPointsToSwap,
  selectConvertedAmount,
  setFromAmount,
  setSelectedCurrency,
  setShowConfirmation,
  setShowProcessing,
  setShowResult,
  setShowMaintenance,
  resetSwapForm,
  swapRequest,
  fetchSwapOptionsRequest,
  clearSwapError
} from '../modules/private/swap';
import CurrencySelection from './CurrencySelection';
import PointSelection from './PointSelection';
import SwapConfirmationPopup from './SwapConfirmationPopup';
import SwapResultPopup from './SwapResultPopup';
import SwapProcessingPopup from './SwapProcessingPopup';
import SwapMaintenancePopup from './SwapMaintenancePopup';
import { toast } from 'react-toastify';
import { getCurrentUser } from '@/lib/api';

export default function NewSwap( ) {
  const user = useSelector(selectCurrentUser);
  const coins = useSelector(selectCoins);
  
  // Redux state selectors
  const fromAmount = useSelector(selectFromAmount);
  const selectedCurrency = useSelector(selectSelectedCurrency);
  const isSwapping = useSelector(selectIsSwapping);
  const showConfirmation = useSelector(selectShowConfirmation);
  const showProcessing = useSelector(selectShowProcessing);
  const showResult = useSelector(selectShowResult);
  const showMaintenance = useSelector(selectShowMaintenance);
  const swapSuccess = useSelector(selectSwapSuccess);
  const errorMessage = useSelector(selectSwapErrorMessage);
  const errorCode = useSelector(selectSwapErrorCode);
  const transactionId = useSelector(selectTransactionId);
  const swapOptions = useSelector(selectSwapOptions);
  const selectedOption = useSelector(selectSelectedSwapOption);
  const pointsToSwap = useSelector(selectPointsToSwap);
  const convertedAmount = useSelector(selectConvertedAmount);
 
  const isOpen = useSelector(selectIsSwapOpen);
  const dispatch = useDispatch<AppDispatch>();

  // Initialize swap options on component mount
  useEffect(() => {
    dispatch(fetchSwapOptionsRequest());
  }, [dispatch]);

  // Handle error display with toast
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const onClose = () => {
    dispatch(closePopup('isSwapOpen'));
    dispatch(resetSwapForm());
  };

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
    return coin?.icon || ''
  };


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
    dispatch(setShowConfirmation(true));
  };

  const handleConfirmSwap = () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.telegramId;

    if (!userId) {
      Toast.show({
        content: 'User not found. Please try again.',
        icon: 'fail'
      });
      return;
    }

    // Hide confirmation popup and dispatch swap request
    dispatch(setShowConfirmation(false));
    dispatch(swapRequest(userId.toString(), pointsToSwap, selectedCurrency, convertedAmount));
  };

  const handleRetrySwap = () => {
    dispatch(setShowResult(false));
    dispatch(setShowConfirmation(true));
  };

  const handleCloseResult = () => {
    dispatch(setShowResult(false));
    if (swapSuccess) {
      onClose();
    }
  };

  const formatPoints = (points: number): string => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toString();
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
          <div className="flex items-center space-x-3">
            <UnorderedListOutline
              className="text-gray-500 cursor-pointer"
              onClick={() => dispatch(openPopup('isSwapHistoryOpen'))}
            />
            <CloseOutline
              className="text-gray-500 cursor-pointer"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Balance Card */}
          <Card className="mb-4 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-cyan-600">
                 { formatPoints(user?.balance || 0)} pts
              </div>
            </div>
          </Card>

          {/* Swap Form */}
          <Card title="Swap Details" className="mb-4">
            <Space direction="vertical" className="w-full">
              {/* From Amount */}
              <PointSelection
                selectedAmount={fromAmount}
                onAmountChange={(amount: string) => dispatch(setFromAmount(amount))}
                title="From (Points)"
                className="mb-0"
                maxAmount={user?.balance || 0}
                defaultAmount='25000'
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
                onCurrencyChange={(currency: string) => dispatch(setSelectedCurrency(currency))}
                getAvailableBalance={getAvailableBalance}
                getUsdValue={getUsdValue}
                title="To Currency"
                className="mb-0"
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
            {isSwapping
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
        onClose={() => dispatch(setShowConfirmation(false))}
        onConfirm={handleConfirmSwap}
        fromAmount={pointsToSwap}
        toCurrency={selectedCurrency}
        toAmount={convertedAmount}
        conversionRate={selectedOption?.rate || 0}
        currencyLabel={selectedOption?.label || selectedCurrency}
        isLoading={isSwapping}
      />

      {/* Swap Processing Popup */}
      <SwapProcessingPopup
        visible={showProcessing}
        onComplete={() => {
          dispatch(setShowProcessing(false));
          dispatch(setShowResult(true));
        }}
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
        currencyLabel={selectedOption?.label || selectedCurrency}
        errorMessage={errorMessage}
        errorCode={errorCode}
      />

      {/* Swap Maintenance Popup */}
      <SwapMaintenancePopup
        visible={showMaintenance}
        onClose={() => dispatch(setShowMaintenance(false))}
        maintenanceDuration={15} // 15 minutes for demo
        startTime={new Date()}
      />
    </Popup>
  );
}
