import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Maintenance, MaintenanceStatus } from '@/models/Maintenance';


// GET /api/maintenance - Check maintenance status
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get maintenance status from database
    let maintenanceDoc = await Maintenance.findOne({ _id: 'system' });
    
    // If no maintenance document exists, create default one
    if (!maintenanceDoc) {
      maintenanceDoc = new Maintenance({
        _id: 'system',
        enabled: false,
        message: 'We are currently performing scheduled maintenance to improve our services.',
        estimatedCompletion: null,
        lastUpdated: new Date().toISOString(),
        progress: 0,
        currentStep: 'Preparing maintenance...'
      });
      
      await maintenanceDoc.save();
    }

    // Convert to plain object and remove MongoDB _id and __v
    const maintenanceStatus = {
      enabled: maintenanceDoc.enabled,
      message: maintenanceDoc.message,
      estimatedCompletion: maintenanceDoc.estimatedCompletion,
      lastUpdated: maintenanceDoc.lastUpdated,
      progress: maintenanceDoc.progress,
      currentStep: maintenanceDoc.currentStep
    };

    return NextResponse.json({
      maintenance: maintenanceStatus
    });
  } catch (error) {
    console.error('Error getting maintenance status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/maintenance - Update maintenance status (admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { enabled, message, estimatedCompletion, progress, currentStep } = body;

    // Get existing maintenance document or create new one
    let maintenanceDoc = await Maintenance.findOne({ _id: 'system' });
    
    if (!maintenanceDoc) {
      maintenanceDoc = new Maintenance({ _id: 'system' });
    }

    // Update maintenance status with provided values
    const updateData: Partial<MaintenanceStatus> = {
      lastUpdated: new Date().toISOString()
    };

    if (enabled !== undefined) updateData.enabled = enabled;
    if (message) updateData.message = message;
    if (estimatedCompletion !== undefined) updateData.estimatedCompletion = estimatedCompletion;
    if (progress !== undefined) updateData.progress = progress;
    if (currentStep) updateData.currentStep = currentStep;

    // Update the document
    await Maintenance.updateOne(
      { _id: 'system' },
      { $set: updateData },
      { upsert: true }
    );

    // Get updated document
    const updatedDoc = await Maintenance.findOne({ _id: 'system' });

    const maintenanceStatus = {
      enabled: updatedDoc.enabled,
      message: updatedDoc.message,
      estimatedCompletion: updatedDoc.estimatedCompletion,
      lastUpdated: updatedDoc.lastUpdated,
      progress: updatedDoc.progress,
      currentStep: updatedDoc.currentStep
    };

    return NextResponse.json({
      success: true,
      maintenance: maintenanceStatus,
      message: 'Maintenance status updated successfully'
    });

  } catch (error) {
    console.error('Error updating maintenance status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
