import React, { useState, useEffect } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
 
 
import { selectCurrentUser, selectSpinWheel , spinWheel  } from '@/modules';
 
import { useDispatch, useSelector } from 'react-redux';

interface SpinWheelModalProps {
  showSpinWheel: boolean;
  onClose: () => void;
}

export default function SpinWheelModal({
  showSpinWheel,
  onClose
}: SpinWheelModalProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const spinWheelState = useSelector(selectSpinWheel);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [possibleRewards] = useState([50, 100, 200, 500, 1000]);

  useEffect(() => {
    if (showSpinWheel && currentUser?.telegramId) {
      
      if (!spinWheelState.canSpin) {
        toast.info('Spin wheel already used today. Come back tomorrow!');
      }
    }
  }, [showSpinWheel, currentUser?.telegramId, dispatch, spinWheelState.canSpin]);

  const handleTapSpin = async () => {
    if (!spinWheelState.canSpin || isSpinning || !currentUser?.telegramId) return;
    
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    // Require 5 taps to complete the spin
    if (newTapCount >= 5) {
      setIsSpinning(true);
      
      try {
        // Generate random reward
        const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
      
      } catch (error) {
        toast.error('Failed to complete spin');
      } finally {
        setIsSpinning(false);
      }
    } else {
      toast.info(`Tap ${5 - newTapCount} more times to spin! 👆`);
    }
  };

  const handleClose = () => {
    if (!isSpinning) {
      setTapCount(0);
      onClose();
    }
  };

  if (!showSpinWheel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full shadow-2xl animate-bounceIn">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎰 Lucky Spin Wheel</h2>
          
          {/* Spin Wheel Visual */}
          <div className="relative mb-6">
            <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl ${isSpinning ? 'animate-spin' : ''}`}>
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                <StarOutlined className={`text-6xl text-purple-600 ${isSpinning ? '' : tapCount > 0 ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
            </div>
          </div>

          {/* Tap Instructions */}
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              {isSpinning ? 'Spinning...' : `Tap ${5 - tapCount} more times to spin!`}
            </p>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < tapCount ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tap Button */}
          <button
            onClick={handleTapSpin}
            disabled={isSpinning || !spinWheelState.canSpin}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 mb-4 ${
              isSpinning || !spinWheelState.canSpin
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSpinning ? 'Spinning...' : !spinWheelState.canSpin ? 'Already Used Today' : '👆 TAP TO SPIN'}
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isSpinning}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
