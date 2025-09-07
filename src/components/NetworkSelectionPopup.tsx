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

interface Network {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  fee: number;
  confirmationTime: string;
  minWithdrawal: number;
  maxWithdrawal: number;
  isActive: boolean;
}

interface NetworkSelectionPopupProps {
  visible: boolean;
  onClose: () => void;
  networks: Network[];
  selectedNetwork?: string;
  onNetworkSelect: (networkId: string) => void;
  currency: string;
  title?: string;
  searchPlaceholder?: string;
}

export default function NetworkSelectionPopup({
  visible,
  onClose,
  networks,
  selectedNetwork,
  onNetworkSelect,
  currency,
  title = "Select Network",
  searchPlaceholder = "Search networks..."
}: NetworkSelectionPopupProps) {
  const [searchText, setSearchText] = useState('');

  // Filter networks based on search text
  const filteredNetworks = useMemo(() => {
    if (!searchText.trim()) return networks;
    
    const searchLower = searchText.toLowerCase();
    return networks.filter(network =>
      network.name.toLowerCase().includes(searchLower) ||
      network.symbol.toLowerCase().includes(searchLower)
    );
  }, [networks, searchText]);

  const handleNetworkSelect = (networkId: string) => {
    onNetworkSelect(networkId);
    onClose();
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const formatFee = (fee: number, currency: string) => {
    if (currency.toUpperCase() === 'PEPE') {
      return fee.toLocaleString();
    }
    return fee.toString();
  };

  const formatWithdrawalLimits = (min: number, max: number, currency: string) => {
    if (currency.toUpperCase() === 'PEPE') {
      return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    return `${min} - ${max}`;
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
            {filteredNetworks.length > 0 && (
              <Badge content={filteredNetworks.length} className="bg-blue-500" />
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

        {/* Popular Networks */}
        {!searchText && (
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">Recommended</div>
            <div className="flex gap-2 overflow-x-auto">
              {networks.filter(network => network.isActive).slice(0, 3).map((network) => (
                <div
                  key={network.id}
                  onClick={() => handleNetworkSelect(network.id)}
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-full border cursor-pointer
                    flex items-center gap-2 min-w-fit
                    ${selectedNetwork === network.id 
                      ? 'bg-blue-100 border-blue-500 text-blue-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  {network.icon && network.icon.startsWith('http') ? (
                    <img
                      src={network.icon}
                      alt={network.name}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <span className="text-lg">{network.icon}</span>
                  )}
                  <span className="text-sm font-medium">{network.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {filteredNetworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Empty 
                description={searchText ? "No networks found" : "No networks available"} 
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
                {filteredNetworks.map((network) => {
                  const isSelected = selectedNetwork === network.id;
                  
                  return (
                    <List.Item
                      key={network.id}
                      prefix={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                            {network.icon && network.icon.startsWith('http') ? (
                              <img
                                src={network.icon}
                                alt={network.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-2xl">{network.icon}</span>
                            )}
                          </div>
                        </div>
                      }
                      extra={
                        <div className="flex items-center gap-2">
                          {!network.isActive && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Coming Soon
                            </span>
                          )}
                          {isSelected && (
                            <CheckOutline className="text-blue-500" />
                          )}
                        </div>
                      }
                      onClick={() => network.isActive && handleNetworkSelect(network.id)}
                      className={`cursor-pointer ${
                        !network.isActive 
                          ? 'opacity-50 cursor-not-allowed' 
                          : isSelected 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {network.name}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {network.symbol}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Fee:</span> {formatFee(network.fee, currency)} {currency}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Time:</span> {network.confirmationTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Limits:</span> {formatWithdrawalLimits(network.minWithdrawal, network.maxWithdrawal, currency)} {currency}
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

        {/* Network Comparison */}
        {!searchText && filteredNetworks.length > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm font-semibold text-gray-700 mb-2">Quick Comparison</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Lowest Fee:</span>
                <div className="text-green-600">
                  {(() => {
                    const lowestFee = Math.min(...filteredNetworks.filter(n => n.isActive).map(n => n.fee));
                    const network = filteredNetworks.find(n => n.fee === lowestFee && n.isActive);
                    return network ? `${network.name} (${formatFee(lowestFee, currency)} ${currency})` : 'N/A';
                  })()}
                </div>
              </div>
              <div>
                <span className="font-medium">Fastest:</span>
                <div className="text-blue-600">
                  {(() => {
                    const fastest = filteredNetworks.find(n => n.confirmationTime.includes('Instant') && n.isActive) ||
                                   filteredNetworks.find(n => n.confirmationTime.includes('1-2') && n.isActive) ||
                                   filteredNetworks.filter(n => n.isActive)[0];
                    return fastest ? `${fastest.name}` : 'N/A';
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

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
            {selectedNetwork && (
              <Button
                block
                type="primary"
                size="large"
                onClick={() => handleNetworkSelect(selectedNetwork)}
              >
                <CheckOutline className="mr-2" />
                Select {networks.find(n => n.id === selectedNetwork)?.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}
