'use client';

import { Card, Button, Tag, Space, Input, Select, Avatar, Spin, message, Timeline, Descriptions, Modal, Form, Alert, Divider, Tabs } from 'antd';
import { 
  SafetyOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SaveOutlined,
  HistoryOutlined,
  EyeOutlined,
  WarningOutlined,
  DollarOutlined,
  GlobalOutlined,
  MobileOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { API_CALL } from 'auth-fingerprint';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface FraudAlert {
  _id: string;
  userId: string;
  username: string;
  telegramId: string;
  alertType: 'suspicious_activity' | 'multiple_accounts' | 'withdrawal_pattern' | 'referral_abuse' | 'bot_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: {
    ipAddress?: string;
    deviceFingerprint?: string;
    suspiciousTransactions?: number;
    relatedAccounts?: string[];
    riskScore?: number;
    userAgent?: string;
    location?: string;
    transactionPattern?: any[];
    behaviorAnalysis?: any;
  };
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  investigationHistory?: InvestigationEntry[];
  relatedAlerts?: string[];
}

interface InvestigationEntry {
  _id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  oldStatus?: string;
  newStatus?: string;
}

interface UserProfile {
  _id: string;
  username: string;
  telegramId: string;
  balance: number;
  totalEarned: number;
  referralCount: number;
  status: string;
  createdAt: string;
  lastActivity: string;
  ipHistory: string[];
  deviceHistory: string[];
}

