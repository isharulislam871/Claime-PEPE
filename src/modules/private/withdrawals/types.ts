export interface Withdrawal {
  _id: string;
  amount: number;
  currency: string;
  coinLogo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  walletId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
  telegramId: string;
}

export interface WithdrawalsState {
  recentWithdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
  isRecentWithdrawalsOpen: boolean;
}

export interface FetchWithdrawalsPayload {
  telegramId: string;
}

export interface FetchWithdrawalsSuccessPayload {
  withdrawals: Withdrawal[];
}

export interface FetchWithdrawalsFailurePayload {
  error: string;
}
