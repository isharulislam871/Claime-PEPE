'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface BotInfo {
  username: string;
  firstName: string;
  id: number;
}

interface UserReferralData {
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  totalEarned: number;
}

export default function InviteTab() {
  const [copied, setCopied] = useState(false);
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [userReferral, setUserReferral] = useState<UserReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Generate referral link dynamically based on bot username and user's referral code
  const referralLink = `https://t.me/${botInfo?.username}?startapp=${userReferral?.referralCode}`
 
  const referralCode = userReferral?.referralCode || "TASKUP123";

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
       toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Fetch bot and user referral information on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bot info
        const botResponse = await fetch('/api/bot');
        const botResult = await botResponse.json();
        
        if (botResult.success && botResult.data) {
          setBotInfo(botResult.data);
        }

        // Get Telegram user data (you'll need to implement this based on your auth system)
        const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
        
        if (telegramUser) {
          // Fetch or create user referral data
          const userResponse = await fetch('/api/user/referral', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId: telegramUser.id.toString(),
              username: telegramUser.username,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
            }),
          });

          const userResult = await userResponse.json();
          
          if (userResult.success && userResult.data) {
            setUserReferral(userResult.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to share via Telegram
  const shareViaTelegram = () => {
    const message = `🚀 Join TaskUp and earn crypto by completing simple tasks!\n\n💰 Use my referral link: ${referralLink}\n\n🎁 Get started and earn rewards together!`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  // Function to share via WhatsApp
  const shareViaWhatsApp = () => {
    const message = `🚀 Join TaskUp and earn crypto by completing simple tasks!\n\n💰 Use my referral link: ${referralLink}\n\n🎁 Get started and earn rewards together!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animate-fadeIn bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-4 py-6 text-white shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invite Friends</h1>
          <p className="text-yellow-100 text-sm">Earn rewards by inviting friends to TaskUp!</p>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-white shadow-2xl border border-gray-200">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Earn Together!</h2>
            <p className="text-blue-100 mb-3 text-sm">Get 10% of your friends' earnings forever</p>
            <div className="flex justify-center items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">10%</div>
                <div className="text-xs text-blue-100">Commission</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-xs text-blue-100">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-xl p-3 border border-gray-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {userReferral?.referralCount || 0}
              </div>
              <div className="text-xs text-gray-600">Friends Invited</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white via-green-50 to-blue-50 rounded-xl p-3 border border-gray-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                 {(userReferral?.referralEarnings || 0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Referral Earned PEPE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Your Referral Link</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-xs"
            />
            <button
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-green-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Your Referral Code</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-xs font-mono"
            />
            <button
              onClick={() => copyToClipboard(referralCode, 'code')}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Share via</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={shareViaTelegram}
              className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z"/>
              </svg>
              <span className="text-xs font-medium">Telegram</span>
            </button>
            <button 
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">How it works</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">1</div>
              <div className="text-xs text-gray-600">Share your referral link with friends</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">2</div>
              <div className="text-xs text-gray-600">They sign up using your link</div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">3</div>
              <div className="text-xs text-gray-600">Earn 10% of their task rewards forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Attribution */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-3 border border-blue-200 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-blue-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z"/>
              </svg>
              <h4 className="font-semibold text-gray-900 text-sm">Developed by</h4>
            </div>
            <p className="text-blue-600 font-medium text-sm mb-1">@mdrijonhossainjibon</p>
            <p className="text-gray-600 text-xs">Professional Telegram Bot Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
