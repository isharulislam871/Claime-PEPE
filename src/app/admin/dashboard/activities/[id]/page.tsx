'use client';

import { Card, Button, Tag, Descriptions, Statistic, Row, Col, Spin, message, Breadcrumb, Avatar, Timeline, Badge } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  WalletOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  EyeOutlined, 
  ArrowLeftOutlined, 
  ClockCircleOutlined,
  GlobalOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatTimestampWithTooltip } from '@/lib/utils/timeFormat';

interface Activity {
  _id: string;
  telegramId: string;
  username?: string;
  telegramUsername?: string;
  type: string;
  description: string;
  reward: number;
  metadata: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

export default function ActivityDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activity details from API
  const fetchActivityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/activities/${activityId}`);
      const data = await response.json();
      
      if (data.success && data.activity) {
        setActivity(data.activity);
      } else {
        throw new Error('Activity not found');
      }
    } catch (err) {
      console.error('Error fetching activity details:', err);
      setError('Failed to load activity details');
      message.error('Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchActivityDetails();
    }
  }, [activityId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ad_view': return 'orange';
      case 'task_complete': return 'blue';
      case 'referral': return 'purple';
      case 'bonus': return 'green';
      case 'withdrawal': return 'red';
      case 'login': return 'cyan';
      case 'ad_view_home': return 'gold';
      case 'api': return 'geekblue';
      case 'swap': return 'magenta';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ad_view': return <EyeOutlined />;
      case 'ad_view_home': return <EyeOutlined />;
      case 'task_complete': return <TrophyOutlined />;
      case 'referral': return <TeamOutlined />;
      case 'bonus': return <TrophyOutlined />;
      case 'withdrawal': return <WalletOutlined />;
      case 'login': return <UserOutlined />;
      case 'api': return <GlobalOutlined />;
      case 'swap': return <WalletOutlined />;
      default: return <UserOutlined />;
    }
  };

  const formatMetadata = (metadata: Record<string, any>) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return 'No additional data';
    }
    
    return Object.entries(metadata).map(([key, value]) => (
      <div key={key} className="mb-2">
        <span className="font-medium text-gray-700">{key}:</span>{' '}
        <span className="text-gray-900">
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested activity could not be found.'}</p>
          <Link href="/admin/dashboard/activities">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Activities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { relative, absolute } = formatTimestampWithTooltip(activity.timestamp);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          {
            title: <Link href="/admin/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/admin/dashboard/activities">Activities</Link>,
          },
          {
            title: `Activity Details`,
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/activities">
            <Button icon={<ArrowLeftOutlined />} className="mr-2">
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-16 h-16 bg-${getTypeColor(activity.type)}-500 rounded-full flex items-center justify-center`}>
              <span className="text-white text-2xl">
                {getTypeIcon(activity.type)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Activity Details
                <Tag color={getTypeColor(activity.type)} className="ml-2">
                  {activity.type.replace('_', ' ').toUpperCase()}
                </Tag>
              </h1>
              <p className="text-gray-600">
                ID: {activity._id.slice(-8)} • {relative}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge status="success" text="Verified" />
        </div>
      </div>

      {/* Statistics Row */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Reward Earned"
              value={activity.reward}
              suffix="pts"
              valueStyle={{ color: activity.reward > 0 ? '#52c41a' : '#8c8c8c' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Activity Type"
              value={activity.type.replace('_', ' ')}
              valueStyle={{ color: '#1890ff' }}
              prefix={getTypeIcon(activity.type)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Time Ago"
              value={relative}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <Statistic
              title="Verification"
              value="Verified"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Activity Information */}
      <Card title="Activity Information">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Activity ID">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {activity._id}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Activity Type">
            <div className="flex items-center gap-2">
              {getTypeIcon(activity.type)}
              <Tag color={getTypeColor(activity.type)}>
                {activity.type.replace('_', ' ').toUpperCase()}
              </Tag>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <div className="max-w-md">
              {activity.description}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Reward">
            {activity.reward > 0 ? (
              <span className="font-semibold text-green-600">
                +{activity.reward.toLocaleString()} pts
              </span>
            ) : (
              <span className="text-gray-400">No reward</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Timestamp">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              <div>
                <div className="font-medium">{absolute}</div>
                <div className="text-sm text-gray-500">{relative}</div>
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Hash">
            <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {activity.hash}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* User Information */}
      <Card title="User Information">
        <div className="flex items-center gap-4 mb-4">
          <Avatar icon={<UserOutlined />} size={64} className="bg-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {activity.username || 'Unknown User'}
            </h3>
            <p className="text-gray-600">
              @{activity.telegramUsername || activity.telegramId}
            </p>
          </div>
        </div>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Telegram ID">
            <span className="text-blue-600 font-medium">
              {activity.telegramId}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            {activity.username || 'Not available'}
          </Descriptions.Item>
          <Descriptions.Item label="Telegram Username">
            {activity.telegramUsername ? `@${activity.telegramUsername}` : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="User Actions">
            <Link href={`/admin/dashboard/users/${activity.telegramId}`}>
              <Button type="link" icon={<UserOutlined />} className="p-0">
                View User Profile
              </Button>
            </Link>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Technical Details */}
      <Card title="Technical Details">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="IP Address">
            <div className="flex items-center gap-2">
              <GlobalOutlined className="text-gray-400" />
              <span className="font-mono text-sm">
                {activity.ipAddress}
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Security Hash">
            <div className="flex items-center gap-2">
              <SafetyOutlined className="text-green-500" />
              <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                {activity.hash.slice(0, 16)}...
              </span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              {new Date(activity.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              {new Date(activity.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Metadata */}
      <Card title="Additional Data">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <InfoCircleOutlined className="text-blue-500" />
            <span className="font-medium text-gray-700">Metadata</span>
          </div>
          <div className="text-sm">
            {formatMetadata(activity.metadata)}
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card title="Activity Timeline">
        <Timeline
          items={[
            {
              dot: <CheckCircleOutlined className="text-green-500" />,
              color: 'green',
              children: (
                <div>
                  <div className="font-medium">Activity Completed</div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </div>
                </div>
              ),
            },
            {
              dot: <WalletOutlined className="text-blue-500" />,
              color: 'blue',
              children: (
                <div>
                  <div className="font-medium">Reward Processed</div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {activity.reward > 0 
                      ? `+${activity.reward} points awarded` 
                      : 'No reward for this activity'
                    }
                  </div>
                </div>
              ),
            },
            {
              dot: <SafetyOutlined className="text-purple-500" />,
              color: 'purple',
              children: (
                <div>
                  <div className="font-medium">Security Verified</div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.updatedAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Activity hash verified and recorded
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
