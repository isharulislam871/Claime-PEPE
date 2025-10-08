import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RpcNode from '@/models/RpcNode';

// PUT /api/admin/rpc-nodes/[id] - Update RPC node
export async function PUT(
  request: NextRequest,
context : any
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, url, network, priority, isDefault, isActive } = body;
    const id =  await context.params.id;
    // If setting as default, unset other defaults for this network
    if (isDefault) {
      await RpcNode.updateMany(
        { network, isDefault: true, _id: { $ne:  id } },
        { isDefault: false }
      );
    }
    
    const rpcNode = await RpcNode.findByIdAndUpdate(
      id,
      {
        name,
        url,
        network,
        priority,
        isDefault,
        isActive
      },
      { new: true }
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
    return NextResponse.json({ 
      error: error.message || 'Failed to update RPC node' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/rpc-nodes/[id] - Delete RPC node
export async function DELETE(
  request: NextRequest,
  context : any
) {
  try {
    await connectDB();
    const id =  await context.params.id;
    
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
  } catch (error: any) {
    console.error('Error deleting RPC node:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete RPC node' 
    }, { status: 500 });
  }
}
