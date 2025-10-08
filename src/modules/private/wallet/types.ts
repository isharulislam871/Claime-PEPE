export interface WalletData {
  currency: string;
  balance: number;
  lockedBalance: number;
  walletAddress: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalSwaps: number;
  lastTransactionAt?: Date;
}

export interface UserData {
  telegramId: string;
  username: string;
  balance: number;
  totalEarned: number;
}

export interface TransactionData {
  transactionId: string;
  type: string;
  action: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: Date;
}

export interface WalletState {
  loading: boolean;
  error: string | null;
  user: UserData | null;
  wallets: WalletData[];
  totalBalance: {
    available: number;
    locked: number;
  };
  recentTransactions: TransactionData[];
}
 

export interface FetchWalletRequest {
  userId: string;
}

export interface FetchWalletResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: {
    user: UserData;
    wallets: WalletData[];
    totalBalance: {
      available: number;
      locked: number;
    };
    recentTransactions: TransactionData[];
  };
}
