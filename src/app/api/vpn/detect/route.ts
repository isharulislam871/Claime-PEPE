import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdsSettings from '@/models/AdsSettings';

// VPN detection using IP analysis
export async function GET(request: NextRequest) {
  try {
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';
 
    
    // Mock VPN detection logic
    const isVpnDetected = await detectVPN(clientIp);
    
    return NextResponse.json({
      success: true,
      data: {
        ip: clientIp,
        isVpn: isVpnDetected,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('VPN detection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to detect VPN' },
      { status: 500 }
    );
  }
}

// VPN detection using multiple providers
async function detectVPN(ip: string): Promise<boolean> {
  try {
    // Get settings from database
    await dbConnect();
    const adsSettings = await AdsSettings.findOne();
    
    if (!adsSettings) {
      console.warn('Ads settings not found');
      return false;
    }

    const { vpnProvider } = adsSettings;
    
    switch (vpnProvider) {
      case 'vpnapi':
        return await detectVPNWithVPNAPI(ip, adsSettings.vpnapiKey);
      case 'ipqualityscore':
        return await detectVPNWithIPQuality(ip, adsSettings.ipqualityKey);
      case 'ip2location':
        return await detectVPNWithIP2Location(ip, adsSettings.ip2locationKey);
      case 'maxmind':
        return await detectVPNWithMaxMind(ip, adsSettings.maxmindKey);
      default:
        console.warn('Unknown VPN provider:', vpnProvider);
        return false;
    }
  } catch (error) {
    console.error('VPN detection error:', error);
    return false;
  }
}

// VPNapi.io detection
async function detectVPNWithVPNAPI(ip: string, apiKey: string): Promise<boolean> {
  if (!apiKey) {
    console.warn('VPNapi.io API key not configured');
    return false;
  }

  const response = await fetch(`https://vpnapi.io/api/${ip}?key=${apiKey}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    console.error('VPNapi.io request failed:', response.status);
    return false;
  }

  const data = await response.json();
  return data.security?.vpn === true || 
         data.security?.proxy === true || 
         data.security?.tor === true || 
         data.security?.relay === true;
}

// IPQualityScore detection
async function detectVPNWithIPQuality(ip: string, apiKey: string): Promise<boolean> {
  if (!apiKey) {
    console.warn('IPQualityScore API key not configured');
    return false;
  }

  const response = await fetch(`https://ipqualityscore.com/api/json/ip/${apiKey}/${ip}?strictness=1&allow_public_access_points=true&fast=true`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    console.error('IPQualityScore request failed:', response.status);
    return false;
  }

  const data = await response.json();
  return data.vpn === true || data.proxy === true || data.tor === true;
}

// IP2Location detection
async function detectVPNWithIP2Location(ip: string, apiKey: string): Promise<boolean> {
  if (!apiKey) {
    console.warn('IP2Location API key not configured');
    return false;
  }

  const response = await fetch(`https://api.ip2location.com/v2/?ip=${ip}&key=${apiKey}&package=PX10&format=json`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    console.error('IP2Location request failed:', response.status);
    return false;
  }

  const data = await response.json();
  return data.is_proxy === 'YES' || data.proxy_type !== '-';
}

// MaxMind detection (simplified - would need actual MaxMind SDK in production)
async function detectVPNWithMaxMind(ip: string, licenseKey: string): Promise<boolean> {
  if (!licenseKey) {
    console.warn('MaxMind license key not configured');
    return false;
  }

  // Note: This is a simplified example. In production, you'd use MaxMind's official SDK
  // For now, we'll return false as MaxMind requires more complex integration
  console.warn('MaxMind integration requires official SDK - returning false for now');
  return false;
}

// POST endpoint for manual VPN check
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip } = body;
    
    if (!ip) {
      return NextResponse.json(
        { success: false, error: 'IP address is required' },
        { status: 400 }
      );
    }
    
    const isVpnDetected = await detectVPN(ip);
    
    return NextResponse.json({
      success: true,
      data: {
        ip,
        isVpn: isVpnDetected,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('VPN detection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to detect VPN' },
      { status: 500 }
    );
  }
}
