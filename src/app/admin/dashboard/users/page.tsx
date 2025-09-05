'use client';

import { Card, Table, Button, Tag, Space, Input, Select, Avatar, Spin, message, DatePicker } from 'antd';
import { UserOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

export default function UsersPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [totalCount, setTotalCount] = useState(0);
  const [statusStats, setStatusStats] = useState<any>({});
  const [totalStats, setTotalStats] = useState<any>({});
  const [userSegments, setUserSegments] = useState<any>({});
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  // Fetch users from API
  const fetchUsers = async (page = 1, limit = pageSize, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchText && { username: searchText }),
        ...filters
      });
      
      // Add date range if selected
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.append('startDate', dateRange[0].toISOString());
        params.append('endDate', dateRange[1].toISOString());
      }
      
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setUserData(data.data.users);
        setTotalCount(data.data.pagination.totalCount);
        setCurrentPage(data.data.pagination.currentPage);
        
        // Update stats from API response
        const stats = data.data.summary.statusBreakdown.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
        setStatusStats(stats);
        setTotalStats(data.data.summary.totalStats);
        setUserSegments(data.data.summary.userSegments);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, statusFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== '') {
        fetchUsers(1, pageSize);
      } else {
        fetchUsers(currentPage, pageSize);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleViewDetails = (user: User) => {
    router.push(`/admin/dashboard/users/${user._id}`);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">@{record.telegramUsername || record.telegramId}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'User ID',
      dataIndex: '_id',
      key: '_id',
      render: (text: string) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {text.slice(-8)}
        </span>
      ),
    },
    {
      title: 'Telegram ID',
      dataIndex: 'telegramId',
      key: 'telegramId',
      render: (text: string) => (
        <span className="text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <span className="font-semibold text-green-600">{balance.toLocaleString()} PEPE</span>
      ),
    },
    {
      title: 'Total Earned',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      render: (earned: number) => (
        <span className="font-medium text-blue-600">{earned.toLocaleString()} PEPE</span>
      ),
    },
    {
      title: 'Referrals',
      dataIndex: 'referralCount',
      key: 'referralCount',
      render: (count: number) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {count}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:bg-blue-50"
            title="View Details"
            onClick={() => handleViewDetails(record)}
          />
          <Link href={`/admin/dashboard/users/${record._id}/edit`}>
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-green-500 hover:bg-green-50"
              title="Edit User"
            />
          </Link>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:bg-red-50"
            title="Delete User"
          />
        </Space>
      ),
    },
  ];

  // Data is now filtered on the server side, so we use userData directly
  const filteredData = userData;
  
  // Pagination handlers
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };
  
  const handleRefresh = () => {
    fetchUsers(currentPage, pageSize);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered users</p>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button type="primary" icon={<UserOutlined />} className="bg-blue-500">
            Add New User
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
          <div className="text-gray-500">Total Users</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {userSegments.activeUsers || 0}
          </div>
          <div className="text-gray-500">Active Users</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {userSegments.highEarners || 0}
          </div>
          <div className="text-gray-500">High Earners</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {userSegments.newUsers || 0}
          </div>
          <div className="text-gray-500">New Users (30d)</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-cyan-600">
            {totalStats.totalEarnings ? totalStats.totalEarnings.toLocaleString() : 0}
          </div>
          <div className="text-gray-500">Total Earnings</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Search
              placeholder="Search users..."
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="ban">Banned</Option>
              <Option value="suspend">Suspended</Option>
            </Select>
            <RangePicker 
              placeholder={['Start Date', 'End Date']} 
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {userData.length} of {totalCount} users
          </div>
        </div>
      </Card>

      {/* Users Table */}
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
                `${range[0]}-${range[1]} of ${total} users`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            className="overflow-x-auto"
            rowKey="_id"
          />
        )}
      </Card>
      </div>
    );
  }
