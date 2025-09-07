import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { RpcNodeState } from './types';

// Base selector
const selectRpcNodeState = (state: RootState): RpcNodeState => state.public.rpcNodes;

// Basic selectors
export const selectRpcNodes = createSelector(
  [selectRpcNodeState],
  (rpcNodeState) => rpcNodeState.rpcNodes
);

export const selectRpcNodesLoading = createSelector(
  [selectRpcNodeState],
  (rpcNodeState) => rpcNodeState.loading
);

export const selectRpcNodesError = createSelector(
  [selectRpcNodeState],
  (rpcNodeState) => rpcNodeState.error
);

export const selectRpcNodesSuccess = createSelector(
  [selectRpcNodeState],
  (rpcNodeState) => rpcNodeState.success
);

// Advanced selectors
export const selectActiveRpcNodes = createSelector(
  [selectRpcNodes],
  (rpcNodes) => rpcNodes.filter(node => node.isActive)
);

export const selectRpcNodesByNetwork = createSelector(
  [selectRpcNodes],
  (rpcNodes) => (network: string) => 
    rpcNodes.filter(node => node.network === network)
);

export const selectActiveRpcNodesByNetwork = createSelector(
  [selectActiveRpcNodes],
  (activeRpcNodes) => (network: string) => 
    activeRpcNodes.filter(node => node.network === network)
);

export const selectDefaultRpcNodes = createSelector(
  [selectRpcNodes],
  (rpcNodes) => rpcNodes.filter(node => node.isDefault)
);

export const selectDefaultRpcNodeByNetwork = createSelector(
  [selectDefaultRpcNodes],
  (defaultRpcNodes) => (network: string) => 
    defaultRpcNodes.find(node => node.network === network)
);

export const selectOnlineRpcNodes = createSelector(
  [selectRpcNodes],
  (rpcNodes) => rpcNodes.filter(node => node.status === 'online')
);

export const selectRpcNodeById = createSelector(
  [selectRpcNodes],
  (rpcNodes) => (id: string) => 
    rpcNodes.find(node => node._id === id)
);

export const selectRpcNodesByStatus = createSelector(
  [selectRpcNodes],
  (rpcNodes) => (status: 'online' | 'offline' | 'error') => 
    rpcNodes.filter(node => node.status === status)
);

export const selectRpcNodesSortedByPriority = createSelector(
  [selectRpcNodes],
  (rpcNodes) => [...rpcNodes].sort((a, b) => a.priority - b.priority)
);

export const selectBestRpcNodeForNetwork = createSelector(
  [selectActiveRpcNodes],
  (activeRpcNodes) => (network: string) => {
    const networkNodes = activeRpcNodes
      .filter(node => node.network === network)
      .sort((a, b) => {
        // Prioritize online nodes
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (b.status === 'online' && a.status !== 'online') return 1;
        
        // Then by priority
        if (a.priority !== b.priority) return a.priority - b.priority;
        
        // Then by response time (lower is better)
        if (a.responseTime && b.responseTime) {
          return a.responseTime - b.responseTime;
        }
        
        return 0;
      });
    
    return networkNodes[0] || null;
  }
);

export const selectNetworkStats = createSelector(
  [selectRpcNodes],
  (rpcNodes) => {
    const stats: Record<string, {
      total: number;
      active: number;
      online: number;
      offline: number;
      error: number;
      hasDefault: boolean;
    }> = {};
    
    rpcNodes.forEach(node => {
      if (!stats[node.network]) {
        stats[node.network] = {
          total: 0,
          active: 0,
          online: 0,
          offline: 0,
          error: 0,
          hasDefault: false
        };
      }
      
      const networkStats = stats[node.network];
      networkStats.total++;
      
      if (node.isActive) networkStats.active++;
      if (node.isDefault) networkStats.hasDefault = true;
      
      switch (node.status) {
        case 'online':
          networkStats.online++;
          break;
        case 'offline':
          networkStats.offline++;
          break;
        case 'error':
          networkStats.error++;
          break;
      }
    });
    
    return stats;
  }
);
