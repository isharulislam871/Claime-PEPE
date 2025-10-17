import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UserWallet from '@/models/UserWallet';
import Withdrawal from '@/models/Withdrawal';
import Coin from '@/models/Coin';
import Activity from '@/models/Activity';
import { verifySignature, isValidAddress } from 'auth-fingerprint';
 

// Define supported network types to match ERC20Service
type SupportedNetwork = 'eth-main' | 'sepolia' | 'bsc-mainnet' | 'bsc-testnet';
// GET /api/withdrawals - Get withdrawal history for a user or all withdrawals for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const signature = searchParams.get('signature')
    const timestamp = searchParams.get('timestamp')
    const  hash = searchParams.get('hash')

   
    const limit = parseInt(searchParams.get('limit') || '100');

 
    const { data , success } = verifySignature({ hash , timestamp , signature} , process.env.NEXTAUTH_SECRET || 'app')
   
    if(!success){
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    const {  telegramId } = JSON.parse(data as string);
    

    // User request - get specific user withdrawals
      if (!telegramId) {
        return NextResponse.json({ error: 'telegramId is required' }, { status: 400 });
      }
     
    const withdrawals = await Withdrawal.find( { telegramId } ).sort({ createdAt: -1 }).limit(limit)

   
    
    // Enrich withdrawals with coin logos
    const enrichedWithdrawals = await Promise.all(
      withdrawals.map(async (withdrawal: any) => {
        const coin = await Coin.findOne({ 
          symbol: withdrawal.currency,
          isActive: true 
        });
        
        return {
          ...withdrawal.toObject(),
          coinLogo: coin?.logoUrl || null,
          coinName: coin?.name || withdrawal.currency
        };
      })
    );
    
    return NextResponse.json({ withdrawals: enrichedWithdrawals } , { status : 200});
     
    
  } catch (error) {
     
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/withdrawals - Create new withdrawal request
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { hash , signature , timestamp } = body;
    const { data , success } = verifySignature({ hash , timestamp , signature} , process.env.NEXTAUTH_SECRET || 'app')
   
    if(!success){
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    const {  amount, currency , network, address, memo , telegramId } = JSON.parse(data as string);
    
 

    if (!hash|| !amount || !currency || !network || !address || !telegramId) {
      return NextResponse.json(
        { error: 'Missing required fields: telegramId, amount, currency, network, address' },
        { status: 400 }
      );
    }
     
    // Validate network type first
    const supportedNetworks: SupportedNetwork[] = ['eth-main', 'sepolia', 'bsc-mainnet', 'bsc-testnet'];
    if (!supportedNetworks.includes(network as SupportedNetwork)) {
      return NextResponse.json(
        { error: `Network ${network} is not supported. Supported networks: ${supportedNetworks.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate currency and network combinations using Coin model
    const coin = await Coin.findOne({ 
      symbol: currency.toUpperCase(), 
      isActive: true 
    });
    
    if (!coin) {
      return NextResponse.json(
        { error: `Currency ${currency} is not supported` },
        { status: 400 }
      );
    }
    
    const validNetwork = coin.networks.find((n : any)=> 
      n.network === network && n.isActive
    );
    
    if (!validNetwork) {
      return NextResponse.json(
        { error: `Network ${network} is not supported for currency ${currency}` },
        { status: 400 }
      );
    }
    
    // Check minimum withdrawal amounts
    const minWithdrawals: { [key: string]: number } = {
      'USDT': 0.1,
      'PEPE': 1
    };
    
    const minAmount = minWithdrawals[currency.toUpperCase()];
    if (minAmount && parseFloat(amount) < minAmount) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount for ${currency.toUpperCase()} is ${minAmount}` },
        { status: 400 }
      );
    }
    
    // Get network fees from API
    let networkFee = 0;
    
    // Set network fees for specific currencies
    const networkFees: { [key: string]: number } = {
      'USDT': 0.03,
      'PEPE': 1
    };
    
    networkFee = networkFees[currency.toUpperCase()] || 0;
    
    const totalAmount = parseFloat(amount) + networkFee;
    
  
    
    // Get user and wallet, check balance
    const user = await User.findByTelegramId(telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

  

    // Check user's own activity requirements: minimum 10 ad views and at least 1 task completion
    const adViewCount = await Activity.countDocuments({ 
      telegramId, 
      type: 'ad_view' 
    });
    
    const taskCompleteCount = await Activity.countDocuments({ 
      telegramId, 
      type: 'task_complete' 
    });
    
    if (adViewCount < 10) {
      return NextResponse.json({ 
        error: `Insufficient activity. You need at least 10 ad views to withdraw. Current: ${adViewCount}`,
        code: 'INSUFFICIENT_AD_VIEWS',
        required: 10,
        current: adViewCount
      }, { status: 400 });
    }
    
    if (taskCompleteCount < 1) {
      return NextResponse.json({ 
        error: `Insufficient activity. You need to complete at least 1 task to withdraw. Current: ${taskCompleteCount}`,
        code: 'INSUFFICIENT_TASK_COMPLETION',
        required: 1,
        current: taskCompleteCount
      }, { status: 400 });
    }
    
    const userWallet = await UserWallet.findOne({ telegramId , currency});
    if (!userWallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 });
    }
    
    // Check wallet balance for the specific currency
    const walletBalance = userWallet.balance || 0;
    const requiredBalance = totalAmount;
    
    if (walletBalance < requiredBalance) {
      return NextResponse.json(
        { error: `Insufficient ${currency.toUpperCase()} balance. Available: ${walletBalance}, Required: ${requiredBalance}` },
        { status: 400 }
      );
      
    }


    if(address){
     const  isAddress =  isValidAddress(address)
       
      if (!isAddress) {
        return NextResponse.json(
          { error: `Invalid address format. Address: ${address}` },
          { status: 400 }
        );
      }

    }
      
    
  
    
    // Create withdrawal request
    const withdrawal = new Withdrawal({
      userId: String(user._id),
      telegramId,
      username: user.username,
      amount: parseFloat(amount),
      method: network, // Use network as method for compatibility
      walletId: address, // Use address as walletId for compatibility
      currency: currency.toUpperCase(),
      network,
      address,
      memo: memo || '',
      networkFee,
      // Set initial status based on transfer type
      status: 'pending'
    });
    
    await withdrawal.save();
    
    // Deduct amount from user wallet balance
    await UserWallet.findOneAndUpdate(
      { telegramId , currency},
      { $inc: { balance :  -requiredBalance } }
    );
    
    
    return NextResponse.json({ 
      withdrawal,
      message:   'Withdrawal request submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
   console.log(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

 