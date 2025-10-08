import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import crypto from 'crypto';
 
export async function PUT(
  request: NextRequest,
  context : any 
) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const body = await request.json();
    const { username, email, role, status  , password } = body;
 
    const user = await Admin.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'Admin user not found'
        },
        { status: 404 }
      );
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await Admin.findOne({
      _id: { $ne: id },
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

    if(password){
      user.password = password
    }
    if(role){
      user.role = role
    }

    if(status){
      user.status = status
    } 
    await user.save();
 
   
 
    // Return updated user data
    const userData = {
      key: user._id.toString(),
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
      createdDate: new Date(user.createdAt).toLocaleDateString(),
      permissions: user.permissions
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Admin user updated successfully'
    });

  } catch (error) {
    console.error('Error updating admin user:', error);
    
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
        error: 'Failed to update admin user',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
   context : any 
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Find the user to delete
    const user = await Admin.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          message: 'Admin user not found'
        },
        { status: 404 }
      );
    }

    // Prevent deletion of super admin
    if (user.role === 'super_admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete super admin',
          message: 'Super admin users cannot be deleted'
        },
        { status: 403 }
      );
    }

    // Delete the user
    await Admin.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Admin user deleted successfully',
      deletedUserId: id
    });

  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete admin user',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
