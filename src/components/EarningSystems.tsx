import React from 'react';
import { toast } from 'react-toastify';
import { 
  RocketOutlined,
  GiftOutlined,
  EyeOutlined,
  StarOutlined,
  TeamOutlined
} from '@ant-design/icons';
 
import { selectEarningSystemsStatus ,  claimDailyCheckIn  } from '@/modules';
import { useDispatch, useSelector } from 'react-redux';
 

interface EarningSystem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
  action: () => void;
}

interface EarningSystemsProps {
  onWatchAd: () => void;
  onOpenSpinWheel: () => void;
}

export default function EarningSystems({
  onWatchAd,
  onOpenSpinWheel
}: EarningSystemsProps) {
  const dispatch = useDispatch();
  const earningStatus = useSelector(selectEarningSystemsStatus);
  
  const handleDailyCheckIn = () => {
    dispatch(claimDailyCheckIn());
  };

  const earningSystems: EarningSystem[] = [
    {
      id: 'daily-checkin',
      title: 'Daily Check-in',
      description: 'Claim your daily reward',
      icon: <GiftOutlined className="text-2xl" />,
      color: 'from-green-500 to-green-600',
      available: true,
      action: handleDailyCheckIn
    },
    {
      id: 'watch-ad',
      title: 'Watch Ads',
      description: 'Earn coins by watching ads',
      icon: <EyeOutlined className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
      available: true,
      action: onWatchAd
    },
    {
      id: 'spin-wheel',
      title: 'Spin Wheel',
      description: 'Try your luck!',
      icon: <StarOutlined className="text-2xl" />,
      color: 'from-purple-500 to-purple-600',
      available: true,
      action: onOpenSpinWheel
    },
    {
      id: 'referrals',
      title: 'Referrals',
      description: 'Invite friends',
      icon: <TeamOutlined className="text-2xl" />,
      color: 'from-orange-500 to-orange-600',
      available: true,
      action: () => toast.info('Referral system coming soon!')
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <RocketOutlined className="text-purple-600" />
        💰 Earning Systems
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {earningSystems.map((system, index) => (
          <div
            key={system.id}
            className={`bg-gradient-to-br ${system.color} p-4 rounded-2xl shadow-lg text-white relative overflow-hidden hover-lift transition-all duration-300 ${
              !system.available ? 'opacity-60' : 'cursor-pointer hover:scale-105'
            }`}
            onClick={system.available ? system.action : undefined}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                {system.icon}
                {system.available && <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>}
              </div>
              <h4 className="font-bold text-sm mb-1">{system.title}</h4>
              <p className="text-xs opacity-90">{system.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
