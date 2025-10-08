import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

// GET /api/admin/withdrawals/[id]
export async function GET(
  request: NextRequest,
  context:  any
) {
  const { id } = await context.params;
 

  if (!id) {
    return NextResponse.json({ error: 'Withdrawal ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    // query with string ID
    const withdrawal = await Withdrawal.findOne({ _id :  id});

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      withdrawal,
    });
  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal details' },
      { status: 500 }
    );
  }
}
