import { NextRequest, NextResponse } from 'next/server';
import  connectDB   from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';

interface InvestigationEntry {
  _id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  oldStatus?: string;
  newStatus?: string;
}

// GET - Fetch individual fraud alert details
export async function GET(  request: NextRequest , context: any) {
  try {
    await connectDB();

    const alertId = await context.params.id;

    // Find user by ID (alert ID is the user ID in our case)
    const user = await User.findById(alertId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fraud alert not found'
        },
        { status: 404 }
      );
    }

    // Type assertion for metadata access
    const userDoc = user as any;

    // Build fraud alert details
    const alertType = user.referralCount > 100 ? 'multiple_accounts' :
                     user.referralCount > 50 ? 'referral_abuse' :
                     user.totalEarned > 200000 ? 'bot_behavior' :
                     user.balance > 50000 ? 'withdrawal_pattern' : 'suspicious_activity';

    const severity = (user.totalEarned > 500000 || user.referralCount > 200) ? 'critical' :
                    (user.totalEarned > 200000 || user.referralCount > 100 || user.balance > 100000) ? 'high' :
                    (user.totalEarned > 100000 || user.referralCount > 50 || user.balance > 50000) ? 'medium' : 'low';

    const riskScore = Math.min(100, 
      (user.totalEarned / 10000) * 10 + 
      user.referralCount * 2 + 
      (user.status === 'active' ? 20 : 0)
    );

    const description = alertType === 'multiple_accounts' ? 'Multiple accounts detected from same source' :
                       alertType === 'referral_abuse' ? 'Suspicious referral patterns detected' :
                       alertType === 'bot_behavior' ? 'Automated behavior patterns detected' :
                       alertType === 'withdrawal_pattern' ? 'Unusual withdrawal patterns detected' :
                       'Suspicious activity patterns detected';

    const fraudStatus = userDoc.metadata?.fraudAlert?.status ||
                       (user.status === 'ban' ? 'resolved' :
                        user.status === 'suspend' ? 'investigating' : 'pending');

    // Get investigation history from user activities
    const investigationHistory = await Activity.find({
      userId: user.telegramId,
      type: { $in: ['fraud_alert', 'status_change', 'investigation'] }
    }).sort({ createdAt: -1 }).limit(10);

    const formattedHistory: InvestigationEntry[] = investigationHistory.map((entry, index) => ({
      _id: entry._id.toString(),
      action: entry.type.replace('_', ' '),
      description: entry.description,
      performedBy: entry.metadata?.performedBy || 'system',
      timestamp: entry.createdAt.toISOString(),
      oldStatus: entry.metadata?.oldStatus,
      newStatus: entry.metadata?.newStatus
    }));

    // Get related accounts (mock implementation)
    const relatedAccounts = alertType === 'multiple_accounts' || alertType === 'referral_abuse' 
      ? [`related_${user.telegramId}_1`, `related_${user.telegramId}_2`]
      : [];

    // Get transaction pattern from activity
    const transactions = await Activity.find({
      userId: user.telegramId,
      type: { $in: ['earning', 'withdrawal'] }
    }).sort({ createdAt: -1 }).limit(20);

    const transactionPattern = transactions.map(tx => ({
      date: tx.createdAt.toISOString().split('T')[0],
      amount: tx.amount,
      type: tx.type
    }));

    // Build complete fraud alert object
    const fraudAlert = {
      _id: alertId,
      userId: user._id.toString(),
      username: user.username,
      telegramId: user.telegramId,
      alertType,
      severity,
      description,
      details: {
        ipAddress: user.ipAddress || 'Unknown',
        deviceFingerprint: userDoc.metadata?.deviceFingerprint || `fp_${user.telegramId}`,
        suspiciousTransactions: transactions.length,
        relatedAccounts,
        riskScore: Math.round(riskScore),
        userAgent: userDoc.metadata?.userAgent || 'Unknown',
        location: userDoc.metadata?.location || 'Unknown',
        transactionPattern,
        totalEarned: user.totalEarned,
        balance: user.balance,
        referralCount: user.referralCount,
        behaviorAnalysis: {
          loginFrequency: user.totalEarned > 100000 ? 'Very High' : 'Normal',
          taskCompletionRate: user.totalEarned > 50000 ? '98%' : '75%',
          referralPattern: user.referralCount > 20 ? 'Suspicious' : 'Normal',
          withdrawalTiming: alertType === 'withdrawal_pattern' ? 'Coordinated' : 'Normal'
        }
      },
      status: fraudStatus,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      assignedTo: userDoc.metadata?.fraudAlert?.assignedTo || userDoc.metadata?.assignedInvestigator || null,
      notes: userDoc.metadata?.fraudAlert?.notes || userDoc.metadata?.investigationNotes || null,
      investigationHistory: formattedHistory,
      relatedAlerts: [] // Could be populated with other alerts for this user
    };

    // Get user profile data
    const userProfile = {
      _id: user._id.toString(),
      username: user.username,
      telegramId: user.telegramId,
      balance: user.balance,
      totalEarned: user.totalEarned,
      referralCount: user.referralCount,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      lastActivity: user.updatedAt.toISOString(),
      ipHistory:  user.ipAddress,
      deviceHistory: [`fp_${user.telegramId}`]
    };

    return NextResponse.json({
      success: true,
      data: {
        alert: fraudAlert,
        userProfile
      }
    });

  } catch (error) {
    console.error('Error fetching fraud alert details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fraud alert details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update fraud alert status and details
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    await connectDB();

    const alertId = await context.params.id;
    const body = await request.json();
    const { status, assignedTo, notes, performedBy = 'admin' } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status is required'
        },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['pending', 'investigating', 'resolved', 'false_positive'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(alertId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fraud alert not found'
        },
        { status: 404 }
      );
    }

    // Get current fraud alert status
    const userDoc = user as any; // Type assertion for metadata access
    const oldStatus = userDoc.metadata?.fraudAlert?.status || 
                     (user.status === 'ban' ? 'resolved' : 
                      user.status === 'suspend' ? 'investigating' : 'pending');

    // Update user metadata
    const updateData: any = {
      'metadata.fraudAlert.status': status,
      'metadata.fraudAlert.updatedAt': new Date(),
      'metadata.fraudAlert.performedBy': performedBy,
      updatedAt: new Date()
    };

    if (assignedTo) {
      updateData['metadata.fraudAlert.assignedTo'] = assignedTo;
      updateData['metadata.assignedInvestigator'] = assignedTo;
    }

    if (notes) {
      updateData['metadata.fraudAlert.notes'] = notes;
      updateData['metadata.investigationNotes'] = notes;
    }

    // Initialize metadata object if it doesn't exist
    if (!userDoc.metadata) {
      updateData['metadata'] = {
        fraudAlert: {
          status,
          updatedAt: new Date(),
          performedBy
        }
      };
    }

    // Update user account status based on fraud alert resolution
    if (status === 'resolved') {
      // Ban user account for resolved fraud cases
      updateData.status = 'ban';
    } else if (status === 'investigating') {
      // Suspend user account during investigation
      updateData.status = 'suspend';
    } else if (status === 'false_positive') {
      // Restore user account if false positive
      updateData.status = 'active';
    }
    // For 'pending' status, keep current user status

    await User.findByIdAndUpdate(alertId, updateData, { new: true });

    // Create activity entry for status change
    await Activity.create({
      userId: user.telegramId,
      type: 'investigation',
      description: `Fraud alert status updated from ${oldStatus} to ${status}${notes ? ` - Notes: ${notes}` : ''}`,
      amount: 0,
      metadata: {
        action: 'status_change',
        alertId,
        oldStatus,
        newStatus: status,
        performedBy,
        assignedTo,
        notes,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Fraud alert status updated to ${status}`,
      data: {
        alertId,
        userId: user._id.toString(),
        username: user.username,
        telegramId: user.telegramId,
        oldStatus,
        newStatus: status,
        assignedTo,
        notes,
        userStatus: updateData.status,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating fraud alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update fraud alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 