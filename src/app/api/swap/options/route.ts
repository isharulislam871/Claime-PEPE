import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

interface SwapOption {
  label: string;
  value: string;
  rate: number;
  icon: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
  isActive?: boolean;
  category?: string;
}

interface SwapOptionsResponse {
  success: boolean;
  swapOptions?: SwapOption[];
  message?: string;
  errorCode?: string;
}


async function fetchRates() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,bitcoin,ethereum,tether,dogecoin,pepe&vs_currencies=usd"
    );
    const data = await res.json();

    return {
      usdt: 1 / 40000, // 40,000 pts = $1 = 1 USDT
      bnb: (1 / 40000) / data.binancecoin.usd,
      btc: (1 / 40000) / data.bitcoin.usd,
      eth: (1 / 40000) / data.ethereum.usd,
      doge: (1 / 40000) / data.dogecoin.usd,
      pepe: (1 / 40000) / data.pepe.usd
    };
  } catch (err) {
    console.error("Error fetching live rates:", err);
    return null;
  }
}


// Static swap options configuration
// Rate calculation: All rates are normalized to 1 USD worth of points (40,000 pts = $1)
// Formula: rate = (crypto amount per $1) / 40,000 points

export async function GET(request: NextRequest) {
  try {
    // Connect MongoDB (future-proofing for DB stored options)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/taskup");
    }

    // Fetch dynamic rates
    const rates = await fetchRates();
    if (!rates) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch live rates",
        errorCode: "RATE_FETCH_ERROR"
      }, { status: 500 });
    }

    // Build Swap Options dynamically
    let SWAP_OPTIONS = [
      {
        label: "USDT",
        value: "usdt",
        rate: rates.usdt,
        icon: "💰",
        description: "40,000 pts = 1 USDT ($1.00)",
        minAmount: 1000,
        maxAmount: 10000000,
        isActive: true,
        category: "Stablecoin"
      },
      {
        label: "BNB",
        value: "bnb",
        rate: rates.bnb,
        icon: "🟡",
        description: `40,000 pts = ${(rates.bnb * 40000).toFixed(6)} BNB ($1.00)`,
        minAmount: 1000,
        maxAmount: 100000000,
        isActive: true,
        category: "Cryptocurrency"
      },
      {
        label: "Bitcoin (BTC)",
        value: "btc",
        rate: rates.btc,
        icon: "₿",
        description: `40,000 pts = ${(rates.btc * 40000).toFixed(8)} BTC ($1.00)`,
        minAmount: 10000,
        maxAmount: 1000000000,
        isActive: true,
        category: "Cryptocurrency"
      },
      {
        label: "Ethereum (ETH)",
        value: "eth",
        rate: rates.eth,
        icon: "⟠",
        description: `40,000 pts = ${(rates.eth * 40000).toFixed(6)} ETH ($1.00)`,
        minAmount: 5000,
        maxAmount: 500000000,
        isActive: true,
        category: "Cryptocurrency"
      },
      {
        label: "Dogecoin (DOGE)",
        value: "doge",
        rate: rates.doge,
        icon: "🐕",
        description: `40,000 pts = ${(rates.doge * 40000).toFixed(2)} DOGE ($1.00)`,
        minAmount: 1000,
        maxAmount: 10000000,
        isActive: true,
        category: "Meme Token"
      },
      {
        label: "Pepe (PEPE)",
        value: "pepe",
        rate: rates.pepe,
        icon: "🐸",
        description: `40,000 pts = ${(rates.pepe * 40000).toFixed(0)} PEPE ($1.00)`,
        minAmount: 1000,
        maxAmount: 1000000,
        isActive: true,
        category: "Meme Token"
      }
    ];

    // === Filtering Logic ===
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("active");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");

    let filteredOptions = [...SWAP_OPTIONS];

    if (category) {
      filteredOptions = filteredOptions.filter(
        (option) => option.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (isActive !== null) {
      const activeFilter = isActive === "true";
      filteredOptions = filteredOptions.filter(
        (option) => option.isActive === activeFilter
      );
    }

    if (minRate) {
      const minRateNum = parseFloat(minRate);
      if (!isNaN(minRateNum)) {
        filteredOptions = filteredOptions.filter(
          (option) => option.rate >= minRateNum
        );
      }
    }

    if (maxRate) {
      const maxRateNum = parseFloat(maxRate);
      if (!isNaN(maxRateNum)) {
        filteredOptions = filteredOptions.filter(
          (option) => option.rate <= maxRateNum
        );
      }
    }

    // Sort ascending by rate
    filteredOptions.sort((a, b) => a.rate - b.rate);

    return NextResponse.json({
      success: true,
      swapOptions: filteredOptions,
      message: `Found ${filteredOptions.length} swap options`
    });

  } catch (error) {
    console.error("Swap options API error:", error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch swap options",
      errorCode: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
// Handle POST requests for updating swap options (admin only)
export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    // For now, we'll return a placeholder response
    
    return NextResponse.json({
      success: false,
      message: 'Swap options updates are not implemented yet',
      errorCode: 'NOT_IMPLEMENTED'
    } as SwapOptionsResponse, { status: 501 });

  } catch (error) {
    console.error('Swap options update error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update swap options',
      errorCode: 'INTERNAL_ERROR'
    } as SwapOptionsResponse, { status: 500 });
  }
}

// Handle PUT requests for individual swap option updates (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, updates } = body;

    if (!value || !updates) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields (value, updates)',
        errorCode: 'INVALID_INPUT'
      } as SwapOptionsResponse, { status: 400 });
    }

    // This would typically update the option in the database
    // For now, we'll return a placeholder response
    
    return NextResponse.json({
      success: false,
      message: 'Individual swap option updates are not implemented yet',
      errorCode: 'NOT_IMPLEMENTED'
    } as SwapOptionsResponse, { status: 501 });

  } catch (error) {
    console.error('Swap option update error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update swap option',
      errorCode: 'INTERNAL_ERROR'
    } as SwapOptionsResponse, { status: 500 });
  }
}
