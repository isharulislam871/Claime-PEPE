import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RpcNode from '@/models/RpcNode';
import { ethers } from 'ethers';

// POST /api/admin/rpc-nodes/health-check - Check health of RPC nodes
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { nodeId, network } = body;
    
    let nodesToCheck = [];
    
    if (nodeId) {
      // Check specific node
      const node = await RpcNode.findById(nodeId);
      if (node) {
        nodesToCheck = [node];
      }
    } else if (network) {
      // Check all nodes for specific network
      nodesToCheck = await RpcNode.find({ network, isActive: true });
    } else {
      // Check all active nodes
      nodesToCheck = await RpcNode.find({ isActive: true });
    }
    
    const results = [];
    
    for (const node of nodesToCheck) {
      const startTime = Date.now();
      let status = 'offline';
      let responseTime = null;
      let blockHeight = null;
      
      try {
        const provider = new ethers.JsonRpcProvider(node.url);
        
        // Test connection and get block number
        blockHeight = await provider.getBlockNumber();
        responseTime = Date.now() - startTime;
        status = 'online';
        
        // Update node status in database
        await RpcNode.findByIdAndUpdate(node._id, {
          status,
          responseTime,
          blockHeight,
          lastChecked: new Date()
        });
        
        results.push({
          nodeId: node._id,
          name: node.name,
          url: node.url,
          status,
          responseTime,
          blockHeight
        });
        
      } catch (error) {
        status = 'error';
        responseTime = Date.now() - startTime;
        
        // Update node status in database
        await RpcNode.findByIdAndUpdate(node._id, {
          status,
          responseTime,
          lastChecked: new Date()
        });
        
        results.push({
          nodeId: node._id,
          name: node.name,
          url: node.url,
          status,
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      checkedCount: results.length
    });
  } catch (error) {
    console.error('Error checking RPC node health:', error);
    return NextResponse.json({ 
      error: 'Failed to check RPC node health' 
    }, { status: 500 });
  }
}
