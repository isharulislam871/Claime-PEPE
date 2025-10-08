import { NextRequest, NextResponse } from 'next/server';

// GET /api/conversion-rates - Get PEPE conversion rates and USD prices
export async function GET(request: NextRequest) {
  try {
    // PEPE conversion rates: How much PEPE equals 1 unit of each currency
    const pepeConversionRates = {
      ETH: 2154471544.72,  // 1 ETH = ~2.15B PEPE
      USDT: 813008.13,     // 1 USDT = ~813K PEPE
      BNB: 256504065.04,   // 1 BNB = ~256M PEPE
      USDC: 813008.13,     // 1 USDC = ~813K PEPE
      PEPE: 1,             // 1 PEPE = 1 PEPE
      BTC: 52000000000,    // 1 BTC = ~52B PEPE
      SOL: 162601626.02,   // 1 SOL = ~162M PEPE
      XRP: 1300000,        // 1 XRP = ~1.3M PEPE
      ADA: 2032520.32,     // 1 ADA = ~2M PEPE
      DOGE: 325203.25,     // 1 DOGE = ~325K PEPE
      MATIC: 1626016.26,   // 1 MATIC = ~1.6M PEPE
      AVAX: 24390243.90,   // 1 AVAX = ~24M PEPE
      DOT: 8130081.30,     // 1 DOT = ~8M PEPE
      LINK: 16260162.60,   // 1 LINK = ~16M PEPE
      UNI: 8130081.30  ,    // 1 UNI = ~8M PEPE
   
    };

    // USD conversion rates (for display purposes)
    const usdRates = {
      ETH: 2650.00,
      USDT: 1.00,
      USDTX: 1.00,
      BNB: 315.50,
      USDC: 1.00,
      PEPE: 0.00000123,
      BTC: 64000.00,
      SOL: 200.00,
      XRP: 1.60,
      ADA: 2.50,
      DOGE: 0.40,
      MATIC: 2.00,
      AVAX: 30.00,
      DOT: 10.00,
      LINK: 20.00,
      UNI: 10.00
    };

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency');

    // If specific currency requested
    if (currency) {
      const currencyUpper = currency.toUpperCase();
      const pepeRate = pepeConversionRates[currencyUpper as keyof typeof pepeConversionRates];
      const usdRate = usdRates[currencyUpper as keyof typeof usdRates];
      
      if (pepeRate !== undefined && usdRate !== undefined) {
        return NextResponse.json({
          success: true,
          currency: currencyUpper,
          pepeConversionRate: pepeRate,
          usdRate: usdRate
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Currency not found'
        }, { status: 404 });
      }
    }

    // Return all rates
    return NextResponse.json({
      success: true,
      pepeConversionRates,
      usdRates
    });
  } catch (error) {
    console.error('Error fetching conversion rates:', error);
    return NextResponse.json({
      error: 'Failed to fetch conversion rates'
    }, { status: 500 });
  }
}
