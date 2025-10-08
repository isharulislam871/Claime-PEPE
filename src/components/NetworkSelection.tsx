'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card  , Empty , Image, Selector  } from 'antd-mobile';
import { useSelector, useDispatch } from 'react-redux';
import NetworkSelectionPopup from './NetworkSelectionPopup';
import { 
  selectActiveRpcNodes, 
  selectRpcNodesLoading, 
  fetchRpcNodesRequest 
} from '../modules/public/rpcNodes';
import { selectCoins } from '../modules/private/coin';
import { networkIcons, NotFoundIcon } from '@/lib/networkIcons';
 

interface Network {
  id: string;
  name: string;
  symbol: string;
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

  // Fetch RPC nodes on component mount
  useEffect(() => {
    dispatch(fetchRpcNodesRequest());
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
      if (networkGroups[coinNetwork.network] ) {
        networks.push({
          id: coinNetwork.network,
          name: coinNetwork.network.toUpperCase(),
          symbol: coinNetwork.network.toUpperCase(),
          fee:   0.0000001,
          confirmationTime: '1-5 minutes',
          minWithdrawal: 0.0002,
          maxWithdrawal: selectedCoin.maxWithdraw || 1000,
          isActive: true
        });
      }
    });

    return networks;
  }, [activeRpcNodes, coins, currency]);


  const selectedNetworkData = availableNetworks.find(network => network.id === selectedNetwork);
 console.log(selectedNetworkData);
  
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
            <div className="w-8 h-8 flex items-center justify-center relative">
              <Image  src={networkIcons[selectedNetworkData?.id as string]} />
             
            </div>
            <div>
              <div className="font-bold">
                {selectedNetworkData?.name || 'Select Network'}
              </div>
              <div className="text-xs text-gray-600">
                {selectedNetworkData ? (
                  <>Fee: { Number(0.0000001).toFixed(8)} {currency} • {selectedNetworkData.confirmationTime}</>
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
        
        selectedNetwork={selectedNetwork}
        onNetworkSelect={handleNetworkSelect}
        currency={currency}
        title={`Select ${currency} Network`}
      />
    </>
  );
}
