import { Modal, Form, Input, Select, Button, Space, Alert, Row, Col } from 'antd';
import { 
  CopyOutlined, 
  SecurityScanOutlined, 
  WarningOutlined 
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Wallet } from '@/types/wallet';
import { selectActiveCoins, selectCoinLoading, selectCoins } from '@/modules/private/coin/coinSelectors';
import { fetchCoinsRequest } from '@/modules/private/coin/coinActions';
import { AppDispatch } from '@/modules/store';

const { Option } = Select;

interface WalletModalsProps {
  // Edit Modal
  modalVisible: boolean;
  onModalClose: () => void;
  editingWallet: Wallet | null;
  onWalletSubmit: (values: any, isEdit: boolean) => Promise<void>;
  
  // Generate Modal
  generateModalVisible: boolean;
  onGenerateModalClose: () => void;
  onWalletGeneration: (values: any) => Promise<any>;
  onSaveGeneratedWallet: (values : any) => Promise<void>;
}

export default function WalletModals({
  modalVisible,
  onModalClose,
  editingWallet,
  onWalletSubmit,
  generateModalVisible,
  onGenerateModalClose,
  onWalletGeneration,
  onSaveGeneratedWallet
}: WalletModalsProps) {
  const [form] = Form.useForm();
  const [generateForm] = Form.useForm();
  const [generatedWallet, setGeneratedWallet] = useState<{address: string, privateKey: string, mnemonic?: string} | null>(null);
  
  // Redux state
  const dispatch = useDispatch<AppDispatch>();
  
  const coinLoading = useSelector(selectCoinLoading);
  const coins = useSelector(selectCoins);

  
  // Fetch coins on component mount
  useEffect(() => {
   
      dispatch(fetchCoinsRequest());
   
  }, [dispatch ]);
  
  // Populate form when editing a wallet
  useEffect(() => {
    if (editingWallet && modalVisible) {
      form.setFieldsValue({
        address: editingWallet.address,
        type: editingWallet.type,
        currency: editingWallet.currency,
        network: editingWallet.network,
        status: editingWallet.status
      });
    } else if (!modalVisible) {
      form.resetFields();
    }
  }, [editingWallet, modalVisible, form]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      {/* Generate Wallet Modal */}
      <Modal
        title="Generate New Wallet"
        open={generateModalVisible}
        onCancel={() => {
          onGenerateModalClose();
          setGeneratedWallet(null);
          generateForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Alert
          message="Security Warning"
          description="Generated private keys are displayed only once. Make sure to save them securely before closing this dialog."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
        />
        
        <Form
          form={generateForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const wallet = await onWalletGeneration(values);
              setGeneratedWallet(wallet);
            } catch (error) {
              // Error handling is done in the parent component
            }
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Wallet Type"
                rules={[{ required: true, message: 'Please select wallet type' }]}
              >
                <Select placeholder="Select wallet type">
                  <Option value="hot">Hot Wallet</Option>
                  <Option value="cold">Cold Wallet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select placeholder="Select currency" loading={coinLoading}>
                  {coins.map(coin => (
                    <Option key={coin.id} value={coin.symbol}>
                      {coin.symbol} - {coin.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="network"
                label="Network"
                rules={[{ required: true, message: 'Please select network' }]}
              >
                <Select placeholder="Select network">
                  <Option value="eth-main">ETH Mainnet</Option>
                  <Option value="sepolia">Sepolia Testnet</Option>
                  <Option value="bsc-mainnet">BSC Mainnet</Option>
                  <Option value="bsc-testnet">BSC Testnet</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!generatedWallet && (
            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block icon={<SecurityScanOutlined />}>
                Generate Wallet
              </Button>
            </Form.Item>
          )}
        </Form>

        {generatedWallet && (
          <div className="mt-4">
            <Alert
              message="Wallet Generated Successfully!"
              description="Please save the private key securely. It will not be shown again."
              type="success"
              showIcon
              className="mb-4"
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={generatedWallet.address} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(generatedWallet.address)}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Private Key
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input.Password 
                    value={generatedWallet.privateKey} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(generatedWallet.privateKey)}
                  />
                </div>
              </div>
              
              {generatedWallet.mnemonic && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mnemonic Phrase
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input.TextArea 
                      value={generatedWallet.mnemonic} 
                      readOnly 
                      className="font-mono text-xs"
                      rows={2}
                    />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedWallet.mnemonic || '')}
                    />
                  </div>
                </div>
              )}
              
              <Alert
                message="Important: Save your private key!"
                description="Store this private key in a secure location. Anyone with access to this key can control the wallet."
                type="error"
                showIcon
                className="mb-3"
              />
            </div>
            
            <Space className="w-full justify-end">
              <Button onClick={() => {
                onGenerateModalClose();
                setGeneratedWallet(null);
                generateForm.resetFields();
              }}>
                Cancel
              </Button>
               
            </Space>
          </div>
        )}
      </Modal>

      {/* Add/Edit Wallet Modal */}
      <Modal
        title={editingWallet ? 'Edit Wallet' : 'Add New Wallet'}
        open={modalVisible}
        onCancel={onModalClose}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onWalletSubmit(values, !!editingWallet)}
        >
          <Form.Item
            name="address"
            label="Wallet Address"
            rules={[
              { required: true, message: 'Please enter wallet address' },
              { min: 42, message: 'Invalid wallet address format' }
            ]}
          >
            <Input placeholder="0x..." />
          </Form.Item>

          <Form.Item
            name="type"
            label="Wallet Type"
            rules={[{ required: true, message: 'Please select wallet type' }]}
          >
            <Select placeholder="Select wallet type">
              <Option value="hot">Hot Wallet</Option>
              <Option value="cold">Cold Wallet</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: 'Please select currency' }]}
          >
            <Select placeholder="Select currency" loading={coinLoading}>
              {coins.map(coin => (
                <Option key={coin.id} value={coin.symbol}>
                  {coin.symbol} - {coin.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="network"
            label="Network"
            rules={[{ required: true, message: 'Please select network' }]}
          >
            <Select placeholder="Select network">
              <Option value="eth-main">ETH Mainnet</Option>
              <Option value="sepolia">Sepolia Testnet</Option>
              <Option value="bsc-mainnet">BSC Mainnet</Option>
              <Option value="bsc-testnet">BSC Testnet</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="maintenance">Maintenance</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={onModalClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingWallet ? 'Update' : 'Add'} Wallet
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
