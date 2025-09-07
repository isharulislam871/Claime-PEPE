'use client';

import React, { useState, useMemo } from 'react';
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
import { useWallet } from '@/hooks/useWallet';

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


 
const swapOptions: any[] = [
  {
    label: 'Bitcoin (BTC)',
    value: 'btc',
    rate: 0.0000000006, // Approximate rate
    description: '~1.67M pts = 0.001 BTC'
  },
  {
    label: 'Ethereum (ETH)',
    value: 'eth',
    rate: 0.000000015, // Approximate rate
    description: '~66.7K pts = 0.001 ETH'
  },
  {
    label: 'USDT',
    value: 'usdt',
    rate: 0.000025,
    description: '40,000 pts = 1 USDT'
  },
  {
    label: 'BNB',
    value: 'bnb',
    rate: 0.0000018, // Approximate rate
    description: '~555 pts = 0.001 BNB'
  }
];

function convertPointsToCrypto(points: number, coin: string): number {
  const option = swapOptions.find(opt => opt.value === coin);
  if (!option) throw new Error(`Unsupported coin: ${coin}`);
  return points * option.rate;
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
  const {  wallets  } = useWallet();
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
                                Balance: {wallet?.balance.toFixed(8)} (~${convertPointsToCrypto(wallet?.balance || 0, 'usdt')}) .......
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
