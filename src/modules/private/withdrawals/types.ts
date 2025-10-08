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
  // New withdrawal creation state
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  createdWithdrawal: Withdrawal | null;
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

// New withdrawal creation types
export interface CreateWithdrawalPayload {
 
  currency: string;
  network: string;
  address: string;
  amount: number;
  memo?: string;
}

export interface CreateWithdrawalSuccessPayload {
  withdrawal: Withdrawal;
  message: string;
}

export interface CreateWithdrawalFailurePayload {
  error: string;
}
