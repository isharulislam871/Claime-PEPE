import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coin from '@/models/Coin';

// GET /api/admin/coins - Fetch all coins
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    const active = searchParams.get('active');
    
    let query: any = {};
    if (active === 'true') {
      query.isActive = true;
    }
    
    let coins = await Coin.find(query)
      .sort({ symbol: 1 })
      .lean();
    
    // Filter by network if specified
    if (network) {
      coins = coins.filter(coin => 
        coin.networks.some((n: any) => n.network === network && n.isActive)
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      coins 
    });
  } catch (error) {
    console.error('Error fetching coins:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch coins' 
    }, { status: 500 });
  }
}

// POST /api/admin/coins - Create new coin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, symbol, decimals, networks, logoUrl, description, website, coinGeckoId } = body;
    
    // Validate networks array
    if (!networks || !Array.isArray(networks) || networks.length === 0) {
      return NextResponse.json({ 
        error: 'At least one network configuration is required' 
      }, { status: 400 });
    }
    
    // Check for duplicate contract addresses within the same network
    for (const network of networks) {
      if (network.contractAddress) {
        const existingCoin = await Coin.findOne({
          'networks.network': network.network,
          'networks.contractAddress': network.contractAddress
        });
        
        if (existingCoin) {
          return NextResponse.json({ 
            error: `Contract address already exists for ${network.network} network` 
          }, { status: 400 });
        }
      }
    }
    
    const coin = await Coin.create({
      name,
      symbol: symbol.toUpperCase(),
      decimals,
      networks,
      logoUrl,
      description,
      website,
      coinGeckoId,
      isActive: true
    });
    
    return NextResponse.json({ 
      success: true, 
      coin 
    });
  } catch (error: any) {
    console.error('Error creating coin:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'Coin symbol already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create coin' 
    }, { status: 500 });
  }
}
