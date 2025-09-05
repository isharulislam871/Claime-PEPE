import { NextRequest, NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
}

// Admin authentication and authorization
export class AdminAuth {
  private static adminTokens = new Set([
    'admin-secret-key-2024',
    'super-admin-master-key'
  ]);

  private static adminUsers = new Map([
    ['admin-secret-key-2024', { id: 'admin1', username: 'admin', role: 'admin' as const }],
    ['super-admin-master-key', { id: 'superadmin1', username: 'superadmin', role: 'super_admin' as const }]
  ]);

  static authenticate(request: NextRequest): AdminUser | null {
    // Check for admin token in header
    const adminToken = request.headers.get('x-admin-token');
    if (adminToken && this.adminTokens.has(adminToken)) {
      return this.adminUsers.get(adminToken) || null;
    }

    // Check for admin token in query params (for development)
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get('adminToken');
    if (queryToken && this.adminTokens.has(queryToken)) {
      return this.adminUsers.get(queryToken) || null;
    }

    // Check for basic admin flag (temporary for development)
    const isAdminParam = searchParams.get('admin') === 'true';
    if (isAdminParam) {
      return { id: 'temp-admin', username: 'temp-admin', role: 'admin' };
    }

    return null;
  }

  static authorize(user: AdminUser, requiredRole: 'admin' | 'super_admin' = 'admin'): boolean {
    if (requiredRole === 'admin') {
      return user.role === 'admin' || user.role === 'super_admin';
    }
    return user.role === 'super_admin';
  }

  static createUnauthorizedResponse(): NextResponse {
    return NextResponse.json(
      { 
        error: 'Unauthorized', 
        message: 'Admin access required. Please provide valid admin token.' 
      }, 
      { status: 401 }
    );
  }

  static createForbiddenResponse(): NextResponse {
    return NextResponse.json(
      { 
        error: 'Forbidden', 
        message: 'Insufficient permissions for this action.' 
      }, 
      { status: 403 }
    );
  }
}

// Middleware wrapper for admin routes
export function withAdminAuth(
  handler: (request: NextRequest, adminUser: AdminUser) => Promise<NextResponse>,
  requiredRole: 'admin' | 'super_admin' = 'admin'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const adminUser = AdminAuth.authenticate(request);
    
    if (!adminUser) {
      return AdminAuth.createUnauthorizedResponse();
    }

    if (!AdminAuth.authorize(adminUser, requiredRole)) {
      return AdminAuth.createForbiddenResponse();
    }

    try {
      return await handler(request, adminUser);
    } catch (error) {
      console.error('Admin route error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Rate limiting for admin actions
export class AdminRateLimit {
  private static actionCounts = new Map<string, { count: number; resetTime: number }>();
  private static readonly RATE_LIMIT = 100; // requests per hour
  private static readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour

  static checkLimit(adminId: string): boolean {
    const now = Date.now();
    const key = `admin:${adminId}`;
    const current = this.actionCounts.get(key);

    if (!current || now > current.resetTime) {
      this.actionCounts.set(key, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    if (current.count >= this.RATE_LIMIT) {
      return false;
    }

    current.count++;
    return true;
  }

  static getRemainingRequests(adminId: string): number {
    const key = `admin:${adminId}`;
    const current = this.actionCounts.get(key);
    
    if (!current || Date.now() > current.resetTime) {
      return this.RATE_LIMIT;
    }

    return Math.max(0, this.RATE_LIMIT - current.count);
  }
}
