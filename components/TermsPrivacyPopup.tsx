'use client';

import React, { useState } from 'react';
import {
  Popup,
  Button,
  Card,
  List,
  Toast,
  Tabs
} from 'antd-mobile';
import {
  CloseOutline,
  FileOutline,
  RightOutline,
  
  GlobalOutline,
  ExclamationCircleOutline,
  UserOutline,
  LockOutline
} from 'antd-mobile-icons';
import { SecurityScanOutlined } from '@ant-design/icons';

interface TermsPrivacyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsPrivacyPopup({ isOpen, onClose }: TermsPrivacyPopupProps) {
  const [activeTab, setActiveTab] = useState('terms');

  const handleOpenTerms = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/terms');
    } else {
      Toast.show('Terms of Service opened');
    }
  };

  const handleOpenPrivacy = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/privacy');
    } else {
      Toast.show('Privacy Policy opened');
    }
  };

  const handleOpenCookies = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/cookies');
    } else {
      Toast.show('Cookie Policy opened');
    }
  };

  const handleOpenDataPolicy = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/data-policy');
    } else {
      Toast.show('Data Policy opened');
    }
  };

  const handleOpenUserAgreement = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/user-agreement');
    } else {
      Toast.show('User Agreement opened');
    }
  };

  const handleOpenGDPR = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://taskup.com/gdpr');
    } else {
      Toast.show('GDPR Information opened');
    }
  };

  const handleDataRequest = () => {
    Toast.show('Data Request: Contact support to request your data');
  };

  const handleDeleteAccount = () => {
    Toast.show('Account Deletion: Contact support to delete your account');
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
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <FileOutline className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Terms & Privacy</h2>
                <p className="text-sm text-gray-500">Legal information and policies</p>
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
          {/* Legal Documents */}
          <Card title="Legal Documents" className="mb-6">
            <List>
              <List.Item
                prefix={<FileOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenTerms}
              >
                <div>
                  <div className="font-medium">Terms of Service</div>
                  <div className="text-sm text-gray-500">Rules and conditions for using TaskUp</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<LockOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenPrivacy}
              >
                <div>
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-gray-500">How we collect and use your data</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<UserOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenUserAgreement}
              >
                <div>
                  <div className="font-medium">User Agreement</div>
                  <div className="text-sm text-gray-500">Your rights and responsibilities</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<GlobalOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenCookies}
              >
                <div>
                  <div className="font-medium">Cookie Policy</div>
                  <div className="text-sm text-gray-500">How we use cookies and tracking</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Data Protection */}
          <Card title="Data Protection" className="mb-6">
            <List>
              <List.Item
                prefix={<SecurityScanOutlined />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenDataPolicy}
              >
                <div>
                  <div className="font-medium">Data Policy</div>
                  <div className="text-sm text-gray-500">How we protect your information</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<ExclamationCircleOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleOpenGDPR}
              >
                <div>
                  <div className="font-medium">GDPR Rights</div>
                  <div className="text-sm text-gray-500">Your European data protection rights</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Data Rights */}
          <Card title="Your Data Rights" className="mb-6">
            <List>
              <List.Item
                prefix={<FileOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleDataRequest}
              >
                <div>
                  <div className="font-medium">Request Your Data</div>
                  <div className="text-sm text-gray-500">Download a copy of your personal data</div>
                </div>
              </List.Item>

              <List.Item
                prefix={<ExclamationCircleOutline />}
                extra={<RightOutline />}
                clickable
                onClick={handleDeleteAccount}
              >
                <div>
                  <div className="font-medium text-red-600">Delete Account</div>
                  <div className="text-sm text-gray-500">Permanently delete your account and data</div>
                </div>
              </List.Item>
            </List>
          </Card>

          {/* Legal Information */}
          <Card title="Legal Information" className="mb-6">
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                <p>Terms of Service: January 1, 2024</p>
                <p>Privacy Policy: January 1, 2024</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <p>For legal inquiries: legal@taskup.com</p>
                <p>For privacy concerns: privacy@taskup.com</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Jurisdiction</h4>
                <p>These terms are governed by the laws of [Your Jurisdiction]</p>
              </div>
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <ExclamationCircleOutline className="text-blue-500 mt-1" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Important Notice</h4>
                <p className="text-blue-700">
                  By using TaskUp, you agree to our Terms of Service and Privacy Policy. 
                  Please read these documents carefully to understand your rights and obligations.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Popup>
  );
}
