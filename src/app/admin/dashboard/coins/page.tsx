'use client';

import { useState, useEffect } from 'react';
import { 
  Button, 
  Space,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Tag,
  Popconfirm,
  Card,
  Statistic,
  Row,
  Col,
  Tooltip,
  Image,
  Tabs,
  Badge,
  Avatar
} from 'antd';
import { 
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
 
  DatabaseOutlined,
  LinkOutlined,
  GlobalOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

export interface NetworkConfig {
  network: string;
  contractAddress?: string;
  isNative: boolean;
  isActive: boolean;
}

export interface Coin {
  _id: string;
  name: string;
  symbol: string;
  decimals: number;
  networks: NetworkConfig[];
  logoUrl?: string;
  description?: string;
  website?: string;
  coinGeckoId?: string;
  minWithdrawal?: number;
  networkFee?: number;
  currentPrice?: number;
  priceChange24h?: number;
  lastPriceUpdate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);
  const [seedLoading, setSeedLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoins();
  }, [selectedNetwork]);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const url = selectedNetwork === 'all' 
        ? '/api/admin/coins' 
        : `/api/admin/coins?network=${selectedNetwork}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }
      
      const data = await response.json();
      setCoins(data.coins || []);
    } catch (error) {
      console.error('Error fetching coins:', error);
      toast.error('Failed to fetch coins');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCoins = async () => {
    setSeedLoading(true);
    try {
      const response = await fetch('/api/admin/coins/seed', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to seed coins');
      }
      
      const data = await response.json();
      toast.success(`Coin seeding completed: ${data.results.length} coins processed`);
      await fetchCoins(); // Refresh data
    } catch (error) {
      console.error('Error seeding coins:', error);
      toast.error('Failed to seed coins');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleFetchPrices = async () => {
    setPriceLoading(true);
    try {
      const response = await fetch('/api/admin/coins/prices', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data = await response.json();
      toast.success(`Prices updated for ${data.updated} coins`);
      await fetchCoins(); // Refresh data
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Failed to fetch prices');
    } finally {
      setPriceLoading(false);
    }
  };

  const handleAddCoin = () => {
    setEditingCoin(null);
    form.resetFields();
    form.setFieldsValue({
      networks: [{ network: 'bsc-mainnet', isNative: false, isActive: true }],
      decimals: 18,
      isActive: true
    });
    setModalVisible(true);
  };

  const handleEditCoin = (coin: Coin) => {
    setEditingCoin(coin);
    form.setFieldsValue(coin);
    setModalVisible(true);
  };

  const handleDeleteCoin = async (coinId: string) => {
    try {
      const response = await fetch(`/api/admin/coins/${coinId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete coin');
      }
      
      setCoins(coins.filter(c => c._id !== coinId));
      toast.success('Coin deleted successfully');
    } catch (error: any) {
      console.error('Error deleting coin:', error);
      toast.error(error.message || 'Failed to delete coin');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingCoin 
        ? `/api/admin/coins/${editingCoin._id}`
        : '/api/admin/coins';
      
      const method = editingCoin ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save coin');
      }
      
      const data = await response.json();
      
      if (editingCoin) {
        setCoins(coins.map(c => 
          c._id === editingCoin._id ? data.coin : c
        ));
        toast.success('Coin updated successfully');
      } else {
        setCoins([...coins, data.coin]);
        toast.success('Coin added successfully');
      }
      
      setModalVisible(false);
      setEditingCoin(null);
      form.resetFields();
    } catch (error: any) {
      console.error('Error saving coin:', error);
      toast.error(error.message || 'Failed to save coin');
    }
  };

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      'bsc-mainnet': 'gold',
      'eth-main': 'blue',
      'sepolia': 'green',
      'bsc-testnet': 'orange'
    };
    return colors[network] || 'default';
  };

  const columns = [
    {
      title: 'Coin',
      key: 'coin',
      render: (record: Coin) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.logoUrl ? (
            <Avatar src={record.logoUrl} size={32} />
          ) : (
            <Avatar icon={<ContainerOutlined />} size={32} />
          )}
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.symbol}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Networks',
      dataIndex: 'networks',
      key: 'networks',
      render: (networks: NetworkConfig[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {networks.filter(n => n.isActive).map((network, index) => (
            <Badge
              key={index}
              count={network.isNative ? 'Native' : 'Token'}
              size="small"
              style={{ backgroundColor: network.isNative ? '#52c41a' : '#1890ff' }}
            >
              <Tag color={getNetworkColor(network.network)}>
                {network.network.toUpperCase()}
              </Tag>
            </Badge>
          ))}
        </div>
      )
    },
    {
      title: 'Decimals',
      dataIndex: 'decimals',
      key: 'decimals',
      width: 80,
      render: (decimals: number) => (
        <Tag color="cyan">{decimals}</Tag>
      )
    },
    {
      title: 'Contract Addresses',
      key: 'contracts',
      render: (record: Coin) => (
        <div style={{ maxWidth: 200 }}>
          {record.networks
            .filter(n => n.contractAddress && n.isActive)
            .map((network, index) => (
              <div key={index} style={{ marginBottom: 4 }}>
                <Tag color={getNetworkColor(network.network)}  >
                  {network.network}
                </Tag>
                <Tooltip title={network.contractAddress}>
                  <code style={{ fontSize: '10px' }}>
                    {network.contractAddress?.slice(0, 8)}...{network.contractAddress?.slice(-6)}
                  </code>
                </Tooltip>
              </div>
            ))
          }
        </div>
      )
    },
    {
      title: 'Links',
      key: 'links',
      render: (record: Coin) => (
        <Space>
          {record.website && (
            <Tooltip title="Website">
              <Button
                type="text"
                icon={<GlobalOutlined />}
                size="small"
                onClick={() => window.open(record.website, '_blank')}
              />
            </Tooltip>
          )}
          {record.coinGeckoId && (
            <Tooltip title="CoinGecko">
              <Button
                type="text"
                icon={<LinkOutlined />}
                size="small"
                onClick={() => window.open(`https://coingecko.com/en/coins/${record.coinGeckoId}`, '_blank')}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: 'Price',
      key: 'price',
      width: 150,
      render: (record: Coin) => (
        <div>
          {record.currentPrice ? (
            <>
              <div style={{ fontWeight: 'bold' }}>
                ${record.currentPrice.toFixed(6)}
              </div>
              {record.priceChange24h !== undefined && (
                <div style={{ 
                  fontSize: '12px', 
                  color: record.priceChange24h >= 0 ? '#52c41a' : '#ff4d4f' 
                }}>
                  {record.priceChange24h >= 0 ? '+' : ''}{record.priceChange24h.toFixed(2)}%
                </div>
              )}
              {record.lastPriceUpdate && (
                <div style={{ fontSize: '10px', color: '#999' }}>
                  {new Date(record.lastPriceUpdate).toLocaleTimeString()}
                </div>
              )}
            </>
          ) : (
            <Tag color="default">No Price</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Min Withdrawal',
      dataIndex: 'minWithdrawal',
      key: 'minWithdrawal',
      width: 120,
      render: (minWithdrawal: number, record: Coin) => (
        minWithdrawal ? (
          <Tag color="blue">
            {minWithdrawal} {record.symbol}
          </Tag>
        ) : (
          <Tag color="default">Not Set</Tag>
        )
      )
    },
    {
      title: 'Network Fee',
      dataIndex: 'networkFee',
      key: 'networkFee',
      width: 120,
      render: (networkFee: number, record: Coin) => (
        networkFee ? (
          <Tag color="orange">
            {networkFee} {record.symbol}
          </Tag>
        ) : (
          <Tag color="default">Not Set</Tag>
        )
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Coin) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCoin(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Coin"
            description="Are you sure you want to delete this coin?"
            onConfirm={() => handleDeleteCoin(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = {
    total: coins.length,
    active: coins.filter(c => c.isActive).length,
    native: coins.filter(c => c.networks.some(n => n.isNative)).length,
    tokens: coins.filter(c => c.networks.some(n => !n.isNative)).length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Coin Management</h1>
            <p className="text-gray-600">Manage supported cryptocurrencies and tokens</p>
          </div>
          <Space>
            <Select
              value={selectedNetwork}
              onChange={setSelectedNetwork}
              style={{ width: 140 }}
            >
              <Option value="all">All Networks</Option>
              <Option value="bsc-mainnet">BSC Mainnet</Option>
              <Option value="eth-main">Ethereum</Option>
              <Option value="sepolia">Sepolia</Option>
              <Option value="bsc-testnet">BSC Testnet</Option>
            </Select>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchCoins}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              icon={<DatabaseOutlined />}
              onClick={handleSeedCoins}
              loading={seedLoading}
            >
              Seed Popular Coins
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleFetchPrices}
              loading={priceLoading}
            >
              Fetch Prices
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCoin}
            >
              Add Coin
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Coins"
                value={stats.total}
                prefix={<ContainerOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active"
                value={stats.active}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Native Coins"
                value={stats.native}
                prefix={<ContainerOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tokens"
                value={stats.tokens}
                prefix={<LinkOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={coins}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} coins`
          }}
        />
      </Card>

      <Modal
        title={editingCoin ? 'Edit Coin' : 'Add Coin'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCoin(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Coin Name"
                rules={[{ required: true, message: 'Please enter coin name' }]}
              >
                <Input placeholder="e.g., Bitcoin" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="symbol"
                label="Symbol"
                rules={[{ required: true, message: 'Please enter symbol' }]}
              >
                <Input placeholder="e.g., BTC" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="decimals"
                label="Decimals"
                rules={[{ required: true, message: 'Please enter decimals' }]}
              >
                <InputNumber
                  min={0}
                  max={18}
                  placeholder="18"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="logoUrl"
                label="Logo URL"
              >
                <Input placeholder="https://example.com/logo.png" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Brief description of the coin" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="website"
                label="Website"
              >
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coinGeckoId"
                label="CoinGecko ID"
              >
                <Input placeholder="bitcoin" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minWithdrawal"
                label="Minimum Withdrawal"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  placeholder="0.1"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="networkFee"
                label="Network Fee"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  placeholder="0.03"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="networks"
            label="Network Configurations"
            rules={[{ required: true, message: 'Please add at least one network' }]}
          >
            <Form.List name="networks">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 8 }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'network']}
                            rules={[{ required: true, message: 'Select network' }]}
                          >
                            <Select placeholder="Network">
                              <Option value="bsc-mainnet">BSC Mainnet</Option>
                              <Option value="eth-main">Ethereum</Option>
                              <Option value="sepolia">Sepolia</Option>
                              <Option value="bsc-testnet">BSC Testnet</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'contractAddress']}
                          >
                            <Input placeholder="Contract Address (leave empty for native)" />
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isNative']}
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="Native" unCheckedChildren="Token" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isActive']}
                            valuePropName="checked"
                            initialValue={true}
                          >
                            <Switch checkedChildren="On" unCheckedChildren="Off" />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ network: 'bsc-mainnet', isNative: false, isActive: true })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Network
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCoin ? 'Update' : 'Add'} Coin
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
