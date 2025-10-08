import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coin from '@/models/Coin';
 
export async function PUT(
  request: NextRequest,
 context : any
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, symbol, decimals, networks, logoUrl, description, website, coinGeckoId, isActive } = body;
    const params = await context.params;
    const id = params.id;
    // Validate networks array
    if (!networks || !Array.isArray(networks) || networks.length === 0) {
      return NextResponse.json({ 
        error: 'At least one network configuration is required' 
      }, { status: 400 });
    }
    
    // Check for duplicate contract addresses within the same network (excluding current coin)
    for (const network of networks) {
      if (network.contractAddress) {
        const existingCoin = await Coin.findOne({
          _id: { $ne: id },
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
    
    const coin = await Coin.findByIdAndUpdate(
     id,
      {
        name,
        symbol: symbol.toUpperCase(),
        decimals,
        networks,
        logoUrl,
        description,
        website,
        coinGeckoId,
        isActive
      },
      { new: true }
    );
    
    if (!coin) {
      return NextResponse.json({ 
        error: 'Coin not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      coin 
    });
  } catch (error: any) {
    console.error('Error updating coin:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'Coin symbol already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to update coin' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/coins/[id] - Delete coin
export async function DELETE(
  request: NextRequest,
  context : any
) {
  try {
    await connectDB();
    const params = await context.params;
    const id = params.id;
    
    const coin = await Coin.findByIdAndDelete(id);
    
    if (!coin) {
      return NextResponse.json({ 
        error: 'Coin not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Coin deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting coin:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete coin' 
    }, { status: 500 });
  }
}
