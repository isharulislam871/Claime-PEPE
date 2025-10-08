'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Popup,

  Card,

  Form,
  Toast,
  SpinLoading,
  Steps
} from 'antd-mobile';
import {
  CloseOutline,

  CheckOutline,
  ClockCircleOutline,
  FileOutline
} from 'antd-mobile-icons';

import { closePopup, fetchWalletRequest, selectIsWithdrawOpen, selectUserBalance, selectWallets } from '@/modules';
import {
  fetchCoinsRequest,

  fetchConversionRatesRequest,
  selectCoins,
  selectUsdRates
} from '@/modules/private/coin';
import {
  createWithdrawal,
  clearCreateState,
  selectCreateWithdrawalLoading,
  selectCreateWithdrawalError,
  selectCreateWithdrawalSuccess,
  selectCreatedWithdrawal
} from '@/modules/private/withdrawals';
 
import { getCurrentUser } from '@/lib/api';
import CurrencySelection from './CurrencySelection';
import NetworkSelection from './NetworkSelection';
import AmountSelection from './AmountSelection';
import WithdrawalProgressPopup from './WithdrawalProgressPopup';
import WithdrawalResultPopup from './WithdrawalResultPopup';
import WithdrawalConfirmationPopup from './WithdrawalConfirmationPopup';
import { toast } from 'react-toastify';
import { Button, Input } from 'antd';
 
import { AppDispatch } from '@/modules/store';
import {
  selectFormData,
  selectCurrentStep,
  selectShowConfirmation,
  selectShowProgress,
  selectShowResult,
  selectWithdrawalSuccess,
  selectErrorMessage,
  selectErrorCode,
  selectCanProceedToNextStep,
  updateFormField,
  setCurrentStep,
  setShowConfirmation,
  setShowProgress,
  setShowResult,
  setWithdrawalSuccess,
  setErrorMessage,
  setErrorCode,
  resetForm,
  clearResultState
} from '@/modules/private/withdrawalForm';


 

