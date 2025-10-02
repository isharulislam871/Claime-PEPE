import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import Coin from '@/models/Coin';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getNativeBalance , getERC20Balance , formatTokenBalance , getERC20Decimals } from 'auth-fingerprint';
import RpcNode from '@/models/RpcNode';
// POST /api/admin/wallets/sync-balances - Sync all wallet balances from blockchain
export async function GET(request: NextRequest) {
  try {
   
    const session = await getServerSession(authOptions);
 
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all active wallets
    const wallets = await Wallet.find({ status: 'active' });
    
    // Get all active coins with their network configurations
    const coins = await Coin.find({ isActive: true });

    // Get all RPC nodes to avoid multiple database calls
    const rpcNodes = await RpcNode.find({});
    const rpcNodeMap = new Map();
    rpcNodes.forEach(node => {
      rpcNodeMap.set(node.network, node);
    });

    const results = [];

    // Sync balances for each wallet
    for (const wallet of wallets) {
      try {
        let realBalance = '0';

        console.log(wallet.network)

        // Find the coin configuration for this wallet's currency
        const coin = coins.find(c => c.symbol === wallet.currency);
          
        if (!coin) {
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            success: false,
            error: `Coin configuration not found for ${wallet.currency}`
          });
          continue;
        }

        // Find the network configuration for this wallet's network
        const networkConfig = coin.networks.find((n: any) => 
          n.network === wallet.network && n.isActive
        );

        if (!networkConfig) {
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            success: false,
            error: `Network configuration not found for ${wallet.currency} on ${wallet.network}`
          });
          continue;
        }

        // Get RPC node for this network
        const rpcNode =  await RpcNode.findOne({ network: wallet.network });

       
        if (!rpcNode) {
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            success: false,
            error: `RPC node not found for ${wallet.currency} on ${wallet.network}`
          });
          continue;
        }

        // Store old balance for comparison
        const oldBalance = wallet.balance;

        // Get balance based on whether it's a native token or ERC20
        if (networkConfig.isNative) {
          // Native token (ETH, BNB)
          realBalance = await getNativeBalance(wallet.address, wallet.network);
        } else if (networkConfig.contractAddress) {
          // ERC20 token
          console.log(`Fetching ERC20 balance for ${wallet.currency} at ${networkConfig.contractAddress}`);
          
          const balance = await getERC20Balance(rpcNode.url, networkConfig.contractAddress, wallet.address);
          const decimals = await getERC20Decimals(rpcNode.url, networkConfig.contractAddress);
          
          realBalance = formatTokenBalance(balance, decimals);
        } else {
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            success: false,
            error: `No contract address found for ${wallet.currency} on ${wallet.network}`
          });
          continue;
        }

        // Convert to numeric and validate
        const numericBalance = parseFloat(realBalance);
        if (isNaN(numericBalance)) {
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            success: false,
            error: `Invalid balance received: ${realBalance}`
          });
          continue;
        }

        // Update wallet balance
        await wallet.updateBalance(numericBalance);
        
        results.push({
          walletId: wallet._id,
          address: wallet.address,
          currency: wallet.currency,
          network: wallet.network,
          oldBalance: oldBalance,
          newBalance: numericBalance,
          success: true
        });
      } catch (error) {
        results.push({
          walletId: wallet._id,
          address: wallet.address,
          currency: wallet.currency,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successfulSyncs = results.filter(r => r.success);
    const failedSyncs = results.filter(r => !r.success);
    
    return NextResponse.json({ 
      success: true, 
      message: `Synced ${successfulSyncs.length} of ${wallets.length} wallets`,
      summary: {
        total: wallets.length,
        successful: successfulSyncs.length,
        failed: failedSyncs.length,
        successRate: `${((successfulSyncs.length / wallets.length) * 100).toFixed(1)}%`
      },
      results,
    });
  } catch (error) {
    console.error('Error syncing wallet balances:', error);
    return NextResponse.json({ 
      error: 'Failed to sync wallet balances' 
    }, { status: 500 });
  }
}
