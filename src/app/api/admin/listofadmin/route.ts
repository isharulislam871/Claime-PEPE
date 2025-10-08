import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import crypto from 'crypto';
import User from '@/models/User';
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query filters
    const query: any = {};

    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { username: searchRegex },
        { email: searchRegex }
      ];
    }

    // Get total count for pagination
    const total = await Admin.countDocuments(query);
 
 

    // Get paginated results
    const skip = (page - 1) * limit;
    const adminUsers = await Admin.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format response data
    const responseData = adminUsers.map(user => ({
      key: user._id.toString(),
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
      createdDate: new Date(user.createdAt).toLocaleDateString(),
      permissions: user.permissions
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        role,
        status,
        search
      }
    });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch admin users',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, email, password, role } = body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Username, email, password, and role are required'
        },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await Admin.findOne({
      $or: [
        { username },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User already exists',
          message: 'Username or email already exists'
        },
        { status: 409 }
      );
    }

   
    // Create new admin user
    const newUser = new Admin({
      username,
      email: email.toLowerCase(),
      password ,
      role,
      isActive: true
    });

    await newUser.save();

    // Return user data without password
    const userData = {
      key: newUser._id.toString(),
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      lastLogin: newUser.lastLogin ? new Date(newUser.lastLogin).toLocaleString() : 'Never',
      createdDate: new Date(newUser.createdAt).toLocaleDateString(),
      permissions: newUser.permissions
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Admin user created successfully'
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    
    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          message: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin user',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
