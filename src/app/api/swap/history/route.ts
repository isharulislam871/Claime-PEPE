import { NextRequest, NextResponse } from 'next/server';
import History from '@/models/History';
import mongoose from 'mongoose';
import { verifySignature } from 'auth-fingerprint';

interface SwapTransaction {
  id: string;
  telegramId: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  conversionRate: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
  txHash?: string;
  fees?: number;
}

interface SwapHistoryResponse {
  success: boolean;
  transactions?: SwapTransaction[];
  message?: string;
  errorCode?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskup');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
     
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const currency = searchParams.get('currency');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const hash = searchParams.get('hash');
    const signature = searchParams.get('signature');
    const timestamp = searchParams.get('timestamp');

    const { success , data   } = verifySignature({hash , signature , timestamp} , process.env.NEXTAUTH_SECRET || 'app');

    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid signature',
        errorCode: 'INVALID_SIGNATURE'
      } as SwapHistoryResponse, { status: 400 });
    }

    const  {  telegramId  } = JSON.parse(data as string);

    // Validate required parameters
    if (!telegramId) {
      return NextResponse.json({
        success: false,
        message: 'telegramId is required',
        errorCode: 'MISSING_TELEGRAM_ID'
      } as SwapHistoryResponse, { status: 400 });
    }

    // Build query filter
    const filter: any = {
      telegramId,
      type: 'swap'
    };

    if (status) {
      filter.status = status;
    }

    if (currency) {
      filter.toCurrency = currency.toUpperCase();
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch transactions with pagination
    const [transactions, total] = await Promise.all([
      History.find(filter)
        .sort({ timestamp: -1 }) // Most recent first
        .skip(skip)
        .limit(limit)
        .lean(),
      History.countDocuments(filter)
    ]);

    // Transform data to match SwapTransaction interface
    const formattedTransactions: SwapTransaction[] = transactions.map(tx => ({
      id: tx._id?.toString() || '',
      telegramId: tx.telegramId,
      fromAmount: tx.amount || 0,
      toCurrency: tx.toCurrency || '',
      toAmount: tx.metadata?.toAmount || 0,
      conversionRate: tx.exchangeRate || 0,
      status: tx.status === 'completed' ? 'completed' : 
              tx.status === 'failed' ? 'failed' : 'pending',
      transactionId: tx.transactionId,
      createdAt: tx.timestamp?.toISOString() || new Date().toISOString(),
      updatedAt: tx.updatedAt?.toISOString() || tx.timestamp?.toISOString() || new Date().toISOString(),
      txHash: tx.txHash,
      fees: tx.fees || 0
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      message: `Found ${formattedTransactions.length} swap transactions`,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    } as SwapHistoryResponse);

  } catch (error :any) {

    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch swap history',
      errorCode: 'INTERNAL_ERROR'
    } as SwapHistoryResponse, { status: 500 });
  }
}

// Handle POST requests for creating manual swap history entries (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      telegramId, 
      fromAmount, 
      toCurrency, 
      toAmount, 
      status = 'completed',
      transactionId,
      txHash 
    } = body;

    // Validate required fields
    if (!telegramId || !fromAmount || !toCurrency || !toAmount) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields (telegramId, fromAmount, toCurrency, toAmount)',
        errorCode: 'INVALID_INPUT'
      } as SwapHistoryResponse, { status: 400 });
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskup');
    }

    // Create history record
    const swapHistory = new History({
      telegramId,
      type: 'swap',
      action: `Manual swap: ${fromAmount} points to ${toAmount} ${toCurrency.toUpperCase()}`,
      amount: fromAmount,
      currency: 'POINTS',
      status,
      transactionId: transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      txHash: txHash || `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`,
      fromCurrency: 'POINTS',
      toCurrency: toCurrency.toUpperCase(),
      exchangeRate: toAmount / fromAmount,
      fees: 0,
      metadata: {
        toAmount,
        swapType: 'manual_entry',
        isManual: true
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || undefined,
      timestamp: new Date()
    });

    await swapHistory.save();

    const formattedTransaction: SwapTransaction = {
      id: swapHistory._id?.toString() || '',
      telegramId: swapHistory.telegramId,
      fromAmount: swapHistory.amount || 0,
      toCurrency: swapHistory.toCurrency || '',
      toAmount: swapHistory.metadata?.toAmount || 0,
      conversionRate: swapHistory.exchangeRate || 0,
      status: swapHistory.status === 'completed' ? 'completed' : 
              swapHistory.status === 'failed' ? 'failed' : 'pending',
      transactionId: swapHistory.transactionId,
      createdAt: swapHistory.timestamp?.toISOString() || new Date().toISOString(),
      updatedAt: swapHistory.updatedAt?.toISOString() || new Date().toISOString(),
      txHash: swapHistory.txHash,
      fees: swapHistory.fees || 0
    };

    return NextResponse.json({
      success: true,
      transactions: [formattedTransaction],
      message: 'Swap history entry created successfully'
    } as SwapHistoryResponse);

  } catch (error) {
    console.error('Create swap history error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create swap history entry',
      errorCode: 'INTERNAL_ERROR'
    } as SwapHistoryResponse, { status: 500 });
  }
}
