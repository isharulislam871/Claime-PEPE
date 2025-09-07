import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import Coin from '@/models/Coin';
import EthereumService from '@/lib/ethereum';
import ERC20Service from '@/lib/erc20';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

    const results = [];

    // Sync balances for each wallet
    for (const wallet of wallets) {
      try {
        let realBalance = '0';

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

        // Get balance based on whether it's a native token or ERC20
        if (networkConfig.isNative) {
          // Native token (ETH, BNB)
          realBalance = await EthereumService.getBalance(wallet.address, wallet.network);
        } else if (networkConfig.contractAddress) {
          // ERC20 token
          realBalance = await ERC20Service.getBalance(
            networkConfig.contractAddress, 
            wallet.address, 
            wallet.network
          );
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

        const numericBalance = parseFloat(realBalance);
        if (!isNaN(numericBalance)) {
          await wallet.updateBalance(numericBalance);
          results.push({
            walletId: wallet._id,
            address: wallet.address,
            currency: wallet.currency,
            oldBalance: wallet.balance,
            newBalance: numericBalance,
            success: true
          });
        }
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

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${results.filter(r => r.success).length} of ${wallets.length} wallets`,
      results,
     
    });
  } catch (error) {
    console.error('Error syncing wallet balances:', error);
    return NextResponse.json({ 
      error: 'Failed to sync wallet balances' 
    }, { status: 500 });
  }
}
