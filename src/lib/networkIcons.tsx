// Network icons mapping - using local images from public/svg/color/
export const networkIcons: Record<string, string> = {
    // Major networks (verified to exist)
    'eth-main': '/svg/color/eth.svg',
    'sepolia': '/svg/color/eth.svg',
    'bsc-mainnet': '/svg/color/bnb.svg',
    'binance': '/svg/color/bnb.svg',
    'polygon': '/svg/color/matic.svg',
    'arbitrum': '/svg/color/eth.svg', // Using ETH icon for Arbitrum
    'optimism': '/svg/color/eth.svg', // Using ETH icon for Optimism
    'avalanche': '/svg/color/avax.svg',
    'fantom': '/svg/color/eth.svg', // FTM not available, using ETH
    'tron': '/svg/color/trx.svg',
    'bitcoin': '/svg/color/btc.svg',
    'litecoin': '/svg/color/ltc.svg',
    'dogecoin': '/svg/color/doge.svg',
    'cardano': '/svg/color/ada.svg',
    'solana': '/svg/color/sol.svg',
    'polkadot': '/svg/color/dot.svg',
    'chainlink': '/svg/color/link.svg',
    'stellar': '/svg/color/xlm.svg',
    'ripple': '/svg/color/xrp.svg',
    // Additional networks (verified to exist)
    'cosmos': '/svg/color/atom.svg',
    'harmony': '/svg/color/one.svg',
    'kucoin': '/svg/color/kcs.svg',
    'huobi': '/svg/color/ht.svg',
    'okex': '/svg/color/ok.svg',
    'algorand': '/svg/color/algo.svg',
    'tezos': '/svg/color/xtz.svg',
    'eos': '/svg/color/eos.svg',
    'neo': '/svg/color/neo.svg',
    'waves': '/svg/color/waves.svg',
    'zilliqa': '/svg/color/zil.svg',
    'vechain': '/svg/color/vet.svg',
    'theta': '/svg/color/theta.svg',
    'filecoin': '/svg/color/fil.svg',
    'internet-computer': '/svg/color/icp.svg',
    'kusama': '/svg/color/ksm.svg',
    // Additional popular tokens
    'uniswap': '/svg/color/uni.svg',
    'aave': '/svg/color/aave.svg',
    'compound': '/svg/color/comp.svg',
    'maker': '/svg/color/mkr.svg',
    'sushi': '/svg/color/sushi.svg',
    'curve': '/svg/color/crv.svg',
    'yearn': '/svg/color/yfi.svg',
    'synthetix': '/svg/color/snx.svg',
    'balancer': '/svg/color/bal.svg',
  };
  

  export const networkNames: Record<string, string> = {
    // Major networks
    'eth-main': 'Ethereum (ERC20)',
    'sepolia': 'Ethereum Sepolia',
    'bsc-mainnet': 'BNB Smart Chain (BEP20)',
    'binance': 'Binance Chain',
    'polygon': 'Polygon (MATIC)',
    'arbitrum': 'Arbitrum',
    'optimism': 'Optimism',
    'avalanche': 'Avalanche (AVAX)',
    'fantom': 'Fantom (FTM)',
    'tron': 'Tron (TRC20)',
    'bitcoin': 'Bitcoin',
    'litecoin': 'Litecoin',
    'dogecoin': 'Dogecoin',
    'cardano': 'Cardano (ADA)',
    'solana': 'Solana',
    'polkadot': 'Polkadot (DOT)',
    'chainlink': 'Chainlink (LINK)',
    'stellar': 'Stellar (XLM)',
    'ripple': 'Ripple (XRP)',
  
    // Additional networks
    'cosmos': 'Cosmos (ATOM)',
    'harmony': 'Harmony (ONE)',
    'kucoin': 'KuCoin (KCS)',
    'huobi': 'Huobi (HT)',
    'okex': 'OKEx (OKB)',
    'algorand': 'Algorand (ALGO)',
    'tezos': 'Tezos (XTZ)',
    'eos': 'EOS',
    'neo': 'NEO',
    'waves': 'Waves',
    'zilliqa': 'Zilliqa (ZIL)',
    'vechain': 'VeChain (VET)',
    'theta': 'Theta',
    'filecoin': 'Filecoin (FIL)',
    'internet-computer': 'Internet Computer (ICP)',
    'kusama': 'Kusama (KSM)',
  
    // Popular tokens / protocols
    'uniswap': 'Uniswap (UNI)',
    'aave': 'Aave',
    'compound': 'Compound (COMP)',
    'maker': 'Maker (MKR)',
    'sushi': 'SushiSwap (SUSHI)',
    'curve': 'Curve (CRV)',
    'yearn': 'Yearn Finance (YFI)',
    'synthetix': 'Synthetix (SNX)',
    'balancer': 'Balancer (BAL)',
  };
  
  


  // SVG component for "not found" network icon
 export const NotFoundIcon = ({ networkName, size = 32 }: { networkName?: string; size?: number }) => {
    const firstLetter = networkName ? networkName.charAt(0).toUpperCase() : '?';
    const fontSize = Math.floor(size * 0.4375); // Proportional font size
    const textY = size * 0.625; // Proportional text position
    
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rounded-full"
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={size/2} fill={`url(#gradient-${size})`} />
        <text
          x={size/2}
          y={textY}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="white"
        >
          {firstLetter}
        </text>
      </svg>
    );
  };


  export const coinIcons: Record<string, string> = {
    'eth': '/svg/color/eth.svg',
    'btc': '/svg/color/btc.svg',
    'ltc': '/svg/color/ltc.svg',
    'doge': '/svg/color/doge.svg',
    'ada': '/svg/color/ada.svg',
    'sol': '/svg/color/sol.svg',
    'dot': '/svg/color/dot.svg',
    'link': '/svg/color/link.svg',
    'xlm': '/svg/color/xlm.svg',
    'xrp': '/svg/color/xrp.svg',
    'atom': '/svg/color/atom.svg',
    'one': '/svg/color/one.svg',
    'kcs': '/svg/color/kcs.svg',
    'ht': '/svg/color/ht.svg',
    'okb': '/svg/color/okb.svg',
    'algo': '/svg/color/algo.svg',
    'xtz': '/svg/color/xtz.svg',
    'eos': '/svg/color/eos.svg',
    'neo': '/svg/color/neo.svg',
    'waves': '/svg/color/waves.svg',
    'zil': '/svg/color/zil.svg',
    'vet': '/svg/color/vet.svg',
    'theta': '/svg/color/theta.svg',
    'fil': '/svg/color/fil.svg',
    'icp': '/svg/color/icp.svg',
    'ksm': '/svg/color/ksm.svg',
    'uni': '/svg/color/uni.svg',
    'comp': '/svg/color/comp.svg',
    'crv': '/svg/color/crv.svg',
    'yfi': '/svg/color/yfi.svg',
    'snx': '/svg/color/snx.svg',
    'bal': '/svg/color/bal.svg',
    'usdt' : '/svg/color/usdt.svg',
  };