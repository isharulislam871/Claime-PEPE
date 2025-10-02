'use client';

import { Card, Table, Button, Tag, Space, Input, Select, DatePicker, Spin, message, Avatar } from 'antd';
import { 
 
  SearchOutlined, 
  EyeOutlined, 
  ReloadOutlined, 
  FilterOutlined,
  TrophyOutlined,
  WalletOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Activity {
  _id: string;
  telegramId: string;
  username: string;
  telegramUsername?: string;
  type: string;
  description: string;
  reward: number;
  metadata: Record<string, any>;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [typeStats, setTypeStats] = useState<any>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [avgReward, setAvgReward] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  // Fetch activities from API
  const fetchActivities = async (page = 1, limit = pageSize, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(searchText && { username: searchText }),
        ...filters
      });
      
      // Add date range if selected
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.append('startDate', dateRange[0].toISOString());
        params.append('endDate', dateRange[1].toISOString());
      }
      
      const response = await fetch(`/api/admin/activities?${params}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setActivitiesData(data.data.activities);
        setTotalCount(data.data.pagination.totalCount);
        setCurrentPage(data.data.pagination.currentPage);
        setTypeStats(data.data.summary.typeBreakdown);
        setTotalRewards(data.data.summary.totalRewards);
        setAvgReward(data.data.summary.avgReward);
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
      message.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage, pageSize);
  }, [currentPage, pageSize, typeFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== '') {
        fetchActivities(1, pageSize);
      } else {
        fetchActivities(currentPage, pageSize);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ad_view': return 'orange';
      case 'task_complete': return 'blue';
      case 'referral': return 'purple';
      case 'bonus': return 'green';
      case 'withdrawal': return 'red';
      case 'login': return 'cyan';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ad_view': return <EyeOutlined />;
      case 'task_complete': return <TrophyOutlined />;
      case 'referral': return <TeamOutlined />;
      case 'bonus': return <TrophyOutlined />;
      case 'withdrawal': return <WalletOutlined />;
      case 'login': return <UserOutlined />;
      default: return <UserOutlined />;
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: Activity) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium text-gray-900">{record.username}</div>
            <div className="text-sm text-gray-500">@{record.telegramUsername || record.telegramId}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Activity Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <Tag color={getTypeColor(type)}>
            {type.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 truncate" title={description}>
            {description}
          </div>
        </div>
      ),
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      render: (reward: number) => (
        <div className="text-center">
          {reward > 0 ? (
            <span className="font-semibold text-green-600">
              +{reward.toLocaleString()} PEPE
            </span>
          ) : (
            <span className="text-gray-400">No reward</span>
          )}
        </div>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {new Date(timestamp).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Activity) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:bg-blue-50"
            title="View Details"
            onClick={() => router.push(`/admin/dashboard/users/${record.telegramId}`)}
          />
        </Space>
      ),
    },
  ];

  // Data is filtered on server side
  const filteredData = activitiesData;
  
  // Pagination handlers
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };
  
  const handleRefresh = () => {
    fetchActivities(currentPage, pageSize);
  };

  // Calculate type stats for display
  const getTypeStatsForDisplay = () => {
    return typeStats.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  };

  const displayStats = getTypeStatsForDisplay();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities Management</h1>
          <p className="text-gray-600 mt-1">Monitor all user activities and rewards</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
          <div className="text-gray-500">Total Activities</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{displayStats.ad_view || 0}</div>
          <div className="text-gray-500">Ad Views</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{displayStats.task_complete || 0}</div>
          <div className="text-gray-500">Tasks</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{displayStats.referral || 0}</div>
          <div className="text-gray-500">Referrals</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalRewards.toLocaleString()}</div>
          <div className="text-gray-500">Total Rewards</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-cyan-600">{Math.round(avgReward || 0)}</div>
          <div className="text-gray-500">Avg Reward</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Search
              placeholder="Search by username..."
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Types</Option>
              <Option value="ad_view">Ad Views</Option>
              <Option value="task_complete">Tasks</Option>
              <Option value="referral">Referrals</Option>
              <Option value="bonus">Bonus</Option>
              <Option value="withdrawal">Withdrawals</Option>
              <Option value="login">Login</Option>
              <Option value="other">Other</Option>
            </Select>
            <RangePicker 
              placeholder={['Start Date', 'End Date']} 
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {activitiesData.length} of {totalCount} activities
          </div>
        </div>
      </Card>

      {/* Activities Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '50', '100', '500', '1000'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} activities`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
            rowKey="_id"
          />
        )}
      </Card>
    </div>
  );
}
