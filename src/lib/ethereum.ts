import { ethers } from 'ethers';

interface EthTransferParams {
  toAddress: string;
  amount: string; // Amount in ETH
  network?: 'eth-main' | 'sepolia' | 'bsc-mainnet' | 'bsc-testnet';
  gasLimit?: string;
  gasPrice?: string;
}

interface EthTransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
}

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

class EthereumService {
  private providers: { [key: string]: ethers.JsonRpcProvider };
  private wallet: ethers.Wallet | null = null;

  // Network configurations
  private networks: { [key: string]: NetworkConfig } = {
    'eth-main': {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    },
    'sepolia': {
      name: 'Sepolia Testnet',
      chainId: 11155111,
      rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 }
    },
    'bsc-mainnet': {
      name: 'Binance Smart Chain',
      chainId: 56,
      rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',
      nativeCurrency: { name: 'Binance Coin', symbol: 'BNB', decimals: 18 }
    },
    'bsc-testnet': {
      name: 'BSC Testnet',
      chainId: 97,
      rpcUrl: process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      nativeCurrency: { name: 'Test BNB', symbol: 'tBNB', decimals: 18 }
    }
  };

  constructor() {
    this.providers = {};
    
    // Initialize providers for each network
    Object.entries(this.networks).forEach(([key, config]) => {
      this.providers[key] = new ethers.JsonRpcProvider(config.rpcUrl);
    });

    // Initialize wallet if private key is provided
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey);
    }
  }

  private getProvider(network: string = 'eth-main'): ethers.JsonRpcProvider {
    return this.providers[network] || this.providers['eth-main'];
  }

  private getConnectedWallet(network: string = 'eth-main'): ethers.Wallet {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Please set WALLET_PRIVATE_KEY environment variable.');
    }
    return this.wallet.connect(this.getProvider(network));
  }

  async getBalance(address: string, network: string = 'eth-main'): Promise<string> {
    try {
      const provider = this.getProvider(network);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting ETH balance:', error);
      return '0';
    }
  }

  async getWalletBalance(network: string = 'eth-main'): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return this.getBalance(this.wallet.address, network);
  }

  async transferEth(params: EthTransferParams): Promise<EthTransferResult> {
    try {
      const {
        toAddress,
        amount,
        network = 'eth-main',
        gasLimit,
        gasPrice
      } = params;

      const wallet = this.getConnectedWallet(network);
      
      // Prepare transaction
      const transaction: any = {
        to: toAddress,
        value: ethers.parseEther(amount)
      };

      // Add gas settings if provided
      if (gasLimit) {
        transaction.gasLimit = gasLimit;
      }
      if (gasPrice) {
        transaction.gasPrice = ethers.parseUnits(gasPrice, 'gwei');
      }

      // Send transaction
      const txResponse = await wallet.sendTransaction(transaction);
      
      // Wait for confirmation
      const receipt = await txResponse.wait();

      return {
        success: true,
        transactionHash: receipt?.hash,
        gasUsed: receipt?.gasUsed.toString()
      };
    } catch (error) {
      console.error('ETH transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async estimateGas(params: EthTransferParams): Promise<{ gasLimit: string; gasPrice: string; totalCost: string } | null> {
    try {
      const {
        toAddress,
        amount,
        network = 'eth-main'
      } = params;

      const provider = this.getProvider(network);
      
      // Estimate gas limit
      const gasLimit = await provider.estimateGas({
        to: toAddress,
        value: ethers.parseEther(amount)
      });

      // Get current gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');

      // Calculate total cost
      const totalGasCost = gasLimit * gasPrice;
      const totalCost = ethers.formatEther(totalGasCost);

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        totalCost
      };
    } catch (error) {
      console.error('Gas estimation error:', error);
      return null;
    }
  }

  async getTransactionStatus(txHash: string, network: string = 'eth-main'): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    gasUsed?: string;
    confirmations?: number;
  } | null> {
    try {
      const provider = this.getProvider(network);
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { status: 'pending' };
      }

      const currentBlock = await provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        confirmations
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return null;
    }
  }

  async getTransactionHistory(address: string, network: string = 'eth-main', limit: number = 10): Promise<any[]> {
    try {
      const provider = this.getProvider(network);
      
      // Note: This is a basic implementation. For production, you'd want to use
      // services like Etherscan API or Alchemy's enhanced APIs for transaction history
      const currentBlock = await provider.getBlockNumber();
      const transactions = [];
      
      // This is a simplified version - in production you'd use proper indexing services
      for (let i = 0; i < Math.min(limit, 100); i++) {
        const block = await provider.getBlock(currentBlock - i, true);
        if (block && block.transactions) {
          const relevantTxs = block.transactions.filter((tx: any) => 
            tx.from === address || tx.to === address
          );
          transactions.push(...relevantTxs);
          
          if (transactions.length >= limit) break;
        }
      }
      
      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  getNetworkInfo(network: string = 'eth-main'): NetworkConfig | null {
    return this.networks[network] || null;
  }

  getAllNetworks(): { [key: string]: NetworkConfig } {
    return this.networks;
  }

  // Utility function to validate Ethereum address
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Utility function to format amounts
  formatEther(wei: string): string {
    return ethers.formatEther(wei);
  }

  parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }
}

export default new EthereumService();
