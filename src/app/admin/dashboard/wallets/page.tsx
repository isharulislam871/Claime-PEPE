'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { AppDispatch } from '@/modules/store';
import {
  fetchWalletsRequest,
  syncBalancesRequest,
  createWalletRequest,
  updateWalletRequest,
  deleteWalletRequest,
  generateWalletRequest,
  fetchTransactionsRequest,
  selectAdminWallets,
  selectAdminWalletsLoading,
  selectAdminWalletsError,
  selectAdminTransactions,
  selectAdminTransactionsLoading,
  selectSyncingBalances
} from '@/modules/private/adminWallets';
 
import WalletTable from '@/components/admin/wallets/WalletTable';
import TransactionTable from '@/components/admin/wallets/TransactionTable';
import WalletModals from '@/components/admin/wallets/WalletModals';

const { TabPane } = Tabs;

export default function WalletsPage() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const wallets = useSelector(selectAdminWallets);
  const transactions = useSelector(selectAdminTransactions);
  const loading = useSelector(selectAdminWalletsLoading);
  const transactionsLoading = useSelector(selectAdminTransactionsLoading);
  const syncingBalances = useSelector(selectSyncingBalances);
  const error = useSelector(selectAdminWalletsError);
  
  // Local state for UI
  const [modalVisible, setModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  useEffect(() => {
    dispatch(fetchWalletsRequest());
    dispatch(fetchTransactionsRequest());
  }, [dispatch]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

 

  const handleRefreshWallets = () => {
    dispatch(fetchWalletsRequest());
  };

  const handleSyncBalances = () => {
    dispatch(syncBalancesRequest());
  };

  const handleRefreshTransactions = () => {
    dispatch(fetchTransactionsRequest(true));
  };

  const handleEditWallet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setModalVisible(true);
  };

  const handleDeleteWallet = async (walletId: string) => {
    dispatch(deleteWalletRequest(walletId));
  };

  const handleGenerateWallet = () => {
    setGenerateModalVisible(true);
  };

  const handleWalletSubmit = async (values: any, isEdit: boolean) => {
    if (isEdit && editingWallet) {
      dispatch(updateWalletRequest(editingWallet._id, values));
    } else {
      dispatch(createWalletRequest(values));
    }
    setModalVisible(false);
    setEditingWallet(null);
  };

  const handleWalletGeneration = async (values: any) => {
    dispatch(generateWalletRequest(values));
  };

  const handleSaveGeneratedWallet = async (values: any) => {
    console.log(values);
    toast.success('Generated wallet saved successfully');
    setGenerateModalVisible(false);
    dispatch(fetchWalletsRequest()); // Refresh wallets list
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefreshWallets}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              icon={<DollarOutlined />}
              onClick={handleSyncBalances}
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
