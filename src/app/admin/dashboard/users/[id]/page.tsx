'use client';

import { Card, Button, Tag, Descriptions, Row, Col, Spin, message, Breadcrumb, Badge, Tooltip, Avatar, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, WalletOutlined, TeamOutlined, TrophyOutlined, EyeOutlined, ArrowLeftOutlined, EditOutlined, ClockCircleOutlined, SafetyOutlined, GlobalOutlined, MobileOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
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

// Utility function to format time ago (e.g., "2m ago", "1h ago", "3d ago")
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
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
      <Card 
        title={
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-0">User Information</h3>
              <p className="text-sm text-gray-500 mb-0">Complete user profile and activity details</p>
            </div>
          </div>
        }
        className="shadow-sm border-0"
      >
        <Descriptions 
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }} 
          bordered
          size="middle"
          className="custom-descriptions"
        >
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <SafetyOutlined className="text-gray-500" />
                <span className="font-medium">User ID</span>
              </div>
            }
          >
            <Tooltip title="Click to copy">
              <span 
                className="font-mono text-sm bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-lg cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200"
                onClick={() => navigator.clipboard.writeText(user._id)}
              >
                {user._id}
              </span>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-500" />
                <span className="font-medium">Username</span>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <Badge status="processing" />
              <span className="text-gray-800 font-medium">{user.username}</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <MobileOutlined className="text-blue-500" />
                <span className="font-medium">Telegram ID</span>
              </div>
            }
          >
            <Tooltip title="Click to copy">
              <span 
                className="text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                onClick={() => navigator.clipboard.writeText(user.telegramId)}
              >
                {user.telegramId}
              </span>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <GlobalOutlined className="text-cyan-500" />
                <span className="font-medium">Telegram Username</span>
              </div>
            }
          >
            {user.telegramUsername ? (
              <div className="flex items-center gap-2">
                <Badge status="success" />
                <span className="text-cyan-600 font-medium">@{user.telegramUsername}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge status="default" />
                <span className="text-gray-500">Not set</span>
              </div>
            )}
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <FireOutlined className="text-orange-500" />
                <span className="font-medium">Account Status</span>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              {user.status === 'active' ? (
                <Tag color="success" className="px-3 py-1 rounded-full font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    ACTIVE
                  </div>
                </Tag>
              ) : user.status === 'ban' ? (
                <Tag color="error" className="px-3 py-1 rounded-full font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    BANNED
                  </div>
                </Tag>
              ) : (
                <Tag color="warning" className="px-3 py-1 rounded-full font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    SUSPENDED
                  </div>
                </Tag>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <TeamOutlined className="text-purple-500" />
                <span className="font-medium">Referral Code</span>
              </div>
            }
          >
            <Tooltip title="Click to view referral network">
              <span 
                className="font-mono text-sm bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1.5 rounded-lg cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200 inline-flex items-center gap-2"
                onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
              >
                <StarOutlined className="text-xs" />
                {user.referralCode || 'Auto-generated'}
              </span>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-green-500" />
                <span className="font-medium">Join Date</span>
              </div>
            }
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                <CalendarOutlined className="text-green-600" />
              </div>
              <div>
                <div className="text-gray-800 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-500" />
                <span className="font-medium">Last Updated</span>
              </div>
            }
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                <ClockCircleOutlined className="text-blue-600" />
              </div>
              <div>
                <span className="text-blue-600 font-medium text-sm bg-blue-50 px-2 py-1 rounded-md">
                  {formatTimeAgo(user.updatedAt)}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(user.updatedAt).toLocaleString('en-US')}
                </div>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-yellow-500" />
                <span className="font-medium">Account Age</span>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <Badge 
                count={user.accountAge} 
                style={{ backgroundColor: '#52c41a' }} 
                className="mr-2"
              />
              <span className="text-green-600 font-medium">
                {user.accountAge} days old
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <EyeOutlined className="text-green-500" />
                <span className="font-medium">Last Active</span>
              </div>
            }
          >
            {user.lastActiveAt ? (
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                  <EyeOutlined className="text-green-600" />
                </div>
                <div>
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-1 rounded-md">
                    {formatTimeAgo(user.lastActiveAt)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(user.lastActiveAt).toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge status="default" />
                <span className="text-gray-500">Never active</span>
              </div>
            )}
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <WalletOutlined className="text-blue-500" />
                <span className="font-medium">Avg. Daily Earnings</span>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <Badge count="AVG" style={{ backgroundColor: '#1890ff' }} className="mr-2" />
              <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">
                {formatNumber(user.averageEarningsPerDay)} pts/day
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <EyeOutlined className="text-orange-500" />
                <span className="font-medium">Total Ads Viewed</span>
              </div>
            }
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
                <EyeOutlined className="text-orange-600" />
              </div>
              <span className="text-orange-600 font-medium text-lg">
                {formatNumber(user.totalAdsViewed || 0)}
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-green-500" />
                <span className="font-medium">Total Tasks Completed</span>
              </div>
            }
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                <TrophyOutlined className="text-green-600" />
              </div>
              <span className="text-green-600 font-medium text-lg">
                {formatNumber(user.totalTasks || 0)}
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <div className="flex items-center gap-2">
                <GlobalOutlined className="text-gray-500" />
                <span className="font-medium">IP Address</span>
              </div>
            }
          >
            {user.ipAddress ? (
              <Tooltip title="Click to copy IP address">
                <span 
                  className="text-gray-600 font-mono text-sm bg-gray-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                  onClick={() => navigator.clipboard.writeText(user.ipAddress!)}
                >
                  {user.ipAddress}
                </span>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-2">
                <Badge status="default" />
                <span className="text-gray-500">Not recorded</span>
              </div>
            )}
          </Descriptions.Item>
        </Descriptions>
        
        {/* Custom CSS for enhanced descriptions */}
        <style jsx global>{`
          .custom-descriptions .ant-descriptions-item-label {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-weight: 500;
            border-right: 3px solid #e2e8f0;
          }
          
          .custom-descriptions .ant-descriptions-item-content {
            background: #ffffff;
            padding: 12px 16px;
          }
          
          .custom-descriptions .ant-descriptions-bordered .ant-descriptions-item {
            border-bottom: 1px solid #e2e8f0;
          }
          
          .custom-descriptions .ant-descriptions-item:hover .ant-descriptions-item-content {
            background: #f8fafc;
            transition: background-color 0.2s ease;
          }
        `}</style>
      </Card>

      {/* Financial Overview */}
      <Card 
        title={
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              icon={<WalletOutlined />} 
              className="bg-gradient-to-r from-green-500 to-blue-600"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-0">Financial Overview</h3>
              <p className="text-sm text-gray-500 mb-0">Complete earnings and balance summary</p>
            </div>
          </div>
        }
        className="shadow-sm border-0"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <TrophyOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="TOTAL" style={{ backgroundColor: '#52c41a' }} />
                </div>
                <div className="text-green-800 font-semibold mb-1">Total Earnings</div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(user.totalEarned)} pts
                </div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <CalendarOutlined className="text-xs" />
                  Lifetime earnings from all activities
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <WalletOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="BALANCE" style={{ backgroundColor: '#1890ff' }} />
                </div>
                <div className="text-blue-800 font-semibold mb-1">Current Balance</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(user.balance)} pts
                </div>
                <div className="text-sm text-blue-600 flex items-center gap-1">
                  <SafetyOutlined className="text-xs" />
                  Available for withdrawal
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <TeamOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="REF" style={{ backgroundColor: '#722ed1' }} />
                </div>
                <div className="text-purple-800 font-semibold mb-1">Referral Earnings</div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatNumber(user.referralEarnings || 0)} pts
                </div>
                <div className="text-sm text-purple-600 flex items-center gap-1">
                  <TeamOutlined className="text-xs" />
                  From <Tooltip title="Click to view referral network">
                    <span 
                      className="cursor-pointer hover:underline font-medium bg-purple-100 px-2 py-1 rounded-md ml-1"
                      onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
                    >
                      {formatNumber(user.referralCount)} referrals
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-orange-500 p-3 rounded-lg">
                    <FireOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="AVG" style={{ backgroundColor: '#fa8c16' }} />
                </div>
                <div className="text-orange-800 font-semibold mb-1">Daily Average</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatNumber(user.averageEarningsPerDay)} pts
                </div>
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <ClockCircleOutlined className="text-xs" />
                  Average earnings per day
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Financial Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <StarOutlined className="text-yellow-500" />
            <span className="font-semibold text-gray-700">Financial Insights</span>
          </div>
          <Row gutter={16}>
            <Col span={8}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.totalEarned > 0 ? Math.round((user.balance / user.totalEarned) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Balance Ratio</div>
                <div className="text-xs text-gray-500">Current vs Total Earned</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.referralCount > 0 ? Math.round((user.referralEarnings || 0) / user.referralCount) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg per Referral</div>
                <div className="text-xs text-gray-500">Points earned per referral</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.accountAge > 0 ? Math.round(user.totalEarned / user.accountAge) : 0}
                </div>
                <div className="text-sm text-gray-600">Efficiency Score</div>
                <div className="text-xs text-gray-500">Total earned / Account age</div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Activity Summary */}
      <Card 
        title={
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              icon={<TrophyOutlined />} 
              className="bg-gradient-to-r from-orange-500 to-red-600"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-0">Activity Summary</h3>
              <p className="text-sm text-gray-500 mb-0">User engagement and performance metrics</p>
            </div>
          </div>
        }
        className="shadow-sm border-0"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-orange-500 p-3 rounded-lg">
                    <EyeOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="ADS" style={{ backgroundColor: '#fa8c16' }} />
                </div>
                <div className="text-orange-800 font-semibold mb-1">Total Ads Viewed</div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {formatNumber(user.totalAdsViewed || 0)}
                </div>
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <EyeOutlined className="text-xs" />
                  Lifetime ad engagement
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <TrophyOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="TASKS" style={{ backgroundColor: '#52c41a' }} />
                </div>
                <div className="text-green-800 font-semibold mb-1">Total Tasks</div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatNumber(user.totalTasks || 0)}
                </div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <TrophyOutlined className="text-xs" />
                  All completed tasks
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <FireOutlined className="text-white text-xl" />
                  </div>
                  <Badge count="TODAY" style={{ backgroundColor: '#1890ff' }} />
                </div>
                <div className="text-blue-800 font-semibold mb-1">Tasks Today</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(user.tasksCompletedToday)}
                </div>
                <div className="text-sm text-blue-600 flex items-center gap-1">
                  <ClockCircleOutlined className="text-xs" />
                  Daily activity level
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Tooltip title="Click to view referral network">
              <div 
                className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => router.push(`/admin/dashboard/users/ref?referralCode=${user.referralCode || user.telegramId}`)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-indigo-500 p-3 rounded-lg">
                      <TeamOutlined className="text-white text-xl" />
                    </div>
                    <Badge count="NETWORK" style={{ backgroundColor: '#722ed1' }} />
                  </div>
                  <div className="text-indigo-800 font-semibold mb-1">Referral Network</div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {formatNumber(user.referralCount)}
                  </div>
                  <div className="text-sm text-indigo-600 flex items-center gap-1">
                    <TeamOutlined className="text-xs" />
                    Active referrals
                  </div>
                </div>
              </div>
            </Tooltip>
          </Col>
        </Row>
        
        {/* Activity Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FireOutlined className="text-red-500" />
            <span className="font-semibold text-gray-700">Activity Insights</span>
          </div>
          <Row gutter={16}>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {(user.totalTasks || 0) > 0 ? Math.round((user.tasksCompletedToday / (user.totalTasks || 1)) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Today's Ratio</div>
                <div className="text-xs text-gray-500">Today vs Total Tasks</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.accountAge > 0 ? Math.round((user.totalTasks || 0) / user.accountAge) : 0}
                </div>
                <div className="text-sm text-gray-600">Tasks per Day</div>
                <div className="text-xs text-gray-500">Average daily tasks</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.accountAge > 0 ? Math.round((user.totalAdsViewed || 0) / user.accountAge) : 0}
                </div>
                <div className="text-sm text-gray-600">Ads per Day</div>
                <div className="text-xs text-gray-500">Average daily ad views</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {(user.totalTasks || 0) > 0 && (user.totalAdsViewed || 0) > 0 
                    ? Math.round(((user.totalAdsViewed || 0) / (user.totalTasks || 1)) * 100) / 100
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Engagement Rate</div>
                <div className="text-xs text-gray-500">Ads per task ratio</div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* Activity Status */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user.tasksCompletedToday > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="font-medium text-gray-700">
                Activity Status: {user.tasksCompletedToday > 0 ? 'Active Today' : 'Inactive Today'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarOutlined />
                <span>Last Active: {user.lastActiveAt ? formatTimeAgo(user.lastActiveAt) : 'Never'}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrophyOutlined />
                <span>Account Age: {user.accountAge} days</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
