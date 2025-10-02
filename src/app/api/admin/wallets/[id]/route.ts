import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import mongoose from 'mongoose';
 

// PUT /api/admin/wallets/[id] - Update wallet
export async function PUT(
  request: NextRequest,
  context : any
) {
  try {
  

   

    const { id } = await context.params;
    const body = await request.json();
    const { address, type, currency, status  , network } = body;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid wallet ID' }, { status: 400 });
    }

    if (type && !['hot', 'cold'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid wallet type. Must be hot or cold' 
      }, { status: 400 });
    }

    if (status && !['active', 'inactive', 'maintenance'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be active, inactive, or maintenance' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Check if wallet exists
    const existingWallet = await Wallet.findById(id);
    if (!existingWallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }
   

    // If address is being updated, check for duplicates
    if (address && address !== existingWallet.address) {
      const duplicateWallet = await Wallet.findOne({ 
        address, 
        _id: { $ne: id } 
      });
      if (duplicateWallet) {
        return NextResponse.json({ 
          error: 'Wallet address already exists' 
        }, { status: 409 });
      }
    }

    // Update wallet
    const updateData: any = {};
    if (address) updateData.address = address;
    if (type) updateData.type = type;
    if (currency) updateData.currency = currency;
    if (status) updateData.status = status;
    if (network) updateData.network = network;

    const wallet = await Wallet.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      wallet  
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json({ 
      error: 'Failed to update wallet' 
    }, { status: 500 });
  }
}

// DELETE /api/admin/wallets/[id] - Delete wallet
export async function DELETE(
  request: NextRequest,
  context : any
) {
  try {
    // Authentication is handled by middleware

    const { id } = await context.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid wallet ID' }, { status: 400 });
    }

    await connectDB();
    
    // Check if wallet exists
    const existingWallet = await Wallet.findById(id);
    if (!existingWallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if wallet has balance (safety check)
    if (existingWallet.balance > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete wallet with non-zero balance. Please transfer funds first.' 
      }, { status: 400 });
    }

    // Delete wallet
    const result = await Wallet.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Wallet deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json({ 
      error: 'Failed to delete wallet' 
    }, { status: 500 });
  }
}
