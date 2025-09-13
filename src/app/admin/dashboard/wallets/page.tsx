'use client';

import { useState, useEffect } from 'react';
import { 
  Button, 
  Space,
  Tabs
} from 'antd';
import { 
  ReloadOutlined,
  DollarOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Wallet, Transaction } from '@/types/wallet';
import WalletStatistics from '@/components/admin/wallets/WalletStatistics';
import WalletTable from '@/components/admin/wallets/WalletTable';
import TransactionTable from '@/components/admin/wallets/TransactionTable';
import WalletModals from '@/components/admin/wallets/WalletModals';

const { TabPane } = Tabs;

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const [syncingBalances, setSyncingBalances] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

 

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/wallets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallets');
      }
      
      const data = await response.json();
      setWallets(data.wallets || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

  const syncAllBalances = async () => {
    setSyncingBalances(true);
    try {
      const response = await fetch(`/api/admin/wallets/sync-balances`);
      
      if (!response.ok) {
        throw new Error('Failed to sync balances');
      }
      
      const data = await response.json();
      toast.success(data.message);
      await fetchWallets(); // Refresh wallet data
    } catch (error) {
      console.error('Error syncing balances:', error);
      toast.error('Failed to sync balances');
    } finally {
      setSyncingBalances(false);
    }
  };

  

  const fetchTransactions = async (refresh = false) => {
    setTransactionsLoading(true);
    try {
      const url = refresh 
        ? '/api/admin/wallets/transactions?refresh=true' 
        : '/api/admin/wallets/transactions';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
      
      if (refresh) {
        toast.success('Transactions refreshed from blockchain');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleRefreshTransactions = () => {
    fetchTransactions(true);
  };

  const handleEditWallet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setModalVisible(true);
  };

  const handleDeleteWallet = async (walletId: string) => {
    try {
      const response = await fetch(`/api/admin/wallets/${walletId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete wallet');
      }
      
      setWallets(wallets.filter(w => w._id !== walletId));
      toast.success('Wallet deleted successfully');
    } catch (error: any) {
      console.error('Error deleting wallet:', error);
      toast.error(error.message || 'Failed to delete wallet');
    }
  };

  const handleGenerateWallet = () => {
    setGenerateModalVisible(true);
  };

  const handleWalletSubmit = async (values: any, isEdit: boolean) => {
    try {
      if (isEdit && editingWallet) {
        // Update wallet
        const response = await fetch(`/api/admin/wallets/${editingWallet._id}`, {
          method: 'PUT',
          body: JSON.stringify(values)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update wallet');
        }
        
        const data = await response.json();
        const updatedWallets = wallets.map(w => 
          w._id === editingWallet._id ? data.wallet : w
        );
        setWallets(updatedWallets);
        toast.success('Wallet updated successfully');
      } else {
        // Add new wallet
        const response = await fetch('/api/admin/wallets', {
          method: 'POST',
          body: JSON.stringify(values)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create wallet');
        }
        
        const data = await response.json();
        setWallets([...wallets, data.wallet]);
        toast.success('Wallet added successfully');
      }
      setModalVisible(false);
      setEditingWallet(null);
    } catch (error: any) {
      console.error('Error saving wallet:', error);
      toast.error(error.message || 'Failed to save wallet');
    }
  };

  const handleWalletGeneration = async (values: any) => {
    try {
      const response = await fetch('/api/admin/wallets/generate', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate wallet');
      }
      
      const data = await response.json();
      toast.success('Wallet generated successfully!');
      return data.wallet;
    } catch (error: any) {
      console.error('Error generating wallet:', error);
      toast.error(error.message || 'Failed to generate wallet');
      throw error;
    }
  };

  const handleSaveGeneratedWallet = async (values: any) => {
    try {
      console.log(values);
      toast.success('Generated wallet saved successfully');
      setGenerateModalVisible(false);
      await fetchWallets(); // Refresh wallets list
    } catch (error: any) {
      toast.error(error.message || 'Failed to save generated wallet');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchWallets}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              icon={<DollarOutlined />}
              onClick={syncAllBalances}
              loading={syncingBalances}
            >
              Sync Balances 
            </Button>
            <Button 
              icon={<KeyOutlined />}
              onClick={handleGenerateWallet}
            >
              Generate Wallet
            </Button>
          </Space>
        </div>

        <WalletStatistics wallets={wallets} />
      </div>

      <Tabs defaultActiveKey="wallets">
        <TabPane tab="Wallets" key="wallets">
          <WalletTable 
            wallets={wallets}
            loading={loading}
            onEdit={handleEditWallet}
            onDelete={handleDeleteWallet}
           
            selectedNetwork={selectedNetwork}
          />
        </TabPane>

        <TabPane tab="Recent Transactions" key="transactions">
          <TransactionTable 
            transactions={transactions} 
            loading={transactionsLoading}
            onRefresh={handleRefreshTransactions}
          />
        </TabPane>
      </Tabs>

      <WalletModals
        modalVisible={modalVisible}
        generateModalVisible={generateModalVisible}
        editingWallet={editingWallet}
        onModalClose={() => {
          setModalVisible(false);
          setEditingWallet(null);
        }}
        onGenerateModalClose={() => setGenerateModalVisible(false)}
        onWalletSubmit={handleWalletSubmit}
        onWalletGeneration={handleWalletGeneration}
        onSaveGeneratedWallet={handleSaveGeneratedWallet}
      />
    </div>
  );
}
