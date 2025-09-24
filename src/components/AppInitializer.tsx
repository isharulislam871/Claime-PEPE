'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import MaintenancePopup from './MaintenancePopup';
import { 
  initializeApp,
  useMaintenanceStatus,
  useAppInitialization,
} from '@/modules/public/app';
import { AppDispatch } from '@/modules/store';

 
 
 
export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const hasInitialized = useRef(false);
  
  // Get app state from Redux store using custom hooks
  const { isEnabled: isMaintenanceEnabled, message: maintenanceMessage } = useMaintenanceStatus();
  const { isInitializing, error } = useAppInitialization();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Dispatch the initialize app action
    dispatch(initializeApp());
  }, [dispatch]);

  return (
    <>
      <MaintenancePopup 
        isOpen={isMaintenanceEnabled}
        onClose={() => {
          // Handle maintenance popup close if needed
          console.log('Maintenance popup closed');
        }}
        maintenanceData={{
          enabled: isMaintenanceEnabled,
          message: maintenanceMessage,
        }}
      />
      {error && (
        <div className="error-message">
          Error initializing app: {error}
        </div>
      )}
      {isInitializing && (
        <div className="loading-indicator">
          Initializing app...
        </div>
      )}
    </>
  );
}
