'use client';

import React from 'react';
import { Popup, Button, Card, ProgressBar } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { UserAddOutlined, CheckCircleOutlined, ExclamationCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { useDispatch,  useSelector } from 'react-redux';
import { closePopup, openPopup, selectCurrentUser, selectIsMinimumInvitesPopupVisible } from '@/modules';

interface MinimumInvitesRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentInvites: number;
  requiredInvites: number;
  onInviteFriends: () => void;
}

export default function MinimumInvitesRequiredPopup( ) {
  
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const onClose = () => {
    dispatch(closePopup('isMinimumInvitesPopupVisible'))
  };
  
  const  currentInvites = user?.referralCount || 0;  
  const remainingInvites = Math.max(0, 5000 - currentInvites);
  const progress = Math.min(100, (currentInvites / 5000) * 100);
  const isEligible = currentInvites >= 5000;

  const isOpen = useSelector(selectIsMinimumInvitesPopupVisible);

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        minHeight: '60vh',
        backgroundColor: '#f8f9fa'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              isEligible ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              {isEligible ? (
                <CheckCircleOutlined className="text-green-600 text-xl" />
              ) : (
                <UserAddOutlined className="text-purple-600 text-xl" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {isEligible ? 'Withdrawal Unlocked!' : 'Invite Friends to Withdraw'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEligible ? 'You can now make withdrawals' : 'Complete your invite requirement'}
              </p>
            </div>
          </div>
          <Button
            fill="none"
            size="small"
            onClick={onClose}
            style={{ padding: '4px' }}
          >
            <CloseOutline fontSize={20} />
          </Button>
        </div>

        {/* Progress Section */}
        <Card className="mb-4">
          <div className="text-center py-4">
            <div className="mb-4">
              <div className={`text-4xl font-bold mb-2 ${
                isEligible ? 'text-green-600' : 'text-purple-600'
              }`}>
                {currentInvites} / {5000}
              </div>
              <div className="text-sm text-gray-600">Successful Invites</div>
            </div>

            <div className="mb-4">
              <ProgressBar
                percent={progress}
                style={{
                  '--fill-color': isEligible ? '#10B981' : '#8B5CF6',
                  '--track-color': '#E5E7EB'
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                {progress.toFixed(0)}% Complete
              </div>
            </div>

            {!isEligible && (
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <ExclamationCircleOutlined className="text-orange-600 mr-2" />
                  <span className="font-medium text-orange-800">
                    {remainingInvites} more invite{remainingInvites !== 1 ? 's' : ''} needed
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  You need to invite {remainingInvites} more friend{remainingInvites !== 1 ? 's' : ''} before you can withdraw your earnings
                </p>
              </div>
            )}

            {isEligible && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircleOutlined className="text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    Withdrawal Requirement Met!
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Congratulations! You can now withdraw your earnings anytime
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Benefits Section */}
        <Card className="mb-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <GiftOutlined className="text-yellow-600 mr-2" />
              Why Invite Friends?
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Unlock Withdrawals:</span> Meet the minimum requirement to access your earnings
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Earn Referral Bonuses:</span> Get rewards for each successful invite
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Build Your Network:</span> Help friends earn money too
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Increase Limits:</span> Higher invite count may unlock better withdrawal limits
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {!isEligible ? (
            <>
              <Button
                block
                size="large"
                onClick={() => {
                  dispatch(openPopup('isInviteFriendsEarn'))
                  onClose();
                }}
                style={{
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  height: '48px',
                  fontWeight: '500'
                }}
              >
                <UserAddOutlined /> Invite Friends Now
              </Button>
              
              <Button
                block
                size="large"
                onClick={onClose}
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  height: '48px',
                  fontWeight: '500'
                }}
              >
                Maybe Later
              </Button>
            </>
          ) : (
            <Button
              block
              size="large"
              onClick={onClose}
              style={{
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontWeight: '500'
              }}
            >
              <CheckCircleOutlined /> Continue to Withdraw
            </Button>
          )}
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This requirement helps maintain platform quality and security
            </p>
          </div>
        </div>
      </div>
    </Popup>
  );
}
