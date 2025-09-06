'use client';

import { useState } from 'react';
import { Card, ActionSheet } from 'antd-mobile';
import { useSelector } from 'react-redux';
import { selectCoins } from '../modules/private/coin';

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
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const coins = useSelector(selectCoins);

  const handleCurrencySelect = (currency: string) => {
    onCurrencyChange(currency);
    setShowCurrencySheet(false);
  };

  return (
    <>
      <Card title={title} className={className}>
        <div
          onClick={() => setShowCurrencySheet(true)}
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

      {/* Currency ActionSheet */}
      <ActionSheet
        visible={showCurrencySheet}
        actions={coins.map((coin) => ({
          key: coin.symbol,
          text: (
            <div className="w-full flex items-center gap-3 text-left">
              <img
                src={coin.logoUrl || getCurrencyLogo(coin.symbol)}
                alt={coin.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-bold text-base">{coin.symbol}</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Balance: {getAvailableBalance(coin.symbol).toFixed(8)} (~$
                  {getUsdValue(coin.symbol, getAvailableBalance(coin.symbol))})
                </div>
              </div>
            </div>
          ),
          onClick: () => handleCurrencySelect(coin.symbol),
        }))}
        onClose={() => setShowCurrencySheet(false)}
        cancelText="Cancel"
      />
    </>
  );
}
