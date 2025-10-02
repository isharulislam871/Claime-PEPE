'use client';

import { useState } from 'react';
import VpnDetectionModal from '@/components/VpnDetectionModal';

interface VpnManagerProps {
  vpnDetected: boolean;
  setVpnDetected: (detected: boolean) => void;
}

export default function VpnManager({ vpnDetected, setVpnDetected }: VpnManagerProps) {
  const [showVpnModal, setShowVpnModal] = useState(false);
  const [isVpnChecking, setIsVpnChecking] = useState(false);

  const checkVpnStatus = async () => {
    try {
      setIsVpnChecking(true);
      const response = await fetch('/api/vpn/detect');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.isVpn) {
          setVpnDetected(true);
          setShowVpnModal(true);
        }
      }
    } catch (error) {
      console.error('VPN check failed:', error);
    } finally {
      setIsVpnChecking(false);
    }
  };

  const handleVpnModalClose = () => {
    setShowVpnModal(false);
  };

  const handleVpnRetry = async () => {
    await checkVpnStatus();
  };

  return (
    <>
      <VpnDetectionModal
        visible={showVpnModal}
        onClose={handleVpnModalClose}
        onRetry={handleVpnRetry}
        isChecking={isVpnChecking}
      />
    </>
  );
}
