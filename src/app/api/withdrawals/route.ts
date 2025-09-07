import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UserWallet from '@/models/UserWallet';
import Withdrawal from '@/models/Withdrawal';
import Coin from '@/models/Coin';
import ERC20Service from '@/lib/erc20';
import { decrypt, encrypt } from '@/lib/authlib';
import { ethers } from 'ethers';

// Define supported network types to match ERC20Service
type SupportedNetwork = 'eth-main' | 'sepolia' | 'bsc-mainnet' | 'bsc-testnet';

// GET /api/withdrawals - Get withdrawal history for a user or all withdrawals for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    const hash = searchParams.get('hash');
    const limit = parseInt(searchParams.get('limit') || '100');

    // User request - get specific user withdrawals
      if (!hash) {
        return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
      }
      const telegramId = encrypt(hash)
    const withdrawals = await Withdrawal.findByTelegramId(telegramId, limit);
    
    // Enrich withdrawals with coin logos
    const enrichedWithdrawals = await Promise.all(
      withdrawals.map(async (withdrawal: any) => {
        const coin = await Coin.findOne({ 
          symbol: withdrawal.currency?.toUpperCase(),
          isActive: true 
        });
        
        return {
          ...withdrawal.toObject(),
          coinLogo: coin?.logoUrl || null,
          coinName: coin?.name || withdrawal.currency
        };
      })
    );
    
    return NextResponse.json({ withdrawals: enrichedWithdrawals });
     
    
  } catch (error) {
    console.error('GET /api/withdrawals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/withdrawals - Create new withdrawal request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { hash, amount, currency , network, address, memo } = body;
    
    if (!hash|| !amount || !currency || !network || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId, amount, currency, network, address' },
        { status: 400 }
      );
    }
    
    const telegramId = decrypt(hash)
    
    // Validate network type first
    const supportedNetworks: SupportedNetwork[] = ['eth-main', 'sepolia', 'bsc-mainnet', 'bsc-testnet'];
    if (!supportedNetworks.includes(network as SupportedNetwork)) {
      return NextResponse.json(
        { error: `Network ${network} is not supported. Supported networks: ${supportedNetworks.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate currency and network combinations using Coin model
    const coin = await Coin.findOne({ 
      symbol: currency.toUpperCase(), 
      isActive: true 
    });
    
    if (!coin) {
      return NextResponse.json(
        { error: `Currency ${currency} is not supported` },
        { status: 400 }
      );
    }
    
    const validNetwork = coin.networks.find((n : any)=> 
      n.network === network && n.isActive
    );
    
    if (!validNetwork) {
      return NextResponse.json(
        { error: `Network ${network} is not supported for currency ${currency}` },
        { status: 400 }
      );
    }
    
    // Check minimum withdrawal amounts
    const minWithdrawals: { [key: string]: number } = {
      'USDT': 0.25
    };
    
    const minAmount = minWithdrawals[currency.toUpperCase()];
    if (minAmount && parseFloat(amount) < minAmount) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount for ${currency.toUpperCase()} is ${minAmount}` },
        { status: 400 }
      );
    }
    
    // Get network fees from API
    let networkFee = 0;
    
    const totalAmount = parseFloat(amount) + networkFee;
    
  
    
    // Get user and wallet, check balance
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userWallet = await UserWallet.findOne({ telegramId , currency});
    if (!userWallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 });
    }
    
    // Check wallet balance for the specific currency
    const walletBalance = userWallet.balance || 0;
    const requiredBalance = totalAmount;
    
    if (walletBalance < requiredBalance) {
      return NextResponse.json(
        { error: `Insufficient ${currency.toUpperCase()} balance. Available: ${walletBalance}, Required: ${requiredBalance}` },
        { status: 400 }
      );
      
    }


    if(address){
     const isValidAddress = ethers.isAddress(address)
       
      if (!isValidAddress) {
        return NextResponse.json(
          { error: `Invalid address format. Address: ${address}` },
          { status: 400 }
        );
      }

    }
      
    

    const contractAddress = coin.networks.find((n : any)=> n.network === network && n.isActive)?.contractAddress;

 

    // Estimate gas for the transfer
    const gasEstimate = await ERC20Service.estimateGas({
      tokenAddress: contractAddress,
      toAddress: address,
      amount: amount.toString(),
      network: network
    });
    
    if (!gasEstimate) {
      return NextResponse.json(
        { error: 'Failed to estimate gas for transaction' },
        { status: 500 }
      );
    }
    
  
    
    // Create withdrawal request
    const withdrawal = new Withdrawal({
      userId: String(user._id),
      telegramId,
      username: user.username,
      amount: parseFloat(amount),
      method: network, // Use network as method for compatibility
      walletId: address, // Use address as walletId for compatibility
      currency: currency.toUpperCase(),
      network,
      address,
      memo: memo || '',
      networkFee,
      // Set initial status based on transfer type
      status: 'pending'
    });
    
    await withdrawal.save();
    
    // Deduct amount from user wallet balance
    await UserWallet.findOneAndUpdate(
      { telegramId , currency},
      { $inc: { balance :  -parseFloat(amount) } }
    );
    
    // Process withdrawal based on network type
    let transferResult: any = { success: true, msg: 'Unknown error' };
    
    try {
      // Execute the ERC20 transfer
      transferResult = await ERC20Service.transferToken({
        tokenAddress: contractAddress,
        toAddress: address,
        amount: amount.toString(),
        network: network,
        gasLimit: gasEstimate.gasLimit,
        gasPrice: gasEstimate.gasPrice
      });
      
      if (transferResult.success) {
          
        withdrawal.status = 'completed';
        withdrawal.transactionId = transferResult.transactionHash ||  `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}` //'transferResult.transactionHash;'
        withdrawal.updatedAt = new Date();
        await withdrawal.save();
      } else {
        withdrawal.status = 'failed';
        withdrawal.failureReason = transferResult.error || transferResult.msg || 'Transfer failed';
        withdrawal.updatedAt = new Date();
        await withdrawal.save();
        
        // Refund user wallet balance on failure
        await UserWallet.findOneAndUpdate(
          { telegramId , currency },
          { $inc: { balance : parseFloat(amount) } }
        );
      }
      
    } catch (error) {
      
      await Withdrawal.findByIdAndUpdate(withdrawal._id, {
        status: 'failed',
        failureReason: error instanceof Error ? error.message : 'Processing failed'
      });
      
      // Refund user wallet balance on failure
      await UserWallet.findOneAndUpdate(
        { telegramId , currency },
        { $inc: { balance : parseFloat(amount) } }
      );
    } 
    
    return NextResponse.json({ 
      withdrawal,
      message:   'Withdrawal request submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
   console.log(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 