import { NextRequest } from 'next/server';

/**
 * Extract client IP address from NextRequest
 * Handles various proxy headers and fallbacks
 */
export function getClientIP(request: NextRequest): string {
  // Check for forwarded IP addresses (common with proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Check for real IP (some proxies use this)
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Check for client IP (Cloudflare uses this)
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback to connection remote address
  const remoteAddr = request.headers.get('x-forwarded-host') || 
                    request.headers.get('host') || 
                    '127.0.0.1';
  
  return remoteAddr;
}
