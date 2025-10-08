import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdsSettings from '@/models/AdsSettings';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get ads settings from database
    let adsSettings = await AdsSettings.findOne();
    
    // If no settings exist, create default settings
    if (!adsSettings) {
      return NextResponse.json(
        { success: false,  erorr : 'Not confingtions ads' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: adsSettings
    });
  } catch (error) {
   
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ads settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Update or create ads settings in database
    const updatedSettings = await AdsSettings.findOneAndUpdate(
      {}, // Empty filter to find the single settings document
      body,
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validation
      }
    );
    
 
    
    return NextResponse.json({
      success: true,
      message: 'Ads settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
  
    return NextResponse.json(
      { success: false, error: 'Failed to update ads settings' },
      { status: 500 }
    );
  }
}
