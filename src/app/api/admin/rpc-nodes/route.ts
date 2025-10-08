import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RpcNode from '@/models/RpcNode';
 
// GET /api/admin/rpc-nodes - Fetch all RPC nodes
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    
    let query = {};
    if (network) {
      query = { network };
    }
    
    const rpcNodes = await RpcNode.find(query)
      .sort({ network: 1, priority: 1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      rpcNodes 
    });
  } catch (error) {
    console.error('Error fetching RPC nodes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch RPC nodes' 
    }, { status: 500 });
  }
}

// POST /api/admin/rpc-nodes - Create new RPC node
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, url, network, priority, isDefault } = body;
    
    // If setting as default, unset other defaults for this network
    if (isDefault) {
      await RpcNode.updateMany(
        { network, isDefault: true },
        { isDefault: false }
      );
    }
    
    const rpcNode = await RpcNode.create({
      name,
      url,
      network,
      priority: priority || 1,
      isDefault: isDefault || false,
      isActive: true,
      status: 'offline'
    });
    
    return NextResponse.json({ 
      success: true, 
      rpcNode 
    });
  } catch (error: any) {
    console.error('Error creating RPC node:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create RPC node' 
    }, { status: 500 });
  }
}
