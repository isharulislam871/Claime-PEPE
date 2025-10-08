'use client';

import { Card, Button, Form, Input, Select, InputNumber, Spin, message, Breadcrumb, Space } from 'antd';
import { UserOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const { Option } = Select;

interface User {
  _id: string;
  telegramId: string;
  username: string;
  telegramUsername?: string;
  balance: number;
  totalEarned: number;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAdsViewed?: number;
  tasksCompletedToday?: number;
  banReason?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        // Populate form with user data
        form.setFieldsValue({
          username: data.user.username,
          telegramUsername: data.user.telegramUsername,
          balance: data.user.balance,
          totalEarned: data.user.totalEarned,
          referralEarnings: data.user.referralEarnings,
          status: data.user.status,
          banReason: data.user.banReason,
          tasksCompletedToday: data.user.tasksCompletedToday || 0
        });
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details');
      message.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  // Save user changes
  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user?.telegramId,
          updates: {
            username: values.username,
            telegramUsername: values.telegramUsername,
            balance: values.balance,
            totalEarned: values.totalEarned,
            referralEarnings: values.referralEarnings,
            status: values.status,
            banReason: values.banReason,
            tasksCompletedToday: values.tasksCompletedToday
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('User updated successfully');
        router.push(`/admin/dashboard/users/${userId}`);
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      message.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested user could not be found.'}</p>
          <Link href="/admin/dashboard/users">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          {
            title: <Link href="/admin/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/admin/dashboard/users">Users</Link>,
          },
          {
            title: <Link href={`/admin/dashboard/users/${userId}`}>{user.username}</Link>,
          },
          {
            title: 'Edit',
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href={`/admin/dashboard/users/${userId}`}>
            <Button icon={<ArrowLeftOutlined />} className="mr-2">
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <UserOutlined className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit User: {user.username}</h1>
              <p className="text-gray-600">
                @{user.telegramUsername || user.telegramId} • ID: {user._id.slice(-8)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card title="Edit User Information">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>

              <Form.Item
                label="Telegram Username"
                name="telegramUsername"
              >
                <Input placeholder="Enter telegram username" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Status is required' }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="ban">Banned</Option>
                  <Option value="suspend">Suspended</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Ban Reason"
                name="banReason"
                tooltip="Only required if status is banned or suspended"
              >
                <Input.TextArea 
                  placeholder="Enter ban/suspend reason" 
                  rows={3}
                />
              </Form.Item>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
              
              <Form.Item
                label="Current Balance (pts)"
                name="balance"
                rules={[{ required: true, message: 'Balance is required' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter balance"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <Form.Item
                label="Total Earned (pts)"
                name="totalEarned"
                rules={[{ required: true, message: 'Total earned is required' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter total earned"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <Form.Item
                label="Referral Earnings (pts)"
                name="referralEarnings"
                rules={[{ required: true, message: 'Referral earnings is required' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter referral earnings"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <Form.Item
                label="Tasks Completed Today"
                name="tasksCompletedToday"
                tooltip="Number of ads/tasks completed today (max 100)"
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  placeholder="Enter tasks completed today"
                />
              </Form.Item>
            </div>
          </div>

          {/* Read-only Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Read-only Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Telegram ID:</span>
                <div className="text-blue-600 font-mono">{user.telegramId}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Referral Code:</span>
                <div className="text-purple-600 font-mono">{user.referralCode}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Referral Count:</span>
                <div className="text-green-600 font-semibold">{user.referralCount}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Ads Viewed:</span>
                <div className="text-orange-600 font-semibold">{user.totalAdsViewed || 0}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Join Date:</span>
                <div className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <div className="text-gray-700">{new Date(user.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Link href={`/admin/dashboard/users/${userId}`}>
              <Button size="large">
                Cancel
              </Button>
            </Link>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={saving}
              icon={<SaveOutlined />}
              className="bg-blue-500"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
