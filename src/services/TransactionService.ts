import { ethers } from 'ethers';

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  status: number;
  tokenTransfers?: TokenTransfer[];
}

export interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
}

class TransactionService {
  private getProvider(network: string): ethers.JsonRpcProvider {
    const rpcUrls = {
      mainnet: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
      bsc: process.env.BSC_RPC_URL || 'https://bsc-rpc.publicnode.com',
      'bsc-testnet': process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    };

    const rpcUrl = rpcUrls[network as keyof typeof rpcUrls];
    if (!rpcUrl) {
      throw new Error(`Unsupported network: ${network}`);
    }

    return new ethers.JsonRpcProvider(rpcUrl);
  }

  async getTransactionHistory(
    address: string, 
    network: string, 
    limit: number = 50,
    offset: number = 0
  ): Promise<BlockchainTransaction[]> {
    try {
      const provider = this.getProvider(network);
      
      // Get latest block number
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10k blocks
      
      // For Ethereum mainnet, we'll use a more comprehensive approach
      if (network === 'mainnet') {
        return await this.getEthereumTransactions(address, provider, fromBlock, latestBlock, limit, offset);
      } else {
        return await this.getBSCTransactions(address, provider, fromBlock, latestBlock, limit, offset);
      }
    } catch (error) {
      console.error(`Error fetching transactions for ${address} on ${network}:`, error);
      throw error;
    }
  }

