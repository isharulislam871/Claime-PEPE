'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from 'antd-mobile';
import { Avatar } from 'antd';
import { formatNumber, formatCurrency } from '@/lib/formatNumber';
import { AppDispatch } from '@/modules/store';
import { selectUsdRates, selectCoinLoading } from '@/modules/private/coin';
import { fetchConversionRatesRequest } from '@/modules/private/coin';

// Function to format currency with abbreviations (1k, 1M, etc.)
const formatAbbreviatedCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else if (absValue >= 1) {
    return `$${value.toFixed(2)}`;
  } else {
    return `$${value.toFixed(4)}`;
  }
};

interface User {
  username?: string;
  profilePicUrl?: string;
  balance?: number;
}

interface HeaderBalanceProps {
  user?: User | null;
  currentUser?: any;
  loading?: boolean;
}


export default function HeaderBalance({ user, currentUser, loading = false }: HeaderBalanceProps) {
  const dispatch = useDispatch<AppDispatch>();
  const usdRates = useSelector(selectUsdRates);
  const ratesLoading = useSelector(selectCoinLoading);

  console.log( usdRates);
  // Fetch conversion rates on component mount
  useEffect(() => {
    if (!Object.keys(usdRates).length) {
      dispatch(fetchConversionRatesRequest());
    }
  }, [dispatch, usdRates]);

  // Convert points to USD using USDT rate (40,000 pts = 1 USDT = $1)
  const convertPointsToUsd = (points: number): number => {
    // Standard conversion: 40,000 points = 1 USDT = $1 USD
    const pointsPerUsd = 40000;
    return points / pointsPerUsd;
  };
  return (
    <div className="h-[60px] bg-white text-gray-900 flex items-center justify-between px-4 mb-4 rounded-lg border border-gray-200">
      {loading ? (
        <>
          <div className="flex items-center gap-2">
            <Skeleton.Title animated className="!w-6 !h-6 !rounded-full" />
            <Skeleton.Title animated className="!w-16 !h-3" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton.Title animated className="!w-12 !h-3" />
            <Skeleton.Title animated className="!w-8 !h-3" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Avatar
              src={user?.profilePicUrl || currentUser?.profilePicUrl as any}
             
              className="rounded-full"
            />
            <span className="text-base font-semibold text-gray-700 truncate max-w-[120px]">
              {user?.username || currentUser?.username || 'User'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Balance:</span>
              <span className="text-sm font-bold text-yellow-400">
                {formatNumber(user?.balance || 0)}
              </span>
              <span className="text-xs text-gray-600">PTS</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">≈</span>
              <span className="text-sm font-semibold text-green-400">
                {formatAbbreviatedCurrency(convertPointsToUsd(user?.balance || 0))}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
