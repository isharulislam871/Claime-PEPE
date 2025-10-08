import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Admin from '@/models/Admin';
import crypto from 'crypto';
// Database connection


function verifyHash(input : any, storedHash : any) {
  const newHash = crypto.createHash("sha256").update(input).digest("hex");
  return newHash === storedHash;
}
 
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

// POST - Admin login
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, password, rememberMe } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username.toLowerCase() }
      ]
    });

    // If user not found, return error without incrementing attempts
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or username' },
        { status: 401 }
      );
    }

    // Check if account is locked
    const isLocked = admin.lockUntil && admin.lockUntil.getTime() > Date.now();
    if (isLocked) {
      return NextResponse.json(
        { success: false, error: 'Account is temporarily locked due to too many failed attempts' },
        { status: 401 }
      );
    }

        
    // Compare password using crypto
    const isPasswordValid =  verifyHash(password , admin.password)
   
    if (!isPasswordValid) {
      // Only increment login attempts for password errors (user exists but wrong password)
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      
      await admin.save();
      
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0) {
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
    }
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'taskup_admin_secret_key';
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      },
      JWT_SECRET,
      {
        expiresIn: rememberMe ? '30d' : '1d',
        issuer: 'taskup-admin',
        subject: admin._id.toString()
      }
    );

    // Prepare response data (exclude sensitive information)
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin
    };

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
      path: '/'
    };

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: adminData,
        token
      }
    });

    // Set authentication cookie
    response.cookies.set('admin_session', token, cookieOptions);
    
    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Check admin session
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.cookies.get('admin_session')?.value;
     
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify JWT token
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'taskup_admin_secret_key';
      
      // First try with audience validation, fallback without for backward compatibility
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET, {
          issuer: 'taskup-admin',
          audience: 'taskup-admin-panel'
        }) as any;
      } catch (audienceError) {
        // Fallback for tokens created before audience validation
        decoded = jwt.verify(token, JWT_SECRET) as any;
      }
   
      // Validate required fields in JWT payload
      if (!decoded.adminId || !decoded.username || !decoded.role) {
        return NextResponse.json(
          { success: false, error: 'Invalid token payload' },
          { status: 401 }
        );
      }
      
      const admin = await Admin.findById(decoded.adminId).select('-password');
      
      if (!admin || !admin.status) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            lastLogin: admin.lastLogin
          }
        }
      });

    } catch (decodeError) {
      console.error('Token verification error:', decodeError);
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Admin logout
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear authentication cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
