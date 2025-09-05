import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
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
    
 

    const results = [];
    const tokenAddresses = {
      mainnet: {
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        USDC: '0xA0b86a33E6441e8e3F3570c5c1c0b9C0e3e0e0e0',
        PEPE: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
        SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'
      },
      bsc: {
        USDT: '0x55d398326f99059fF775485246999027B3197955',
        USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        PEPE: '0x25d887ce7a35172c62febfd67a1856f20faebb00'
      }
    };

    // Sync balances for each wallet
    for (const wallet of wallets) {
      try {
        let realBalance = '0';

        if (wallet.currency === 'ETH' || wallet.currency === 'BNB') {
          realBalance = await EthereumService.getBalance(wallet.address, wallet.network);
        } else {
          const networkTokens = tokenAddresses[ wallet.network as keyof typeof tokenAddresses];
          const tokenAddress = networkTokens?.[wallet.currency as keyof typeof networkTokens];

          if (tokenAddress) {
            realBalance = await ERC20Service.getBalance(tokenAddress, wallet.address,  wallet.network);
          }
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
