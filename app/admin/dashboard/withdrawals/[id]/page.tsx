'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Tag, Modal, Input, Select, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
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
    try {
      setUpdating(true);
      const response = await fetch('/api/admin', {
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
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('Withdrawal updated successfully');
        setWithdrawal(data.withdrawal);
        setUpdateModalVisible(false);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            type="text"
          >
            Back to Withdrawals
          </Button>
          <h1 className="text-2xl font-bold">Withdrawal Details</h1>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setUpdateModalVisible(true)}
          disabled={withdrawal.status === 'completed'}
        >
          Update Status
        </Button>
      </div>

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
                <div className="font-mono text-sm bg-gray-100 p-3 rounded mt-1 break-all">
                  {withdrawal.transactionId}
                </div>
              </div>
            </Card>
          )}

          {/* Failure Reason */}
          {withdrawal.failureReason && (
            <Card title="Failure Details" className="shadow-sm">
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <div className="text-red-800">{withdrawal.failureReason}</div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card title="Timeline" className="shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium">Request Created</div>
                  <div className="text-xs text-gray-500">{formatDate(withdrawal.createdAt)}</div>
                </div>
              </div>
              
              {withdrawal.updatedAt !== withdrawal.createdAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-xs text-gray-500">{formatDate(withdrawal.updatedAt)}</div>
                  </div>
                </div>
              )}
              
              {withdrawal.processedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium">Processed</div>
                    <div className="text-xs text-gray-500">{formatDate(withdrawal.processedAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm">
            <div className="space-y-2">
              {withdrawal.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    className="w-full"
                    onClick={() => {
                      setNewStatus('completed');
                      setUpdateModalVisible(true);
                    }}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    className="w-full"
                    onClick={() => {
                      setNewStatus('failed');
                      setUpdateModalVisible(true);
                    }}
                  >
                    Mark as Failed
                  </Button>
                </>
              )}
              
              {withdrawal.status === 'processing' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  className="w-full"
                  onClick={() => {
                    setNewStatus('completed');
                    setUpdateModalVisible(true);
                  }}
                >
                  Mark as Completed
                </Button>
              )}
            </div>
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
        okText="Update"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              value={newStatus}
              onChange={setNewStatus}
              className="w-full"
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
              <label className="block text-sm font-medium mb-2">Transaction ID</label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {(newStatus === 'failed' || newStatus === 'cancelled') && (
            <div>
              <label className="block text-sm font-medium mb-2">Failure Reason</label>
              <TextArea
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Enter reason for failure/cancellation"
                rows={3}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
