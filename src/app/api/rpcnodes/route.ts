import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RpcNode from '@/models/RpcNode';

// GET /api/rpcnodes - Fetch RPC nodes with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
  
    const isDefault = searchParams.get('isDefault');
    
    // Build query object
    let query: any = {};
    
    if (network) {
      query.network = network;
    }
    
    if (isDefault !== null) {
      query.isDefault = isDefault === 'true';
    }
    
    const rpcNodes = await RpcNode.find(query)
      .sort({ priority: 1, createdAt: -1 })
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

// POST /api/rpcnodes - Create a new RPC node
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, url, network, isActive, isDefault, priority } = body;
    
    // Validate required fields
    if (!name || !url || !network) {
      return NextResponse.json({ 
        error: 'Name, URL, and network are required' 
      }, { status: 400 });
    }
    
    // If setting as default, unset other defaults for the same network
    if (isDefault) {
      await RpcNode.updateMany(
        { network, isDefault: true },
        { isDefault: false }
      );
    }
    
    const rpcNode = new RpcNode({
      name,
      url,
      network,
      isActive: isActive !== undefined ? isActive : true,
      isDefault: isDefault || false,
      priority: priority || 1,
      status: 'offline'
    });
    
    await rpcNode.save();
    
    return NextResponse.json({ 
      success: true, 
      rpcNode 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating RPC node:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'RPC node with this URL already exists' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create RPC node' 
    }, { status: 500 });
  }
}

// PUT /api/rpcnodes - Update an existing RPC node
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, name, url, network, isActive, isDefault, priority, status, responseTime, blockHeight } = body;
    
    if (!id) {
      return NextResponse.json({ 
        error: 'RPC node ID is required' 
      }, { status: 400 });
    }
    
    // If setting as default, unset other defaults for the same network
    if (isDefault) {
      await RpcNode.updateMany(
        { network, isDefault: true, _id: { $ne: id } },
        { isDefault: false }
      );
    }
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (network !== undefined) updateData.network = network;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (responseTime !== undefined) updateData.responseTime = responseTime;
    if (blockHeight !== undefined) updateData.blockHeight = blockHeight;
    
    // Update lastChecked if status is being updated
    if (status !== undefined) {
      updateData.lastChecked = new Date();
    }
    
    const rpcNode = await RpcNode.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!rpcNode) {
      return NextResponse.json({ 
        error: 'RPC node not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      rpcNode 
    });
  } catch (error: any) {
    console.error('Error updating RPC node:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({ 
        error: 'RPC node with this URL already exists' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update RPC node' 
    }, { status: 500 });
  }
}

// DELETE /api/rpcnodes - Delete an RPC node
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'RPC node ID is required' 
      }, { status: 400 });
    }
    
    const rpcNode = await RpcNode.findByIdAndDelete(id);
    
    if (!rpcNode) {
      return NextResponse.json({ 
        error: 'RPC node not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'RPC node deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting RPC node:', error);
    return NextResponse.json({ 
      error: 'Failed to delete RPC node' 
    }, { status: 500 });
  }
}
