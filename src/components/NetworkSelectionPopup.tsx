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
import { 
  selectActiveRpcNodes, 
  selectRpcNodesLoading, 
  fetchRpcNodesRequest 
} from '../modules/public/rpcNodes';
import { useSelector, useDispatch } from 'react-redux';
import { networkIcons, networkNames, NotFoundIcon } from '../lib/networkIcons';
 
interface NetworkSelectionPopupProps {
  visible: boolean;
  onClose: () => void;
  selectedNetwork?: string;
  onNetworkSelect: (networkId: string) => void;
  currency: string;
  title?: string;
  searchPlaceholder?: string;
}

export default function NetworkSelectionPopup({
  visible,
  onClose,

  selectedNetwork,
  onNetworkSelect,
  currency,
  title = "Select Network",
  searchPlaceholder = "Search networks..."
}: NetworkSelectionPopupProps) {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  
  // Redux selectors
  const rpcNodes = useSelector(selectActiveRpcNodes);
  const loading = useSelector(selectRpcNodesLoading);

  // Helper functions for network data
  const getNetworkIcon = (network: string) => {
    return networkIcons[network.toLowerCase()] || null;
  };

  

  const getConfirmationTime = (network: string) => {
    const times: Record<string, string> = {
      'ethereum': '2-5 minutes',
      'bitcoin': '10-60 minutes',
      'binance': '1-2 minutes',
      'polygon': 'Instant',
      'avalanche': 'Instant',
      'solana': 'Instant',
      'cardano': '5-10 minutes',
      'polkadot': '6-12 seconds',
      'chainlink': '2-5 minutes',
      'litecoin': '2-5 minutes'
    };
    return times[network.toLowerCase()] || '1-5 minutes';
  };
 

  const getMaxWithdrawal = (network: string) => {
    const maxs: Record<string, number> = {
      'ethereum': 100,
      'bitcoin': 10,
      'binance': 1000,
      'polygon': 10000,
      'avalanche': 1000,
      'solana': 10000,
      'cardano': 100000,
      'polkadot': 10000,
      'chainlink': 10000,
      'litecoin': 1000
    };
    return maxs[network.toLowerCase()] || 1000;
  };

  // Transform RPC nodes to network format
  const networks = useMemo(() => {
    return rpcNodes.map(node => ({
      id: node._id,
      name: node.network,
      symbol: node.network.toUpperCase(),
      icon: getNetworkIcon(node.network),
      fee: Number(0.0000001).toFixed(8),
      confirmationTime: getConfirmationTime(node.network),
      minWithdrawal: 0.0002,
      maxWithdrawal: getMaxWithdrawal(node.network),
      isActive: node.isActive && node.status === 'online'
    }));
  }, [rpcNodes]);

  // Fetch RPC nodes on component mount
  useEffect(() => {
    if (visible && rpcNodes.length === 0) {
      dispatch(fetchRpcNodesRequest({ isActive: true }));
    }
  }, [visible, dispatch, rpcNodes.length]);

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

 

  const formatWithdrawalLimits = (min: number, max: number, currency: string) => {
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
                  onClick={() => handleNetworkSelect(network.name)}
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-full border cursor-pointer
                    flex items-center gap-2 min-w-fit
                    ${selectedNetwork === network.id
                      ? 'bg-blue-100 border-blue-500 text-blue-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  {network.icon ? (
                    <img
                      src={network.icon}
                      alt={network.name}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5">
                      <NotFoundIcon networkName={network.name} size={20} />
                    </div>
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
                  const isSelected = selectedNetwork === network.name;

                  return (
                    <List.Item
                      key={network.id}
                      prefix={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center">
                            {network.icon ? (
                              <img
                                src={network.icon}
                                alt={network.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10">
                                <NotFoundIcon networkName={network.name} size={40} />
                              </div>
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
                      onClick={() => network.isActive && handleNetworkSelect(network.name)}
                      className={`cursor-pointer ${!network.isActive
                          ? 'opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                         
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {networkNames[network.name]}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Fee:</span> { network.fee } {currency}
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
 
        
      </div>
    </Popup>
  );
}
