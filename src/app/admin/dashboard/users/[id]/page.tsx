'use client';

import { Card, Button, Tag, Descriptions, Statistic, Row, Col, Spin, message, Breadcrumb } from 'antd';
import { UserOutlined, CalendarOutlined, WalletOutlined, TeamOutlined, TrophyOutlined, EyeOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_CALL } from 'auth-fingerprint';

// Utility function to format numbers with K, M, B suffixes
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

interface User {
  _id: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  telegramUsername?: string;
  profilePicUrl?: string;
  balance: number;
  totalEarned: number;
  referralCount: number;
  tasksCompletedToday: number;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields from API
  accountAge: number;
  isActive: boolean;
  averageEarningsPerDay: number;
  // Additional fields
  totalAdsViewed?: number;
  totalTasks?: number;
  ipAddress?: string;
  userAgent?: string;
  // Legacy fields for compatibility
  referralCode?: string;
  referralEarnings?: number;
  status?: string;
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
      
      const { response, status } = await API_CALL({
        url: `/admin/users/${userId}`,
        method: 'GET'
      });
      
      if (status === 200 && response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'User not found');
      }
    } catch (err: any) {
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
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName || user.lastName ? 
                  `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                  user.username
                }
              </h1>
              <p className="text-gray-600">
                @{user.username} • {user.telegramUsername ? `@${user.telegramUsername}` : user.telegramId} • ID: {user._id.slice(-8)}
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
              value={formatNumber(user.balance)}
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
              value={formatNumber(user.totalEarned)}
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
              value={formatNumber(user.referralCount)}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Tasks Today"
              value={formatNumber(user.tasksCompletedToday)}
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
            <Tag color={user.isActive ? 'green' : 'orange'}>
              {user.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Referral Code">
            <span 
              className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
              title="Click to view referral list"
            >
              {user.referralCode || 'Not set'}
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
          <Descriptions.Item label="Account Age">
            <span className="text-green-600 font-medium">
              {user.accountAge} days
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Last Active">
            {user.lastActiveAt ? (
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-gray-400" />
                {new Date(user.lastActiveAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            ) : (
              <span className="text-gray-500">Never</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Avg. Daily Earnings">
            <span className="text-blue-600 font-medium">
              {formatNumber(user.averageEarningsPerDay)} pts/day
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Total Ads Viewed">
            <span className="text-orange-600 font-medium">
              {formatNumber(user.totalAdsViewed || 0)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Total Tasks Completed">
            <span className="text-green-600 font-medium">
              {formatNumber(user.totalTasks || 0)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="IP Address">
            <span className="text-gray-600 font-mono text-sm">
              {user.ipAddress || 'Not recorded'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="User Agent" span={2}>
            <span className="text-gray-600 text-sm break-all">
              {user.userAgent ? (
                <div className="max-w-md truncate" title={user.userAgent}>
                  {user.userAgent}
                </div>
              ) : (
                'Not recorded'
              )}
            </span>
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
                {formatNumber(user.totalEarned)} pts
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
                {formatNumber(user.balance)} pts
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
                {formatNumber(user.referralEarnings || 0)} pts
              </div>
              <div className="text-sm text-purple-600 mt-1">
                Earned from <span 
                  className="cursor-pointer hover:underline font-medium"
                  onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
                  title="Click to view referral list"
                >
                  {formatNumber(user.referralCount)} referrals
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Activity Summary */}
      <Card title="Activity Summary">
        <Row gutter={16}>
          <Col span={8}>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <div className="text-orange-800 font-semibold mb-2">Total Ads Viewed</div>
              <div className="text-3xl font-bold text-orange-600">
                {formatNumber(user.totalAdsViewed || 0)}
              </div>
              <div className="text-sm text-orange-600 mt-1">
                Lifetime ad views
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-green-800 font-semibold mb-2">Total Tasks</div>
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(user.totalTasks || 0)}
              </div>
              <div className="text-sm text-green-600 mt-1">
                All completed tasks
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div 
              className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
              onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
              title="Click to view referral list"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-indigo-800 font-semibold">Referral Network</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatNumber(user.referralCount)} Users
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
