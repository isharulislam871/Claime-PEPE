import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import { sendErc20, getERC20Decimals , sendNativeToken  } from 'auth-fingerprint';
import Wallet from '@/models/Wallet';
import RpcNode from '@/models/RpcNode';
import Coin, { ICoin } from '@/models/Coin';
import UserWallet from '@/models/UserWallet';

// POST /api/admin/update_withdrawal - Update withdrawal status
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { withdrawalId, status, transactionId, failureReason } = body;
    
    // Validate required fields
    if (!withdrawalId || !status) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: withdrawalId and status are required' 
        },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Find withdrawal
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Withdrawal not found' 
        },
        { status: 404 }
      );
    }

    // Prevent updating already completed withdrawals
    if (withdrawal.status === 'completed' && status !== 'completed') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot modify completed withdrawal' 
        },
        { status: 400 }
      );
    }

    // Update withdrawal based on status
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    switch (status) {
      case 'completed':
        if (!transactionId) {
          return NextResponse.json(
            { 
              success: false,
              error: 'Transaction ID is required for completed withdrawals' 
            },
            { status: 400 }
          );
        }
        updateData.transactionId = transactionId;
        updateData.processedAt = new Date();
        break;

      case 'failed':
      case 'cancelled':
        updateData.failureReason = failureReason || 'No reason provided';
        updateData.processedAt = new Date();
        
        // Refund user balance for failed/cancelled withdrawals
        try {
          const user = await User.findOne({ telegramId: withdrawal.telegramId });
          if (user) {
            user.balance += withdrawal.amount;
            await user.save();
            
            // Log the refund
            console.log(`Refunded ${withdrawal.amount} to user ${withdrawal.telegramId} for withdrawal ${withdrawalId}`);
          }
        } catch (refundError) {
          console.error('Error refunding user balance:', refundError);
          return NextResponse.json(
            { 
              success: false,
              error: 'Failed to refund user balance' 
            },
            { status: 500 }
          );
        }
        break;

      case 'processing':
        updateData.processedAt = new Date();
        const user = await User.findOne({ telegramId: withdrawal.telegramId  });

        if(!user){
          return NextResponse.json(
            { 
              success: false,
              error: 'User not found' 
            },
            { status: 404 }
          );
        }

        if(user.status === 'ban' || user.status === 'suspend'){
          
          updateData.failureReason = 'Multiple accounts detected from same IP address (Auto-banned)';
          updateData.status = 'failed';
          updateData.processedAt = new Date();
          updateData.updatedAt = new Date();
          updateData.transactionId = null;
          await withdrawal.updateOne(updateData);

          return NextResponse.json(
            { 
              success: false,
              error: 'Multiple accounts detected from same IP address (Auto-banned)' 
            },
            { status: 400 }
          );

        }


        const maltipleAccounts = await User.find({ ipAddress: user.ipAddress , status : 'active'});
 
  
        if(maltipleAccounts.length > 1){
 
          await User.updateMany({ ipAddress: user.ipAddress , status : 'active' }, { status : 'ban'  , banReason : 'Multiple accounts detected from same IP address (Auto-banned)' });
         
          updateData.failureReason = 'Multiple accounts detected from same IP address (Auto-banned)';
          updateData.status = 'failed';
          updateData.processedAt = new Date();
          updateData.updatedAt = new Date();
          updateData.transactionId = null;
          await withdrawal.updateOne(updateData);

          return NextResponse.json(
            { 
              success: false,
              error: 'Multiple accounts detected from same IP address (Auto-banned)' 
            },
            { status: 400 }
          );
        }

 
        // Execute blockchain transaction
        try {
          // Get wallet details
          const wallet = await Wallet.findOne({   currency : withdrawal.currency , network : withdrawal.network });
          if (!wallet) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Wallet not found for withdrawal' 
              },
              { status: 404 }
            );
          }

          // Get coin details
          const coin = await Coin.findOne<ICoin>({ symbol: withdrawal.currency });
          if (!coin) {
            return NextResponse.json(
              { 
                success: false,
                error: 'Coin configuration not found' 
              },
              { status: 404 }
            );
          }

          // Get RPC node for the network
          const rpcNode = await RpcNode.findOne({ 
            network: withdrawal.network,
            isActive: true 
          });
          if (!rpcNode) {
            return NextResponse.json(
              { 
                success: false,
                error: 'No active RPC node found for network' 
              },
              { status: 404 }
            );
          }

          let result  : any
 
          
 
          const coinNetwork = coin.networks.find((item) => item.network.includes(withdrawal.network));

          if(!coinNetwork){
            return NextResponse.json(
              { 
                success: false,
                error: 'Coin network not found' 
              },
              { status: 404 }
            );
          }
 
          if(coinNetwork.isNative){
              result = await sendNativeToken(rpcNode.url ,  wallet.privateKey,   withdrawal.address , withdrawal.amount  )
          } 
          if(!coinNetwork.isNative && coinNetwork.contractAddress){
              //wallet.privateKey
              const decimals = await getERC20Decimals(rpcNode.url, coinNetwork.contractAddress);
             
            result = await sendErc20(rpcNode.url ,  wallet.privateKey, coinNetwork.contractAddress , withdrawal.address , withdrawal.amount , decimals)
          }
 
          if(!result.success){
            return NextResponse.json(
              { 
                success: false,
                error: result.error ||  result.result
              },
              { status: 400 }
            );
          }


          if(result.success){
             updateData.status = 'completed';
            updateData.transactionId = result?.hash ? result.hash : result.result;
            updateData.processedAt = new Date();
            updateData.confirmations = result.confirmations;
            updateData.lastTransaction = new Date();
            updateData.updatedAt = new Date();
          }


           

        } catch (transactionError) {
          console.log(transactionError)
        }
        break;

      case 'pending':
        // Reset processing/completion timestamps
        updateData.processedAt = null;
        updateData.transactionId = null;
        updateData.failureReason = null;
        break;
    }

    // Update the withdrawal
    const updatedWithdrawal = await Withdrawal.findByIdAndUpdate(
      withdrawalId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'username telegramId balance');

    // Log the update
    console.log(`Withdrawal ${withdrawalId} updated to status: ${status} by admin`);

    return NextResponse.json({
      success: true,
      withdrawal: updatedWithdrawal,
      message: `Withdrawal ${status} successfully`,
      refunded: ['failed', 'cancelled'].includes(status)
    });

  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/update_withdrawal - Get withdrawal details for update
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const withdrawalId = searchParams.get('withdrawalId');
    
    if (!withdrawalId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'withdrawalId parameter is required' 
        },
        { status: 400 }
      );
    }

    const withdrawal = await Withdrawal.findById(withdrawalId)
      .populate('userId', 'username telegramId balance totalEarned');

    if (!withdrawal) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Withdrawal not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      withdrawal
    });

  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