export default function NewWithdrawal( ) {
  const dispatch = useDispatch<AppDispatch>();
  
  const coins = useSelector(selectCoins);
  const wallets = useSelector(selectWallets);
  const usdRates = useSelector(selectUsdRates);
  const isOpenWithdraw = useSelector(selectIsWithdrawOpen);
  
  // Redux selectors for withdrawal creation
  const createLoading = useSelector(selectCreateWithdrawalLoading);
  const createError = useSelector(selectCreateWithdrawalError);
  const createSuccess = useSelector(selectCreateWithdrawalSuccess);
  const createdWithdrawal = useSelector(selectCreatedWithdrawal);
  
  // Redux selectors for withdrawal form
  const formData = useSelector(selectFormData);
  const currentStep = useSelector(selectCurrentStep);
  const showConfirmation = useSelector(selectShowConfirmation);
  const showProgress = useSelector(selectShowProgress);
 
  const withdrawalSuccess = useSelector(selectWithdrawalSuccess);
  const errorMessage = useSelector(selectErrorMessage);
  const errorCode = useSelector(selectErrorCode);
  const canProceedToNextStep = useSelector(selectCanProceedToNextStep);
  
  const onClose = () =>{
    dispatch(closePopup('isOpenWithdraw'))
  }

  useEffect(() => {
    dispatch(fetchCoinsRequest());
    dispatch(fetchConversionRatesRequest());
    
    const currentUser = getCurrentUser();
    if (currentUser?.telegramId) {
      dispatch(fetchWalletRequest({ userId: String(currentUser.telegramId) })); // Fetch wallet data on component mount
    }
  }, [dispatch ]);

  // Handle Redux withdrawal creation state changes
  useEffect(() => {
    if (createSuccess && createdWithdrawal) {
      dispatch(setWithdrawalSuccess(true));
      dispatch(setErrorMessage(''));
      dispatch(setErrorCode(''));
      dispatch(setShowProgress(false));
      dispatch(setShowResult(true));
      
      // Refresh wallet data to reflect updated balance
      const currentUser = getCurrentUser();
      if (currentUser?.telegramId) {
        dispatch(fetchWalletRequest({ userId: String(currentUser.telegramId) }));
      }
      
      // Clear Redux state for next withdrawal
      dispatch(clearCreateState());
    }
  }, [createSuccess, createdWithdrawal, dispatch]);

  useEffect(() => {
    if (createError) {
      dispatch(setWithdrawalSuccess(false));
      dispatch(setErrorMessage(createError));
      dispatch(setErrorCode('WITHDRAWAL_ERROR'));
      dispatch(setShowProgress(false));
      dispatch(setShowResult(true));
      
      // Clear Redux error state
      dispatch(clearCreateState());
    }
  }, [createError, dispatch]);

 

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    dispatch(updateFormField(field, value));
  };

  const getAvailableBalance = (currency: string) => {
    // Find wallet by currency from the wallets array
    const wallet = wallets.find(w => w.currency === currency);
    return wallet?.balance || 0;
  };

  const getUsdValue = (currency: string, amount: number) => {
    const rate = usdRates[currency] || 0;
    return (amount * rate).toFixed(2);
  };

  // Convert USD amount to selected currency amount
  const convertUsdToCurrency = (usdAmount: number, currency: string): string => {
    const rate = usdRates[currency] || 1;
    if (rate === 0) return '0';
    return (usdAmount / rate).toFixed(8);
  };



  const getCurrentFee = () => {
    return 0.000001; // Mock fee
  };

  const getReceiveAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = getCurrentFee();
    return Math.max(0, amount - fee);
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      // Validate currency and amount
      if (!formData.currency || !formData.amount || parseFloat(formData.amount) <= 0) {
        toast.error('Please select currency and enter valid amount');
        return;
      }
      dispatch(setCurrentStep(1));
    } else if (currentStep === 1) {
      // Validate address
      if (!formData.address) {
        toast.error('Please enter withdrawal address');
        return;
      }
      dispatch(setCurrentStep(2));
    }
  };

  const handleSubmit = () => {
    // Show confirmation popup
    dispatch(setShowConfirmation(true));
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const handleConfirmWithdrawal = () => {
    dispatch(setShowConfirmation(false));
    dispatch(setShowProgress(true));

    const currentUser = getCurrentUser();
    if (!currentUser?.telegramId) {
      dispatch(setWithdrawalSuccess(false));
      dispatch(setErrorMessage('User not authenticated'));
      dispatch(setErrorCode('AUTH_ERROR'));
      dispatch(setShowProgress(false));
      dispatch(setShowResult(true));
      return;
    }

  
    // Dispatch Redux action to create withdrawal
    dispatch(createWithdrawal({
      currency: formData.currency,
      network: formData.network,
      address: formData.address,
      amount: parseFloat(formData.amount),
      memo: formData.memo || ''
    }));
  };

   

  const handleCloseResult = () => {
    dispatch(setShowResult(false));
    if (withdrawalSuccess) {
      // Reset form and close on success
      dispatch(resetForm());
      onClose();
    }
  };

   

  const copyFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleInputChange('address', text);
      toast.success('Address pasted from clipboard');
    } catch (error) {
      toast.error('Failed to paste from clipboard');
    }
  };

  const steps = [
    { title: 'Amount', description: 'Select currency and amount' },
    { title: 'Address', description: 'Enter withdrawal address' },
    { title: 'Confirm', description: 'Review and confirm' }
  ];
 

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <CurrencySelection
              selectedCurrency={formData.currency}
              onCurrencyChange={(currency) => handleInputChange('currency', currency)}
              getAvailableBalance={getAvailableBalance}
              getUsdValue={getUsdValue}

              title="Select Currency"
            />

            <NetworkSelection
              selectedNetwork={formData.network}
              onNetworkChange={(network) => handleInputChange('network', network)}
              currency={formData.currency}
              title="Select Network"
            />

            <AmountSelection
              selectedAmount={formData.amount}
              onAmountChange={(amount) => handleInputChange('amount', amount)}
              currency={formData.currency}
              getAvailableBalance={getAvailableBalance}
              getUsdValue={getUsdValue}
              convertUsdToCurrency={convertUsdToCurrency}
              title="Select Amount"
            />
          </div>
        );

      case 1:
        return (
          <Card title="Withdrawal Address">
            <div className="space-y-4">
              <Input
                size="large" // 🔹 makes it taller (similar to Binance)
                value={formData.address}
                onChange={(value) =>
                  handleInputChange('address', value.target.value)
                }
                placeholder="Enter wallet address"
                className="h-12" // 🔹 override to 48px if you want exact Binance feel
                suffix={
                  <Button
                    type="text"
                    onClick={copyFromClipboard}
                    className="h-fit p-0 text-gray-600 hover:text-blue-600"
                  >
                    <FileOutline className="w-5 h-5" />
                  </Button>
                }
              />

              <Input
                size="large"
                value={formData.memo}
                onChange={(value) =>
                  handleInputChange('memo', value.target.value)
                }
                placeholder="Memo (optional)"
                className="h-12"
              />
            </div>
          </Card>



        );

      case 2:
        return (
          <div className="space-y-4">
            <Card title="Withdrawal Summary">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-semibold">{formData.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{formData.amount} {formData.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span className="font-semibold">{getCurrentFee()} {formData.currency}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You'll Receive:</span>
                    <span className="font-bold text-green-600">
                      {getReceiveAmount().toFixed(4)} {formData.currency}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mt-4">
                  <div className="text-sm text-gray-600 mb-1">Address:</div>
                  <div className="text-sm font-mono break-all">{formData.address}</div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Popup
      visible={isOpenWithdraw}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '100vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                {/* <WalletOutline className="text-white text-lg" /> */}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Withdrawal</h2>
                <p className="text-sm text-gray-500">Withdraw your earnings</p>
              </div>
            </div>
            <Button

              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutline className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white px-6 py-4 border-b border-gray-100">
          <Steps current={currentStep} direction="horizontal">
            {steps.map((step, index) => (
              <Steps.Step
                key={index}
                title={step.title}
                description={step.description}
                status={index === currentStep ? 'process' : index < currentStep ? 'finish' : 'wait'}
              />
            ))}
          </Steps>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {renderStepContent()}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-100 px-4 py-4 safe-area-pb">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                type="default"
                size="large"
                onClick={handlePreviousStep}
                className="flex-1"
              >
                Previous
              </Button>
            )}

            {currentStep < 2 ? (
              <Button
                type="primary"
                size="large"
                onClick={handleNextStep}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                className="flex-1"
              >
                Review Withdrawal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Confirmation Popup */}
      <WithdrawalConfirmationPopup
        visible={showConfirmation}
        onClose={() => dispatch(setShowConfirmation(false))}
        onConfirm={handleConfirmWithdrawal}
        currency={formData.currency}
        network={formData.network}
        amount={formData.amount}
        address={formData.address}
        
        loading={createLoading}
      />

      {/* Withdrawal Progress Popup */}
      <WithdrawalProgressPopup
        visible={showProgress}
        currency={formData.currency}
        network={ formData.network}
        amount={formData.amount}
        address={formData.address}
      
        duration={60}
      />

      {/* Withdrawal Result Popup */}
      <WithdrawalResultPopup  onClose={ handleCloseResult }/>

    </Popup>
  );

 
}
