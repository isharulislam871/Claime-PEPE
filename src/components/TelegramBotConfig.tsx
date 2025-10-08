'use client';

import {
  Form,
  Input,
  Switch,
  Button,
  Tag,
  message,
  Card
} from 'antd';
import {
  RobotOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
  ReloadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';

interface TelegramBotConfigProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function TelegramBotConfig({ onSave, loading = false }: TelegramBotConfigProps) {
  const [form] = Form.useForm();
  const [botStatus, setBotStatus] = useState<'running' | 'stopped' | 'unknown'>('unknown');
  const [botLoading, setBotLoading] = useState(false);
  const [webhookActive, setWebhookActive] = useState(false);

  const handleBotControl = async (action: 'start' | 'stop') => {
    setBotLoading(true);
    try {
      const response = await fetch('/api/bot/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        setBotStatus(data.status);
        setWebhookActive(data.webhookActive || false);
        message.success(data.message);
      } else {
        throw new Error(`Failed to ${action} bot`);
      }
    } catch (error) {
      message.error(`Failed to ${action} bot`);
    } finally {
      setBotLoading(false);
    }
  };

  const checkBotStatus = async () => {
    try {
      const response = await fetch('/api/bot/status');
      if (response.ok) {
        const data = await response.json();
        setBotStatus(data.status);
      }
    } catch (error) {
      console.error('Error checking bot status:', error);
    }
  };

  const loadBotConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/bot/config');
 
      if (response.ok) {
        const data = await response.json();
        form.setFieldsValue({
          botToken: data.botToken,
          botUsername: data.botUsername,
          webhookUrl: data.webhookUrl,
          autoStart: data.autoStart
        });
        setBotStatus(data.status);
        setWebhookActive(data.webhookActive || false);
      }
    } catch (error) {
      console.error('Error loading bot config:', error);
    }
  }, [form]);

  const handleResetSettings = () => {
    form.resetFields();
    message.info('Form reset to default values');
  };

  useEffect(() => {
    loadBotConfig();
  }, [loadBotConfig]);

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          botToken: '',
          botUsername: '',
          webhookUrl: '',
          autoStart: true
        }}
        onFinish={onSave}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              name="botToken"
              label="Bot Token"
              rules={[{ required: true, message: 'Please enter bot token!' }]}
            >
              <Input.Password 
                placeholder="Enter your Telegram bot token"
                visibilityToggle={{
                  visible: false,
                  onVisibleChange: () => {}
                }}
              />
            </Form.Item>

            <Form.Item
              name="botUsername"
              label="Bot Username"
            >
              <Input placeholder="@your_bot_username" />
            </Form.Item>

            <Form.Item
              name="webhookUrl"
              label="Webhook URL"
            >
              <Input placeholder="https://your-domain.com/api/webhook" />
            </Form.Item>

            <Form.Item
              name="autoStart"
              label="Auto Start Bot"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center">
                <RobotOutlined className="mr-2" />
                Bot Status
              </h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span>Bot Status:</span>
                  <Tag 
                    color={
                      botStatus === 'running' ? 'green' : 
                      botStatus === 'stopped' ? 'red' : 'orange'
                    }
                    icon={
                      botStatus === 'running' ? <CheckCircleOutlined /> : 
                      botStatus === 'stopped' ? <PauseCircleOutlined /> : null
                    }
                  >
                    {botStatus.toUpperCase()}
                  </Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Webhook:</span>
                  <Tag 
                    color={webhookActive ? 'green' : 'red'}
                    icon={webhookActive ? <LinkOutlined /> : <DisconnectOutlined />}
                  >
                    {webhookActive ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleBotControl('start')}
                  loading={botLoading}
                  disabled={botStatus === 'running'}
                  size="small"
                >
                  Start Bot
                </Button>
                <Button
                  danger
                  icon={<PauseCircleOutlined />}
                  onClick={() => handleBotControl('stop')}
                  loading={botLoading}
                  disabled={botStatus === 'stopped'}
                  size="small"
                >
                  Stop Bot
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={checkBotStatus}
                  size="small"
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Bot Setup Instructions:</h5>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Create a bot via @BotFather on Telegram</li>
                <li>2. Copy the bot token and paste it above</li>
                <li>3. Set your webhook URL (optional)</li>
                <li>4. Save settings and start the bot</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button 
            type="default" 
            icon={<ReloadOutlined />}
            onClick={handleResetSettings}
          >
            Reset to Default
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Bot Settings
          </Button>
        </div>
      </Form>
    </Card>
  );
}
