import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
 
// GET /api/withdrawals/status - Check withdrawal status from Binance
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const withdrawalId = searchParams.get('withdrawalId');
    
    if (!withdrawalId) {
      return NextResponse.json({ error: 'withdrawalId is required' }, { status: 400 });
    }
    
    // Get withdrawal from database
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }
    
    // If withdrawal is already completed or failed, return current status
    if (['completed', 'failed', 'cancelled'].includes(withdrawal.status)) {
      return NextResponse.json({ 
        withdrawal: {
          id: withdrawal._id,
          status: withdrawal.status,
          transactionId: withdrawal.transactionId,
          
          failureReason: withdrawal.failureReason
        }
      });
    }
    
     
    return NextResponse.json({ 
      withdrawal: {
        id: withdrawal._id,
        status: withdrawal.status,
        transactionId: withdrawal.transactionId,
        failureReason: withdrawal.failureReason
      }
    });
    
  } catch (error) {
    console.error('GET /api/withdrawals/status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
