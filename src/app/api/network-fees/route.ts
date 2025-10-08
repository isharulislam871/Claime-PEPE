import { NextRequest, NextResponse } from 'next/server';

// GET /api/network-fees - Get network fees for withdrawals
export async function GET(request: NextRequest) {
  try {
    // Network fees configuration
    const networkFees = {
      'ETH-ethereum': 0.005,
      'USDTX-ethereum': 0.5,
      'USDT-bsc': 0.8,
      'USDT-polygon': 0.1,
      'BNB-bsc': 0.0005,
      'USDC-ethereum': 5,
      'USDC-bsc': 0.8,
      'USDC-polygon': 0.1,
      'PEPE-ethereum': 5000,
      'PEPE-bsc': 250,
      'BTC-mainnet': 0.0001,
      'SOL-solana': 0.00025,
      'XRP-xrp': 0.1,
      'ADA-cardano': 1,
      'DOGE-dogecoin': 1,
      'MATIC-polygon': 0.01,
      'AVAX-avalanche': 0.001,
      'DOT-polkadot': 0.1,
      'LINK-ethereum': 0.1,
      'UNI-ethereum': 0.01
    };

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');
    const network = searchParams.get('network');

    // If specific currency and network requested
    if (currency && network) {
      const key = `${currency.toUpperCase()}-${network.toLowerCase()}`;
      const fee = networkFees[key as keyof typeof networkFees];
      
      if (fee !== undefined) {
        return NextResponse.json({
          success: true,
          fee,
          currency,
          network
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Fee not found for this currency-network combination'
        }, { status: 404 });
      }
    }

    // Return all fees
    return NextResponse.json({
      success: true,
      fees: networkFees
    });
  } catch (error) {
    console.error('Error fetching network fees:', error);
    return NextResponse.json({
      error: 'Failed to fetch network fees'
    }, { status: 500 });
  }
}
