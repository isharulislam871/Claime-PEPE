'use client';

import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Switch,
  Divider,
  Select,
  message
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  DollarOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

interface AdsSettingsProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function AdsSettings({ onSave, loading = false }: AdsSettingsProps) {
  const [form] = Form.useForm();
  const [loadingState, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [monetagEnabled, setMonetagEnabled] = useState(false);

  // Fetch initial values from API
  useEffect(() => {
    const fetchAdsSettings = async () => {
      try {
        setInitialLoading(true);
        const response = await fetch('/api/ads/settings');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            form.setFieldsValue(result.data);
            setMonetagEnabled(result.data?.monetagEnabled || false);
          }
        }
      } catch (error) {
        console.error('Error fetching ads settings:', error);
        toast.error('Failed to load ads settings');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAdsSettings();
  }, [form]);

  const handleResetSettings = () => {
    form.resetFields();
  };

  const handleMonetagToggle = (checked: boolean) => {
    setMonetagEnabled(checked);
    if (!checked) {
      // Clear Monetag-related fields when disabled
      form.setFieldsValue({
        monetagApiKey: undefined,
        monetagPublisherId: undefined,
        monetagAdFormat: undefined,
        monetagRewardAmount: undefined,
        monetagTestMode: false,
        monetagAutoShow: false
      });
    }
  };

  const handleSaveAdsSettings = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ads/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Ads settings saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save ads settings');
      }
    } catch (error) {
      console.error('Error saving ads settings:', error);
      message.error('Failed to save ads settings');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Space direction="vertical" align="center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <Text className="text-gray-600">Loading ads settings...</Text>
        </Space>
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveAdsSettings}
      >
        <Space direction="vertical" size="large" className="w-full">
          {/* Default Ads Reward Section */}
          <Card 
            title={
              <Space>
                <DollarOutlined className="text-green-600" />
                <span>Ads Reward Configuration</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="defaultAdsReward"
                    label="Default Ads Reward"
                    tooltip="Amount of tokens awarded for watching an advertisement"
                    rules={[{ required: true, message: 'Please enter default ads reward' }]}
                  >
                    <InputNumber
                      min={1}
                      max={1000}
                      placeholder="Enter reward amount"
                      className="w-full"
                      addonAfter="tokens"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adsRewardMultiplier"
                    label="Reward Multiplier"
                    tooltip="Multiplier applied to base reward for special events"
                    rules={[{ required: true, message: 'Please enter reward multiplier' }]}
                  >
                    <InputNumber
                      min={1}
                      max={10}
                      step={0.1}
                      placeholder="Enter multiplier"
                      className="w-full"
                      addonAfter="x"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adsWatchLimit"
                    label="Daily Watch Limit"
                    tooltip="Maximum number of ads a user can watch per day"
                    rules={[{ required: true, message: 'Please enter daily watch limit' }]}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      placeholder="Enter daily limit"
                      className="w-full"
                      addonAfter="ads/day"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="minWatchTime"
                    label="Minimum Watch Time"
                    tooltip="Minimum time user must watch ad to receive reward"
                    rules={[{ required: true, message: 'Please enter minimum watch time' }]}
                  >
                    <InputNumber
                      min={5}
                      max={60}
                      placeholder="Enter watch time"
                      className="w-full"
                      addonAfter="seconds"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* GigaPub Ads Configuration */}
          <Card 
            title={
              <Space>
                <PlayCircleOutlined className="text-blue-600" />
                <span>GigaPub Ads Configuration</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Form.Item
                name="enableGigaPubAds"
                valuePropName="checked"
                label="Enable GigaPub Ads"
              >
                <Switch />
              </Form.Item>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubApiKey"
                    label="GigaPub API Key"
                    tooltip="Your GigaPub API key for ad serving"
                  >
                    <Input.Password
                      placeholder="Enter GigaPub API key"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubPublisherId"
                    label="Publisher ID"
                    tooltip="Your GigaPub publisher identifier"
                  >
                    <Input
                      placeholder="Enter publisher ID"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubAdFormat"
                    label="Ad Format"
                    tooltip="Select the ad format for GigaPub ads"
                  >
                    <Select placeholder="Select ad format" className="w-full">
                      <Select.Option value="video">Video Ads</Select.Option>
                      <Select.Option value="banner">Banner Ads</Select.Option>
                      <Select.Option value="interstitial">Interstitial Ads</Select.Option>
                      <Select.Option value="rewarded">Rewarded Video</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubRewardAmount"
                    label="GigaPub Reward Amount"
                    tooltip="Specific reward amount for GigaPub ads"
                  >
                    <InputNumber
                      min={1}
                      max={500}
                      placeholder="Enter reward amount"
                      className="w-full"
                      addonAfter="tokens"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubTestMode"
                    valuePropName="checked"
                    label="Test Mode"
                    tooltip="Enable test mode for development"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="gigaPubAutoShow"
                    valuePropName="checked"
                    label="Auto Show Ads"
                    tooltip="Automatically show ads when available"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* Monetag Configuration */}
          <Card 
            title={
              <Space>
                <GlobalOutlined className="text-purple-600" />
                <span>Monetag Configuration</span>
                <Switch 
                  checked={monetagEnabled}
                  onChange={handleMonetagToggle}
                  size="small"
                />
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Form.Item
              name="monetagEnabled"
              valuePropName="checked"
              style={{ display: 'none' }}
            >
              <Switch />
            </Form.Item>
            
            {monetagEnabled && (
              <Space direction="vertical" size="middle" className="w-full">
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagApiKey"
                      label="Monetag API Key"
                      tooltip="Your Monetag API key for ad serving"
                      rules={monetagEnabled ? [{ required: true, message: 'Please enter Monetag API key' }] : []}
                    >
                      <Input.Password
                        placeholder="Enter Monetag API key"
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagPublisherId"
                      label="Publisher ID"
                      tooltip="Your Monetag publisher identifier"
                      rules={monetagEnabled ? [{ required: true, message: 'Please enter publisher ID' }] : []}
                    >
                      <Input
                        placeholder="Enter publisher ID"
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagAdFormat"
                      label="Ad Format"
                      tooltip="Select the ad format for Monetag ads"
                      rules={monetagEnabled ? [{ required: true, message: 'Please select ad format' }] : []}
                    >
                      <Select placeholder="Select ad format" className="w-full">
                        <Select.Option value="popunder">Pop-under</Select.Option>
                        <Select.Option value="banner">Banner</Select.Option>
                        <Select.Option value="native">Native Ads</Select.Option>
                        <Select.Option value="push">Push Notifications</Select.Option>
                        <Select.Option value="video">Video Ads</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagRewardAmount"
                      label="Monetag Reward Amount"
                      tooltip="Specific reward amount for Monetag ads"
                      rules={monetagEnabled ? [{ required: true, message: 'Please enter reward amount' }] : []}
                    >
                      <InputNumber
                        min={1}
                        max={500}
                        placeholder="Enter reward amount"
                        className="w-full"
                        addonAfter="tokens"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagTestMode"
                      valuePropName="checked"
                      label="Test Mode"
                      tooltip="Enable test mode for development"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="monetagAutoShow"
                      valuePropName="checked"
                      label="Auto Show Ads"
                      tooltip="Automatically show ads when available"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            )}
            
            {!monetagEnabled && (
              <div className="text-center py-8">
                <Text className="text-gray-500">
                  Enable Monetag to configure ad settings
                </Text>
              </div>
            )}
          </Card>

          {/* Advanced Settings */}
          <Card 
            title={
              <Space>
                <SettingOutlined className="text-orange-600" />
                <span>Advanced Settings</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adFrequencyCap"
                    label="Ad Frequency Cap"
                    tooltip="Maximum ads shown per user per hour"
                  >
                    <InputNumber
                      min={1}
                      max={20}
                      placeholder="Enter frequency cap"
                      className="w-full"
                      addonAfter="ads/hour"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adCooldownPeriod"
                    label="Ad Cooldown Period"
                    tooltip="Minimum time between ads for same user"
                  >
                    <InputNumber
                      min={30}
                      max={3600}
                      placeholder="Enter cooldown period"
                      className="w-full"
                      addonAfter="seconds"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="enableAdAnalytics"
                    valuePropName="checked"
                    label="Enable Ad Analytics"
                    tooltip="Track ad performance and user engagement"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="enableAdBlocking"
                    valuePropName="checked"
                    label="Ad Blocker Detection"
                    tooltip="Detect and handle ad blocker usage"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-sm border-gray-200">
            <Space className="w-full justify-between">
              <Space>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleResetSettings}
                  disabled={loadingState}
                >
                  Reset Settings
                </Button>
              </Space>
              
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loadingState}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                >
                  Save Ads Settings
                </Button>
              </Space>
            </Space>
          </Card>
        </Space>
      </Form>
    </Space>
  );
}