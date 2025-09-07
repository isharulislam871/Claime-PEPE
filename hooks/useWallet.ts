import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWalletRequest, 
  refreshWallet,
  clearWalletData,
  selectWalletLoading,
  selectWalletError,
  selectUser,
  selectWallets,
  selectTotalBalance,
  selectRecentTransactions,
  selectPointsWallet,
  selectWalletByCurrency,
  selectIsWalletDataLoaded
} from '@/modules/private/wallet';
import { encrypt } from '@/lib/authlib';
import { getCurrentUser } from '@/lib/api';

export const useWallet = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);
  const user = useSelector(selectUser);
  const wallets = useSelector(selectWallets);
  const totalBalance = useSelector(selectTotalBalance);
  const recentTransactions = useSelector(selectRecentTransactions);
  const pointsWallet = useSelector(selectPointsWallet);
  const isDataLoaded = useSelector(selectIsWalletDataLoaded);

  // Actions
  const fetchWallet = useCallback(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.telegramId) {
      const userId = encrypt(currentUser.telegramId);
      dispatch(fetchWalletRequest({ userId }));
    }
  }, [dispatch]);

  const refreshWalletData = useCallback(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.telegramId) {
      const userId = encrypt(currentUser.telegramId);
      dispatch(refreshWallet({ userId }));
    }
  }, [dispatch]);

  const clearWallet = useCallback(() => {
    dispatch(clearWalletData());
  }, [dispatch]);

  const getWalletByCurrency = useCallback((currency: string) => {
    return wallets.find(wallet => wallet.currency === currency);
  }, [wallets]);

  return {
    // State
    loading,
    error,
    user,
    wallets,
    totalBalance,
    recentTransactions,
    pointsWallet,
    isDataLoaded,
    
    // Actions
    fetchWallet,
    refreshWalletData,
    clearWallet,
    getWalletByCurrency
  };
};
