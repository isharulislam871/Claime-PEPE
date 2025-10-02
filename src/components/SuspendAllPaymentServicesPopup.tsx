'use client';

import React from 'react';
import { Popup, Button, Card, Footer } from 'antd-mobile';
import { StopOutlined, ExclamationCircleOutlined, ToolOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { closePopup, selectIsPaymentSuspendedPopupVisible } from '@/modules';
 

export default function SuspendAllPaymentServicesPopup( ) {
  const isOpen = useSelector(selectIsPaymentSuspendedPopupVisible);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closePopup('isPaymentSuspendedPopupVisible'));
  }
    
  
  return (
    <Popup
      visible={isOpen}
      onMaskClick={() => {}} // Disable mask click to close
      
      bodyStyle={{
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'auto',
        padding: 0
      }}
    >
      <div className="min-h-screen bg-white">
        {/* Binance-like Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <StopOutlined className="text-red-500 text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Payment Services</h1>
                <p className="text-xs text-gray-500">Temporarily Suspended</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CloseOutlined className="text-gray-400 text-lg" />
            </button>
          </div>
        </div>

        <div className="p-4">

        {/* Main Alert */}
        <Card className="mb-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StopOutlined className="text-red-600 text-3xl" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Payment Services Temporarily Suspended
            </h3>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              All payment-related services have been temporarily suspended for system maintenance and security updates.
            </p>

            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-red-800 mb-2 flex items-center justify-center">
                <ExclamationCircleOutlined className="mr-2" />
                Currently Unavailable Services
              </h4>
              <ul className="text-sm text-red-700 text-left space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Withdrawals and cash-outs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Payment processing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Balance transfers
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Reward redemptions
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center justify-center">
                <ToolOutlined className="mr-2" />
                What's Still Available
              </h4>
              <ul className="text-sm text-blue-700 text-left space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Earning points through tasks
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Daily check-ins and bonuses
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Watching ads for rewards
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Inviting friends
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Account management
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center justify-center">
                <ClockCircleOutlined className="mr-2" />
                Your Earnings Are Safe
              </h4>
              <p className="text-sm text-green-700">
                All your earned points and rewards are securely stored. You can continue earning while we work on improvements. 
                Payment services will be restored as soon as maintenance is complete.
              </p>
            </div>
          </div>
        </Card>

        {/* Maintenance Info */}
        <Card className="mb-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <ToolOutlined className="text-orange-600 mr-2" />
              Why Are Services Suspended?
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Security Updates:</span> Implementing enhanced security measures for your protection
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">System Maintenance:</span> Upgrading payment infrastructure for better performance
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Compliance Updates:</span> Ensuring all payment processes meet regulatory standards
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Feature Improvements:</span> Adding new payment options and faster processing
                </div>
              </div>
            </div>
          </div>
        </Card>

     

        {/* Footer */}
        <Footer
          content={
            <div className="text-center py-4 bg-gray-50 border-t border-gray-100 mt-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  Developed by <span className="text-blue-600 font-medium">FutureApps_Dev</span>
                </p>
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} FutureApps_Dev. All rights reserved.
                </p>
              </div>
            </div>
          }
          className="bg-gray-50"
        />
        </div>
      </div>
    </Popup>
  );
}
