'use client';

import { useState, useEffect } from 'react';
import { NavBar, Form, Input, Button, Selector, Modal, Toast, Card, Space, ActionSheet } from 'antd-mobile';
import { LeftOutline, ClockCircleOutline, FileOutline, MoreOutline, SearchOutline, HistogramOutline, DownOutline } from 'antd-mobile-icons';
import { HistoryOutlined } from '@ant-design/icons';
 
 
import { getCurrentUser } from '../lib/api';
import RecentWithdrawals from './RecentWithdrawals';
import ProcessingActionSheet from './ProcessingActionSheet';
import ConfirmationActionSheet from './ConfirmationActionSheet';
import CurrencySelection from './CurrencySelection';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserBalance } from '../modules';
import { 
  fetchCoinsRequest, 
  fetchConversionRatesRequest,
  selectCoins,
  selectPepeConversionRates,
  selectUsdRates,
  selectCoinLoading,
  selectCoinError
} from '../modules/private/coin';
import InviteFriendsEarn from './InviteFriendsEarn';
import NewWithdrawal from './NewWithdrawal';
import NewProfile from './NewProfile';
import NewEarn from './NewEarn';
import NewHome from './NewHome';
 

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
  const coins = useSelector(selectCoins);
 
  const [formData, setFormData] = useState<WithdrawFormData>({
    currency: 'USDT', // Default fallback
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNetworkSheet, setShowNetworkSheet] = useState(false);
  const [showRecentWithdrawals, setShowRecentWithdrawals] = useState(false);
  const [showProcessingSheet, setShowProcessingSheet] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [withdrawalFailed, setWithdrawalFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentWithdrawalId, setCurrentWithdrawalId] = useState<string | null>(null);
  
  
  const pepeConversionRates = useSelector(selectPepeConversionRates);
  const usdRates = useSelector(selectUsdRates);
  const coinLoading = useSelector(selectCoinLoading);
  const coinError = useSelector(selectCoinError);
  
  // Local state for network fees and other data
  const [networkFees, setNetworkFees] = useState<Record<string, number>>({});
 

  // Fetch dynamic data from Redux and APIs
  useEffect(() => {
    // Dispatch Redux actions to fetch coins and conversion rates
    dispatch(fetchCoinsRequest());
    dispatch(fetchConversionRatesRequest());
    
    const fetchNetworkFees = async () => {
      try {
        
        // Fetch network fees (keep this as direct API call for now)
        const feesResponse = await fetch('/api/network-fees');
        const feesData = await feesResponse.json();
        if (feesData.success) {
          setNetworkFees(feesData.fees);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Toast.show('Failed to load coin data');
      } finally {
    
      }
    };

    fetchNetworkFees();
  }, [dispatch]);

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
        <CurrencySelection
          selectedCurrency={formData.currency}
          onCurrencyChange={(currency) => handleInputChange('currency', currency)}
          getAvailableBalance={getAvailableBalance}
          getUsdValue={getUsdValue}
          getCurrencyLogo={getCurrencyLogo}
          title="Currency"
        />


     {/* Network Selection */}
<Card title="Network" className="mb-4">
  <div
    onClick={() => setShowNetworkSheet(true)}
    className="
      px-4 py-3
      border border-gray-300 rounded-md
      bg-white cursor-pointer
      flex justify-between items-center
      hover:bg-gray-50
    "
  >
    {/* Left side */}
    <div className="flex items-center gap-3">
      <img
        src={getNetworkLogo(formData.network)}
        alt={formData.network}
        className="w-6 h-6 rounded-full"
      />
      <div>
        <div className="font-bold">{formData.network.toUpperCase()}</div>
        <div className="text-xs text-gray-600">
          Fee: {getCurrentFee()} {formData.currency}
        </div>
      </div>
    </div>

    {/* Right side (chevron) */}
    <div className="text-gray-400">▼</div>
  </div>
</Card>


       {/* Withdrawal Address */}
<Card title="Withdrawal Address" className="mb-4">
  <div className="relative">
    <Input
      value={formData.address}
      onChange={(value) => handleInputChange('address', value)}
      placeholder="Enter wallet address"
      clearable
      className="pr-10" // add space for the paste button
    />

    {/* Paste button */}
    <div
      className="
        absolute right-2 top-1/2 -translate-y-1/2
        cursor-pointer p-1 z-10
      "
      onClick={() => {
        navigator.clipboard.readText()
          .then(text => {
            handleInputChange('address', text);
            Toast.show('Address pasted');
          })
          .catch(() => Toast.show('Failed to paste'));
      }}
    >
      <FileOutline className="text-[#F0B90B] text-base" />
    </div>
  </div>
</Card>


      {/* Memo (Optional) */}
<Card title="Memo (Optional)" className="mb-4">
  <Input
    value={formData.memo}
    onChange={(value) => handleInputChange('memo', value)}
    placeholder="Enter memo if required"
    clearable
    className="w-full"
  />
</Card>

  

       {/* Amount */}
<Card
  title="Amount"
  className="mb-4"
  extra={
    <Button
      size="small"
      fill="none"
      color="primary"
      onClick={() =>
        handleInputChange(
          'amount',
          Math.max(0, getAvailableBalance(formData.currency) - getCurrentFee()).toString()
        )
      }
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      Max
    </Button>
  }
>
  <Input
    type="number"
    value={formData.amount}
    onChange={(value) => handleInputChange('amount', value)}
    placeholder="0.00"
    clearable
    className="w-full"
  />
</Card>


       {/* Transaction Summary */}
{formData.amount && (
  <Card title="Transaction Summary" className="mb-4">
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between">
        <span>Amount</span>
        <span>
          {formData.amount} {formData.currency}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Network Fee</span>
        <span>
          {getCurrentFee()} {formData.currency}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-2">
        <div className="flex justify-between font-bold">
          <span>You&apos;ll Receive</span>
          <span className="text-[#F0B90B]">
            {getReceiveAmount().toFixed(4)} {formData.currency}
          </span>
        </div>
      </div>
    </div>
  </Card>
)}


         {/* Withdraw Button */}
<Button
  block
  color="warning"
  size="large"
  onClick={() => setShowConfirmModal(true)}
  disabled={
    !formData.address || !formData.amount || parseFloat(formData.amount) <= 0
  }
  className="mb-4"
>
  Withdraw
</Button>

          {/* Security Notice */}
<Card title="Security Tips" className="mb-4">
  <div className="flex flex-col gap-1 text-sm w-full">
    <div>• Double-check the withdrawal address</div>
    <div>• Ensure the network matches your destination wallet</div>
    <div>• Withdrawals are irreversible once confirmed</div>
  </div>
</Card>
        </div>
      </div>



     {/* Network ActionSheet */}
<ActionSheet
  visible={showNetworkSheet}
  actions={getAvailableNetworks(formData.currency).map((networkConfig) => {
    const feeKey = `${formData.currency}-${networkConfig.network}`;
    const networkFee = networkFees[feeKey] || 0;

    return {
      key: networkConfig.network,
      text: (
        <div className="w-full flex items-center gap-3 text-left">
          <img
            src={getNetworkLogo(networkConfig.network)}
            alt={networkConfig.network}
            className="w-6 h-6 rounded-full"
          />
          <div>
            <div className="font-bold text-base">
              {networkConfig.network.toUpperCase()}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              Network Fee: {networkFee} {formData.currency}
            </div>
          </div>
        </div>
      ),
      onClick: () => {
        handleInputChange('network', networkConfig.network);
        setShowNetworkSheet(false);
      },
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
        
      />
    {/*   <InviteFriendsEarn isOpen={true} onClose={() =>  console.log('close')} /> */}
    {/*  <NewWithdrawal isOpen={true} onClose={() => console.log('close')} /> */}
    {/*  <NewProfile isOpen={true} onClose={() => console.log('close')} /> */}

    {/* <NewEarn isOpen={true} onClose={() => console.log('close')}  /> */}
    <NewHome  isOpen={true} onClose={() => console.log('close')} 
/>
    </div>
  );
}