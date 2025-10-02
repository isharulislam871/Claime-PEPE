'use client';

import React from 'react';
import { Popup, Button, Card } from 'antd-mobile';
import { StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectIsRegistrationBlockedPopupVisible, selectIsTaskPopupOpen } from '@/modules';



export default function NewRegistrationBlockedPopup() {

  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsRegistrationBlockedPopupVisible);

  const onClose = () => {
    dispatch(closePopup('isRegistrationBlockedPopupVisible'))
  }

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{

        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <StopOutlined className="text-red-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Registration Temporarily Disabled</h2>
              <p className="text-sm text-gray-500">New user registrations are currently unavailable</p>
            </div>
          </div>

        </div>

        {/* Content */}
        <Card className="mb-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationCircleOutlined className="text-orange-600 text-2xl" />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              We're Currently Under Maintenance
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              New user registrations have been temporarily disabled while we perform system maintenance and improvements.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">What does this mean?</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• New users cannot create accounts at this time</li>
                <li>• Existing users can continue using the app normally</li>
                <li>• All features remain available for current users</li>
                <li>• Registration will be restored soon</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Already have an account?</h4>
              <p className="text-sm text-green-700">
                If you're an existing user, you can continue using all features without any restrictions.
              </p>
            </div>
          </div>
        </Card>


      </div>
    </Popup>
  );
}
