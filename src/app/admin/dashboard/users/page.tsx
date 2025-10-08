'use client';

import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Avatar,
  Spin,
  message,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { AppDispatch } from '@/modules/store';
import {
  fetchUsersRequest,
  refreshUsersRequest,
  setSearchText,
  setStatusFilter,
  setDateRange,
  setCurrentPage,
  setPageSize,
  clearFilters,
  clearError,
} from '@/modules/admin/users/actions';
import {
  selectUsers,
  selectTotalCount,
  selectPagination,
  selectStatusStats,
  selectTotalStats,
  selectUserSegments,
  selectSearchText,
  selectStatusFilter,
  selectDateRange,
  selectCurrentPage,
  selectPageSize,
  selectUsersLoading,
  selectUsersRefreshing,
  selectUsersError,
  selectHasActiveFilters,
} from '@/modules/admin/users/selectors';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

import { User } from '@/modules/admin/users/types';

// Helper function to format numbers with abbreviations
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

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state selectors
  const users = useSelector(selectUsers);
  const totalCount = useSelector(selectTotalCount);
  const pagination = useSelector(selectPagination);
  const statusStats = useSelector(selectStatusStats);
  const totalStats = useSelector(selectTotalStats);
  const userSegments = useSelector(selectUserSegments);
  const searchText = useSelector(selectSearchText);
  const statusFilter = useSelector(selectStatusFilter);
  const dateRange = useSelector(selectDateRange);
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);
  const loading = useSelector(selectUsersLoading);
  const refreshing = useSelector(selectUsersRefreshing);
  const error = useSelector(selectUsersError);
  const hasActiveFilters = useSelector(selectHasActiveFilters);


  // Effects
  useEffect(() => {
    dispatch(fetchUsersRequest(currentPage, pageSize));
  }, [dispatch, currentPage, pageSize, statusFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== '') {
        dispatch(fetchUsersRequest(1, pageSize));
      } else {
        dispatch(fetchUsersRequest(currentPage, pageSize));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dispatch, searchText, currentPage, pageSize]);

  // Error handling effect
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Event Handlers
  const handleViewDetails = (user: User) => {
    router.push(`/admin/dashboard/users/${user._id}`);
  };

  const handlePageChange = (page: number, size?: number) => {
    dispatch(setCurrentPage(page));
    if (size && size !== pageSize) {
      dispatch(setPageSize(size));
    }
  };
  
  const handleRefresh = () => {
    dispatch(refreshUsersRequest());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
  };

  const handleStatusFilterChange = (value: string) => {
    dispatch(setStatusFilter(value));
  };

  const handleDateRangeChange = (dates: [any, any] | null) => {
    dispatch(setDateRange(dates));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Table Configuration
  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium text-gray-900">{text?.slice(0, 20)}</div>
            <div className="text-sm text-gray-500">
              @{record.telegramUsername || record.telegramId}
            </div>
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
        <span className="font-semibold text-green-600">
          {balance.toLocaleString()} pts
        </span>
      ),
    },
    {
      title: 'Total Earned',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      render: (earned: number) => (
        <span className="font-medium text-blue-600">
          {earned.toLocaleString()} pts
        </span>
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
      render: (date: string) => {
        const getRelativeTime = (dateString: string) => {
          const now = new Date();
          const past = new Date(dateString);
          const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

          if (diffInSeconds < 10) return 'just now';
          if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
          
          const diffInMinutes = Math.floor(diffInSeconds / 60);
          if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
          
          const diffInHours = Math.floor(diffInMinutes / 60);
          if (diffInHours < 24) return `${diffInHours}h ago`;
          
          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 30) return `${diffInDays}d ago`;
          
          const diffInMonths = Math.floor(diffInDays / 30);
          if (diffInMonths < 12) return `${diffInMonths}mo ago`;
          
          const diffInYears = Math.floor(diffInMonths / 12);
          return `${diffInYears}y ago`;
        };

        return (
          <span className="text-gray-600" title={new Date(date).toLocaleString()}>
            {getRelativeTime(date)}
          </span>
        );
      },
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

  // Data is now filtered on the server side, so we use users directly
  const filteredData = users;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div></div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </Button>
          {hasActiveFilters && (
            <Button 
              onClick={handleClearFilters}
              type="default"
            >
              Clear Filters
            </Button>
          )}
         
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(totalCount)}
          </div>
          <div className="text-gray-500">Total Users</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(userSegments.activeUsers || 0)}
          </div>
          <div className="text-gray-500">Active Users</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {formatNumber(userSegments.highEarners || 0)}
          </div>
          <div className="text-gray-500">High Earners</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(userSegments.newUsers || 0)}
          </div>
          <div className="text-gray-500">New Users (30d)</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-cyan-600">
            {formatNumber(totalStats.totalEarnings || 0)}
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
              value={searchText}
              onChange={handleSearchChange}
            />
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
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
              onChange={handleDateRangeChange}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {users.length} of {totalCount} users
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
              current: pagination.currentPage,
              pageSize: pageSize,
              total: pagination.totalCount,
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
