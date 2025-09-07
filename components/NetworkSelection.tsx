'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import NetworkSelectionPopup from './NetworkSelectionPopup';
import { 
  selectActiveRpcNodes, 
  selectRpcNodesLoading, 
  fetchRpcNodesRequest 
} from '../modules/public/rpcNodes';
import { selectCoins } from '../modules/private/coin';
 

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

interface NetworkSelectionProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  currency: string;
  title?: string;
  className?: string;
}

export default function NetworkSelection({
  selectedNetwork,
  onNetworkChange,
  currency,
  title = "Network",
  className = "mb-4"
}: NetworkSelectionProps) {
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);

  const handleNetworkSelect = (networkId: string) => {
    onNetworkChange(networkId);
    setShowNetworkPopup(false);
  };

  const dispatch = useDispatch();
  const loading = useSelector(selectRpcNodesLoading);
  const activeRpcNodes = useSelector(selectActiveRpcNodes);
  const coins = useSelector(selectCoins);

  const networkIcons: Record<string, string> = {
    'bsc': 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970',
    'ethereum': 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    'polygon': 'https://assets.coingecko.com/coins/images/32440/standard/polygon.png?1698233684',
    'tron': 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193'
  };

  // Fetch RPC nodes on component mount
  useEffect(() => {
    dispatch(fetchRpcNodesRequest({ isActive: true }));
  }, [dispatch]);

  // Convert coin networks and RPC nodes to Network format
  const availableNetworks = useMemo((): Network[] => {
    const networks: Network[] = [];
    
    // Find the selected coin
    const selectedCoin = coins.find(coin => coin.symbol === currency);
    
    if (!selectedCoin) {
      return networks;
    }

    // Get available networks for this coin
    const coinNetworks = selectedCoin.networks || [];
    
    // Filter networks that have active RPC nodes
    const networkGroups = activeRpcNodes.reduce((acc: Record<string, any[]>, node: any) => {
      if (!acc[node.network]) {
        acc[node.network] = [];
      }
      acc[node.network].push(node);
      return acc;
    }, {});

    coinNetworks.forEach((coinNetwork: any) => {
      // Only include networks that have active RPC nodes
      if (networkGroups[coinNetwork.network] && coinNetwork.isActive !== false) {
        networks.push({
          id: coinNetwork.network,
          name: coinNetwork.network.toUpperCase(),
          symbol: coinNetwork.network.toUpperCase(),
          icon: networkIcons[coinNetwork.network] || selectedCoin.logoUrl || '🌐',
          fee: selectedCoin.fee || 0.001,
          confirmationTime: '1-5 minutes',
          minWithdrawal: selectedCoin.minWithdraw || 0.001,
          maxWithdrawal: selectedCoin.maxWithdraw || 1000,
          isActive: true
        });
      }
    });

    return networks;
  }, [activeRpcNodes, coins, currency]);
  const selectedNetworkData = availableNetworks.find(network => network.id === selectedNetwork);

  const formatFee = (fee: number, currency: string) => {
    if (currency.toUpperCase() === 'PEPE') {
      return fee.toLocaleString();
    }
    return fee.toString();
  };

  return (
    <>
      <Card title={title} className={className}>
        <div
          onClick={() => setShowNetworkPopup(true)}
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
            <div className="w-8 h-8 flex items-center justify-center">
              {selectedNetworkData?.icon && selectedNetworkData.icon.startsWith('http') ? (
                <img
                  src={selectedNetworkData.icon}
                  alt={selectedNetworkData.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-2xl">{selectedNetworkData?.icon || '🌐'}</span>
              )}
            </div>
            <div>
              <div className="font-bold">
                {selectedNetworkData?.name || 'Select Network'}
              </div>
              <div className="text-xs text-gray-600">
                {selectedNetworkData ? (
                  <>Fee: {formatFee(selectedNetworkData.fee, currency)} {currency} • {selectedNetworkData.confirmationTime}</>
                ) : (
                  'Choose withdrawal network'
                )}
              </div>
            </div>
          </div>

          {/* Right side (chevron) */}
          <div className="text-gray-400">▼</div>
        </div>
      </Card>

      {/* Network Selection Popup */}
      <NetworkSelectionPopup
        visible={showNetworkPopup}
        onClose={() => setShowNetworkPopup(false)}
        networks={availableNetworks}
        selectedNetwork={selectedNetwork}
        onNetworkSelect={handleNetworkSelect}
        currency={currency}
        title={`Select ${currency} Network`}
      />
    </>
  );
}
