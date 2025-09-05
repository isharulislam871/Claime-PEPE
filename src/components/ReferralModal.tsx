'use client';

import { useState } from 'react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://t.me/TaskItUpBot?start=test_use";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="p-6 text-center">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Refer Friends, Earn 10% More!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Earn a <span className="text-blue-500 font-semibold">10% commission</span> from your friends&apos; earnings!
          </p>

          {/* Referral Link */}
          <div className="flex items-center bg-gray-50 rounded-lg p-3 mb-6">
            <input 
              type="text" 
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-500">Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">0 PEPE</div>
              <div className="text-sm text-gray-500">Earned</div>
            </div>
          </div>

          {/* How it works */}
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 mb-3">How a referral is counted:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <p className="text-sm text-gray-600">
                  Your friend must join using your unique link.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <p className="text-sm text-gray-600">
                  Your referral count increases instantly when they join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
