import React from 'react';
import { EyeOutlined, HourglassOutlined } from '@ant-design/icons';
 
import { selectCurrentUser, selectEarningSystemsStatus } from '@/modules';
import { useSelector } from 'react-redux';

export default function StatsGrid() {
  const user = useSelector(selectCurrentUser);
  const earningStatus = useSelector(selectEarningSystemsStatus);

  console.log(earningStatus)
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 animate-stagger">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl shadow-lg text-center hover-lift hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <EyeOutlined className="text-xl text-white animate-pulse" />
        </div>
        <p className="text-emerald-700 text-sm font-semibold">👁️ Ads Watched Today</p>
        <h3 className="text-3xl font-black text-emerald-800">{earningStatus.adsWatched || 0}</h3>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 p-5 rounded-2xl shadow-lg text-center hover-lift hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <HourglassOutlined className="text-xl text-white animate-spin-reverse" />
        </div>
        <p className="text-orange-700 text-sm font-semibold">⏳ Ads Left Today</p>
        <h3 className="text-3xl font-black text-orange-800">{40 - earningStatus.adsWatched}</h3>
      </div>
    </div>
  );
}
