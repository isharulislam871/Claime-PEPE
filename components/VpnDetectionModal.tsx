'use client';

 
import { Modal, Button, Space, Typography, Alert, Spin } from 'antd';
import { SecurityScanOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface VpnDetectionModalProps {
  visible: boolean;
  onClose: () => void;
  onRetry: () => void;
  isChecking?: boolean;
}

export default function VpnDetectionModal({ 
  visible, 
  onClose, 
  onRetry, 
  isChecking = false 
}: VpnDetectionModalProps) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      maskClosable={false}
      width={400}
      className="vpn-detection-modal"
    >
      <div className="text-center p-4">
        <Space direction="vertical" size="large" className="w-full">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <SecurityScanOutlined className="text-3xl text-red-500" />
            </div>
          </div>

          {/* Title */}
          <Title level={4} className="text-red-600 mb-0">
            VPN Detected
          </Title>

          {/* Message */}
          <Alert
            message="VPN Connection Not Allowed"
            description="Our system has detected that you're using a VPN connection. Please disable your VPN to access ads and rewards features."
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="text-left"
          />

          {/* Additional Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Text className="text-sm text-gray-600">
              This restriction is in place to ensure fair usage and prevent abuse of our rewards system.
            </Text>
          </div>

          {/* Action Buttons */}
          <Space size="middle" className="w-full justify-center">
            <Button
              type="primary"
              icon={isChecking ? <Spin size="small" /> : <ReloadOutlined />}
              onClick={onRetry}
              loading={isChecking}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            >
              {isChecking ? 'Checking...' : 'Check Again'}
            </Button>
        
          </Space>

          {/* Help Text */}
          <Text className="text-xs text-gray-500">
            If you believe this is an error, please contact support.
          </Text>
        </Space>
      </div>
    </Modal>
  );
}
