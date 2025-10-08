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

interface AmountOption {
  id: string;
  usdAmount: number;
  currencyAmount: string;
  isAffordable: boolean;
  displayText: string;
}

interface AmountSelectionPopupProps {
  visible: boolean;
  onClose: () => void;
  currency: string;
  selectedAmount?: string;
  onAmountSelect: (amount: string) => void;
  getAvailableBalance: (currency: string) => number;
  getUsdValue: (currency: string, amount: number) => string;
  convertUsdToCurrency: (usdAmount: number, currency: string) => string;
  title?: string;
  searchPlaceholder?: string;
  coinPrice?: number | null;
  priceLoading?: boolean;
}

export default function AmountSelectionPopup({
  visible,
  onClose,
  currency,
  selectedAmount,
  onAmountSelect,
  getAvailableBalance,
  getUsdValue,
  convertUsdToCurrency,
  title = "Select Amount",
  searchPlaceholder = "Search amounts...",
  coinPrice,
  priceLoading = false
}: AmountSelectionPopupProps) {
  const [searchText, setSearchText] = useState('');

  // Predefined USD amounts for quick selection
  const predefinedUsdAmounts = [0.2, 0.5, 0.9, 5, 6, 10, 15];

  // Convert USD amounts to amount options
  const amountOptions = useMemo(() => {
    const availableBalance = getAvailableBalance(currency);
    
    return predefinedUsdAmounts.map(usdAmount => {
      let currencyAmount: string;
      
      if (coinPrice && coinPrice > 0) {
        // Use real CoinGecko price
        const cryptoAmount = usdAmount / coinPrice;
        currencyAmount = cryptoAmount.toFixed(8);
      } else {
        // Fallback to old method
        currencyAmount = convertUsdToCurrency(usdAmount, currency);
      }
      
      const isAffordable = parseFloat(currencyAmount) <= availableBalance;
      
      return {
        id: usdAmount.toString(),
        usdAmount,
        currencyAmount,
        isAffordable,
        displayText: `$${usdAmount} USD`
      };
    });
  }, [predefinedUsdAmounts, currency, getAvailableBalance, convertUsdToCurrency, coinPrice]);

  // Filter amounts based on search text
  const filteredAmounts = useMemo(() => {
    if (!searchText.trim()) return amountOptions;

    const searchLower = searchText.toLowerCase();
    return amountOptions.filter(option =>
      option.displayText.toLowerCase().includes(searchLower) ||
      option.currencyAmount.includes(searchText) ||
      option.usdAmount.toString().includes(searchText)
    );
  }, [amountOptions, searchText]);

  const handleAmountSelect = (currencyAmount: string) => {
    onAmountSelect(currencyAmount);
    onClose();
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const availableBalance = getAvailableBalance(currency);

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
            {filteredAmounts.length > 0 && (
              <Badge content={filteredAmounts.length} className="bg-blue-500" />
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

        {/* Currency Info */}
        <div className="p-4 border-b border-gray-100 bg-blue-50">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Selected Currency: <span className="font-semibold text-blue-600">{currency}</span></p>
            <p className="text-sm text-gray-500">
              Available Balance: {availableBalance.toFixed(8)} {currency}
              {priceLoading ? (
                <span className="animate-pulse"> (~Loading...)</span>
              ) : coinPrice ? (
                <span> (~${(availableBalance * coinPrice).toFixed(2)})</span>
              ) : (
                <span> (~$0.00)</span>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {priceLoading ? (
                <span className="animate-pulse">Loading exchange rate...</span>
              ) : coinPrice ? (
                <>Exchange Rate: 1 USD = {(1 / coinPrice).toFixed(8)} {currency}</>
              ) : (
                <>Exchange Rate: 1 USD = {convertUsdToCurrency(1, currency)} {currency}</>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {filteredAmounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Empty
                description={searchText ? "No amounts found" : "No amounts available"}
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
              <List>
                {filteredAmounts.map((option) => {
                  const isSelected = selectedAmount === option.currencyAmount;

                  return (
                    <List.Item
                      key={option.id}
                      prefix={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-lg">$</span>
                          </div>
                        </div>
                      }
                      extra={
                        <div className="flex items-center gap-2">
                          {!option.isAffordable && (
                            <span className="text-xs bg-red-200 text-red-600 px-2 py-1 rounded">
                              Insufficient Balance
                            </span>
                          )}
                          {isSelected && (
                            <CheckOutline className="text-blue-500" />
                          )}
                        </div>
                      }
                      onClick={() => option.isAffordable && handleAmountSelect(option.currencyAmount)}
                      className={`cursor-pointer ${!option.isAffordable
                          ? 'opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-lg">
                            ${option.usdAmount}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            USD
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Amount:</span> {parseFloat(option.currencyAmount).toFixed(4)} {currency}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span> 
                            <span className={option.isAffordable ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                              {option.isAffordable ? '✓ Available' : '✗ Insufficient Balance'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  );
                })}
              </List>
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
            {selectedAmount && (
              <Button
                block
                type="primary"
                size="large"
                onClick={() => handleAmountSelect(selectedAmount)}
              >
                <CheckOutline className="mr-2" />
                Confirm Selection
              </Button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