  private async getEthereumTransactions(
    address: string,
    provider: ethers.JsonRpcProvider,
    fromBlock: number,
    toBlock: number,
    limit: number,
    offset: number
  ): Promise<BlockchainTransaction[]> {
    const transactions: BlockchainTransaction[] = [];
    
    try {
      // Get ERC-20 token transfers - make separate calls for from/to
      const fromFilter = {
        fromBlock,
        toBlock,
        topics: [
          ethers.id('Transfer(address,address,uint256)'), // Transfer event signature
          ethers.zeroPadValue(address, 32), // from address
          null // any to address
        ]
      };

      const toFilter = {
        fromBlock,
        toBlock,
        topics: [
          ethers.id('Transfer(address,address,uint256)'), // Transfer event signature
          null, // any from address
          ethers.zeroPadValue(address, 32)  // to address
        ]
      };

      // Get logs for both directions
      const [fromLogs, toLogs] = await Promise.all([
        provider.getLogs(fromFilter).catch(() => []),
        provider.getLogs(toFilter).catch(() => [])
      ]);

      const logs = [...fromLogs, ...toLogs];
      
      // Process logs and get transaction details
      const txHashes = [...new Set(logs.map(log => log.transactionHash))];
      
      for (const txHash of txHashes.slice(offset, offset + limit)) {
        try {
          const [tx, receipt] = await Promise.all([
            provider.getTransaction(txHash),
            provider.getTransactionReceipt(txHash)
          ]);

          if (tx && receipt) {
            const block = await provider.getBlock(receipt.blockNumber);
            
            transactions.push({
              hash: tx.hash,
              blockNumber: receipt.blockNumber,
              from: tx.from,
              to: tx.to || '',
              value: tx.value.toString(),
              gasUsed: receipt.gasUsed.toString(),
              gasPrice: tx.gasPrice?.toString() || '0',
              timestamp: block?.timestamp || 0,
              status: receipt.status || 0,
              tokenTransfers: await this.parseTokenTransfers(receipt, provider)
            });
          }
        } catch (txError) {
          console.error(`Error processing transaction ${txHash}:`, txError);
        }
      }
    } catch (error) {
      console.error('Error fetching Ethereum transactions:', error);
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  private async getBSCTransactions(
    address: string,
    provider: ethers.JsonRpcProvider,
    fromBlock: number,
    toBlock: number,
    limit: number,
    offset: number
  ): Promise<BlockchainTransaction[]> {
    const transactions: BlockchainTransaction[] = [];
    
    try {
      // Get BEP-20 token transfers - need to make separate calls for from/to
      const fromFilter = {
        fromBlock,
        toBlock,
        topics: [
          ethers.id('Transfer(address,address,uint256)'), // Transfer event signature
          ethers.zeroPadValue(address, 32), // from address
          null // any to address
        ]
      };

      const toFilter = {
        fromBlock,
        toBlock,
        topics: [
          ethers.id('Transfer(address,address,uint256)'), // Transfer event signature
          null, // any from address
          ethers.zeroPadValue(address, 32)  // to address
        ]
      };

      // Get logs for both directions
      const [fromLogs, toLogs] = await Promise.all([
        provider.getLogs(fromFilter).catch(() => []),
        provider.getLogs(toFilter).catch(() => [])
      ]);

      const logs = [...fromLogs, ...toLogs];
      
      // Process logs and get transaction details
      const txHashes = [...new Set(logs.map(log => log.transactionHash))];
      
      // Also get native BNB transactions by scanning recent blocks
      const nativeTxHashes = await this.getBNBTransactions(address, provider, fromBlock, toBlock);
      
      // Combine all transaction hashes
      const allTxHashes = [...new Set([...txHashes, ...nativeTxHashes])];
      
      for (const txHash of allTxHashes.slice(offset, offset + limit)) {
        try {
          const [tx, receipt] = await Promise.all([
            provider.getTransaction(txHash),
            provider.getTransactionReceipt(txHash)
          ]);

          if (tx && receipt) {
            const block = await provider.getBlock(receipt.blockNumber);
            
            transactions.push({
              hash: tx.hash,
              blockNumber: receipt.blockNumber,
              from: tx.from,
              to: tx.to || '',
              value: tx.value.toString(),
              gasUsed: receipt.gasUsed.toString(),
              gasPrice: tx.gasPrice?.toString() || '0',
              timestamp: block?.timestamp || 0,
              status: receipt.status || 0,
              tokenTransfers: await this.parseTokenTransfers(receipt, provider)
            });
          }
        } catch (txError) {
          console.error(`Error processing BSC transaction ${txHash}:`, txError);
        }
      }
    } catch (error) {
      console.error('Error fetching BSC transactions:', error);
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  private async getBNBTransactions(
    address: string,
    provider: ethers.JsonRpcProvider,
    fromBlock: number,
    toBlock: number
  ): Promise<string[]> {
    const txHashes: string[] = [];
    
    try {
      // Scan recent blocks for native BNB transactions
      // This is a simplified approach - in production, you'd use BSCScan API
      const blockRange = Math.min(100, toBlock - fromBlock); // Limit to 100 blocks
      const startBlock = Math.max(fromBlock, toBlock - blockRange);
      
      for (let blockNum = startBlock; blockNum <= toBlock; blockNum += 10) {
        try {
          const block = await provider.getBlock(blockNum, true);
          if (block && block.transactions) {
            for (const tx of block.transactions) {
              if (typeof tx === 'object' && tx !== null) {
                const transaction = tx as ethers.TransactionResponse;
                if (
                  (transaction.from?.toLowerCase() === address.toLowerCase() ||
                   transaction.to?.toLowerCase() === address.toLowerCase()) &&
                  transaction.value && transaction.value > BigInt(0)
                ) {
                  txHashes.push(transaction.hash);
                }
              }
            }
          }
        } catch (blockError) {
          console.error(`Error fetching block ${blockNum}:`, blockError);
        }
      }
    } catch (error) {
      console.error('Error scanning for BNB transactions:', error);
    }
    
    return txHashes;
  }

  private async parseTokenTransfers(
    receipt: ethers.TransactionReceipt,
    provider: ethers.JsonRpcProvider
  ): Promise<TokenTransfer[]> {
    const transfers: TokenTransfer[] = [];
    
    // ERC-20 Transfer event signature
    const transferTopic = ethers.id('Transfer(address,address,uint256)');
    
    for (const log of receipt.logs) {
      if (log.topics[0] === transferTopic && log.topics.length === 3) {
        try {
          const from = ethers.getAddress('0x' + log.topics[1].slice(26));
          const to = ethers.getAddress('0x' + log.topics[2].slice(26));
          const value = ethers.getBigInt(log.data).toString();
          
          // Get token info
          const tokenContract = new ethers.Contract(
            log.address,
            ['function symbol() view returns (string)', 'function decimals() view returns (uint8)'],
            provider
          );
          
          try {
            const [symbol, decimals] = await Promise.all([
              tokenContract.symbol(),
              tokenContract.decimals()
            ]);
            
            transfers.push({
              from,
              to,
              value,
              tokenAddress: log.address,
              tokenSymbol: symbol,
              tokenDecimals: decimals
            });
          } catch (tokenError) {
            // Token contract might not implement symbol/decimals
            transfers.push({
              from,
              to,
              value,
              tokenAddress: log.address,
              tokenSymbol: 'UNKNOWN',
              tokenDecimals: 18
            });
          }
        } catch (parseError) {
          console.error('Error parsing token transfer:', parseError);
        }
      }
    }
    
    return transfers;
  }

  async getTransactionByHash(txHash: string, network: string): Promise<BlockchainTransaction | null> {
    try {
      const provider = this.getProvider(network);
      
      const [tx, receipt] = await Promise.all([
        provider.getTransaction(txHash),
        provider.getTransactionReceipt(txHash)
      ]);

      if (!tx || !receipt) {
        return null;
      }

      const block = await provider.getBlock(receipt.blockNumber);
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        from: tx.from,
        to: tx.to || '',
        value: tx.value.toString(),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: tx.gasPrice?.toString() || '0',
        timestamp: block?.timestamp || 0,
        status: receipt.status || 0,
        tokenTransfers: await this.parseTokenTransfers(receipt, provider)
      };
    } catch (error) {
      console.error(`Error fetching transaction ${txHash}:`, error);
      return null;
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;
