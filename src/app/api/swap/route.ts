import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import History from '@/models/History';
import UserWallet from '@/models/UserWallet';
import mongoose from 'mongoose';
import { verifySignature } from 'auth-fingerprint';
interface SwapRequest {
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  telegramId: string; // Made required since we need to identify the user
}

interface SwapResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
  errorCode?: string;
  data?: {
    fromAmount: number;
    toCurrency: string;
    toAmount: number;
    exchangeRate: number;
    timestamp: string;
    remainingBalance?: number;
    txHash?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskup');
    }

    const body = await request.json();
    const { hash , signature , timestamp } = body;
    const { success , data  } = verifySignature({hash , signature , timestamp } , process.env.NEXTAUTH_SECRET || 'app');
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid signature',
        errorCode: 'INVALID_SIGNATURE'
      } as SwapResponse, { status: 400 });
    }
    

 
    const { fromAmount, toCurrency, toAmount , telegramId    } : SwapRequest =  JSON.parse(data as string)
 
    console.log( fromAmount , toCurrency , toAmount , telegramId )

     
    // Validate input
    if (!fromAmount || !toCurrency || !toAmount || !telegramId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields (fromAmount, toCurrency, toAmount, userId)',
        errorCode: 'INVALID_INPUT'
      } as SwapResponse, { status: 400 });
    }

    if (fromAmount < 1000) {
      return NextResponse.json({
        success: false,
        message: 'Minimum swap amount is 1,000 points',
        errorCode: 'MINIMUM_AMOUNT_ERROR'
      } as SwapResponse, { status: 400 });
    }

    // Find user by telegramId
    const user = await User.findOne({ telegramId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND'
      } as SwapResponse, { status: 404 });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Account is not active. Cannot perform swap.',
        errorCode: 'ACCOUNT_INACTIVE'
      } as SwapResponse, { status: 403 });
    }

     

    // Check if wallet has sufficient balance
    if (user.balance < fromAmount) {
      return NextResponse.json({
        success: false,
        message: `Insufficient wallet balance. You have ${user.balance} points but need ${fromAmount} points.`,
        errorCode: 'INSUFFICIENT_WALLET_BALANCE'
      } as SwapResponse, { status: 400 });
    }

    // Find or create target currency wallet
    let targetWallet = await UserWallet.findWallet(user.telegramId, toCurrency);
    if (!targetWallet) {
      targetWallet = await UserWallet.createWallet({
        userId: user._id?.toString() || user.telegramId,
        telegramId: user.telegramId,
        currency: toCurrency.toUpperCase(),
        balance: 0,
 
      });
    }

    // Generate transaction ID and hash
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;

    try {
      // Process swap using wallet methods
      user.balance -=fromAmount;
      await targetWallet.addBalance(toAmount);

      // Update user balance to sync with wallet
     
      await user.save();

      // Create history record for swap transaction
      const swapHistory = new History({
        userId: user._id?.toString() || user.telegramId,
        telegramId: user.telegramId,
        type: 'swap',
        action: `Swapped ${fromAmount} points to ${toAmount} ${toCurrency.toUpperCase()}`,
        amount: fromAmount,
        currency: 'POINTS',
        status: 'completed',
        transactionId,
        txHash,
        fromCurrency: 'POINTS',
        toCurrency: toCurrency.toUpperCase(),
        exchangeRate: toAmount / fromAmount,
        fees: 0,
        metadata: {
          toAmount,
          remainingBalance: user.balance,
          swapType: 'points_to_crypto',
          fromWalletId: user._id,
          toWalletId: targetWallet._id,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || undefined,
        timestamp: new Date()
      });

      await swapHistory.save();

      return NextResponse.json({
        success: true,
        transactionId,
        message: 'Swap completed successfully',
        data: {
          fromAmount,
          toCurrency: toCurrency.toUpperCase(),
          toAmount,
          exchangeRate: toAmount / fromAmount,
          timestamp: new Date().toISOString(),
          remainingBalance: user.balance,
          txHash: txHash
        }
      } as SwapResponse , { status: 201 });

    } catch (swapError) {
      console.error('Swap processing error:', swapError);
      
      // Rollback balance if history creation fails
      user.balance += fromAmount;
      await user.save();
      
      return NextResponse.json({
        success: false,
        message: 'Failed to process swap',
        errorCode: 'SWAP_ERROR'
      } as SwapResponse, { status: 500 });
    }

  } catch (error) {
    console.error('Swap API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error occurred during swap processing',
      errorCode: 'INTERNAL_ERROR_500'
    } as SwapResponse, { status: 500 });
  }
}

// Handle GET requests (optional - for health check)
export async function GET() {
  return NextResponse.json({
    message: 'Swap API is running',
    timestamp: new Date().toISOString()
  });
}
