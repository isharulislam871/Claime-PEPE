'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
 
 
import { selectCurrentUser, watchAdRequest } from '@/modules';
 

// Import new components
import UserProfile from './UserProfile';
import BalanceCard from './BalanceCard';
import StatsGrid from './StatsGrid';
import EarningSystems from './EarningSystems';
import SpinWheelModal from './SpinWheelModal';
import {   useSelector , useDispatch } from 'react-redux';

export default function HomeTab() {
  
  const user = useSelector(selectCurrentUser);
   const dispatch = useDispatch();
 
  const [showSpinWheel, setShowSpinWheel] = useState(false);

   
 
 
  const handleWatchAd = async () => {
    
     dispatch(watchAdRequest());
    
  };

  const handleOpenSpinWheel = () => {
    setShowSpinWheel(true);
  };

  const handleCloseSpinWheel = () => {
    setShowSpinWheel(false);
  };

  return (
    <div className="animate-fadeIn bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen p-4">
      <UserProfile />
      
      <BalanceCard />
      
      <StatsGrid />
      
      <EarningSystems
        onWatchAd={handleWatchAd}
        onOpenSpinWheel={handleOpenSpinWheel}
      />

      <SpinWheelModal
        showSpinWheel={showSpinWheel}
        onClose={handleCloseSpinWheel}
      />
    </div>
  );
}
