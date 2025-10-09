import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifySignature, generateSignature } from 'auth-fingerprint';
import emailService from '@/lib/emailService';
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Parse request body
        const body = await request.json();
        const { signature, timestamp, hash } = body;

        // Validate required fields
        if (!signature || !timestamp || !hash) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: signature, hash, timestamp '
                },
                { status: 400 }
            );
        }
        const { success, data } = verifySignature({ signature, timestamp, hash }, process.env.NEXTAUTH_SECRET || 'app');

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid signature verification'
                },
                { status: 401 }
            );
        }

        const { email , password } = JSON.parse(data as string)


        // Find admin by ID
        const admin = await Admin.findOne({ email });



        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Admin not found'
                },
                { status: 404 }
            );
        }

            function verifyHash(input : any, storedHash : any) {
                  const newHash = crypto.createHash("sha256").update(input).digest("hex");
                  return newHash === storedHash;
          }


             // Optional: add password verification if stored hashed
         const isValid = verifyHash(password , admin.password);

         if(!isValid){
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid password'
                },
                { status: 401 }
            );
         }

        // Check admin status
        if (admin.status === 'banned') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Account has been banned. Contact support for assistance.'
                },
                { status: 403 }
            );
        }

        if (admin.status === 'suspended') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Account is temporarily suspended. Contact support for assistance.'
                },
                { status: 403 }
            );
        }

        if (admin.status !== 'active') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Account is not active'
                },
                { status: 403 }
            );
        }




 
    
        // Generate OTP and send email
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
          await emailService.sendOTPEmail(admin.email, {
              username: admin.username,
              otp: otp,
              expiresIn: 5,
              purpose: 'login'
          });

        admin.otp_code = otp;
        admin.exp_otp = new Date(Date.now() + 5 * 60 * 1000); // 10 minutes

       const hashToString = generateSignature(JSON.stringify({ ...admin }) , process.env.NEXTAUTH_SECRET || 'app')
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();
        return NextResponse.json({  success: true,  message: 'OTP sent to your email!'  , hashToString   });

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


