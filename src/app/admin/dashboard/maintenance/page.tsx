'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Switch, 
  Button, 
  Input, 
  Progress, 
  DatePicker, 
  message, 
  Spin, 
  Alert,
  Divider,
  Row,
  Col,
  Statistic,
  Timeline
} from 'antd';
import {
  ToolOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  estimatedCompletion: string | null;
  progress: number;
  currentStep: string;
  lastUpdated: string;
}

export default function AdminMaintenancePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceStatus>({
    enabled: false,
    message: 'We are currently performing scheduled maintenance to improve our services.',
    estimatedCompletion: null,
    progress: 0,
    currentStep: 'Preparing maintenance...',
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceData(data.maintenance);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      message.error('Failed to fetch maintenance status');
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async (updates: Partial<MaintenanceStatus>) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setMaintenanceData(data.maintenance);
        message.success('Maintenance status updated successfully');
      } else {
        throw new Error('Failed to update maintenance status');
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      message.error('Failed to update maintenance status');
    } finally {
      setUpdating(false);
    }
  };

  const toggleMaintenance = (enabled: boolean) => {
    updateMaintenanceStatus({ enabled });
  };

  const updateProgress = (progress: number) => {
    updateMaintenanceStatus({ progress });
  };

  const updateCurrentStep = (currentStep: string) => {
    updateMaintenanceStatus({ currentStep });
  };

  const updateMessage = (message: string) => {
    updateMaintenanceStatus({ message });
  };

  const updateEstimatedCompletion = (date: dayjs.Dayjs | null) => {
    updateMaintenanceStatus({ 
      estimatedCompletion: date ? date.toISOString() : null 
    });
  };

  const quickProgressUpdate = (progress: number, step: string) => {
    updateMaintenanceStatus({ progress, currentStep: step });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Maintenance Dashboard
          </h1>
          <p className="text-gray-600">
            Control and monitor system maintenance status
          </p>
        </div>

        {/* Status Overview */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Maintenance Status"
                value={maintenanceData.enabled ? 'Active' : 'Inactive'}
                valueStyle={{ 
                  color: maintenanceData.enabled ? '#f5222d' : '#52c41a' 
                }}
                prefix={
                  maintenanceData.enabled ? 
                    <ExclamationCircleOutlined /> : 
                    <CheckCircleOutlined />
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Progress"
                value={maintenanceData.progress}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
                prefix={<ToolOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Current Step"
                value={maintenanceData.currentStep}
                valueStyle={{ fontSize: '14px' }}
                prefix={<SettingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Last Updated"
                value={new Date(maintenanceData.lastUpdated).toLocaleString()}
                valueStyle={{ fontSize: '12px' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Controls */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Maintenance Control" className="h-full">
              <div className="space-y-6">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Maintenance Mode
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enable or disable maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceData.enabled}
                    onChange={toggleMaintenance}
                    loading={updating}
                    checkedChildren={<PauseCircleOutlined />}
                    unCheckedChildren={<PlayCircleOutlined />}
                   
                  />
                </div>

                {/* Progress Control */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Progress Control
                  </h4>
                  <Progress 
                    percent={maintenanceData.progress} 
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    className="mb-3"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="small" 
                      onClick={() => quickProgressUpdate(25, 'Database optimization')}
                      loading={updating}
                    >
                      25% - DB Optimization
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => quickProgressUpdate(50, 'Server updates')}
                      loading={updating}
                    >
                      50% - Server Updates
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => quickProgressUpdate(75, 'API enhancements')}
                      loading={updating}
                    >
                      75% - API Updates
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => quickProgressUpdate(100, 'Maintenance complete')}
                      loading={updating}
                    >
                      100% - Complete
                    </Button>
                  </div>
                </div>

                {/* Custom Progress */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Custom Progress
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Progress %"
                      style={{ width: '120px' }}
                      onPressEnter={(e) => {
                        const value = parseInt((e.target as HTMLInputElement).value);
                        if (value >= 0 && value <= 100) {
                          updateProgress(value);
                        }
                      }}
                    />
                    <Input
                      placeholder="Current step description"
                      onPressEnter={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        if (value.trim()) {
                          updateCurrentStep(value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Configuration" className="h-full">
              <div className="space-y-6">
                {/* Maintenance Message */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Maintenance Message
                  </h4>
                  <TextArea
                    rows={4}
                    value={maintenanceData.message}
                    onChange={(e) => setMaintenanceData(prev => ({
                      ...prev,
                      message: e.target.value
                    }))}
                    placeholder="Enter maintenance message for users"
                  />
                  <Button
                    type="primary"
                    size="small"
                    className="mt-2"
                    onClick={() => updateMessage(maintenanceData.message)}
                    loading={updating}
                  >
                    Update Message
                  </Button>
                </div>

                {/* Estimated Completion */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Estimated Completion
                  </h4>
                  <DatePicker
                    showTime
                    value={maintenanceData.estimatedCompletion ? 
                      dayjs(maintenanceData.estimatedCompletion) : null
                    }
                    onChange={updateEstimatedCompletion}
                    placeholder="Select completion time"
                    className="w-full"
                  />
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => updateEstimatedCompletion(dayjs().add(1, 'hour'))}
                      loading={updating}
                    >
                      Set +1 Hour
                    </Button>
                    <Button
                      onClick={() => updateEstimatedCompletion(dayjs().add(2, 'hour'))}
                      loading={updating}
                    >
                      Set +2 Hours
                    </Button>
                    <Button
                      onClick={() => updateEstimatedCompletion(null)}
                      loading={updating}
                    >
                      Clear Completion Time
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Current Status Alert */}
        {maintenanceData.enabled && (
          <Alert
            message="Maintenance Mode is Currently Active"
            description="Users are being redirected to the maintenance page. Remember to disable maintenance mode when work is complete."
            type="warning"
            showIcon
            className="mt-6"
            action={
              <Button 
                size="small" 
                danger 
                onClick={() => toggleMaintenance(false)}
                loading={updating}
              >
                Disable Now
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
