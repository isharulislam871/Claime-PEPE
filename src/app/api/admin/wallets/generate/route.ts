import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import Wallet from '@/models/Wallet';
import dbConnect from '@/lib/mongodb';
// POST /api/admin/wallets/generate - Generate new wallet
export async function POST(request: NextRequest) {
  try {
     
    await dbConnect();
    const body = await request.json();
    const { type, currency, network } = body;

    // Validation
    if (!type || !currency || !network) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, currency, network' 
      }, { status: 400 });
    }

    if (!['hot', 'cold'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid wallet type. Must be hot or cold' 
      }, { status: 400 });
    }

    // Generate wallet using ethers library
    const wallet = ethers.Wallet.createRandom();
     await Wallet.create({
      address: wallet.address,
      type,
      currency,
      network,
      balance: 0,
      status: 'active',
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || null
    });
    
    return NextResponse.json({ 
      success: true, 
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase || null,
        type,
        currency,
        network
      }
    });
  } catch (error) {
    console.error('Error generating wallet:', error);
    return NextResponse.json({ 
      error: 'Failed to generate wallet' 
    }, { status: 500 });
  }
}
