'use client';

import React from 'react';
import Image from 'next/image';

interface BinanceLoaderProps {
  size?: number;
  className?: string;
}

export default function BinanceLoader({ size = 80, className = '' }: BinanceLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer blur ring */}
        <div 
          className="absolute bg-gradient-to-br from-yellow-400/40 to-yellow-600/40 rounded-full blur-lg animate-pulse-slow"
          style={{ width: size * 1.8, height: size * 1.8 }}
        ></div>
        
        {/* Middle blur ring */}
        <div 
          className="absolute bg-gradient-to-br from-yellow-400/60 to-yellow-600/60 rounded-full blur-md animate-pulse-blur"
          style={{ width: size * 1.4, height: size * 1.4 }}
        ></div>
        
        {/* Main logo container */}
        <div 
          className="relative flex items-center justify-center z-10"
          style={{ width: size, height: size }}
        >
          {/* TaskUp Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="TaskUp Logo"
              width={size}
              height={size}
              className="drop-shadow-lg"
            />
          </div>
          
          {/* Rotating outer ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-yellow-200 border-r-yellow-200/50 rounded-full animate-spin"></div>
          
          {/* Counter-rotating inner ring */}
          <div className="absolute inset-2 border-2 border-transparent border-b-yellow-300 border-l-yellow-300/50 rounded-full animate-spin-reverse"></div>
        </div>
      </div>
    </div>
  );
}
