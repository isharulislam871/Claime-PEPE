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
