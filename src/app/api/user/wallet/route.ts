import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import UserWallet from '@/models/UserWallet';
import History from '@/models/History';
import mongoose from 'mongoose';
import { decrypt } from '@/lib/authlib';

interface WalletResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: {
    user: {
      telegramId: string;
      username: string;
      balance: number;
      totalEarned: number;
    };
    wallets: Array<{
      currency: string;
      balance: number;
      lockedBalance: number;
      walletAddress: string;
      totalDeposits: number;
      totalWithdrawals: number;
      totalSwaps: number;
      lastTransactionAt?: Date;
    }>;
    totalBalance: {
      available: number;
      locked: number;
    };
    recentTransactions: Array<{
      transactionId: string;
      type: string;
      action: string;
      amount: number;
      currency: string;
      status: string;
      timestamp: Date;
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskup');
    }

    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const encryptedUserId = searchParams.get('userId');

    if (!encryptedUserId) {
      return NextResponse.json({
        success: false,
        message: 'Missing userId parameter',
        errorCode: 'MISSING_USER_ID'
      } as WalletResponse, { status: 400 });
    }

    // Decrypt the userId to get telegramId
    const telegramId = decrypt(encryptedUserId);
    if (!telegramId) {
      return NextResponse.json({
        success: false,
        message: 'Invalid userId parameter',
        errorCode: 'INVALID_USER_ID'
      } as WalletResponse, { status: 400 });
    }

    // Find user by telegramId
    const user = await User.findOne({ telegramId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND'
      } as WalletResponse, { status: 404 });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Account is not active',
        errorCode: 'ACCOUNT_INACTIVE'
      } as WalletResponse, { status: 403 });
    }

    // Get all user wallets
    const wallets = await UserWallet.findByTelegramId(telegramId);

    // Get total balance summary
    const totalBalanceSummary = await UserWallet.getTotalBalance(telegramId);
    const totalBalance = totalBalanceSummary[0] || { totalBalance: 0, totalLocked: 0 };

    // Get recent transactions (last 10)
    const recentTransactions = await History.find({ telegramId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('transactionId type action amount currency status timestamp');

    // Format wallet data
    const formattedWallets = wallets.map(wallet => ({
      currency: wallet.currency,
      balance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
      walletAddress: wallet.walletAddress,
      totalDeposits: wallet.totalDeposits,
      totalWithdrawals: wallet.totalWithdrawals,
      totalSwaps: wallet.totalSwaps,
      lastTransactionAt: wallet.lastTransactionAt
    }));

    // Format transaction data
    const formattedTransactions = recentTransactions.map(tx => ({
      transactionId: tx.transactionId,
      type: tx.type,
      action: tx.action,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      timestamp: tx.timestamp
    }));

    return NextResponse.json({
      success: true,
      message: 'Wallet data retrieved successfully',
      data: {
        user: {
          telegramId: user.telegramId,
          username: user.username,
          balance: user.balance,
          totalEarned: user.totalEarned
        },
        wallets: formattedWallets,
        totalBalance: {
          available: totalBalance.totalBalance || 0,
          locked: totalBalance.totalLocked || 0
        },
        recentTransactions: formattedTransactions
      }
    } as WalletResponse);

  } catch (error) {
    console.error('Wallet API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error occurred while fetching wallet data',
      errorCode: 'INTERNAL_ERROR_500'
    } as WalletResponse, { status: 500 });
  }
}

 
