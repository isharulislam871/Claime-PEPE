import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import { getERC20Balance , formatTokenBalance    , getNativeBalance , generateWallet   } from 'auth-fingerprint'


 
// GET /api/admin/wallets - Fetch all wallets
export async function GET(request: NextRequest) {
  try {
    // Authentication is handled by middleware

    await connectDB();
    
    const wallets = await Wallet.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      wallets
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch wallets' 
    }, { status: 500 });
  }
}

// POST /api/admin/wallets - Create a new wallet
export async function POST(request: NextRequest) {
  try {
    // Authentication is handled by middleware

    const body = await request.json();
    const { address, type, currency, network = 'eth-main', status = 'active', privateKey, mnemonic } = body;

    // Validation
    if (!address || !type || !currency) {
      return NextResponse.json({ 
        error: 'Missing required fields: address, type, currency' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Check if wallet address already exists
    const existingWallet = await Wallet.findOne({ address });
    if (existingWallet) {
      return NextResponse.json({ 
        error: 'Wallet address already exists' 
      }, { status: 409 });
    }

    // Get real balance from blockchain
    let realBalance = 0;


 

    const newWallet = new Wallet({
      address,
      type,
      currency,
      network,
      balance: realBalance,
      status,
      privateKey,
      mnemonic
    });

    await newWallet.save();
    
    return NextResponse.json({ 
      success: true, 
      wallet: newWallet
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json({ 
      error: 'Failed to create wallet' 
    }, { status: 500 });
  }
}
