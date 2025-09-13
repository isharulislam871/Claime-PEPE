export interface Wallet {
  _id: string;
  address: string;
  type: 'hot' | 'cold';
  currency: string;
  balance: number;
  status: 'active' | 'inactive' | 'maintenance';
  network?: 'eth-main' | 'sepolia' | 'bsc-mainnet' | 'bsc-testnet';
  createdAt: string;
  lastTransaction?: string;
}

export interface Transaction {
  _id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: string;
}
