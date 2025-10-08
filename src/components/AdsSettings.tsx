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

 

export default function AdsSettings({   loading = false } ) {
  const [form] = Form.useForm();
  const [loadingState, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [monetagEnabled, setMonetagEnabled] = useState(false);

  // Fetch initial values from API
  useEffect(() => {
    const fetchAdsSettings = async () => {
      try {
        setInitialLoading(true);
        const response = await fetch('/api/admin/ads/');
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

 
 

  const handleSaveAdsSettings = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ads', {
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
                    rules={[{ required: true, message: 'Please enter default ads reward!' }]}
                  >
                    <InputNumber 
                      min={1} 
                      max={100000000}
                      addonAfter="pts" 
                      size="large"
                      className="w-full rounded-lg" 
                      placeholder="50"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adsWatchLimit"
                    label="Daily Ads Watch Limit"
                    tooltip="Maximum number of ads a user can watch per day"
                  >
                    <InputNumber 
                      min={1} 
                      max={1000}
                      size="large"
                      className="w-full rounded-lg" 
                      placeholder="10"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="adsRewardMultiplier"
                    label="Reward Multiplier"
                    tooltip="Multiplier for ads rewards (1.0 = normal, 2.0 = double)"
                  >
                    <InputNumber 
                      min={0.1} 
                      max={5.0}
                      step={0.1}
                      size="large"
                      className="w-full rounded-lg" 
                      placeholder="1.0"
                    />
                  </Form.Item>
                </Col>
              
              </Row>
            </Space>
          </Card>

          {/* GigaPub Integration Section */}
          <Card 
            title={
              <Space>
                <AppstoreOutlined className="text-purple-600" />
                <span>GigaPub Integration</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Form.Item
                name="enableGigaPubAds"
                label="Enable GigaPub Ads"
                tooltip="Enable or disable GigaPub advertisement integration"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Enabled" 
                  unCheckedChildren="Disabled"
                  size="default"
                />
              </Form.Item>
              <Form.Item
                name="gigaPubAppId"
                label="GigaPub App ID"
                tooltip="Your GigaPub application ID for ads integration"
                rules={[
                  { required: true, message: 'Please enter GigaPub App ID!' },
                  { min: 4, message: 'App ID must be at least 40 characters long!' }
                ]}
              >
                <Input 
                  placeholder="Enter your GigaPub App ID (e.g., 2441)" 
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </Space>
          </Card>

          {/* Monetag Integration */}
          <Card 
            title={
              <Space>
                <GlobalOutlined className="text-blue-600" />
                <span>Monetag Integration</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Row gutter={[24, 16]}>
                <Col xs={24}>
                  <Form.Item
                    name="monetagEnabled"
                    label="Enable Monetag Ads"
                    tooltip="Turn on/off Monetag advertisement integration"
                    valuePropName="checked"
                  >
                    <Switch 
                      size="default"
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      onChange={(checked) => setMonetagEnabled(checked)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {monetagEnabled && (
                <>
                   
                  <Row gutter={[24, 16]}>
                     
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="monetagZoneId"
                        label="Zone ID"
                        tooltip="Your Monetag zone ID for advertisements"
                        rules={monetagEnabled ? [{ required: true, message: 'Zone ID is required when Monetag is enabled!' }] : []}
                      >
                        <Input 
                          placeholder="Enter Zone ID"
                          size="large"
                          prefix={<DollarOutlined className="text-gray-400" />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Space>
          </Card>

          {/* VPN Security Settings */}
        {/*   <Card 
            title={
              <Space>
                <SecurityScanOutlined className="text-red-600" />
                <span>VPN Security Settings</span>
              </Space>
            }
            className="shadow-sm border-gray-200"
          >
            <Space direction="vertical" size="middle" className="w-full">
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="vpnRequired"
                    label="VPN Required"
                    tooltip="Require users to use VPN to watch ads"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Required" 
                      unCheckedChildren="Not Required"
                      size="default"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="vpnNotAllowed"
                    label="VPN Not Allowed"
                    tooltip="Block users with VPN from watching ads"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Blocked" 
                      unCheckedChildren="Allowed"
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="vpnProvider"
                label="VPN Detection Provider"
                tooltip="Choose your preferred VPN detection service"
                rules={[{ required: true, message: 'Please select a VPN provider!' }]}
              >
                <Select size="large" className="rounded-lg">
                  <Select.Option value="vpnapi">VPNapi.io (Free: 1K/day)</Select.Option>
                  <Select.Option value="ipqualityscore">IPQualityScore (Free: 5K/month)</Select.Option>
                  <Select.Option value="ip2location">IP2Location (Free: 500/day)</Select.Option>
                  <Select.Option value="maxmind">MaxMind GeoIP2 (Paid)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => 
                  prevValues.vpnProvider !== currentValues.vpnProvider
                }
              >
                {({ getFieldValue }) => {
                  const provider = getFieldValue('vpnProvider');
                  
                  if (provider === 'vpnapi') {
                    return (
                      <>
                        <Form.Item
                          name="vpnapiKey"
                          label="VPNapi.io API Key"
                          tooltip="Your VPNapi.io API key for VPN detection"
                          rules={[
                            { required: true, message: 'Please enter VPNapi.io API key!' },
                            { min: 20, message: 'API key must be at least 20 characters long!' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="Enter your VPNapi.io API key" 
                            size="large"
                            className="rounded-lg"
                            visibilityToggle
                          />
                        </Form.Item>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <Text className="text-blue-800 text-sm">
                            <strong>VPNapi.io:</strong> Free plan includes 1,000 requests per day. 
                            <a href="https://vpnapi.io/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-1">
                              Get API key
                            </a>
                          </Text>
                        </div>
                      </>
                    );
                  }
                  
                  if (provider === 'ipqualityscore') {
                    return (
                      <>
                        <Form.Item
                          name="ipqualityKey"
                          label="IPQualityScore API Key"
                          tooltip="Your IPQualityScore API key for VPN detection"
                          rules={[
                            { required: true, message: 'Please enter IPQualityScore API key!' },
                            { min: 15, message: 'API key must be at least 15 characters long!' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="Enter your IPQualityScore API key" 
                            size="large"
                            className="rounded-lg"
                            visibilityToggle
                          />
                        </Form.Item>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                          <Text className="text-green-800 text-sm">
                            <strong>IPQualityScore:</strong> Free plan includes 5,000 requests per month. 
                            <a href="https://www.ipqualityscore.com/create-account" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline ml-1">
                              Get API key
                            </a>
                          </Text>
                        </div>
                      </>
                    );
                  }
                  
                  if (provider === 'ip2location') {
                    return (
                      <>
                        <Form.Item
                          name="ip2locationKey"
                          label="IP2Location API Key"
                          tooltip="Your IP2Location API key for VPN detection"
                          rules={[
                            { required: true, message: 'Please enter IP2Location API key!' },
                            { min: 10, message: 'API key must be at least 10 characters long!' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="Enter your IP2Location API key" 
                            size="large"
                            className="rounded-lg"
                            visibilityToggle
                          />
                        </Form.Item>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                          <Text className="text-purple-800 text-sm">
                            <strong>IP2Location:</strong> Free plan includes 500 requests per day. 
                            <a href="https://www.ip2location.com/register" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline ml-1">
                              Get API key
                            </a>
                          </Text>
                        </div>
                      </>
                    );
                  }
                  
                  if (provider === 'maxmind') {
                    return (
                      <>
                        <Form.Item
                          name="maxmindKey"
                          label="MaxMind License Key"
                          tooltip="Your MaxMind GeoIP2 license key for VPN detection"
                          rules={[
                            { required: true, message: 'Please enter MaxMind license key!' },
                            { min: 12, message: 'License key must be at least 12 characters long!' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="Enter your MaxMind license key" 
                            size="large"
                            className="rounded-lg"
                            visibilityToggle
                          />
                        </Form.Item>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                          <Text className="text-orange-800 text-sm">
                            <strong>MaxMind:</strong> Premium service with high accuracy. Paid plans start at $20/month. 
                            <a href="https://www.maxmind.com/en/geoip2-services-and-databases" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline ml-1">
                              Learn more
                            </a>
                          </Text>
                        </div>
                      </>
                    );
                  }
                  
                  return null;
                }}
              </Form.Item>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Text className="text-yellow-800 text-sm">
                  <strong>Note:</strong> VPN Required and VPN Not Allowed settings are mutually exclusive. If VPN is required, "VPN Not Allowed" will be automatically disabled and vice versa.
                </Text>
              </div>
            </Space>
          </Card> */}

          {/* Action Buttons */}
          <Card className="shadow-sm border-gray-200">
            <Space size="large" direction="vertical" className="w-full">
              <Space size="middle" wrap className="w-full justify-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loadingState || loading}
                  size="large"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 border-0 shadow-lg hover:from-purple-600 hover:to-purple-700 rounded-lg px-8"
                >
                  Save Ads Configuration
                </Button>
                 
              </Space>
            </Space>
          </Card>
        </Space>
      </Form>
    </Space>
  );
}
