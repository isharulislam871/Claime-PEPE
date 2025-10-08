'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd-mobile';
import { useDispatch, useSelector } from 'react-redux';
import { selectCoins } from '../modules/private/coin';
import CurrencySelectionPopup from './CurrencySelectionPopup';
import { selectWallets , fetchWalletRequest  } from '@/modules';
import { getCurrentUser } from '@/lib/api';
import { AppDispatch } from '@/modules/store';
 

interface CurrencySelectionProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  getAvailableBalance: (currency: string) => number;
  getUsdValue: (currency: string, amount: number) => string;
  defaultCurrency?: string;
  title?: string;
  className?: string;
}

export default function CurrencySelection({
  selectedCurrency,
  onCurrencyChange,
  getAvailableBalance,
  getUsdValue,
   
  title = "Currency",
  className = "mb-4"
}: CurrencySelectionProps) {
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
  const [coinPrices, setCoinPrices] = useState<{ [key: string]: number }>({});
  const [priceLoading, setPriceLoading] = useState(false);
  const coins = useSelector(selectCoins);
  const dispatch = useDispatch<AppDispatch>();
  const wallets = useSelector(selectWallets);

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

  // Fetch prices for all currencies
  const fetchCoinPrices = async (currencies: string[]) => {
    if (!currencies.length) return;
    
    setPriceLoading(true);
    
    try {
      const coinIds = currencies.map(getCoinGeckoId).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`,
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
      
      // Map back to currency symbols
      const priceMap: { [key: string]: number } = {};
      currencies.forEach(currency => {
        const coinId = getCoinGeckoId(currency);
        if (data[coinId]?.usd) {
          priceMap[currency] = data[coinId].usd;
        }
      });
      
      setCoinPrices(priceMap);
    } catch (error) {
      console.error('Error fetching coin prices:', error);
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.telegramId) {
      dispatch(fetchWalletRequest({ userId: String(currentUser.telegramId) }));
    }
  }, [dispatch]);

  // Fetch prices when coins are available
  useEffect(() => {
    if (coins && coins.length > 0) {
      const currencies = coins.map(coin => coin.symbol);
      fetchCoinPrices(currencies);
    }
  }, [coins]);
  // Set default currency if none is selected
  useEffect(() => {
    if (!selectedCurrency  ) {
      onCurrencyChange(coins[0].symbol);
 
    }
  }, [selectedCurrency , coins ,  onCurrencyChange]);

  const handleCurrencySelect = (currencyId: string) => {
    onCurrencyChange(currencyId);
    setShowCurrencyPopup(false);
  };
 const wallet = wallets.find(wallet => wallet.currency === selectedCurrency);
  // Convert coins to CurrencySelectionPopup format
  const currencyItems = useMemo(() => {
    // Use coins from Redux if available, otherwise use default currencies
    const availableCurrencies = coins || [];
  
    return availableCurrencies.map((coin) => {
      const walletBalance = wallets.find(wallet => wallet.currency === coin.symbol)?.balance || 0;
      const coinPrice = coinPrices[coin.symbol] || 0;
      const usdValue = coinPrice > 0 ? (walletBalance * coinPrice).toFixed(2) : '0.00';
      
      return {
        id: coin.symbol,
        symbol: coin.symbol,
        name: coin.name || coin.symbol,
        icon: coin.icon || '',
        balance: walletBalance,
        usdValue: usdValue,
        logoUrl: ('logoUrl' in coin && coin.logoUrl) ? coin.logoUrl : '',
        category: 'Cryptocurrencies'
      };
    });
  }, [coins, wallets, coinPrices]);

 
 

  return (
    <>
      <Card title={title} className={className}>
        <div
          onClick={() => setShowCurrencyPopup(true)}
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
              src={(() => {
                const selectedCoin = coins.find(coin => coin.symbol === selectedCurrency);
                return (selectedCoin?.logoUrl) ? selectedCoin.logoUrl : '';
              })()}
              alt={selectedCurrency}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-bold">{selectedCurrency || 'Select Currency'}</div>
              <div className="text-xs text-gray-600">
                {selectedCurrency ? (
                  <>Balance: {wallet?.balance.toFixed(8)} {selectedCurrency} 
                    {priceLoading ? (
                      <span className="animate-pulse"> (~Loading...)</span>
                    ) : coinPrices[selectedCurrency] ? (
                      <span> (~${((wallet?.balance || 0) * coinPrices[selectedCurrency]).toFixed(2)})</span>
                    ) : (
                      <span> (~$0.00)</span>
                    )}
                  </>
                ) : (
                  'Loading currencies...'
                )}
              </div>
            </div>
          </div>

          {/* Right side (chevron) */}
          <div className="text-gray-400">▼</div>
        </div>
      </Card>

      {/* Currency Selection Popup */}
      <CurrencySelectionPopup
        visible={showCurrencyPopup}
        onClose={() => setShowCurrencyPopup(false)}
        title="Select Currency"
        currencies={currencyItems}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={handleCurrencySelect}
        searchPlaceholder="Search currencies..."
        showBalance={true}
        showCategories={false}
      />
    </>
  );
}
