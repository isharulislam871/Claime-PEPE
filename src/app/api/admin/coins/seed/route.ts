import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Coin from '@/models/Coin';

// POST /api/admin/coins/seed - Seed database with popular coins
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const popularCoins = [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        decimals: 8,
        networks: [
          { network: 'mainnet', isNative: true, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        description: 'The first and most well-known cryptocurrency',
        website: 'https://bitcoin.org',
        coinGeckoId: 'bitcoin'
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        networks: [
          { network: 'ethereum', isNative: true, isActive: true },
          { network: 'mainnet', isNative: true, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        description: 'Decentralized platform for smart contracts',
        website: 'https://ethereum.org',
        coinGeckoId: 'ethereum'
      },
      {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
        networks: [
          { network: 'bsc', isNative: true, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        description: 'Native token of Binance Smart Chain',
        website: 'https://binance.org',
        coinGeckoId: 'binancecoin'
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        networks: [
          { network: 'ethereum', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', isNative: false, isActive: true },
          { network: 'bsc', contractAddress: '0x55d398326f99059fF775485246999027B3197955', isNative: false, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        description: 'Stablecoin pegged to USD',
        website: 'https://tether.to',
        coinGeckoId: 'tether'
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        networks: [
          { network: 'ethereum', contractAddress: '0xA0b86a33E6441e8e3F3570c5c1c0b9C0e3e0e0e0', isNative: false, isActive: true },
          { network: 'bsc', contractAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', isNative: false, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        description: 'Regulated stablecoin backed by USD',
        website: 'https://centre.io',
        coinGeckoId: 'usd-coin'
      },
      {
        name: 'Pepe',
        symbol: 'PEPE',
        decimals: 18,
        networks: [
          { network: 'ethereum', contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', isNative: false, isActive: true },
          { network: 'bsc', contractAddress: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00', isNative: false, isActive: true }
        ],
        logoUrl: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
        description: 'Meme cryptocurrency based on Pepe the Frog',
        coinGeckoId: 'pepe'
      },
      {
        name: 'Shiba Inu',
        symbol: 'SHIB',
        decimals: 18,
        networks: [
          { network: 'ethereum', contractAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', isNative: false, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
        description: 'Decentralized meme token',
        website: 'https://shibatoken.com',
        coinGeckoId: 'shiba-inu'
      },
      {
        name: 'Binance USD',
        symbol: 'BUSD',
        decimals: 18,
        networks: [
          { network: 'bsc', contractAddress: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', isNative: false, isActive: true },
          { network: 'ethereum', contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53', isNative: false, isActive: true }
        ],
        logoUrl: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png',
        description: 'Stablecoin issued by Binance',
        website: 'https://binance.com',
        coinGeckoId: 'binance-usd'
      }
    ];
    
    const results = [];
    
    for (const coinData of popularCoins) {
      try {
        // Check if coin already exists
        const existingCoin = await Coin.findOne({ symbol: coinData.symbol });
        
        if (!existingCoin) {
          const coin = await Coin.create(coinData);
          results.push({ symbol: coinData.symbol, status: 'created', id: coin._id });
        } else {
          results.push({ symbol: coinData.symbol, status: 'already_exists', id: existingCoin._id });
        }
      } catch (error: any) {
        results.push({ symbol: coinData.symbol, status: 'error', error: error.message });
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Coin seeding completed',
      results
    });
  } catch (error) {
    console.error('Error seeding coins:', error);
    return NextResponse.json({ 
      error: 'Failed to seed coins' 
    }, { status: 500 });
  }
}
