'use client';

import { Card, Button, Input, Select, Radio, Switch, Form, Table, Tag, Space, Modal, DatePicker, Progress, Tabs } from 'antd';
import {
  SoundOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  BellOutlined,
  MessageOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export default function BroadcastPage() {
  const [form] = Form.useForm();
  const [messageType, setMessageType] = useState('announcement');
  const [targetAudience, setTargetAudience] = useState('all');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<any>(null);
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [audienceCounts, setAudienceCounts] = useState<{ [key: string]: number }>({});

  // Fetch broadcast history
  const fetchBroadcastHistory = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/broadcast?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      if (result.success) {
        setBroadcastHistory(result.data.map((item: any) => ({ ...item, key: item._id, id: item._id })));
        setStats(result.stats);
        setPagination(result.pagination);
      } else {
        console.error('Failed to fetch broadcast history:', result.error);
      }
    } catch (error) {
      console.error('Error fetching broadcast history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch audience counts for dropdown
  const fetchAudienceCounts = async () => {
    try {
      const audiences = ['all', 'active_users', 'new_users', 'high_earners', 'inactive_users'];
      const response = await fetch('/api/admin/target-audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audiences }),
      });
      const result = await response.json();
      
      if (result.success) {
        // Transform the data to match expected format
        const counts: { [key: string]: number } = {};
        Object.keys(result.data).forEach(key => {
          counts[key] = result.data[key].count;
        });
        setAudienceCounts(counts);
      } else {
        console.error('Failed to fetch audience counts:', result.error);
      }
    } catch (error) {
      console.error('Error fetching audience counts:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBroadcastHistory();
    fetchAudienceCounts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'sending': return 'orange';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'blue';
      case 'task_notification': return 'green';
      case 'system_update': return 'orange';
      case 'promotional': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Broadcast Info',
      key: 'info',
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-gray-900">{record.title}</div>
          <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{record.message}</div>
          <div className="flex gap-2 mt-2">
            <Tag color={getTypeColor(record.type)}>{record.type.replace('_', ' ')}</Tag>
            <Tag>{record.audience.replace('_', ' ')}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Broadcast ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{text}</span>
      ),
    },
    {
      title: 'Delivery Stats',
      key: 'stats',
      render: (_: any, record: any) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium">{record.delivered}</span>/{record.totalUsers} delivered
          </div>
          <div className="text-sm">
            <span className="font-medium text-blue-600">{record.opened}</span> opened
          </div>
          <div className="text-sm">
            <span className="font-medium text-green-600">{record.clicked}</span> clicked
          </div>
          {record.status === 'completed' && (
            <div className="text-xs text-gray-500">
              CTR: {((record.clicked / record.delivered) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Sent Date',
      dataIndex: 'sentDate',
      key: 'sentDate',
      render: (date: string, record: any) => (
        <div>
          <div className="text-sm">
            {date ? new Date(date).toLocaleString() : 
             record.scheduledTime ? `Scheduled: ${new Date(record.scheduledTime).toLocaleString()}` : 
             'Not sent'}
          </div>
          <div className="text-xs text-gray-500">by {record.sentBy}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:bg-blue-50"
            onClick={() => showBroadcastDetails(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<BarChartOutlined />}
            className="text-green-500 hover:bg-green-50"
            title="View Analytics"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:bg-red-50"
            onClick={() => handleDeleteBroadcast(record.id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const showBroadcastDetails = (broadcast: any) => {
    setPreviewMessage(broadcast);
    setIsPreviewVisible(true);
  };

  const handleSendBroadcast = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (result.success) {
        Modal.success({
          title: 'Broadcast Sent Successfully',
          content: result.message,
        });
        form.resetFields();
        fetchBroadcastHistory(); // Refresh the history
      } else {
        Modal.error({
          title: 'Failed to Send Broadcast',
          content: result.error,
        });
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      Modal.error({
        title: 'Error',
        content: 'An unexpected error occurred while sending the broadcast.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    Modal.confirm({
      title: 'Delete Broadcast',
      content: 'Are you sure you want to delete this broadcast? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/admin/broadcast?id=${id}`, {
            method: 'DELETE',
          });
          
          const result = await response.json();
          
          if (result.success) {
            Modal.success({
              title: 'Broadcast Deleted',
              content: result.message,
            });
            fetchBroadcastHistory(); // Refresh the history
          } else {
            Modal.error({
              title: 'Failed to Delete Broadcast',
              content: result.error,
            });
          }
        } catch (error) {
          console.error('Error deleting broadcast:', error);
          Modal.error({
            title: 'Error',
            content: 'An unexpected error occurred while deleting the broadcast.',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handlePreviewMessage = () => {
    form.validateFields().then(values => {
      setPreviewMessage({
        ...values,
        id: 'PREVIEW',
        sentDate: new Date().toLocaleString(),
        sentBy: 'Admin (Preview)'
      });
      setIsPreviewVisible(true);
    });
  };

  const audienceOptions = [
    { value: 'all', label: 'All Users', count: audienceCounts['all'] || 0 },
    { value: 'active_users', label: 'Active Users (Last 7 days)', count: audienceCounts['active_users'] || 0 },
    { value: 'new_users', label: 'New Users (Last 30 days)', count: audienceCounts['new_users'] || 0 },
    { value: 'high_earners', label: 'Top Earners (>10k PEPE)', count: audienceCounts['high_earners'] || 0 },
    { value: 'inactive_users', label: 'Inactive Users (>30 days)', count: audienceCounts['inactive_users'] || 0 }
  ];

  const selectedAudienceCount = audienceOptions.find(opt => opt.value === targetAudience)?.count || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broadcast Messages</h1>
          <p className="text-gray-600 mt-1">Send notifications and announcements to users</p>
        </div>
        <Button icon={<BarChartOutlined />}>
          View Analytics
        </Button>
      </div>

      <Tabs defaultActiveKey="compose">
        <TabPane 
          tab={
            <span>
              <MessageOutlined />
              Compose Message
            </span>
          } 
          key="compose"
        >
          {/* Compose Message Section */}
          <Card title="Compose New Broadcast" className="mb-6">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                type: 'announcement',
                audience: 'all',
                priority: 'normal',
                sendNow: true
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Form.Item
                    name="title"
                    label="Message Title"
                    rules={[{ required: true, message: 'Please enter a title!' }]}
                  >
                    <Input placeholder="Enter broadcast title" />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Message Content"
                    rules={[{ required: true, message: 'Please enter message content!' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Enter your message content here..."
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>

                  <Form.Item
                    name="type"
                    label="Message Type"
                    rules={[{ required: true }]}
                  >
                    <Select onChange={setMessageType}>
                      <Option value="announcement">📢 Announcement</Option>
                      <Option value="task_notification">📋 Task Notification</Option>
                      <Option value="system_update">⚙️ System Update</Option>
                      <Option value="promotional">🎯 Promotional</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="space-y-4">
                  <Form.Item
                    name="audience"
                    label="Target Audience"
                    rules={[{ required: true }]}
                  >
                    <Select onChange={setTargetAudience}>
                      {audienceOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label} ({option.count} users)
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TeamOutlined className="text-blue-500" />
                      <span className="font-medium text-blue-900">Audience Summary</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      Your message will be sent to <strong>{selectedAudienceCount}</strong> users
                    </div>
                  </div>

                  <Form.Item
                    name="priority"
                    label="Priority Level"
                  >
                    <Radio.Group>
                      <Radio value="low">Low</Radio>
                      <Radio value="normal">Normal</Radio>
                      <Radio value="high">High</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="sendNow"
                    label="Delivery Options"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Send Now" unCheckedChildren="Schedule" />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => 
                      prevValues.sendNow !== currentValues.sendNow
                    }
                  >
                    {({ getFieldValue }) =>
                      !getFieldValue('sendNow') && (
                        <Form.Item
                          name="scheduledTime"
                          label="Schedule Time"
                          rules={[{ required: true, message: 'Please select schedule time!' }]}
                        >
                          <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="Select date and time"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      )
                    }
                  </Form.Item>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendBroadcast}
                  size="large"
                  className="bg-blue-500"
                >
                  Send Broadcast
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={handlePreviewMessage}
                  size="large"
                >
                  Preview
                </Button>
              </div>
            </Form>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ClockCircleOutlined />
              Broadcast History ({stats.total || 0})
            </span>
          } 
          key="history"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
              <div className="text-gray-500">Total Broadcasts</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed || 0}</div>
              <div className="text-gray-500">Completed</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.scheduled || 0}</div>
              <div className="text-gray-500">Scheduled</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalDelivered || 0}</div>
              <div className="text-gray-500">Total Delivered</div>
            </Card>
          </div>

          {/* Broadcast History Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={broadcastHistory}
              loading={loading}
              pagination={{
                current: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} broadcasts`,
                onChange: (page, pageSize) => {
                  fetchBroadcastHistory(page, pageSize);
                },
              }}
              className="overflow-x-auto"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Preview Modal */}
      <Modal
        title="Message Preview"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            Close
          </Button>,
          previewMessage?.id === 'PREVIEW' && (
            <Button
              key="send"
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                setIsPreviewVisible(false);
                handleSendBroadcast();
              }}
              className="bg-blue-500"
            >
              Send Now
            </Button>
          ),
        ]}
        width={600}
      >
        {previewMessage && (
          <div className="space-y-4">
            {/* Message Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <BellOutlined className="text-blue-500" />
                <span className="font-medium text-gray-900">{previewMessage.title}</span>
              </div>
              <div className="text-gray-700 mb-3">{previewMessage.message}</div>
              <div className="text-xs text-gray-500">
                {previewMessage.sentDate} • {previewMessage.sentBy}
              </div>
            </div>

            {/* Message Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Message Type</label>
                <div>
                  <Tag color={getTypeColor(previewMessage.type)}>
                    {previewMessage.type?.replace('_', ' ') || 'N/A'}
                  </Tag>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Target Audience</label>
                <div className="font-medium">
                  {audienceOptions.find(opt => opt.value === previewMessage.audience)?.label || previewMessage.audience}
                </div>
              </div>
            </div>

            {previewMessage.delivered !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery Statistics</label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span className="font-medium">{previewMessage.delivered}/{previewMessage.totalUsers}</span>
                  </div>
                  <Progress 
                    percent={(previewMessage.delivered / previewMessage.totalUsers) * 100} 
                    size="small"
                    status="active"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Opened:</span>
                      <span className="font-medium text-blue-600">{previewMessage.opened}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked:</span>
                      <span className="font-medium text-green-600">{previewMessage.clicked}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
