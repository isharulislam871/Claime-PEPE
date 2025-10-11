import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Withdrawal from '@/models/Withdrawal';

// Database connection
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// GET /api/admin/withdrawals/[id]
export async function GET(
  request: NextRequest,
  context:  any
) {
  const { id } = await context.params;
 

  if (!id) {
    return NextResponse.json({ error: 'Withdrawal ID is required' }, { status: 400 });
  }

  await connectDB();

  try {
    // query with string ID
    const withdrawal = await Withdrawal.findOne({ _id :  id});

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: withdrawal,
    });
  } catch (error) {
    console.error('Error fetching withdrawal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch withdrawal details' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/withdrawals/[id] - Update withdrawal status
export async function PUT(
  request: NextRequest,
  context: any
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ 
      success: false, 
      error: 'Withdrawal ID is required' 
    }, { status: 400 });
  }

  await connectDB();

  try {
    const body = await request.json();
    const { status, transactionId, failureReason, adminNotes } = body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status provided'
      }, { status: 400 });
    }

    // Find the withdrawal
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return NextResponse.json({
        success: false,
        error: 'Withdrawal not found'
      }, { status: 404 });
    }

    // Update withdrawal based on status
    withdrawal.status = status;
    
    if (status === 'processing') {
      withdrawal.markAsProcessing();
    } else if (status === 'completed') {
      withdrawal.markAsCompleted(transactionId);
    } else if (status === 'failed') {
      withdrawal.markAsFailed(failureReason || 'No reason provided');
    }

    // Add admin notes if provided
    if (adminNotes) {
      withdrawal.adminNotes = adminNotes;
    }

    await withdrawal.save();

    return NextResponse.json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update withdrawal' },
      { status: 500 }
    );
  }
}
