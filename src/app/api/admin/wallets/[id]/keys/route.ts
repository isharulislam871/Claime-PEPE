import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import mongoose from 'mongoose';

// GET /api/admin/wallets/[id]/keys - Get wallet private key and mnemonic (admin only)
export async function GET(
  request: NextRequest,
  context : any
) {
  try {
    const { id } = await context.params;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid wallet ID' }, { status: 400 });
    }

    await connectDB();
    
    // Get wallet with sensitive data (privateKey and mnemonic)
    const wallet = await Wallet.findById(id).select('+privateKey +mnemonic');
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      keys: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic
      }
    });
  } catch (error) {
    return NextResponse.json({  error: 'Failed to fetch wallet keys' }, { status: 500 });
  }
}
