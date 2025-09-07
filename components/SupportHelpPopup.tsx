'use client';

import React, { useState } from 'react';
import {
  Popup,
  Button,
  Card,
  List,
  Toast
} from 'antd-mobile';
import {
  CloseOutline,
  QuestionCircleOutline,
  RightOutline,
  MessageOutline,
  ExclamationCircleOutline,
  StarOutline,
  GlobalOutline,
  FileOutline
} from 'antd-mobile-icons';
import { SecurityScanOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
 
interface SupportHelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportHelpPopup({ isOpen, onClose }: SupportHelpPopupProps) {
  const [termsPrivacyOpen, setTermsPrivacyOpen] = useState(false);
  const handleHelpCenter = () => {
    // Open help center or FAQ
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup-help.com/faq');
    } else {
      Toast.show('Help Center: Find answers to common questions');
    }
  };

  const handleContactSupport = () => {
    // Open support chat or email
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/Bep20manager');
    } else {
      Toast.show('Contact Support: @taskup_support');
    }
  };

  const handleReportBug = () => {
    // Open bug report form
    Toast.show('Bug Report: Describe the issue you encountered');
  };

  const handleFeatureRequest = () => {
    // Open feature request form
    Toast.show('Feature Request: Suggest new features');
  };

  const handleTermsOfService = () => {
    setTermsPrivacyOpen(true);
    toast.info('Terms of Service opene soon')
  };

  const handlePrivacyPolicy = () => {
    setTermsPrivacyOpen(true);
  };

  const handleRateApp = () => {
    // Open app rating
    Toast.show('⭐ Rate TaskUp: Help us improve with your feedback!');
  };

  const handleCommunity = () => {
    // Open community channel
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/BEP20USDTchannel');
    } else {
      Toast.show('Community: @taskup_community');
    }
  };

  const handleTutorial = () => {
    // Show app tutorial
    Toast.show('Tutorial: Learn how to use TaskUp effectively');
  };

  return (
    <Popup
      visible={isOpen}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ height: '85vh', backgroundColor: '#f8fafc' }}
    >
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <QuestionCircleOutline className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Support & Help</h2>
                <p className="text-sm text-gray-500">Get help and support</p>
              </div>
            </div>
            <Button
              fill='none'
              size='small'
              onClick={onClose}
              className="!p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseOutline className="text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {/* Quick Help */}
          <Card title="Quick Help" className="mb-6">
            <List>
              <List.Item
                prefix={<QuestionCircleOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleHelpCenter}
              >
                <div>
                  <div className="font-medium">Help Center</div>
                  <div className="text-sm text-gray-500">FAQ and guides</div>
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
                prefix={<FileOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleTutorial}
              >
                <div>
                  <div className="font-medium">Tutorial</div>
                  <div className="text-sm text-gray-500">Learn how to use TaskUp</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Report & Feedback */}
          <Card title="Report & Feedback" className="mb-6">
            <List>
              <List.Item
                prefix={<ExclamationCircleOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleReportBug}
              >
                <div>
                  <div className="font-medium">Report a Bug</div>
                  <div className="text-sm text-gray-500">Found an issue? Let us know</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<StarOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleFeatureRequest}
              >
                <div>
                  <div className="font-medium">Feature Request</div>
                  <div className="text-sm text-gray-500">Suggest new features</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<StarOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleRateApp}
              >
                <div>
                  <div className="font-medium">Rate TaskUp</div>
                  <div className="text-sm text-gray-500">Help us improve with your rating</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Community & Legal */}
          <Card title="Community & Legal" className="mb-6">
            <List>
              <List.Item
                prefix={<GlobalOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleCommunity}
              >
                <div>
                  <div className="font-medium">Community</div>
                  <div className="text-sm text-gray-500">Join our Telegram community</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<FileOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleTermsOfService}
              >
                <div>
                  <div className="font-medium">Terms of Service</div>
                  <div className="text-sm text-gray-500">Read our terms</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<SecurityScanOutlined />}
                extra={<RightOutline />}
                clickable
                onClick={handlePrivacyPolicy}
              >
                <div>
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-gray-500">How we protect your data</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* App Information */}
          <Card title="App Information" className="mb-6">
            <List>
              <List.Item extra="v1.0.0">
                App Version
              </List.Item>
              <List.Item extra="Build 2024.1">
                Build Number
              </List.Item>
              <List.Item extra="Telegram WebApp">
                Platform
              </List.Item>
              <List.Item extra="Online">
                Status
              </List.Item>
            </List>
          </Card>

          {/* Emergency Contact */}
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="p-4 text-center">
              <div className="text-red-600 font-medium mb-2">Need Urgent Help?</div>
              <div className="text-sm text-red-500 mb-3">
                For urgent issues, contact our support team directly
              </div>
              <Button 
                color="danger" 
                size="small"
                onClick={handleContactSupport}
              >
                Contact Support Now
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Terms & Privacy Popup */}
     {/*  <TermsPrivacyPopup 
        isOpen={termsPrivacyOpen} 
        onClose={() => setTermsPrivacyOpen(false)} 
      /> */}
    </Popup>
  );
}
