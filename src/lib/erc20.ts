import { ethers } from 'ethers';
import mongoose from 'mongoose';
import RpcNode from '@/models/RpcNode';
import Wallet from '@/models/Wallet';
import connectDB from '@/lib/mongodb';

// Standard ERC20 ABI for transfer function
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

interface ERC20TransferParams {
  tokenAddress: string;
  toAddress: string;
  amount: string;
  network?: 'mainnet' | 'sepolia' | 'bsc' | 'bsc-testnet';
  gasLimit?: string;
  gasPrice?: string;
}

interface ERC20TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
}

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

class ERC20Service {
  private providers: { [key: string]: ethers.JsonRpcProvider } = {};
  private wallet: ethers.Wallet | null = null;
  private rpcNodes: { [key: string]: any[] } = {};

  constructor() {
    // Wallet will be initialized dynamically from database
  }

  private async initializeWallet(network: string = 'mainnet') {
    try {
      await connectDB();
      
      // Find an active hot wallet for the specified network
      const walletDoc = await Wallet.findOne({
        type: 'hot',
        status: 'active',
        network: network
      }).select('+privateKey'); // Explicitly include privateKey field
      
      if (walletDoc && walletDoc.privateKey) {
        this.wallet = new ethers.Wallet(walletDoc.privateKey);
        return this.wallet;
      }
      
      // Fallback to environment variable if no database wallet found
      const privateKey = process.env.WALLET_PRIVATE_KEY;
      if (privateKey) {
        this.wallet = new ethers.Wallet(privateKey);
        return this.wallet;
      }
      
      throw new Error('No wallet private key found in database or environment variables');
    } catch (error) {
      console.error('Error initializing wallet:', error);
      throw error;
    }
  }

  private async initializeProviders() {
    try {
      await connectDB();
      
      // Fetch active RPC nodes
      const activeNodes = await RpcNode.find({
        isActive: true,
        status: { $in: ['online', 'offline'] }
      }).sort({ network: 1, priority: 1, isDefault: -1 });

      // Group nodes by network
      this.rpcNodes = activeNodes.reduce((acc: any, node: any) => {
        if (!acc[node.network]) {
          acc[node.network] = [];
        }
        acc[node.network].push(node);
        return acc;
      }, {});

      // Initialize providers for each network
      for (const [network, nodes] of Object.entries(this.rpcNodes)) {
        if (nodes.length > 0) {
          const primaryNode = nodes[0]; // Use highest priority node
          this.providers[network] = new ethers.JsonRpcProvider(primaryNode.url);
        }
      }

    
    } catch (error) {
      console.error('Error initializing RPC providers:', error);
    
    }
  }

  private async getProvider(network: string = 'mainnet'): Promise<ethers.JsonRpcProvider> {
    // Initialize providers if not already done
    if (Object.keys(this.providers).length === 0) {
      await this.initializeProviders();
    }
    
    // Try to get provider for the requested network
    let provider = this.providers[network];
    
    // If provider doesn't exist or fails, try fallback nodes
    if (!provider && this.rpcNodes[network]) {
      for (const node of this.rpcNodes[network]) {
        try {
          const testProvider = new ethers.JsonRpcProvider(node.url);
          await testProvider.getBlockNumber(); // Test connection
          this.providers[network] = testProvider;
          provider = testProvider;
          
          // Update node status to online
          await RpcNode.findByIdAndUpdate(node._id, {
            status: 'online',
            lastChecked: new Date()
          });
          
          break;
        } catch (error) {
          console.warn(`RPC node ${node.url} failed:`, error);
          
          // Update node status to error
          await RpcNode.findByIdAndUpdate(node._id, {
            status: 'error',
            lastChecked: new Date()
          });
        }
      }
    }
    
    return provider || this.providers.mainnet || new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  }

  private async getConnectedWallet(network: string = 'mainnet'): Promise<ethers.Wallet> {
    if (!this.wallet) {
      await this.initializeWallet(network);
    }
    
    if (!this.wallet) {
      throw new Error('Failed to initialize wallet from database or environment variables.');
    }
    
    const provider = await this.getProvider(network);
    return this.wallet.connect(provider);
  }

  async getTokenInfo(tokenAddress: string, network: string = 'mainnet'): Promise<TokenInfo | null> {
    try {
      const provider = await this.getProvider(network);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);

      let balance = '0';
      if (this.wallet) {
        balance = await contract.balanceOf(this.wallet.address);
        balance = ethers.formatUnits(balance, decimals);
      }

      return {
        name,
        symbol,
        decimals: Number(decimals),
        balance
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }

  async getBalance(tokenAddress: string, walletAddress: string, network : string ): Promise<string> {
    try {
      const provider = await this.getProvider(network);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async getNativeBalance(network: string = 'mainnet'): Promise<string> {
    try {
      const wallet = await this.getConnectedWallet(network);
      const provider = await this.getProvider(network);
      console.log(wallet)
      const balance = await provider.getBalance(wallet.address);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting native balance:', error);
      return '0';
    }
  }

  async transferToken(params: ERC20TransferParams): Promise<ERC20TransferResult> {
    try {
      const {
        tokenAddress,
        toAddress,
        amount,
        network = 'mainnet',
        gasLimit,
        gasPrice
      } = params;

      console.log('Transfer params:', { tokenAddress, toAddress, amount, network, gasLimit, gasPrice });

      const wallet = await this.getConnectedWallet(network);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

      // Get token decimals
      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);

      console.log('Token decimals:', decimals, 'Amount in wei:', amountInWei.toString());

      // Check wallet balance first
      const provider = wallet.provider;
      if (!provider) {
        throw new Error('Wallet provider is not available');
      }
      const walletBalance = await provider.getBalance(wallet.address);
      console.log('Wallet ETH balance:', ethers.formatEther(walletBalance));

      // Check token balance
      const tokenBalance = await contract.balanceOf(wallet.address);
      console.log('Wallet token balance:', ethers.formatUnits(tokenBalance, decimals));

      if (tokenBalance < amountInWei) {
        throw new Error(`Insufficient token balance. Required: ${ethers.formatUnits(amountInWei, decimals)}, Available: ${ethers.formatUnits(tokenBalance, decimals)}`);
      }

      // Prepare transaction options
      const txOptions: any = {};
      if (gasLimit) {
        txOptions.gasLimit = gasLimit;
      }
      if (gasPrice) {
        // gasPrice is already in gwei format from estimateGas, convert to wei
        txOptions.gasPrice = ethers.parseUnits(gasPrice.toString(), 'gwei');
      }

      console.log('Transaction options:', txOptions);

      // Execute transfer
      const transaction = await contract.transfer(toAddress, amountInWei, txOptions);
      console.log('Transaction sent:', transaction.hash);
      
      // Wait for transaction confirmation
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('ERC20 transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async estimateGas(params: ERC20TransferParams): Promise<{ gasLimit: string; gasPrice: string } | null> {
    try {
      const {
        tokenAddress,
        toAddress,
        amount,
        network = 'mainnet'
      } = params;

      const wallet = await this.getConnectedWallet(network);
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
      const provider = await this.getProvider(network);

      // Get token decimals
      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);

      // Estimate gas limit
      const gasLimit = await contract.transfer.estimateGas(toAddress, amountInWei);
      
      // Get current gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei')
      };
    } catch (error) {
      console.error('Gas estimation error:', error);
      return null;
    }
  }

  
}

export default new ERC20Service();
