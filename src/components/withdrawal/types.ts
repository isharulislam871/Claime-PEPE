export interface WithdrawalStatusProps {
  currency: string;
  network: string;
  amount: string;
  address: string;
  formatAddress: (address: string) => string;
  withdrawal?: any;
  errorMessage?: string;
  errorCode?: string;
}
