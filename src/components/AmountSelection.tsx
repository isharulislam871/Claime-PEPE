'use client';

import { useState, useEffect } from 'react';
import { Card } from 'antd-mobile';
import AmountSelectionPopup from './AmountSelectionPopup';

interface AmountSelectionProps {
  selectedAmount?: string;
  onAmountChange: (amount: string) => void;
  currency: string;
  getAvailableBalance: (currency: string) => number;
  getUsdValue: (currency: string, amount: number) => string;
  convertUsdToCurrency: (usdAmount: number, currency: string) => string;
  title?: string;
  className?: string;
}

export default function AmountSelection({
  selectedAmount,
  onAmountChange,
  currency,
  getAvailableBalance,
  getUsdValue,
  convertUsdToCurrency,
  title = "Amount",
  className = "mb-4"
}: AmountSelectionProps) {
  const [showAmountPopup, setShowAmountPopup] = useState(false);
  const [coinPrice, setCoinPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

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

  // Fetch price from CoinGecko API
  const fetchCoinPrice = async (currency: string) => {
    if (!currency) return;
    
    setPriceLoading(true);
    
    try {
      const coinId = getCoinGeckoId(currency);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
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
      
      if (data[coinId]?.usd) {
        setCoinPrice(data[coinId].usd);
      } else {
        setCoinPrice(null);
      }
    } catch (error) {
      console.error('Error fetching coin price:', error);
      setCoinPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  // Fetch price when currency changes
  useEffect(() => {
    if (currency) {
      fetchCoinPrice(currency);
    }
  }, [currency]);

  const handleAmountSelect = (amount: string) => {
    onAmountChange(amount);
    setShowAmountPopup(false);
  };

  const availableBalance = getAvailableBalance(currency);

  return (
    <>
      <Card title={title} className={className}>
        <div
          onClick={() => setShowAmountPopup(true)}
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
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">$</span>
            </div>
            <div>
              <div className="font-bold">
                {selectedAmount ? (
                  <>
                    {parseFloat(selectedAmount).toFixed(4)} {currency}
                  </>
                ) : (
                  'Select Amount'
                )}
              </div>
              <div className="text-xs text-gray-600">
                {selectedAmount ? (
                  priceLoading ? (
                    <span className="animate-pulse">≈ Loading USD...</span>
                  ) : coinPrice ? (
                    <>≈ ${(parseFloat(selectedAmount) * coinPrice).toFixed(2)} USD</>
                  ) : (
                    <>≈ $0.00 USD</>
                  )
                ) : (
                  <>Available: {availableBalance.toFixed(8)} {currency}
                    {priceLoading ? (
                      <span className="animate-pulse"> (~Loading...)</span>
                    ) : coinPrice ? (
                      <span> (~${(availableBalance * coinPrice).toFixed(2)})</span>
                    ) : (
                      <span> (~$0.00)</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side (chevron) */}
          <div className="text-gray-400">▼</div>
        </div>
      </Card>

      {/* Amount Selection Popup */}
      <AmountSelectionPopup
        visible={showAmountPopup}
        onClose={() => setShowAmountPopup(false)}
        title="Select Amount"
        currency={currency}
        selectedAmount={selectedAmount}
        onAmountSelect={handleAmountSelect}
        getAvailableBalance={getAvailableBalance}
        getUsdValue={getUsdValue}
        convertUsdToCurrency={convertUsdToCurrency}
        searchPlaceholder="Search amounts..."
        coinPrice={coinPrice}
        priceLoading={priceLoading}
      />
    </>
  );
}
