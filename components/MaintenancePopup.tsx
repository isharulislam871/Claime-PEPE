'use client';

import React, { useState, useEffect } from 'react';
import {
  Popup,
  Button,
  Card,
  List,
  Toast,
  SpinLoading,
  ProgressBar
} from 'antd-mobile';
import {
  CloseOutline,
  ExclamationCircleOutline,
  RightOutline,
  MessageOutline,
  GlobalOutline,
  FileOutline,
  ClockCircleOutline,
  CheckCircleOutline
} from 'antd-mobile-icons';
import { ToolOutlined, ReloadOutlined } from '@ant-design/icons';

interface MaintenancePopupProps {
  isOpen: boolean;
  onClose: () => void;
  maintenanceData?: {
    enabled: boolean;
    message?: string;
    estimatedDuration?: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
    affectedServices?: string[];
  };
}

export default function MaintenancePopup({ 
  isOpen, 
  onClose, 
  maintenanceData 
}: MaintenancePopupProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && maintenanceData?.endTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(maintenanceData.endTime!).getTime();
        const startTime = new Date(maintenanceData.startTime || now).getTime();
        
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        const remaining = endTime - now;
        
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}m`);
          setProgress((elapsed / totalDuration) * 100);
        } else {
          setTimeRemaining('Completed');
          setProgress(100);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, maintenanceData]);

  const handleRefresh = () => {
    Toast.show('Checking maintenance status...');
    // Trigger a refresh of maintenance status
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleContactSupport = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/taskup_support');
    } else {
      Toast.show('Contact Support: @taskup_support');
    }
  };

  const handleStatusPage = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://status.taskup.com');
    } else {
      Toast.show('Status Page: Check our status page for updates');
    }
  };

  const handleCommunity = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/taskup_community');
    } else {
      Toast.show('Community: @taskup_community');
    }
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '90vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-orange-500 text-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ToolOutlined className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Maintenance Mode</h2>
                <p className="text-sm text-orange-100">Service temporarily unavailable</p>
              </div>
            </div>
            <Button
              fill='none'
              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <CloseOutline className="text-white" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {/* Maintenance Status */}
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ToolOutlined className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-orange-800 mb-2">
                We're Currently Under Maintenance
              </h3>
              <p className="text-orange-700 mb-4">
                {maintenanceData?.message || 
                 'We are performing scheduled maintenance to improve your experience. Please check back soon.'}
              </p>
              
              {timeRemaining && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-orange-600">Estimated completion:</span>
                    <span className="text-sm font-medium text-orange-800">{timeRemaining}</span>
                  </div>
                  <ProgressBar 
                    percent={progress} 
                    style={{ 
                      '--fill-color': '#f97316',
                      '--track-color': '#fed7aa'
                    }} 
                  />
                </div>
              )}

              <Button 
                color="warning" 
                size="small"
                onClick={handleRefresh}
                className="mt-2"
              >
                <ReloadOutlined className="mr-2" />
                Check Status
              </Button>
            </div>
          </Card>

          {/* Maintenance Details */}
          {maintenanceData && (
            <Card title="Maintenance Details" className="mb-6">
              <List>
                {maintenanceData.reason && (
                  <List.Item extra={maintenanceData.reason}>
                    Reason
                  </List.Item>
                )}
                {maintenanceData.estimatedDuration && (
                  <List.Item extra={maintenanceData.estimatedDuration}>
                    Duration
                  </List.Item>
                )}
                {maintenanceData.startTime && (
                  <List.Item extra={new Date(maintenanceData.startTime).toLocaleString()}>
                    Started
                  </List.Item>
                )}
                {maintenanceData.endTime && (
                  <List.Item extra={new Date(maintenanceData.endTime).toLocaleString()}>
                    Expected End
                  </List.Item>
                )}
              </List>
            </Card>
          )}

          {/* Affected Services */}
          {maintenanceData?.affectedServices && maintenanceData.affectedServices.length > 0 && (
            <Card title="Affected Services" className="mb-6">
              <List>
                {maintenanceData.affectedServices.map((service, index) => (
                  <List.Item 
                    key={index}
                    prefix={<ExclamationCircleOutline className="text-orange-500" />}
                  >
                    {service}
                  </List.Item>
                ))}
              </List>
            </Card>
          )}

          {/* What You Can Do */}
          <Card title="What You Can Do" className="mb-6">
            <List>
              <List.Item
                prefix={<GlobalOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleStatusPage}
              >
                <div>
                  <div className="font-medium">Check Status Page</div>
                  <div className="text-sm text-gray-500">Real-time updates on our services</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<MessageOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleContactSupport}
              >
                <div>
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm text-gray-500">Get help from our team</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<GlobalOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleCommunity}
              >
                <div>
                  <div className="font-medium">Join Community</div>
                  <div className="text-sm text-gray-500">Stay updated with our community</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Tips */}
          <Card title="Tips While You Wait" className="mb-6">
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircleOutline className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">Stay Connected</div>
                  <div className="text-xs text-gray-600">Follow our community for real-time updates</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircleOutline className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">Check Back Later</div>
                  <div className="text-xs text-gray-600">Maintenance usually completes ahead of schedule</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircleOutline className="text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">Prepare for Return</div>
                  <div className="text-xs text-gray-600">We'll have exciting updates when we're back!</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Notice */}
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="p-4 text-center">
              <div className="text-red-600 font-medium mb-2">Urgent Issues?</div>
              <div className="text-sm text-red-500 mb-3">
                For critical issues that can't wait, contact our emergency support
              </div>
              <Button 
                color="danger" 
                size="small"
                onClick={handleContactSupport}
              >
                Emergency Contact
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Popup>
  );
}
