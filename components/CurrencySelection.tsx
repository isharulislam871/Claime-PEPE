'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { selectCoins } from '../modules/private/coin';
import CurrencySelectionPopup from './CurrencySelectionPopup';
import { useWallet } from '@/hooks/useWallet';

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
  defaultCurrency,
  title = "Currency",
  className = "mb-4"
}: CurrencySelectionProps) {
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
  const coins = useSelector(selectCoins);

  const {  wallets , fetchWallet  } = useWallet();

  useEffect(() => {
    fetchWallet();
  }, [ fetchWallet ]);
  // Set default currency if none is selected
  useEffect(() => {
    if (!selectedCurrency && defaultCurrency) {
      onCurrencyChange(defaultCurrency);
    }
  }, [selectedCurrency, defaultCurrency, onCurrencyChange]);

  const handleCurrencySelect = (currencyId: string) => {
    onCurrencyChange(currencyId);
    setShowCurrencyPopup(false);
  };
 const wallet = wallets.find(wallet => wallet.currency === selectedCurrency);
  // Convert coins to CurrencySelectionPopup format
  const currencyItems = useMemo(() => {
    // Use coins from Redux if available, otherwise use default currencies
    const availableCurrencies = coins || [];
  
    return availableCurrencies.map((coin) => ({
      id: coin.symbol,
      symbol: coin.symbol,
      name: coin.name || coin.symbol,
      icon: coin.icon || '',
      balance: wallets.find(wallet => wallet.currency === coin.symbol)?.balance || 0,
      usdValue: getUsdValue(coin.symbol, wallets.find(wallet => wallet.currency === coin.symbol)?.balance || 0 ),
      logoUrl: ('logoUrl' in coin && coin.logoUrl) ? coin.logoUrl : '',
      category: 'Cryptocurrencies'
    }));
  }, [coins,   getUsdValue]);

 


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
                  <>Balance: { wallet?.balance.toFixed(8)} (~$
                    {getUsdValue(selectedCurrency, wallet?.balance || 0)})</>
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
