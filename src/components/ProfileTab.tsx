'use client';

 
import Image from 'next/image';
 
 
import { selectCurrentUser, selectUserLoading } from '@/modules';
 
import BinanceLoader from './BinanceLoader';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileTab() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
 

if (loading) {
    return (
      <div className="animate-fadeIn flex flex-col items-center justify-center min-h-screen w-full">
        <BinanceLoader size={120} className="mb-8" />
        
      </div>
    );
  }
  return (
    <div className="animate-fadeIn bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen w-full">
      {/* Header Section - Binance Style */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-4 py-6 text-white shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image 
              src={user?.profilePicUrl || "https://i.pravatar.cc/150"} 
              alt="User Profile" 
              width={70}
              height={70}
              className="w-[70px] h-[70px] rounded-full border-3 border-white shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold mb-1 truncate">{user?.username || 'User'}</h2>
            <p className="text-yellow-100 text-sm truncate">@{user?.telegramUsername || 'username'}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-yellow-600 px-2 py-1 rounded-full">VIP 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards - Binance Style */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-4 border border-gray-200">
          <div className="text-center mb-3">
            <p className="text-gray-500 text-xs mb-1">Total Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">{user?.balance || 0}</h3>
            <p className="text-yellow-600 font-semibold text-sm">PEPE</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-xs font-medium">Total Earned</p>
                  <p className="text-green-800 font-bold text-base">{user?.totalEarned || 0}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-xs font-medium">Referral Bonus</p>
                  <p className="text-blue-800 font-bold text-base">{user?.referralEarnings || 0}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Binance Style */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-3 shadow-lg border border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Ads Watched</p>
                <p className="font-bold text-base text-gray-900">{user?.adsWatchedToday || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-3 shadow-lg border border-orange-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Tasks Done</p>
                <p className="font-bold text-base text-gray-900">{user?.tasksCompletedToday || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-3 shadow-lg border border-green-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Referrals</p>
                <p className="font-bold text-base text-gray-900">{user?.referralCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-3 shadow-lg border border-red-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Days Active</p>
                <p className="font-bold text-base text-gray-900">
                  {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information - Binance Style */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-200">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Account Information
            </h3>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Member Since</span>
              <span className="font-medium text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Last Activity</span>
              <span className="font-medium text-gray-900">
                {user?.lastTaskTimestamp ? new Date(user.lastTaskTimestamp).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {user?.referredBy && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm">Referred By</span>
                <span className="font-medium text-gray-900">{user.referredBy}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Account Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Attribution */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-xl p-3 border border-blue-200 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z"/>
              </svg>
              <h4 className="font-semibold text-gray-900">Developed by</h4>
            </div>
            <p className="text-blue-600 font-medium text-sm mb-1">@mdrijonhossainjibon</p>
            <p className="text-gray-600 text-xs">Professional Telegram Bot Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
