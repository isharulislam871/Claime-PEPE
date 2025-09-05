'use client';

import { useState, useEffect } from 'react';
import { NavBar, Form, Input, Button, Selector, Modal, Toast, Card, Space, ActionSheet } from 'antd-mobile';
import { LeftOutline, ClockCircleOutline, FileOutline, MoreOutline, SearchOutline, HistogramOutline, DownOutline } from 'antd-mobile-icons';
import { HistoryOutlined } from '@ant-design/icons';
 
 
import { getCurrentUser } from '../lib/api';
import RecentWithdrawals from './RecentWithdrawals';
import ProcessingActionSheet from './ProcessingActionSheet';
import ConfirmationActionSheet from './ConfirmationActionSheet';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserBalance } from '../modules';
 

interface WithdrawFormData {
  currency: string;
  network: string;
  address: string;
  amount: string;
  memo?: string;
}

interface CoinData {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  networks: {
    network: string;
    contractAddress?: string;
    isNative: boolean;
  }[];
}

export default function WithdrawTab() {
  
  const dispatch = useDispatch();
  const mainPepeBalance = useSelector(selectUserBalance);
  
  const [formData, setFormData] = useState<WithdrawFormData>({
    currency: 'USDTX',
    network: 'ethereum',
    address: '',
    amount: '',
    memo: ''
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showNetworkSheet, setShowNetworkSheet] = useState(false);
  const [showRecentWithdrawals, setShowRecentWithdrawals] = useState(false);
  const [showProcessingSheet, setShowProcessingSheet] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [withdrawalFailed, setWithdrawalFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentWithdrawalId, setCurrentWithdrawalId] = useState<string | null>(null);
  
  // Dynamic data from APIs
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [pepeConversionRates, setPepeConversionRates] = useState<Record<string, number>>({});
  const [usdRates, setUsdRates] = useState<Record<string, number>>({});
  const [networkFees, setNetworkFees] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch dynamic data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        
        // Fetch coins
        const coinsResponse = await fetch('/api/coins');
        const coinsData = await coinsResponse.json();
        if (coinsData.success) {
          setCoins(coinsData.coins);
        }

        // Fetch conversion rates
        const ratesResponse = await fetch('/api/conversion-rates');
        const ratesData = await ratesResponse.json();
        if (ratesData.success) {
          setPepeConversionRates(ratesData.pepeConversionRates);
          setUsdRates(ratesData.usdRates);
        }

        // Fetch network fees
        const feesResponse = await fetch('/api/network-fees');
        const feesData = await feesResponse.json();
        if (feesData.success) {
          setNetworkFees(feesData.fees);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show('Failed to load coin data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate available balance for each currency based on main PEPE balance
  const getAvailableBalance = (currency: string) => {
    const rate = pepeConversionRates[currency] || 1;
    return mainPepeBalance / rate;
  };
  
  const getUsdValue = (currency: string, amount: number) => {
    const rate = usdRates[currency] || 0;
    return (amount * rate).toFixed(2);
  };

  // Get logo URL for a currency
  const getCurrencyLogo = (currency: string) => {
    const coin = coins.find(c => c.symbol === currency);
    return coin?.logoUrl || '';
  };

  // Get network logo URL
  const getNetworkLogo = (network: string) => {
    const networkLogos: Record<string, string> = {
      'ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'bsc': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      'polygon': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      'mainnet': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
    };
    return networkLogos[network] || '';
  };

  // Get available networks for a currency
  const getAvailableNetworks = (currency: string) => {
    const coin = coins.find(c => c.symbol === currency);
    return coin?.networks || [];
  };

  const handleInputChange = (field: keyof WithdrawFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'currency' && { 
        network: getAvailableNetworks(value)[0]?.network || 'ethereum' 
      })
    }));
  };

  const getCurrentFee = () => {
    const key = `${formData.currency}-${formData.network}`;
    return networkFees[key] || 0;
  };

  const getReceiveAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = getCurrentFee();
    return Math.max(0, amount - fee);
  };

  // Check withdrawal status
  const checkWithdrawalStatus = async (withdrawalId: string) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?.telegramId) return null;

      const response = await fetch(`/api/withdrawals?telegramId=${currentUser.telegramId}&withdrawalId=${withdrawalId}`);
      const result = await response.json();
      
      if (response.ok && result.withdrawals && result.withdrawals.length > 0) {
        return result.withdrawals[0];
      }
      return null;
    } catch (error) {
      console.error('Error checking withdrawal status:', error);
      return null;
    }
  };

  // Poll withdrawal status
  const pollWithdrawalStatus = async (withdrawalId: string) => {
    const maxAttempts = 30; // Poll for up to 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      attempts++;
      const withdrawal = await checkWithdrawalStatus(withdrawalId);
      
      if (withdrawal) {
        if (withdrawal.status === 'completed') {
          setProcessingStep(4);
          setWithdrawalSuccess(true);
          
          // Auto-close after showing success for 3 seconds
          setTimeout(() => {
            setShowProcessingSheet(false);
         
            setCurrentWithdrawalId(null);
          }, 3000);
          
          return;
        } else if (withdrawal.status === 'failed') {
          setProcessingStep(4);
          setWithdrawalFailed(true);
          setErrorMessage(withdrawal.failureReason || 'Withdrawal failed');
          
          // Auto-close after showing error for 5 seconds
          setTimeout(() => {
            setShowProcessingSheet(false);
            setProcessingStep(0);
            setWithdrawalFailed(false);
            setErrorMessage('');
            setCurrentWithdrawalId(null);
          }, 5000);
          
          return;
        }
      }

      // Continue polling if not completed/failed and haven't exceeded max attempts
      if (attempts < maxAttempts) {
        setTimeout(poll, 10000); // Poll every 10 seconds
      } else {
        // Timeout - assume still processing
        setProcessingStep(3); // Keep showing blockchain confirmation
      }
    };

    // Start polling after initial delay
    setTimeout(poll, 5000); // Wait 5 seconds before first status check
  };

  const handleWithdraw = async () => {
    setShowConfirmModal(false);
    setShowProcessingSheet(true);
    setProcessingStep(0);
    setWithdrawalSuccess(false);
    setWithdrawalFailed(false);
    setErrorMessage('');

    try {
      const currentUser = getCurrentUser();
      if (!currentUser?.telegramId) {
        throw new Error('User not authenticated');
      }

      // Step 1: Validating transaction
      setProcessingStep(1);
      
      // Validate withdrawal data
      const withdrawalData = {
        telegramId: currentUser.telegramId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        network: formData.network,
        address: formData.address,
        memo: formData.memo || ''
      };

      // Client-side validation
      if (withdrawalData.amount <= 0) {
        throw new Error('Invalid withdrawal amount');
      }

      const requiredBalance = formData.currency === 'PEPE' 
        ? withdrawalData.amount + getCurrentFee()
        : (withdrawalData.amount + getCurrentFee()) * (pepeConversionRates[formData.currency as keyof typeof pepeConversionRates] || 1);

      if (mainPepeBalance < requiredBalance) {
        throw new Error('Insufficient balance for withdrawal');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Processing withdrawal - Submit to API
      setProcessingStep(2);
      
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawalData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Withdrawal request failed');
      }

      // Store withdrawal ID for status polling
      const withdrawalId = result.withdrawal._id;
      setCurrentWithdrawalId(withdrawalId);
  
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Confirming on blockchain
      setProcessingStep(3);
      
      // Start polling withdrawal status
      pollWithdrawalStatus(withdrawalId);

    } catch (error: any) {
      console.error('Withdrawal error:', error);
      
      // Step 4: Failed
      setProcessingStep(4);
      setWithdrawalFailed(true);
      setErrorMessage(error.message || 'Withdrawal failed. Please try again.');

      Toast.show({
        content: error.message || 'Withdrawal failed',
        position: 'top'
      });

      // Keep processing sheet open to show error
      setTimeout(() => {
        setShowProcessingSheet(false);
        setProcessingStep(0);
        setWithdrawalFailed(false);
        setErrorMessage('');
        setCurrentWithdrawalId(null);
      }, 5000);
    }
  };


  const right = (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setShowRecentWithdrawals(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <HistoryOutlined className="text-gray-600 text-lg" />
      </button>
    </div>
  )
 

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Binance-Style Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md">
              <DownOutline className="text-white text-xl rotate-180" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Withdraw</h1>
              <p className="text-sm text-gray-500">Send crypto to external wallets</p>
            </div>
          </div>
          {right}
        </div>
      </div>

     

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: '88px' }}>
        <div className="p-4 space-y-4 pb-6">
       
        {/* Currency Selection */}
        <Card title="Currency" style={{ marginBottom: '16px' }}>
          <div 
            onClick={() => setShowCurrencySheet(true)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={getCurrencyLogo(formData.currency)} 
                alt={formData.currency}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{formData.currency}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Balance: {getAvailableBalance(formData.currency).toFixed(8)} (~${getUsdValue(formData.currency, getAvailableBalance(formData.currency))})
                </div>
              </div>
            </div>
            <div style={{ color: '#999' }}>▼</div>
          </div>
        </Card>

        {/* Network Selection */}
        <Card title="Network" style={{ marginBottom: '16px' }}>
          <div 
            onClick={() => setShowNetworkSheet(true)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={getNetworkLogo(formData.network)} 
                alt={formData.network}
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{formData.network.toUpperCase()}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Fee: {getCurrentFee()} {formData.currency}
                </div>
              </div>
            </div>
            <div style={{ color: '#999' }}>▼</div>
          </div>
        </Card>

        {/* Withdrawal Address */}
        <Card title="Withdrawal Address" style={{ marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Input
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              placeholder="Enter wallet address"
              clearable
            />
            <div 
              style={{ 
                position: 'absolute', 
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                padding: '4px',
                zIndex: 10
              }}
              onClick={() => {
                navigator.clipboard.readText().then(text => {
                  handleInputChange('address', text);
                  Toast.show('Address pasted');
                }).catch(() => Toast.show('Failed to paste'));
              }}
            >
              <FileOutline style={{ color: '#F0B90B', fontSize: '16px' }} />
            </div>
          </div>
        </Card>

        {/* Memo (if needed) */}
       
          <Card title="Memo (Optional)" style={{ marginBottom: '16px' }}>
            <Input
              value={formData.memo}
              onChange={(value) => handleInputChange('memo', value)}
              placeholder="Enter memo if required"
              clearable
            />
          </Card>
  

        {/* Amount */}
        <Card 
          title="Amount" 
          extra={
            <Button 
              size="small" 
              fill="none" 
              color="primary"
              onClick={() => handleInputChange('amount', Math.max(0, getAvailableBalance(formData.currency) - getCurrentFee()).toString())}
            >
              Max
            </Button>
          }
          style={{ marginBottom: '16px' }}
        >
          <Input
            type="number"
            value={formData.amount}
            onChange={(value) => handleInputChange('amount', value)}
            placeholder="0.00"
            
            clearable
          />
        </Card>

        {/* Transaction Summary */}
        {formData.amount && (
          <Card title="Transaction Summary" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Amount</span>
                <span>{formData.amount} {formData.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Network Fee</span>
                <span>{getCurrentFee()} {formData.currency}</span>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>You'll Receive</span>
                  <span style={{ color: '#F0B90B' }}>{getReceiveAmount().toFixed(4)} {formData.currency}</span>
                </div>
              </div>
            </Space>
          </Card>
        )}

        {/* Withdraw Button */}
        <Button
          block
          color="warning"
          size="large"
          onClick={() => setShowConfirmModal(true)}
          disabled={!formData.address || !formData.amount || parseFloat(formData.amount) <= 0}
          style={{ marginBottom: '16px' }}
        >
          Withdraw
        </Button>

          {/* Security Notice */}
          <Card title="Security Tips" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%', fontSize: '14px' }}>
              <div>• Double-check the withdrawal address</div>
              <div>• Ensure the network matches your destination wallet</div>
              <div>• Withdrawals are irreversible once confirmed</div>
            </Space>
          </Card>
        </div>
      </div>

      {/* Currency ActionSheet */}
      <ActionSheet
        visible={showCurrencySheet}
        actions={coins.map(coin => ({
          key: coin.symbol,
          text: (
            <div style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={coin.logoUrl || ''} 
                alt={coin.symbol}
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{coin.symbol}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  Balance: {getAvailableBalance(coin.symbol).toFixed(8)} (~${getUsdValue(coin.symbol, getAvailableBalance(coin.symbol))})
                </div>
              </div>
            </div>
          ),
          onClick: () => {
            handleInputChange('currency', coin.symbol);
            setShowCurrencySheet(false);
          }
        }))}
        onClose={() => setShowCurrencySheet(false)}
        cancelText="Cancel"
      />

      {/* Network ActionSheet */}
      <ActionSheet
        visible={showNetworkSheet}
        actions={getAvailableNetworks(formData.currency).map(networkConfig => {
          const feeKey = `${formData.currency}-${networkConfig.network}`;
          const networkFee = networkFees[feeKey] || 0;
          return {
            key: networkConfig.network,
            text: (
              <div style={{ textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={getNetworkLogo(networkConfig.network)} 
                  alt={networkConfig.network}
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{networkConfig.network.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Network Fee: {networkFee} {formData.currency}
                  </div>
                </div>
              </div>
            ),
            onClick: () => {
              handleInputChange('network', networkConfig.network);
              setShowNetworkSheet(false);
            }
          };
        })}
        onClose={() => setShowNetworkSheet(false)}
        cancelText="Cancel"
      />

      {/* Confirmation ActionSheet */}
      <ConfirmationActionSheet
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleWithdraw}
        isLoading={isLoading}
        formData={formData}
        getCurrentFee={getCurrentFee}
        getReceiveAmount={getReceiveAmount}
      />

      {/* Processing ActionSheet */}
      <ProcessingActionSheet
        visible={showProcessingSheet}
        processingStep={processingStep}
        withdrawalSuccess={withdrawalSuccess}
        withdrawalFailed={withdrawalFailed}
        errorMessage={errorMessage}
        onClose={() => {
          setShowProcessingSheet(false);
          setProcessingStep(0);
          setWithdrawalFailed(false);
          setErrorMessage('');
          setCurrentWithdrawalId(null);
        }}
        formData={formData}
      />

      {/* Recent Withdrawals Popup */}
      <RecentWithdrawals
        isOpen={showRecentWithdrawals}
        onClose={() => setShowRecentWithdrawals(false)}
       telegramId='123456789'
      />
    </div>
  );
}