'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, Modal, Input, Select, message, Avatar, Descriptions, Timeline, Statistic, Row, Col, Space, Divider, Tooltip, Badge, Alert } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, WalletOutlined, CalendarOutlined, CopyOutlined, PrinterOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  failureReason?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface StatusHistory {
  status: string;
  timestamp: string;
  admin?: string;
  notes?: string;
}

export default function WithdrawalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const withdrawalId = params.id as string;
  
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    fetchWithdrawalDetails();
  }, [withdrawalId]);

  const fetchWithdrawalDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`);
      const data = await response.json();
      
      if (data.success) {
        setWithdrawal(data.withdrawal);
        setNewStatus(data.withdrawal.status);
        setTransactionId(data.withdrawal.transactionId || '');
        setFailureReason(data.withdrawal.failureReason || '');
      } else {
        message.error('Failed to fetch withdrawal details');
      }
    } catch (error) {
      console.error('Error fetching withdrawal:', error);
      message.error('Error fetching withdrawal details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!validateUpdate()) return;
    setConfirmModalVisible(true);
  };

  const confirmUpdate = async () => {
    try {
      setUpdating(true);
      const response = await fetch('/api/admin/update_withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_withdrawal',
          withdrawalId: withdrawal?._id,
          status: newStatus,
          transactionId: newStatus === 'completed' ? transactionId : undefined,
          failureReason: (newStatus === 'failed' || newStatus === 'cancelled') ? failureReason : undefined,
          adminNotes: adminNotes,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('Withdrawal updated successfully');
        setWithdrawal(data.withdrawal);
        setUpdateModalVisible(false);
        setConfirmModalVisible(false);
        fetchWithdrawalDetails();
      } else {
        message.error(data.error || 'Failed to update withdrawal');
      }
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      message.error('Error updating withdrawal');
    } finally {
      setUpdating(false);
    }
  };

  const validateUpdate = () => {
    if (newStatus === 'completed' && !transactionId.trim()) {
      message.error('Transaction ID is required for completed withdrawals');
      return false;
    }
    if ((newStatus === 'failed' || newStatus === 'cancelled') && !failureReason.trim()) {
      message.error('Failure reason is required for failed/cancelled withdrawals');
      return false;
    }
    return true;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copied to clipboard`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const data = {
      withdrawal,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Admin'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdrawal-${withdrawal?._id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ExclamationCircleOutlined />;
      case 'processing': return <EditOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'failed': return <CloseCircleOutlined />;
      case 'cancelled': return <CloseCircleOutlined />;
      default: return null;
    }
  };

  const getRiskLevel = (amount: number) => {
    if (amount > 10000) return { level: 'high', color: 'red' };
    if (amount > 1000) return { level: 'medium', color: 'orange' };
    return { level: 'low', color: 'green' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading withdrawal details...</div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Withdrawal not found</div>
      </div>
    );
  }

  const riskLevel = withdrawal ? getRiskLevel(withdrawal.amount) : { level: 'low', color: 'green' };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="mb-4"
        >
          Back to Withdrawals
        </Button>
        
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Withdrawal Details</h1>
            <p className="text-gray-600 mt-1">ID: {withdrawal?._id}</p>
          </div>
          <Space>
            <Tooltip title="Print Details">
              <Button icon={<PrinterOutlined />} onClick={handlePrint} />
            </Tooltip>
            <Tooltip title="Export Data">
              <Button icon={<DownloadOutlined />} onClick={handleExport} />
            </Tooltip>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setUpdateModalVisible(true)}
              size="large"
            >
              Update Status
            </Button>
          </Space>
        </div>
      </div>

      {/* Risk Alert */}
      {riskLevel.level === 'high' && (
        <Alert
          message="High Value Withdrawal"
          description="This withdrawal requires additional verification due to its high value."
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {/* Status Overview */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="Amount"
              value={withdrawal?.amount}
              suffix={withdrawal?.currency.toUpperCase()}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-gray-500 mb-2">Status</div>
            <Badge 
              status={getStatusColor(withdrawal?.status || '') as any}
              text={
                <Tag 
                  color={getStatusColor(withdrawal?.status || '')}
                  icon={getStatusIcon(withdrawal?.status || '')}
                  className="text-lg px-3 py-1"
                >
                  {withdrawal?.status.toUpperCase()}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <div className="text-gray-500 mb-2">Risk Level</div>
            <Tag color={riskLevel.color} className="text-lg px-3 py-1">
              {riskLevel.level.toUpperCase()}
            </Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center">
            <Statistic
              title="Created"
              value={formatDate(withdrawal?.createdAt || '')}
              valueStyle={{ fontSize: '14px' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title="Basic Information" className="shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Withdrawal ID</label>
                <div className="text-lg font-mono">{withdrawal._id}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div>
                  <Tag color={getStatusColor(withdrawal.status)} className="text-sm">
                    {withdrawal.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <div className="text-xl font-semibold text-green-600">
                  {formatAmount(withdrawal.amount, withdrawal.currency)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Method</label>
                <div className="text-lg">{withdrawal.method}</div>
              </div>
            </div>
          </Card>

          {/* User Information */}
          <Card title="User Information" className="shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <div className="text-lg">{withdrawal.username}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telegram ID</label>
                <div className="text-lg font-mono">{withdrawal.telegramId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <div className="text-sm font-mono text-gray-600">{withdrawal.userId}</div>
              </div>
            </div>
          </Card>

          {/* Wallet Information */}
          <Card title="Wallet Information" className="shadow-sm">
            <div>
              <label className="text-sm font-medium text-gray-500">Wallet ID</label>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded mt-1 break-all">
                {withdrawal.walletId}
              </div>
            </div>
          </Card>

          {/* Transaction Details */}
          {withdrawal.transactionId && (
            <Card title="Transaction Details" className="shadow-sm">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm bg-gray-100 p-3 rounded flex-1 break-all">
                    {withdrawal.transactionId}
                  </div>
                  <Tooltip title="Copy Transaction ID">
                    <Button 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={() => copyToClipboard(withdrawal.transactionId!, 'Transaction ID')}
                    />
                  </Tooltip>
                </div>
              </div>
            </Card>
          )}

          {/* Failure Reason */}
          {withdrawal.failureReason && (
            <Card title="Failure Details" className="shadow-sm">
              <Alert
                message="Failure Reason"
                description={withdrawal.failureReason}
                type="error"
                showIcon
              />
            </Card>
          )}

          {/* Admin Notes */}
          {withdrawal.adminNotes && (
            <Card title="Admin Notes" className="shadow-sm">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="text-gray-700">{withdrawal.adminNotes}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - User Profile & Timeline */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card title="User Profile" className="shadow-sm">
            <div className="text-center mb-4">
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                className="mb-3"
              />
              <h3 className="text-lg font-semibold">{withdrawal.username}</h3>
              <p className="text-gray-500">@{withdrawal.telegramId}</p>
            </div>
            
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Full Name">
                {withdrawal.firstName || withdrawal.lastName 
                  ? `${withdrawal.firstName || ''} ${withdrawal.lastName || ''}`.trim()
                  : 'Not provided'
                }
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <span className="font-mono text-xs">{withdrawal.userId}</span>
              </Descriptions.Item>
              {withdrawal.ipAddress && (
                <Descriptions.Item label="IP Address">
                  <span className="font-mono text-xs">{withdrawal.ipAddress}</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Timeline */}
          <Card title="Status Timeline" className="shadow-sm">
            <Timeline>
              <Timeline.Item 
                color="blue"
                dot={<CalendarOutlined />}
              >
                <div>
                  <div className="font-medium">Withdrawal Created</div>
                  <div className="text-sm text-gray-500">{formatDate(withdrawal.createdAt)}</div>
                </div>
              </Timeline.Item>
              
              {withdrawal.processedAt && (
                <Timeline.Item 
                  color={withdrawal.status === 'completed' ? 'green' : 'red'}
                  dot={withdrawal.status === 'completed' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  <div>
                    <div className="font-medium">
                      {withdrawal.status === 'completed' ? 'Completed' : 'Failed/Cancelled'}
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(withdrawal.processedAt)}</div>
                  </div>
                </Timeline.Item>
              )}
              
              <Timeline.Item 
                color="gray"
                dot={<EditOutlined />}
              >
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-sm text-gray-500">{formatDate(withdrawal.updatedAt)}</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm">
            <Space direction="vertical" className="w-full">
              <Button 
                block 
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(withdrawal._id, 'Withdrawal ID')}
              >
                Copy Withdrawal ID
              </Button>
              <Button 
                block 
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(withdrawal.walletId, 'Wallet Address')}
              >
                Copy Wallet Address
              </Button>
              {withdrawal.transactionId && (
                <Button 
                  block 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(withdrawal.transactionId!, 'Transaction ID')}
                >
                  Copy Transaction ID
                </Button>
              )}
            </Space>
          </Card>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        title="Update Withdrawal Status"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={handleUpdateStatus}
        confirmLoading={updating}
        okText="Update Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <Select
              value={newStatus}
              onChange={setNewStatus}
              className="w-full"
              placeholder="Select new status"
            >
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="completed">Completed</Option>
              <Option value="failed">Failed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </div>

          {newStatus === 'completed' && (
            <div>
              <label className="block text-sm font-medium mb-2">Transaction ID *</label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {(newStatus === 'failed' || newStatus === 'cancelled') && (
            <div>
              <label className="block text-sm font-medium mb-2">Failure Reason *</label>
              <TextArea
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Enter failure reason"
                rows={3}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Admin Notes</label>
            <TextArea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Status Update"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={confirmUpdate}
        confirmLoading={updating}
        okText="Confirm Update"
        okType="primary"
      >
        <div className="space-y-3">
          <p>Are you sure you want to update this withdrawal status?</p>
          <div className="bg-gray-50 p-3 rounded">
            <div><strong>Current Status:</strong> {withdrawal?.status}</div>
            <div><strong>New Status:</strong> {newStatus}</div>
            {newStatus === 'completed' && transactionId && (
              <div><strong>Transaction ID:</strong> {transactionId}</div>
            )}
            {(newStatus === 'failed' || newStatus === 'cancelled') && failureReason && (
              <div><strong>Reason:</strong> {failureReason}</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
