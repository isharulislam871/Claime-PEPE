'use client'; 
import {  selectCurrentUser } from '@/modules';
import { useSelector } from 'react-redux';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBalance?: boolean;
  showUserInfo?: boolean;
}

export default function Header({ title, subtitle, showBalance = false, showUserInfo = false }: HeaderProps) {
 
  const user = useSelector(selectCurrentUser)
 

  return (
    <div className="mb-6">
      {/* User Info Section */}
      {showUserInfo && user && (
        <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <img 
              src={user.profilePicUrl || "https://i.pravatar.cc/100"} 
              alt="User Profile" 
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <div>
              <p className="text-sm text-gray-600">Welcome,</p>
              <h2 className="text-lg font-semibold text-gray-900">{user.username}</h2>
            </div>
          </div>
          {showBalance && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-xl font-bold text-yellow-600">{user.balance || 0} PEPE</p>
            </div>
          )}
        </div>
      )}

      {/* Title Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Balance Only Section */}
      {showBalance && !showUserInfo && user && (
        <div className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-4 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Available Balance</p>
            <p className="text-2xl font-bold">{user.balance || 0} <span className="text-lg">PEPE</span></p>
          </div>
        </div>
      )}

     
    </div>
  );
}
