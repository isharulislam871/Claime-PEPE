'use client';

import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Divider,
  Card
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface GeneralSettingsProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function GeneralSettings({ onSave, loading = false }: GeneralSettingsProps) {
  const [form] = Form.useForm();

  const handleResetSettings = () => {
    form.resetFields();
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          platformName: 'TaskUp Crypto App',
          platformDescription: 'Earn PEPE tokens by completing simple tasks',
          supportEmail: 'support@taskup.com',
          userRegistration: true,
          emailVerification: true,
          timezone: 'UTC'
        }}
        onFinish={onSave}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              name="platformName"
              label="Platform Name"
              rules={[{ required: true, message: 'Please enter platform name!' }]}
            >
              <Input placeholder="TaskUp Crypto App" />
            </Form.Item>

            <Form.Item
              name="platformDescription"
              label="Platform Description"
            >
              <TextArea rows={3} placeholder="Platform description" />
            </Form.Item>

            <Form.Item
              name="supportEmail"
              label="Support Email"
              rules={[{ type: 'email', message: 'Please enter valid email!' }]}
            >
              <Input placeholder="support@taskup.com" />
            </Form.Item>

            <Form.Item
              name="timezone"
              label="Default Timezone"
            >
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="America/New_York">Eastern Time</Option>
                <Option value="Europe/London">London</Option>
                <Option value="Asia/Tokyo">Tokyo</Option>
                <Option value="Asia/Dhaka">Dhaka</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item
              name="userRegistration"
              label="Allow User Registration"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>

            <Form.Item
              name="emailVerification"
              label="Require Email Verification"
              valuePropName="checked"
            >
              <Switch checkedChildren="Required" unCheckedChildren="Optional" />
            </Form.Item>
          </div>
        </div>

        <Divider />

        <div className="flex gap-4">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            className="bg-blue-500"
          >
            Save Changes
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
        </div>
      </Form>
    </Card>
  );
}
