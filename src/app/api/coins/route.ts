import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coin from '@/models/Coin';

// GET /api/coins - Public endpoint to fetch active coins for withdrawal
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    
    // Only fetch active coins
    let query: any = { isActive: true };
    
    let coins = await Coin.find(query)
      .sort({ symbol: 1 })
      .lean();
    
    // Filter by network if specified and only include active networks
    if (network) {
      coins = coins.filter(coin => 
        coin.networks.some((n: any) => n.network === network && n.isActive)
      );
    }
    
    // Transform data for frontend consumption
    const transformedCoins = coins.map(coin => ({
      symbol: coin.symbol,
      name: coin.name,
      decimals: coin.decimals,
      logoUrl: coin.logoUrl,
      networks: coin.networks
        .filter((n: any) => n.isActive)
        .map((n: any) => ({
          network: n.network,
          contractAddress: n.contractAddress,
          isNative: n.isNative
        }))
    }));
    
    return NextResponse.json({ 
      success: true, 
      coins: transformedCoins 
    });
  } catch (error) {
    console.error('Error fetching coins:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch coins' 
    }, { status: 500 });
  }
}
