'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Popup,
  Button,
  Card,
  Input,
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
  selectCoins,
  selectPepeConversionRates,
  selectUsdRates
} from '../modules/private/coin';
import CurrencySelection from './CurrencySelection';
import { getCurrentUser } from '@/lib/api';

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

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    currency: 'USDT',
    network: 'ethereum',
    address: '',
    amount: '',
    memo: ''
  });

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
    const rate = pepeConversionRates[currency] || 1;
    return mainPepeBalance / rate;
  };
  
  const getUsdValue = (currency: string, amount: number) => {
    const rate = usdRates[currency] || 0;
    return (amount * rate).toFixed(2);
  };

  const getCurrencyLogo = (currency: string) => {
    return `https://cryptologos.cc/logos/${currency.toLowerCase()}-${currency.toLowerCase()}-logo.png`;
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
        Toast.show('Please select currency and enter valid amount');
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validate address
      if (!formData.address) {
        Toast.show('Please enter withdrawal address');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitWithdrawal = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Toast.show({
        content: 'Withdrawal request submitted successfully!',
        icon: 'success'
      });
      onClose();
      setCurrentStep(0);
      setFormData({
        currency: 'USDT',
        network: 'ethereum',
        address: '',
        amount: '',
        memo: ''
      });
    } catch (error) {
      Toast.show({
        content: 'Failed to submit withdrawal request',
        icon: 'fail'
      });
    } finally {
      setLoading(false);
    }
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
              getCurrencyLogo={getCurrencyLogo}
              title="Select Currency"
            />

            <Card title="Amount">
              <div className="space-y-4">
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(value) => handleInputChange('amount', value)}
                  placeholder="0.00"
                  clearable
                />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-semibold">
                    {getAvailableBalance(formData.currency).toFixed(8)} {formData.currency}
                  </span>
                </div>
                
                <Button 
                  size="small" 
                  fill="outline"
                  onClick={() => handleInputChange('amount', Math.max(0, getAvailableBalance(formData.currency) - getCurrentFee()).toString())}
                >
                  Use Max
                </Button>
              </div>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Card title="Withdrawal Address">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    placeholder="Enter wallet address"
                    clearable
                  />
                  <Button 
                    size="small" 
                    fill="none"
                    onClick={copyFromClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <FileOutline />
                  </Button>
                </div>
                
                <Input
                  value={formData.memo}
                  onChange={(value) => handleInputChange('memo', value)}
                  placeholder="Memo (optional)"
                  clearable
                />
              </div>
            </Card>
          </div>
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
              fill='none' 
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
                fill="outline" 
                size="large"
                onClick={handlePreviousStep}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button 
                color="primary" 
                size="large"
                onClick={handleNextStep}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button 
                color="primary" 
                size="large"
                onClick={handleSubmitWithdrawal}
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
