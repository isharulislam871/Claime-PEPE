'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Popup,
  SearchBar,
  List,
  Empty,
  Badge,
  Card
} from 'antd-mobile';
import {
  CloseOutline,
  CheckOutline,
  SearchOutline
} from 'antd-mobile-icons';
import { Button } from 'antd';
import { selectWallets } from '@/modules';
import { useSelector } from 'react-redux';
 

interface Currency {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  usdValue: string;
  logoUrl?: string;
  category?: string;
}

interface CoinPrice {
  usd: number;
}

interface CurrencySelectionPopupProps {
  visible: boolean;
  onClose: () => void;
  currencies: Currency[];
  selectedCurrency?: string;
  onCurrencySelect: (currencyId: string) => void;
  title?: string;
  searchPlaceholder?: string;
  showBalance?: boolean;
  showCategories?: boolean;
}






export default function CurrencySelectionPopup({
  visible,
  onClose,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  title = "Select Currency",
  searchPlaceholder = "Search currencies...",
  showBalance = true,
  showCategories = false
}: CurrencySelectionPopupProps) {
  const [searchText, setSearchText] = useState('');
  const [coinPrices, setCoinPrices] = useState<{ [key: string]: number }>({});
  const [priceLoading, setPriceLoading] = useState(false);
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
  const fetchCoinPrices = async (currencySymbols: string[]) => {
    if (!currencySymbols.length) return;
    
    setPriceLoading(true);
    
    try {
      const coinIds = currencySymbols.map(getCoinGeckoId).join(',');
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
      currencySymbols.forEach(currency => {
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

  // Fetch prices when popup opens and currencies are available
  useEffect(() => {
    if (visible && currencies.length > 0) {
      const currencySymbols = currencies.map(currency => currency.symbol);
      fetchCoinPrices(currencySymbols);
    }
  }, [visible, currencies]);
  // Filter currencies based on search text
  const filteredCurrencies = useMemo(() => {
    if (!searchText.trim()) return currencies;
    
    const searchLower = searchText.toLowerCase();
    return currencies.filter(currency =>
      currency.symbol.toLowerCase().includes(searchLower) ||
      currency.name.toLowerCase().includes(searchLower) ||
      currency.category?.toLowerCase().includes(searchLower)
    );
  }, [currencies, searchText]);

  // Group currencies by category if showCategories is true
  const groupedCurrencies = useMemo(() => {
    if (!showCategories) return { 'All Currencies': filteredCurrencies };
    
    return filteredCurrencies.reduce((groups, currency) => {
      const category = currency.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(currency);
      return groups;
    }, {} as Record<string, Currency[]>);
  }, [filteredCurrencies, showCategories]);

  const handleCurrencySelect = (currencyId: string) => {
    onCurrencySelect(currencyId);
    onClose();
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        height: '100vh',
        borderRadius: '0px',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {filteredCurrencies.length > 0 && (
              <Badge content={filteredCurrencies.length} className="bg-blue-500" />
            )}
          </div>
          <CloseOutline 
            className="text-gray-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={setSearchText}
            showCancelButton
            onCancel={handleClearSearch}
          />
        </div>

        {/* Popular Currencies */}
        {!searchText && (
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">Popular</div>
            <div className="flex gap-2 overflow-x-auto">
              {currencies.slice(0, 4).map((currency) => (
                <div
                  key={currency.id}
                  onClick={() => handleCurrencySelect(currency.id)}
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-full border cursor-pointer
                    flex items-center gap-2 min-w-fit
                    ${selectedCurrency === currency.id 
                      ? 'bg-blue-100 border-blue-500 text-blue-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-lg">{currency.icon}</span>
                  <span className="text-sm font-medium">{currency.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {filteredCurrencies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Empty 
                description={searchText ? "No currencies found" : "No currencies available"} 
                image={<SearchOutline className="text-4xl text-gray-300" />}
              />
              {searchText && (
                <Button
                  size="small"
                  type="default"
                  onClick={handleClearSearch}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div>
              {Object.entries(groupedCurrencies).map(([category, categoryItems]) => (
                <div key={category}>
                  {showCategories && Object.keys(groupedCurrencies).length > 1 && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-700">
                        {category} ({categoryItems.length})
                      </div>
                    </div>
                  )}
                  
                  <List>
                    {categoryItems.map((currency) => {
                      const isSelected = selectedCurrency === currency.id;
                      const wallet = wallets.find(wallet => wallet.currency === currency.id);
 
                      return (
                        <List.Item
                          key={currency.id}
                          prefix={
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex items-center justify-center">
                                {currency.logoUrl ? (
                                  <img
                                    src={currency.logoUrl}
                                    alt={currency.symbol}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <span className="text-2xl">{currency.icon}</span>
                                )}
                              </div>
                            </div>
                          }
                          extra={
                            isSelected && (
                              <CheckOutline className="text-blue-500" />
                            )
                          }
                          onClick={() => handleCurrencySelect(currency.id)}
                          className={`cursor-pointer ${
                            isSelected 
                              ? 'bg-blue-50 border-l-4 border-blue-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {currency.symbol}
                              </span>
                              <span className="text-sm text-gray-600">
                                {currency.name}
                              </span>
                            </div>
                            {showBalance && (
                              <div className="text-sm text-gray-600 mt-1">
                                Balance: {wallet?.balance.toFixed(8) || '0.00000000'} {currency.symbol}
                                {priceLoading ? (
                                  <span className="animate-pulse"> (~Loading...)</span>
                                ) : coinPrices[currency.symbol] ? (
                                  <span> (~${((wallet?.balance || 0) * coinPrices[currency.symbol]).toFixed(2)})</span>
                                ) : (
                                  <span> (~$0.00)</span>
                                )}
                              </div>
                            )}
                          </div>
                        </List.Item>
                      );
                    })}
                  </List>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <Button
              block
              danger
              size="large"
              onClick={onClose}
            >
              Cancel
            </Button>
            {selectedCurrency && (
              <Button
                block
                type="primary"
                size="large"
                onClick={() => handleCurrencySelect(selectedCurrency)}
              >
                <CheckOutline className="mr-2" />
                Select {currencies.find(c => c.id === selectedCurrency)?.symbol}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
