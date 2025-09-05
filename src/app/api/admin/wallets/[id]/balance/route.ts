import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import EthereumService from '@/lib/ethereum';
import ERC20Service from '@/lib/erc20';

// GET /api/admin/wallets/[id]/balance - Get real-time wallet balance
export async function GET(
  request: NextRequest,
  context : any
) {
  try {
    
 
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || 'mainnet';

    await connectDB();
    
    // Get wallet from database
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    let realBalance = '0';
    let tokenInfo = null;

    // Get real-time balance from blockchain
    if (wallet.currency === 'ETH') {
      realBalance = await EthereumService.getBalance(wallet.address, network);
    } else {
      // ERC20 token balance
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
          PEPE: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00'
        }
      };

      const networkTokens = tokenAddresses[network as keyof typeof tokenAddresses];
      const tokenAddress = networkTokens?.[wallet.currency as keyof typeof networkTokens];

      if (tokenAddress) {
        realBalance = await ERC20Service.getBalance(tokenAddress, wallet.address, network);
        tokenInfo = await ERC20Service.getTokenInfo(tokenAddress, network);
      }
    }

    // Update wallet balance in database
    const numericBalance = parseFloat(realBalance);
    if (!isNaN(numericBalance)) {
      await wallet.updateBalance(numericBalance);
    }

    return NextResponse.json({ 
      success: true, 
      wallet: {
        ...wallet.toJSON(),
        realTimeBalance: realBalance,
        network
      },
      tokenInfo
    });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return NextResponse.json({ 
      error: 'Failed to get wallet balance' 
    }, { status: 500 });
  }
}

// PUT /api/admin/wallets/[id]/balance - Update wallet balance manually
export async function PUT(  request: NextRequest, context : any ) {
  try {
 
 
    const { id } = await context.params;
    const body = await request.json();
    const { balance } = body;

    if (typeof balance !== 'number' || balance < 0) {
      return NextResponse.json({ 
        error: 'Invalid balance. Must be a non-negative number' 
      }, { status: 400 });
    }

    await connectDB();
    
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    await wallet.updateBalance(balance);

    return NextResponse.json({ 
      success: true, 
      wallet: wallet.toJSON(),
      message: 'Balance updated successfully'
    });
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    return NextResponse.json({ 
      error: 'Failed to update wallet balance' 
    }, { status: 500 });
  }
}
