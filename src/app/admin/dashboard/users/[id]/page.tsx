'use client';

import { Card, Button, Tag, Descriptions, Statistic, Row, Col, Spin, message, Breadcrumb } from 'antd';
import { UserOutlined, CalendarOutlined, WalletOutlined, TeamOutlined, TrophyOutlined, EyeOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
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
            title: user.username,
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/users">
            <Button icon={<ArrowLeftOutlined />} className="mr-2">
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <UserOutlined className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">
                @{user.telegramUsername || user.telegramId} • ID: {user._id.slice(-8)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/users/${userId}/edit`}>
            <Button type="primary" icon={<EditOutlined />} className="bg-blue-500">
              Edit User
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Row */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Current Balance"
              value={user.balance}
              suffix="pts"
              valueStyle={{ color: '#52c41a' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Total Earned"
              value={user.totalEarned}
              suffix="pts"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Referrals"
              value={user.referralCount}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Ads Viewed"
              value={user.totalAdsViewed || 0}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* User Information */}
      <Card title="User Information">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="User ID">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {user._id}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Telegram ID">
            <span className="text-blue-600 font-medium">
              {user.telegramId}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Telegram Username">
            {user.telegramUsername ? `@${user.telegramUsername}` : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={user.status === 'active' ? 'green' : 'orange'}>
              {user.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Referral Code">
            <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {user.referralCode}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Join Date">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              {new Date(user.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Financial Overview */}
      <Card title="Financial Overview">
        <Row gutter={16}>
          <Col span={8}>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-green-800 font-semibold mb-2">Total Earnings</div>
              <div className="text-3xl font-bold text-green-600">
                {user.totalEarned.toLocaleString()} pts
              </div>
              <div className="text-sm text-green-600 mt-1">
                Lifetime earnings from all activities
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-blue-800 font-semibold mb-2">Current Balance</div>
              <div className="text-3xl font-bold text-blue-600">
                {user.balance.toLocaleString()} pts
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Available for withdrawal
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-purple-800 font-semibold mb-2">Referral Earnings</div>
              <div className="text-3xl font-bold text-purple-600">
                {user.referralEarnings.toLocaleString()} pts
              </div>
              <div className="text-sm text-purple-600 mt-1">
                Earned from {user.referralCount} referrals
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Activity Summary */}
      <Card title="Activity Summary">
        <Row gutter={16}>
          <Col span={12}>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-orange-800 font-semibold">Ads Engagement</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {user.totalAdsViewed || 0} Views
                  </div>
                </div>
                <EyeOutlined className="text-orange-500 text-3xl" />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-indigo-800 font-semibold">Referral Network</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {user.referralCount} Users
                  </div>
                </div>
                <TeamOutlined className="text-indigo-500 text-3xl" />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
