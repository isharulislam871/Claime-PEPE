'use client';

import {
  Form,
  InputNumber,
  Switch,
  Button,
  Divider,
  Card
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

interface SecuritySettingsProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function SecuritySettings({ onSave, loading = false }: SecuritySettingsProps) {
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
          twoFactorAuth: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordMinLength: 8,
          requireSpecialChars: true,
          ipWhitelist: false,
          apiRateLimit: 1000,
          encryptionEnabled: true
        }}
        onFinish={onSave}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Authentication</h3>
            
            <Form.Item
              name="twoFactorAuth"
              label="Two-Factor Authentication"
              valuePropName="checked"
            >
              <Switch checkedChildren="Required" unCheckedChildren="Optional" />
            </Form.Item>

            <Form.Item
              name="sessionTimeout"
              label="Session Timeout (minutes)"
            >
              <InputNumber min={5} max={1440} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="maxLoginAttempts"
              label="Max Login Attempts"
            >
              <InputNumber min={3} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="passwordMinLength"
              label="Minimum Password Length"
            >
              <InputNumber min={6} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">System Security</h3>
            
            <Form.Item
              name="requireSpecialChars"
              label="Require Special Characters in Password"
              valuePropName="checked"
            >
              <Switch checkedChildren="Required" unCheckedChildren="Optional" />
            </Form.Item>

            <Form.Item
              name="ipWhitelist"
              label="IP Whitelist for Admin Access"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>

            <Form.Item
              name="apiRateLimit"
              label="API Rate Limit (requests/hour)"
            >
              <InputNumber min={100} max={10000} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="encryptionEnabled"
              label="Data Encryption"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
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
