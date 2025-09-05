import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

// GET /api/withdrawals/stats - Get withdrawal statistics for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    
    if (!telegramId) {
      return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
    }
    
    // Get total withdrawn amount
    const totalWithdrawnResult = await Withdrawal.aggregate([
      { $match: { telegramId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalWithdrawn = totalWithdrawnResult.length > 0 ? totalWithdrawnResult[0].total : 0;
    
    // Get withdrawal counts by status
    const statusCounts = await Withdrawal.aggregate([
      { $match: { telegramId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get recent withdrawals
    const recentWithdrawals = await Withdrawal.find({ telegramId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount status createdAt method');
    
    const stats = {
      totalWithdrawn,
      totalRequests: statusCounts.reduce((sum, item) => sum + item.count, 0),
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentWithdrawals
    };
    
    return NextResponse.json({ stats });
    
  } catch (error) {
    console.error('GET /api/withdrawals/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
