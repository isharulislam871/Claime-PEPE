import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Wallet from '@/models/Wallet';
import BlockScan from '@/models/BlockScan';
import RpcNode from '@/models/RpcNode';
import Coin from '@/models/Coin';
 
import { ethers } from 'ethers';

// GET /api/admin/wallets/transactions - Fetch wallet transactions
export async function GET(request: NextRequest) {
  try {
    // Authentication is handled by middleware

    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    const limit = parseInt(searchParams.get('limit') || '500');
    const offset = parseInt(searchParams.get('offset') || '0');

    await connectDB();
    
    let newTransactions: any[] = [];
    let savedTransactions: any[] = [];
  
    let total = 0;
 

    // First, get existing transactions from database
    const existingTransactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();
    
 
    total = await Transaction.countDocuments({});

    // If refresh is requested, fetch new transactions from blockchain
    if (refresh) {
      // Get active RPC nodes for all networks
      const allRpcNodes = await RpcNode.find({
        isActive: true,
        status: { $in: ['online', 'offline'] } // Include offline nodes as backup
      }).sort({ network: 1, priority: 1, isDefault: -1 });

  
      if (allRpcNodes.length === 0) {
        return NextResponse.json({ 
          error: 'No active RPC nodes found for any network' 
        }, { status: 503 });
      }

      // Group RPC nodes by network
      const rpcNodesByNetwork = allRpcNodes.reduce((acc: any, node: any) => {
        if (!acc[node.network]) {
          acc[node.network] = [];
        }
        acc[node.network].push(node);
        return acc;
      }, {});


      

      // Get active coins for all networks
      const coins = await Coin.find({
        isActive: true,
        'networks.isActive': true,
        'networks.contractAddress': { $exists: true, $ne: null }
      });
      
 
      if (coins.length === 0) {
        return NextResponse.json({ 
          error: 'No active coins found for any network' 
        }, { status: 404 });
      }

      // Group coins by network
      const coinsByNetwork: { [key: string]: any[] } = {};
      coins.forEach(coin => {
        coin.networks.forEach((network: any) => {
          if (network.isActive && network.contractAddress) {
            if (!coinsByNetwork[network.network]) {
              coinsByNetwork[network.network] = [];
            }
            coinsByNetwork[network.network].push({
              ...coin,
              activeNetwork: network
            });
          }
        });
      });
 

     
      const erc20Abi = [
        "function decimals() view returns (uint8)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ];
      
      let allNewTransactions: any[] = [];
      const usedRpcUrls: string[] = [];

      // Process each network that has coins
      for (const [networkName, networkCoins] of Object.entries(coinsByNetwork)) {
        const rpcNodes = rpcNodesByNetwork[networkName];
        if (!rpcNodes || rpcNodes.length === 0) {
          console.warn(`No RPC nodes found for network: ${networkName}`);
          continue;
        }

        // Get all wallet addresses for this network
        const wallets = await Wallet.find({ 
          network: networkName,
          status: 'active'
        });

        if (!wallets || wallets.length === 0) {
          console.warn(`No active wallets found for network: ${networkName}`);
          continue;
        }

        let provider: ethers.JsonRpcProvider | null = null;
        let workingRpcUrl = '';

        // Try RPC nodes for this network in priority order
        for (const rpcNode of rpcNodes) {
 
          try {
            const testProvider = new ethers.JsonRpcProvider(rpcNode.url);
            await testProvider.getBlockNumber(); // Test connection
            provider = testProvider;
            workingRpcUrl = rpcNode.url;
            
            // Update RPC node status to online
            await RpcNode.findByIdAndUpdate(rpcNode._id, {
              status: 'online',
              lastChecked: new Date()
            });
            
            break;
          } catch (error) {
            console.warn(`RPC node ${rpcNode.url} failed:`, error);
            
            // Update RPC node status to error
            await RpcNode.findByIdAndUpdate(rpcNode._id, {
              status: 'error',
              lastChecked: new Date()
            });
            
            continue;
          }
        }

        if (!provider) {
          console.warn(`All RPC nodes unavailable for network: ${networkName}`);
          continue;
        }

        usedRpcUrls.push(workingRpcUrl);
        const currentBlockNumber = await provider.getBlockNumber();
 
        // Process each coin for this network
        for (const coin of networkCoins) {
          const tokenAddress = coin.activeNetwork.contractAddress;
          const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          
          // Process transactions for all wallets in this network
          for (const wallet of wallets) {
            const address = wallet.address;
            const filterFrom = contract.filters.Transfer(address, null);
            const filterTo = contract.filters.Transfer(null, address);
           
          
          // Get or create block scan record for this token
          let blockScan = await BlockScan.findOne({
            network: networkName,
            contractAddress: tokenAddress.toLowerCase()
          });
        
        let fromBlock: number = 0;
        
        if (!blockScan) {
          // First time scan - start from 2500 blocks back
          fromBlock = currentBlockNumber - 2500;
          blockScan = await BlockScan.create({
            network: networkName,
            contractAddress: tokenAddress.toLowerCase(),
            lastProcessedBlock: fromBlock
          });
        } else {
          const lastUpdate = new Date(blockScan.updatedAt).getTime();
          const now = Date.now();
          const oneHour = 60 * 60 * 1000;
      
          if (now - lastUpdate > oneHour) {
            // If more than 1 hour → reset
            fromBlock = currentBlockNumber 
            blockScan.updatedAt = new Date();
            await blockScan.save(); 
          } 
          fromBlock = blockScan.lastProcessedBlock;
        
        }
 
         
        // Only scan if there are new blocks to process
        
          const sent = await contract.queryFilter(filterFrom, fromBlock , 'latest');
          const received = await contract.queryFilter(filterTo, fromBlock, 'latest');
        
            
         
          // Get existing transaction hashes for fast lookup
          const existingTxHashes = new Set(
            await Transaction.distinct('txHash', {})
          );

          

          // Process sent transactions
          for (const log of sent) {
            const txHash = log.transactionHash.toLowerCase();
           
            // Fast check: skip if transaction already exists
            if (existingTxHashes.has(txHash)) {
              continue;
            }

            const from = "0x" + log.topics[1].slice(26);
            const to = "0x" + log.topics[2].slice(26);
            const hexValue = BigInt(log.data);
            try {
              // Get or create wallet for the from address
              const wallet = await Wallet.findOne({ address: from });
              if (!wallet) {
                 console.log('Wallet not found:', from.toLowerCase());
                 continue;
              }
              
              blockScan.lastProcessedBlock = currentBlockNumber;
              await blockScan.save();

              const transactionData = {
                walletId: wallet._id,
                walletAddress: from.toLowerCase(),
                txHash: txHash,
                blockNumber: log.blockNumber,
                type: 'withdrawal' as const,
                amount: ethers.formatUnits(hexValue, coin._doc.decimals),
                currency: coin._doc.symbol,
                network: networkName,
                status: 'completed' as const,
                fromAddress: from.toLowerCase(),
                toAddress: to.toLowerCase(),
              };

              // Save unique transaction to database
              const savedTx = await Transaction.create(transactionData);
               savedTransactions.push(savedTx);
              allNewTransactions.push(transactionData);
            } catch (error: any) {
              // Skip duplicate transactions (unique constraint on txHash)
              if (error.code !== 11000) {
                console.error('Error saving transaction:', error);
              }
            }
          }

          // Process received transactions
          for (const log of received) {
            const txHash = log.transactionHash.toLowerCase();
            
            // Fast check: skip if transaction already exists
            if (existingTxHashes.has(txHash)) {
              continue;
            }

            const from = "0x" + log.topics[1].slice(26);
            const to = "0x" + log.topics[2].slice(26);
            const hexValue = BigInt(log.data);

            try {
              // Get or create wallet for the to address
              const wallet = await Wallet.findOne({ address: from.toLowerCase() });
              if (!wallet) {
                 console.log('Wallet not found:', from.toLowerCase());
                 continue;
              }
              blockScan.lastProcessedBlock = currentBlockNumber;
              await blockScan.save();

              const transactionData = {
                walletId: wallet._id,
                walletAddress: to.toLowerCase(),
                txHash: txHash,
                blockNumber: log.blockNumber,
                type: 'deposit' as const,
                amount: ethers.formatUnits(hexValue, coin._doc.decimals),
                currency: coin._doc.symbol,
                network: networkName,
                status: 'completed' as const,
                fromAddress: from.toLowerCase(),
                toAddress: to.toLowerCase(),
              };

              // Save unique transaction to database
               const savedTx = await Transaction.create(transactionData);
               savedTransactions.push(savedTx);
               allNewTransactions.push(transactionData);
            } catch (error: any) {
              // Skip duplicate transactions (unique constraint on txHash)
              if (error.code !== 11000) {
                console.error('Error saving transaction:', error);
              }
            }
          }
 
        }
          }
        }
      

      // Update newTransactions with all collected transactions
      newTransactions = allNewTransactions;

     
    }

    return NextResponse.json({ 
      success: true, 
      newTransactions,
      savedCount: savedTransactions.length,
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch transactions' 
    }, { status: 500 });
  }
}

 