import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
  
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const network = searchParams.get('network');  

    if (!address) {
      return NextResponse.json({ 
        error: 'Missing required parameter: address' 
      }, { status: 400 });
    }

    await connectDB();

    // Find wallet in database
    const wallet = await Wallet.findOne({ address });
    if (!wallet) {
      return NextResponse.json({ 
        error: 'Wallet not found in database' 
      }, { status: 404 });
    }

    let realBalance = '0';
    let tokenInfo = null;

 
 
    return NextResponse.json({ 
      success: true, 
      wallet: {
        ...wallet.toJSON(),
        realTimeBalance: realBalance
      },
      network,
      tokenInfo
    });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return NextResponse.json({ 
      error: 'Failed to get wallet balance' 
    }, { status: 500 });
  }
}
