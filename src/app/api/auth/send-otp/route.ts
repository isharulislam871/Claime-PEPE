import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import otpService from '@/lib/otpService';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    const { email } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email is required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Generate and send OTP
    const result = await otpService.generateAndSendOTP(email);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });
    
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
