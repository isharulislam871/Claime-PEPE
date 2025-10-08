import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SystemSettings from '@/models/SystemSettings';
import { verifySignature } from 'auth-fingerprint';

// GET /api/system-settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const settings = await SystemSettings.getSettings();

    return NextResponse.json({
      success: true,
      result: {
        platformName: settings.platformName,
        platformDescription: settings.platformDescription,
        supportEmail: settings.supportEmail,
        allowUserRegistration: settings.allowUserRegistration,
        referralBonus: settings.referralBonus,
        newUserBonus: settings.newUserBonus,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// PUT /api/system-settings - Update system settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { timestamp, hash, signature, ...updates } = body;

    // Verify signature for security
    if (!timestamp || !hash || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required authentication parameters'
      }, { status: 400 });
    }

    const { success } = verifySignature({ timestamp, hash, signature }, process.env.NEXTAUTH_SECRET || 'app');

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid signature'
      }, { status: 401 });
    }

    // Validate update fields
    const allowedFields = [
      'platformName',
      'platformDescription', 
      'supportEmail',
      'allowUserRegistration',
      'referralBonus',
      'newUserBonus'
    ];

    const filteredUpdates: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid fields to update'
      }, { status: 400 });
    }

    // Validate specific fields
    if (filteredUpdates.supportEmail && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(filteredUpdates.supportEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    if (filteredUpdates.referralBonus !== undefined && (typeof filteredUpdates.referralBonus !== 'number' || filteredUpdates.referralBonus < 0)) {
      return NextResponse.json({
        success: false,
        error: 'Referral bonus must be a non-negative number'
      }, { status: 400 });
    }

    if (filteredUpdates.newUserBonus !== undefined && (typeof filteredUpdates.newUserBonus !== 'number' || filteredUpdates.newUserBonus < 0)) {
      return NextResponse.json({
        success: false,
        error: 'New user bonus must be a non-negative number'
      }, { status: 400 });
    }

    const updatedSettings = await SystemSettings.updateSettings(filteredUpdates);

    return NextResponse.json({
      success: true,
      message: 'System settings updated successfully',
      result: {
        platformName: updatedSettings.platformName,
        platformDescription: updatedSettings.platformDescription,
        supportEmail: updatedSettings.supportEmail,
        allowUserRegistration: updatedSettings.allowUserRegistration,
        referralBonus: updatedSettings.referralBonus,
        newUserBonus: updatedSettings.newUserBonus,
        updatedAt: updatedSettings.updatedAt
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}
