'use client';

import React, { useState, useEffect } from 'react';
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

import { selectUserBalance } from '@/modules';
import {
  fetchCoinsRequest,

  fetchConversionRatesRequest,
  selectCoins,
  selectPepeConversionRates,
  selectUsdRates
} from '../modules/private/coin';
import { useWallet } from '@/hooks/useWallet';
import { encrypt } from '@/lib/authlib';
import { getCurrentUser } from '@/lib/api';
import CurrencySelection from './CurrencySelection';
import NetworkSelection from './NetworkSelection';
import WithdrawalProgressPopup from './WithdrawalProgressPopup';
import WithdrawalResultPopup from './WithdrawalResultPopup';
import WithdrawalConfirmationPopup from './WithdrawalConfirmationPopup';
import { toast } from 'react-toastify';
import { Button, Input } from 'antd';


interface NewWithdrawalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WithdrawalFormData {
  currency: string;
  network: string;
  address: string;
  amount: string;
  memo?: string;
}

export default function NewWithdrawal({ isOpen, onClose }: NewWithdrawalProps) {
  const dispatch = useDispatch();
  const mainPepeBalance = useSelector(selectUserBalance);
  const coins = useSelector(selectCoins);
  const pepeConversionRates = useSelector(selectPepeConversionRates);
  const usdRates = useSelector(selectUsdRates);
  
  // Use wallet hook for wallet data
  const { 
    wallets, 
    loading: walletLoading, 
    fetchWallet, 
    getWalletByCurrency 
  } = useWallet();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');

  

  const [formData, setFormData] = useState<WithdrawalFormData>({
    currency: 'USDT',
    network: 'trc20',
    address: '',
    amount: '',
    memo: ''
  });

  useEffect(() => {
    dispatch(fetchCoinsRequest());
    dispatch(fetchConversionRatesRequest());
    fetchWallet(); // Fetch wallet data on component mount
  }, [fetchWallet]);

  // Update currency when coins are loaded
  useEffect(() => {
    if (coins.length > 0 && (!formData.currency || formData.currency === 'USDT')) {
      setFormData(prev => ({
        ...prev,
        currency: coins[0].symbol
      }));
    }
  }, [coins, formData.currency]);

  const handleInputChange = (field: keyof WithdrawalFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAvailableBalance = (currency: string) => {
    // Use wallet balance instead of conversion rates
    const wallet = getWalletByCurrency(currency);
    return wallet?.balance || 0;
  };

  const getUsdValue = (currency: string, amount: number) => {
    const rate = usdRates[currency] || 0;
    return (amount * rate).toFixed(2);
  };



  const getCurrentFee = () => {
    return 0.001; // Mock fee
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
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validate address
      if (!formData.address) {
        toast.error('Please enter withdrawal address');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleSubmit = () => {
    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmWithdrawal = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setShowProgress(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser?.telegramId) {
        throw new Error('User not authenticated');
      }

      const hash = encrypt(currentUser.telegramId);
      
      // Call withdrawal API
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash,
          currency: formData.currency,
          network: formData.network,
          address: formData.address,
          amount: parseFloat(formData.amount),
          memo: formData.memo || ''
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Withdrawal request failed');
      }

      if (data.success) {
        setWithdrawalSuccess(true);
        setErrorMessage('');
        setErrorCode('');
        
        // Refresh wallet data to reflect updated balance
        fetchWallet();
        
        toast.success('Withdrawal request submitted successfully!');
      } else {
        throw new Error(data.message || 'Withdrawal failed');
      }
      

    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawalSuccess(false);
      setErrorMessage(error instanceof Error ? error.message : 'Withdrawal failed. Please try again.');
      setErrorCode('WITHDRAWAL_ERROR');
      
      toast.error(error instanceof Error ? error.message : 'Withdrawal failed');
    } finally {
      setLoading(false);
      setShowProgress(false);
      setShowResult(true);
    }
  };

  const handleRetryWithdrawal = () => {
    setShowResult(false);
    setCurrentStep(2); // Go back to confirmation step
  };

  const handleCloseResult = () => {
    setShowResult(false);
    if (withdrawalSuccess) {
      // Reset form and close on success
      setFormData({
        currency: 'USDT',
        network: 'trc20',
        address: '',
        amount: '',
        memo: ''
      });
      setCurrentStep(0);
      onClose();
    }
  };

  const getNetworkIcon = (network: string) => {
    const icons: Record<string, string> = {
      'trc20': '🔴',
      'erc20': '🔷',
      'bep20': '🟡',
      'polygon': '🟣',
      'bitcoin': '₿',
      'ethereum': 'Ξ',
      'arbitrum': '🔵'
    };
    return icons[network] || '🌐';
  };

  const copyFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleInputChange('address', text);
      Toast.show('Address pasted from clipboard');
    } catch (error) {
      Toast.show('Failed to paste from clipboard');
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

            <Card title="Amount">
              <div className="space-y-4">
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(value) =>
                    handleInputChange('amount', value.target.value)
                  }
                  placeholder="0.00"
                  suffix={
                    <Button
                      size="small"
                      type="link"
                      onClick={() =>
                        handleInputChange(
                          'amount',
                          Math.max(
                            0,
                            getAvailableBalance(formData.currency) - getCurrentFee()
                          ).toString()
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 px-2 py-0 h-auto min-w-0"
                      style={{ fontSize: '12px' }}
                    >
                      Use Max
                    </Button>
                  }
                />


                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold">
                    {getAvailableBalance(formData.currency).toFixed(8)} {formData.currency}
                  </span>
                </div>
              </div>
            </Card>
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
      visible={isOpen}
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
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmWithdrawal}
        currency={formData.currency}
        network={getNetworkName(formData.network)}
        amount={formData.amount}
        address={formData.address}
        networkIcon={getNetworkIcon(formData.network)}
        loading={loading}
      />

      {/* Withdrawal Progress Popup */}
      <WithdrawalProgressPopup
        visible={showProgress}
        currency={formData.currency}
        network={getNetworkName(formData.network)}
        amount={formData.amount}
        address={formData.address}
        networkIcon={getNetworkIcon(formData.network)}
        duration={60}
      />

      {/* Withdrawal Result Popup */}
      <WithdrawalResultPopup
        visible={showResult}
        onClose={handleCloseResult}
        onRetry={handleRetryWithdrawal}
        success={withdrawalSuccess}
        currency={formData.currency}
        network={getNetworkName(formData.network)}
        amount={formData.amount}
        address={formData.address}
        networkIcon={getNetworkIcon(formData.network)}
        errorMessage={errorMessage}
        errorCode={errorCode}
      />
    </Popup>
  );

  function getNetworkName(networkId: string): string {
    const networks: Record<string, string> = {
      'trc20': 'TRON (TRC20)',
      'erc20': 'Ethereum (ERC20)',
      'bep20': 'BSC (BEP20)',
      'polygon': 'Polygon (MATIC)',
      'bitcoin': 'Bitcoin Network',
      'ethereum': 'Ethereum Network',
      'arbitrum': 'Arbitrum One'
    };
    return networks[networkId] || networkId;
  }
}