export default function FraudAlertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const alertId = params.id as string;

  const [alert, setAlert] = useState<FraudAlert | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [notesForm] = Form.useForm();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlertDetails();
  }, [alertId]);

  const fetchAlertDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts/${alertId}`,
        method: 'GET'
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch alert details');
      }

      const { alert: alertData, userProfile: userProfileData } = result.data;
      
      setAlert(alertData);
      setUserProfile(userProfileData);
    } catch (err) {
      console.error('Error fetching alert details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load alert details';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (values: any) => {
    try {
      setUpdating(true);
      
      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts/${alertId}`,
        method: 'PUT',
        body: {
          status: values.status,
          assignedTo: values.assignedTo,
          notes: values.notes,
          performedBy: 'admin'
        }
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update alert status');
      }
      
      message.success('Alert status updated successfully');
      setStatusModalVisible(false);
      form.resetFields();
      fetchAlertDetails();
    } catch (err) {
      console.error('Error updating alert status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update alert status';
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleNotesUpdate = async (values: any) => {
    try {
      setUpdating(true);
      
      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts/${alertId}`,
        method: 'PUT',
        body: {
          notes: values.notes,
          performedBy: 'admin',
          action: 'note_added'
        }
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update notes');
      }
      
      message.success('Investigation notes updated successfully');
      setNotesModalVisible(false);
      notesForm.resetFields();
      fetchAlertDetails();
    } catch (err) {
      console.error('Error updating notes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notes';
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'investigating': return 'blue';
      case 'resolved': return 'green';
      case 'false_positive': return 'gray';
      default: return 'default';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_accounts': return <TeamOutlined />;
      case 'withdrawal_pattern': return <DollarOutlined />;
      case 'bot_behavior': return <ExclamationCircleOutlined />;
      case 'referral_abuse': return <WarningOutlined />;
      case 'suspicious_activity': return <SafetyOutlined />;
      default: return <SafetyOutlined />;
    }
  };

  const handleQuickStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      
      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts/${alertId}`,
        method: 'PUT',
        body: {
          status: newStatus,
          performedBy: 'admin'
        }
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update alert status');
      }
      
      message.success(`Alert marked as ${newStatus.replace('_', ' ')}`);
      fetchAlertDetails();
    } catch (err) {
      console.error('Error updating alert status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update alert status';
      message.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Alert"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchAlertDetails}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-6">
        <Alert
          message="Alert Not Found"
          description="The requested fraud alert could not be found."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            className="flex items-center"
          >
            Back to Fraud Alerts
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {getAlertTypeIcon(alert.alertType)}
              Fraud Alert Details
            </h1>
            <p className="text-gray-600 mt-1">Alert ID: {alert._id}</p>
          </div>
        </div>
        <Space>
          <Button 
            icon={<EditOutlined />}
            onClick={() => setNotesModalVisible(true)}
          >
            Add Notes
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={() => setStatusModalVisible(true)}
            className="bg-blue-500"
          >
            Update Status
          </Button>
        </Space>
      </div>

      {/* Alert Status Banner */}
      {alert.severity === 'critical' && (
        <Alert
          message="Critical Security Alert"
          description="This alert requires immediate attention and investigation."
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Overview */}
          <Card title="Alert Overview" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Alert Type" span={1}>
                <div className="flex items-center gap-2">
                  {getAlertTypeIcon(alert.alertType)}
                  <span className="capitalize">{alert.alertType.replace('_', ' ')}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Severity" span={1}>
                <Tag color={getSeverityColor(alert.severity)} className="uppercase font-medium">
                  {alert.severity}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Risk Score" span={1}>
                <span className={`font-bold text-lg ${
                  alert.details.riskScore! >= 90 ? 'text-red-600' :
                  alert.details.riskScore! >= 70 ? 'text-orange-600' :
                  alert.details.riskScore! >= 50 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {alert.details.riskScore}/100
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={1}>
                <Tag color={getStatusColor(alert.status)} className="capitalize">
                  {alert.status.replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At" span={1}>
                {new Date(alert.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated" span={1}>
                {new Date(alert.updatedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To" span={2}>
                {alert.assignedTo || 'Unassigned'}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {alert.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Detailed Analysis */}
          <Card title="Detailed Analysis">
            <Tabs defaultActiveKey="technical">
              <TabPane tab="Technical Details" key="technical">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">IP Address</label>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">
                        {alert.details.ipAddress}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Device Fingerprint</label>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">
                        {alert.details.deviceFingerprint}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="mt-1">{alert.details.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Suspicious Transactions</label>
                      <p className="mt-1 text-red-600 font-medium">
                        {alert.details.suspiciousTransactions || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {alert.details.userAgent && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">User Agent</label>
                      <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                        {alert.details.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              </TabPane>

              <TabPane tab="Related Accounts" key="accounts">
                {alert.details.relatedAccounts && alert.details.relatedAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {alert.details.relatedAccounts.length} related accounts detected:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {alert.details.relatedAccounts.map((account, index) => (
                        <Card key={index} size="small" className="border-l-4 border-l-red-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar icon={<UserOutlined />} size="small" className="bg-red-500" />
                              <span className="font-medium">{account}</span>
                            </div>
                            <Button type="text" size="small" icon={<EyeOutlined />} />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No related accounts detected.</p>
                )}
              </TabPane>

              <TabPane tab="Behavior Analysis" key="behavior">
                {alert.details.behaviorAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Login Frequency</label>
                        <p className="mt-1 font-medium">{alert.details.behaviorAnalysis.loginFrequency}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Task Completion Rate</label>
                        <p className="mt-1 font-medium">{alert.details.behaviorAnalysis.taskCompletionRate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Referral Pattern</label>
                        <p className="mt-1 font-medium text-red-600">{alert.details.behaviorAnalysis.referralPattern}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Withdrawal Timing</label>
                        <p className="mt-1 font-medium text-red-600">{alert.details.behaviorAnalysis.withdrawalTiming}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No behavior analysis available.</p>
                )}
              </TabPane>

              <TabPane tab="Transaction Pattern" key="transactions">
                {alert.details.transactionPattern && alert.details.transactionPattern.length > 0 ? (
                  <div className="space-y-3">
                    {alert.details.transactionPattern.map((transaction, index) => (
                      <Card key={index} size="small">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{transaction.type}</span>
                            <span className="text-gray-500 ml-2">{transaction.date}</span>
                          </div>
                          <span className={`font-bold ${
                            transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earning' ? '+' : '-'}{transaction.amount} pts
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No transaction pattern data available.</p>
                )}
              </TabPane>
            </Tabs>
          </Card>

          {/* Investigation Notes */}
          <Card title="Investigation Notes" className="shadow-sm">
            {alert.notes ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">{alert.notes}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No investigation notes available.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile */}
          <Card title="User Profile" className="shadow-sm">
            {userProfile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar icon={<UserOutlined />} size={48} className="bg-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{userProfile.username}</h3>
                    <p className="text-sm text-gray-500">ID: {userProfile.telegramId}</p>
                  </div>
                </div>
                
                <Divider className="my-3" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance:</span>
                    <span className="font-medium">{userProfile.balance.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Earned:</span>
                    <span className="font-medium">{userProfile.totalEarned.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Referrals:</span>
                    <span className="font-medium">{userProfile.referralCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Tag color={userProfile.status === 'active' ? 'green' : 'red'}>
                      {userProfile.status.toUpperCase()}
                    </Tag>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium">{new Date(userProfile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button type="primary" block className="bg-blue-500">
                  View Full Profile
                </Button>
              </div>
            )}
          </Card>

          {/* Investigation History */}
          <Card title="Investigation History" className="shadow-sm">
            {alert.investigationHistory && alert.investigationHistory.length > 0 ? (
              <Timeline mode="left" className="mt-4">
                {alert.investigationHistory.map((entry) => (
                  <Timeline.Item 
                    key={entry._id}
                    dot={<HistoryOutlined className="text-blue-500" />}
                  >
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{entry.action.replace('_', ' ')}</p>
                      <p className="text-gray-600 mt-1">{entry.description}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        By {entry.performedBy} • {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <p className="text-gray-500 italic">No investigation history available.</p>
            )}
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm">
            <Space direction="vertical" className="w-full">
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                block 
                className="bg-green-500"
                disabled={alert.status === 'resolved' || updating}
                loading={updating}
                onClick={() => handleQuickStatusUpdate('resolved')}
              >
                Mark as Resolved
              </Button>
              <Button 
                icon={<CloseCircleOutlined />} 
                block
                disabled={alert.status === 'false_positive' || updating}
                loading={updating}
                onClick={() => handleQuickStatusUpdate('false_positive')}
              >
                Mark as False Positive
              </Button>
              <Button 
                icon={<UserOutlined />} 
                block
                danger
                disabled={updating}
              >
                Suspend User Account
              </Button>
              <Button 
                icon={<FileTextOutlined />} 
                block
                disabled={updating}
              >
                Generate Report
              </Button>
            </Space>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        title="Update Alert Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleStatusUpdate} layout="vertical">
          <Form.Item
            name="status"
            label="New Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="investigating">Investigating</Option>
              <Option value="resolved">Resolved</Option>
              <Option value="false_positive">False Positive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="assignedTo"
            label="Assign To"
          >
            <Select placeholder="Select investigator">
              <Option value="admin_john">Admin John</Option>
              <Option value="admin_jane">Admin Jane</Option>
              <Option value="admin_mike">Admin Mike</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Status Change Notes"
          >
            <TextArea rows={3} placeholder="Add notes about this status change..." />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setStatusModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={updating} className="bg-blue-500">
                Update Status
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notes Modal */}
      <Modal
        title="Add Investigation Notes"
        open={notesModalVisible}
        onCancel={() => setNotesModalVisible(false)}
        footer={null}
      >
        <Form form={notesForm} onFinish={handleNotesUpdate} layout="vertical">
          <Form.Item
            name="notes"
            label="Investigation Notes"
            rules={[{ required: true, message: 'Please add investigation notes' }]}
          >
            <TextArea rows={6} placeholder="Add detailed investigation notes..." />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setNotesModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={updating} className="bg-blue-500">
                Save Notes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
