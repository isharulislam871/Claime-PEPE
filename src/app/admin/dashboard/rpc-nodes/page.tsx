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
  Tooltip
} from 'antd';
import { 
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ApiOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Option } = Select;

export interface RpcNode {
  _id: string;
  name: string;
  url: string;
  network: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  lastChecked?: string;
  status: 'online' | 'offline' | 'error';
  responseTime?: number;
  blockHeight?: number;
  createdAt: string;
  updatedAt: string;
}

export default function RpcNodesPage() {
  const [rpcNodes, setRpcNodes] = useState<RpcNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<RpcNode | null>(null);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRpcNodes();
  }, [selectedNetwork]);

  const fetchRpcNodes = async () => {
    setLoading(true);
    try {
      const url = selectedNetwork === 'all' 
        ? '/api/admin/rpc-nodes' 
        : `/api/admin/rpc-nodes?network=${selectedNetwork}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch RPC nodes');
      }
      
      const data = await response.json();
      setRpcNodes(data.rpcNodes || []);
    } catch (error) {
      console.error('Error fetching RPC nodes:', error);
      toast.error('Failed to fetch RPC nodes');
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async (nodeId?: string) => {
    setHealthCheckLoading(true);
    try {
      const response = await fetch('/api/admin/rpc-nodes/health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId,
          network: selectedNetwork === 'all' ? undefined : selectedNetwork
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to check RPC node health');
      }
      
      const data = await response.json();
      toast.success(`Health check completed for ${data.checkedCount} nodes`);
      await fetchRpcNodes(); // Refresh data
    } catch (error) {
      console.error('Error checking RPC node health:', error);
      toast.error('Failed to check RPC node health');
    } finally {
      setHealthCheckLoading(false);
    }
  };

  const handleAddNode = () => {
    setEditingNode(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditNode = (node: RpcNode) => {
    setEditingNode(node);
    form.setFieldsValue(node);
    setModalVisible(true);
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      const response = await fetch(`/api/admin/rpc-nodes/${nodeId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete RPC node');
      }
      
      setRpcNodes(rpcNodes.filter(n => n._id !== nodeId));
      toast.success('RPC node deleted successfully');
    } catch (error: any) {
      console.error('Error deleting RPC node:', error);
      toast.error(error.message || 'Failed to delete RPC node');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingNode 
        ? `/api/admin/rpc-nodes/${editingNode._id}`
        : '/api/admin/rpc-nodes';
      
      const method = editingNode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save RPC node');
      }
      
      const data = await response.json();
      
      if (editingNode) {
        setRpcNodes(rpcNodes.map(n => 
          n._id === editingNode._id ? data.rpcNode : n
        ));
        toast.success('RPC node updated successfully');
      } else {
        setRpcNodes([...rpcNodes, data.rpcNode]);
        toast.success('RPC node added successfully');
      }
      
      setModalVisible(false);
      setEditingNode(null);
      form.resetFields();
    } catch (error: any) {
      console.error('Error saving RPC node:', error);
      toast.error(error.message || 'Failed to save RPC node');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'offline':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RpcNode) => (
        <div>
          <strong>{text}</strong>
          {record.isDefault && <Tag color="blue" style={{ marginLeft: 8 }}>Default</Tag>}
        </div>
      )
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <code style={{ fontSize: '12px' }}>{url}</code>
        </Tooltip>
      )
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network: string) => (
        <Tag color="geekblue">{network.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: RpcNode) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getStatusIcon(status)}
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          {record.responseTime && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              {record.responseTime}ms
            </span>
          )}
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: number) => (
        <Tag color="purple">{priority}</Tag>
      )
    },
    {
      title: 'Block Height',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (height: number) => height ? height.toLocaleString() : '-'
    },
    {
      title: 'Active',
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
      width: 200,
      render: (_ : any, record: RpcNode) => (
        <Space>
          <Button
            type="text"
            icon={<ThunderboltOutlined />}
            onClick={() => handleHealthCheck(record._id)}
            loading={healthCheckLoading}
            size="small"
          >
            Test
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditNode(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete RPC Node"
            description="Are you sure you want to delete this RPC node?"
            onConfirm={() => handleDeleteNode(record._id)}
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
    total: rpcNodes.length,
    online: rpcNodes.filter(n => n.status === 'online').length,
    offline: rpcNodes.filter(n => n.status === 'offline').length,
    error: rpcNodes.filter(n => n.status === 'error').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">RPC Node Management</h1>
            <p className="text-gray-600">Manage blockchain RPC endpoints and monitor their health</p>
          </div>
          <Space>
            <Select
              value={selectedNetwork}
              onChange={setSelectedNetwork}
              style={{ width: 120 }}
            >
              <Option value="all">All Networks</Option>
              <Option value="bsc">BSC</Option>
              <Option value="ethereum">Ethereum</Option>
              <Option value="polygon">Polygon</Option>
              <Option value="mainnet">Mainnet</Option>
            </Select>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchRpcNodes}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => handleHealthCheck()}
              loading={healthCheckLoading}
            >
              Check All
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNode}
            >
              Add RPC Node
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Nodes"
                value={stats.total}
                prefix={<ApiOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Online"
                value={stats.online}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Offline"
                value={stats.offline}
                prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Error"
                value={stats.error}
                prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={rpcNodes}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} RPC nodes`
          }}
        />
      </Card>

      <Modal
        title={editingNode ? 'Edit RPC Node' : 'Add RPC Node'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingNode(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter node name' }]}
          >
            <Input placeholder="e.g., BSC Public Node 1" />
          </Form.Item>

          <Form.Item
            name="url"
            label="RPC URL"
            rules={[
              { required: true, message: 'Please enter RPC URL' },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="https://bsc-dataseed1.binance.org/" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="network"
                label="Network"
                rules={[{ required: true, message: 'Please select network' }]}
              >
                <Select placeholder="Select network">
                  <Option value="bsc">BSC</Option>
                  <Option value="ethereum">Ethereum</Option>
                  <Option value="polygon">Polygon</Option>
                  <Option value="mainnet">Mainnet</Option>
                  <Option value="bsc-testnet">BSC Testnet</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please enter priority' }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="1-10"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isDefault"
                label="Set as Default"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingNode ? 'Update' : 'Add'} RPC Node
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
