import React, { useEffect } from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import { selectCurrentUser, selectUserBalance } from '@/modules';
 
import { useSelector } from 'react-redux';

export default function BalanceCard() {
 
  const balance = useSelector(selectUserBalance);
  
  const formatBalance = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  const convertToUSDT = (points: number): string => {
    // 10,000 points = $0.25 USDT
    const usdtValue = (points / 10000) * 0.25;
    return usdtValue.toFixed(4);
  };
  
  
  return (
    <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-2xl mb-6 shadow-purple-400/50 animate-slideInRight hover-lift animate-glow relative overflow-hidden" style={{animationDelay: '0.1s'}}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10">
        <p className="text-purple-100 font-semibold text-sm uppercase tracking-wide animate-fadeIn" style={{animationDelay: '0.5s'}}>
          💰 Total Balance
        </p>
        <h1 className="text-5xl font-black animate-bounceIn mt-2" style={{animationDelay: '0.7s'}}>
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {formatBalance(balance || 0)}
          </span> 
          <span className="text-xl font-bold text-purple-200 ml-2 flex items-center gap-1">
            Points <TrophyOutlined className="text-yellow-300" />
          </span>
        </h1>
        <div className="mt-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm animate-fadeIn" style={{animationDelay: '0.9s'}}>
          <p className="text-purple-100 text-sm font-medium mb-1">💵 USDT Value</p>
          <p className="text-green-300 font-bold text-lg">
            ${convertToUSDT(balance || 0)} USDT
          </p>
          <p className="text-purple-200 text-xs mt-1">
            Rate: 10,000 Points = $0.25 USDT
          </p>
        </div>
      </div>
    </div>
  );
}
