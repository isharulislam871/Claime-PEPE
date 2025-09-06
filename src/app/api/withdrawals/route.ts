import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import Coin from '@/models/Coin';
import ERC20Service from '@/lib/erc20';
import { encrypt } from '@/lib/authlib';

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
    const { telegramId, amount, currency , network, address, memo } = body;
    
    if (!telegramId || !amount || !currency || !network || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId, amount, currency, network, address' },
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
    
    // Get network fees from API
    let networkFee = 0;
    
    const totalAmount = parseFloat(amount) + networkFee;
    
  
    
    // Get user and check balance
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // For PEPE withdrawals, check PEPE balance; for others, convert from PEPE balance
    let requiredBalance = totalAmount;
    const contractAddress = coin.networks.find((n : any)=> n.network === network && n.isActive)?.contractAddress; 
    
    const balance = await ERC20Service.getBalance(contractAddress , address , network);
    if(parseFloat(balance) < requiredBalance){
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }
    
    
    if (user.balance < requiredBalance) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    

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
    
    // Deduct amount from user balance
    await User.findOneAndUpdate(
      { telegramId },
      { $inc: { balance: -amount } }
    );
    
    // Process withdrawal based on network type
    let transferResult: any = { success: false, msg: 'Unknown error' };
    
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
        await Withdrawal.findByIdAndUpdate(withdrawal._id, {
          status: 'completed',
          transactionId: transferResult.transactionHash || transferResult.txnId || transferResult.id || `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          completedAt: new Date()
        });
      } else {
        await Withdrawal.findByIdAndUpdate(withdrawal._id, {
          status: 'failed',
          failureReason: transferResult.error || transferResult.msg || 'Transfer failed'
        });
        
        // Refund user balance on failure
        await User.findOneAndUpdate(
          { telegramId },
          { $inc: { balance: parseFloat(amount) } }
        );
      }
      
    } catch (error) {
      console.error('Withdrawal processing error:', error);
      
      await Withdrawal.findByIdAndUpdate(withdrawal._id, {
        status: 'failed',
        failureReason: error instanceof Error ? error.message : 'Processing failed'
      });
      
      // Refund user balance on failure
      await User.findOneAndUpdate(
        { telegramId },
        { $inc: { balance: parseFloat(amount) } }
      );
    } 
    
    return NextResponse.json({ 
      withdrawal,
      message:   'Withdrawal request submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/withdrawals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/withdrawals - Update withdrawal status (admin only)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { withdrawalId, status, transactionId, failureReason } = body;
    
    if (!withdrawalId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: withdrawalId, status' },
        { status: 400 }
      );
    }
    
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }
    
    // Update withdrawal based on status
    if (status === 'completed') {
      withdrawal.markAsCompleted(transactionId);
    } else if (status === 'failed') {
      withdrawal.markAsFailed(failureReason || 'Processing failed');
      // Refund user balance
      await User.findOneAndUpdate(
        { telegramId: withdrawal.telegramId },
        { $inc: { balance: withdrawal.amount } }
      );
    } else if (status === 'cancelled') {
      withdrawal.status = 'cancelled';
      // Refund user balance
      await User.findOneAndUpdate(
        { telegramId: withdrawal.telegramId },
        { $inc: { balance: withdrawal.amount } }
      );
    } else {
      withdrawal.status = status;
    }
    
    await withdrawal.save();
    
    return NextResponse.json({ 
      withdrawal,
      message: `Withdrawal ${status} successfully`
    });
    
  } catch (error) {
    console.error('PUT /api/withdrawals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
