import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
 
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
