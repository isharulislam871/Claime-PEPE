'use client';

import { useState, useMemo } from 'react';
import { Card } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { selectCoins } from '../modules/private/coin';
import CurrencySelectionPopup from './CurrencySelectionPopup';

interface CurrencySelectionProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  getAvailableBalance: (currency: string) => number;
  getUsdValue: (currency: string, amount: number) => string;
  getCurrencyLogo: (currency: string) => string;
  title?: string;
  className?: string;
}

export default function CurrencySelection({
  selectedCurrency,
  onCurrencyChange,
  getAvailableBalance,
  getUsdValue,
  getCurrencyLogo,
  title = "Currency",
  className = "mb-4"
}: CurrencySelectionProps) {
  const [showCurrencyPopup, setShowCurrencyPopup] = useState(false);
  const coins = useSelector(selectCoins);

  const handleCurrencySelect = (currencyId: string) => {
    onCurrencyChange(currencyId);
    setShowCurrencyPopup(false);
  };

  // Default currencies
  const defaultCurrencies = [
    { symbol: 'USDT', name: 'Tether USD', icon: '💵' },
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'PEPE', name: 'Pepe', icon: '🐸' }
  ];

  // Convert coins to CurrencySelectionPopup format
  const currencyItems = useMemo(() => {
    // Use coins from Redux if available, otherwise use default currencies
    const availableCurrencies = coins.length > 0 ? coins : defaultCurrencies;
    
    return availableCurrencies.map((coin) => ({
      id: coin.symbol,
      symbol: coin.symbol,
      name: coin.name || coin.symbol,
      icon: coin.icon || '💰',
      balance: getAvailableBalance(coin.symbol),
      usdValue: getUsdValue(coin.symbol, getAvailableBalance(coin.symbol)),
      logoUrl: getCurrencyLogo(coin.symbol),
      category: 'Cryptocurrencies'
    }));
  }, [coins, getAvailableBalance, getUsdValue, getCurrencyLogo]);

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
              src={getCurrencyLogo(selectedCurrency)}
              alt={selectedCurrency}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-bold">{selectedCurrency || 'Select Currency'}</div>
              <div className="text-xs text-gray-600">
                {selectedCurrency ? (
                  <>Balance: {getAvailableBalance(selectedCurrency).toFixed(8)} (~$
                  {getUsdValue(selectedCurrency, getAvailableBalance(selectedCurrency))})</>
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
