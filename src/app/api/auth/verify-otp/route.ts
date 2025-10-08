import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import otpService from '@/lib/otpService';
import emailService from '@/lib/emailService';
import { verifySignature } from 'auth-fingerprint';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { hash, signature, timestamp } = body;
    const { success, data } = verifySignature({ hash, signature, timestamp }, process.env.NEXTAUTH_SECRET || 'app')

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid signature '
        },
        { status: 400 }
      );
    }

    const { type, otp, email } = JSON.parse(data as string)

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and OTP are required'
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

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'OTP must be 6 digits'
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await otpService.verifyOTP(email, otp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message
        },
        { status: 401 }
      );
    }

    // Send successful login notification
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
    await emailService.sendSuccessfulLogin(email, {
      username: result.admin!.username,
      role: result.admin!.role,
      ip: clientIP,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
