'use client';

import {
  Form,
  Input,
  InputNumber,
  Button,
  Divider,
  Card
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';

interface TokensRewardsSettingsProps {
  onSave?: (values: any) => void;
  loading?: boolean;
}

export default function TokensRewardsSettings({ onSave, loading = false }: TokensRewardsSettingsProps) {
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
          tokenSymbol: 'PEPE',
          tokenName: 'PEPE Token',
          defaultTaskReward: 100,
          minimumWithdrawal: 1000,
          withdrawalFee: 50,
          dailyRewardLimit: 5000,
          referralBonus: 500,
          newUserBonus: 1000
        }}
        onFinish={onSave}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Form.Item
              name="tokenSymbol"
              label="Token Symbol"
              rules={[{ required: true, message: 'Please enter token symbol!' }]}
            >
              <Input placeholder="PEPE" />
            </Form.Item>

            <Form.Item
              name="tokenName"
              label="Token Name"
            >
              <Input placeholder="PEPE Token" />
            </Form.Item>
 

            <Form.Item
              name="newUserBonus"
              label="New User Bonus"
            >
              <InputNumber min={1000} addonAfter="PEPE" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item
              name="minimumWithdrawal"
              label="Minimum Withdrawal"
            >
              <InputNumber min={100} addonAfter="PEPE" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="withdrawalFee"
              label="Withdrawal Fee"
            >
              <InputNumber min={0} addonAfter="PEPE" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="referralBonus"
              label="Referral Bonus"
            >
              <InputNumber min={0} addonAfter="PEPE" style={{ width: '100%' }} />
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
