'use client';

import React, { useState } from 'react';
import { Popup, Button, Input, Card, Slider, Toast } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { UserAddOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface MinimumInvitesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  onSave: (value: number) => void;
}

export default function MinimumInvitesPopup({ isOpen, onClose, currentValue, onSave }: MinimumInvitesPopupProps) {
  const [inviteCount, setInviteCount] = useState(currentValue);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (inviteCount < 1 || inviteCount > 100) {
      Toast.show({ content: 'Please enter a value between 1 and 100', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(inviteCount);
      Toast.show({ content: 'Minimum invites requirement updated successfully', icon: 'success' });
      onClose();
    } catch (error) {
      Toast.show({ content: 'Failed to update setting', icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInviteCount(currentValue);
  };

  const presetValues = [5, 10, 15, 20, 25, 50];

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
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <UserAddOutlined className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Minimum Invites Required</h2>
              <p className="text-sm text-gray-500">Set the required number of invites for withdrawals</p>
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

        {/* Current Setting Info */}
        <Card className="mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircleOutlined className="text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Current Setting</span>
            </div>
            <p className="text-blue-700 text-sm">
              Users must invite <strong>{currentValue} people</strong> before they can make withdrawals
            </p>
          </div>
        </Card>

        {/* Input Section */}
        <Card className="mb-4">
          <div className="space-y-4">
            <div>
              <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>
                Number of Required Invites
              </div>
              <Input
                type="number"
                value={inviteCount.toString()}
                onChange={(value) => setInviteCount(parseInt(value) || 0)}
                placeholder="Enter number of invites"
                style={{ 
                  backgroundColor: '#F9FAFB',
                  fontSize: '16px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}
                min={1}
                max={100}
              />
              <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                Range: 1 - 100 invites
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>
                Adjust with Slider
              </div>
              <Slider
                value={inviteCount}
                onChange={(value) => setInviteCount(Array.isArray(value) ? value[0] : value)}
                min={1}
                max={100}
                step={1}
                ticks
                style={{ marginBottom: '16px' }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span className="font-medium text-purple-600">{inviteCount}</span>
                <span>100</span>
              </div>
            </div>

            {/* Preset Values */}
            <div>
              <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>
                Quick Presets
              </div>
              <div className="grid grid-cols-3 gap-2">
                {presetValues.map((preset) => (
                  <Button
                    key={preset}
                    size="small"
                    onClick={() => setInviteCount(preset)}
                    style={{
                      backgroundColor: inviteCount === preset ? '#8B5CF6' : '#F3F4F6',
                      color: inviteCount === preset ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Impact Warning */}
        {inviteCount !== currentValue && (
          <Card className="mb-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ExclamationCircleOutlined className="text-orange-600 mr-2" />
                <span className="font-medium text-orange-800">Impact Notice</span>
              </div>
              <p className="text-orange-700 text-sm">
                {inviteCount > currentValue ? (
                  <>Increasing to <strong>{inviteCount} invites</strong> will make withdrawals harder for users</>
                ) : (
                  <>Decreasing to <strong>{inviteCount} invites</strong> will make withdrawals easier for users</>
                )}
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              block
              size="large"
              onClick={handleReset}
              style={{
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontWeight: '500',
                flex: 1
              }}
            >
              Reset
            </Button>
            <Button
              block
              size="large"
              onClick={handleSave}
              loading={loading}
              disabled={inviteCount === currentValue}
              style={{
                backgroundColor: inviteCount === currentValue ? '#D1D5DB' : '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontWeight: '500',
                flex: 2
              }}
            >
              Save Changes
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This setting affects all future withdrawal requests
            </p>
          </div>
        </div>
      </div>
    </Popup>
  );
}
