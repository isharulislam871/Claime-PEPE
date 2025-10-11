'use client';

import { Card, Table, Button, Tag, Input, DatePicker, Select, Spin, message, Breadcrumb, Statistic, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, TrophyOutlined, SearchOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_CALL } from 'auth-fingerprint';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

interface ReferralUser {
  _id: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  telegramUsername?: string;
  balance: number;
  totalEarned: number;
  referralCount: number;
  isActive: boolean;
  createdAt: string;
  lastActiveAt?: string;
  // Additional fields
  totalAdsViewed?: number;
  totalTasks?: number;
  ipAddress?: string;
  userAgent?: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  averageEarningsPerReferral: number;
  totalAdsViewed: number;
  totalTasks: number;
}

export default function ReferralListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('referralCode');
  
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | []>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch referral data
  const fetchReferrals = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        referralCode: referralCode || '',
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchText,
        status: statusFilter,
      });

      if (dateRange.length === 2) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      }

      const { response, status } = await API_CALL({
        url: `/admin/users/referrals?${params.toString()}`,
        method: 'GET'
      });

      if (status === 200 && response.success) {
        setReferrals(response.data.referrals || []);
        setStats(response.data.stats || null);
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch referrals');
      }
    } catch (err: any) {
      console.error('Error fetching referrals:', err);
      setError('Failed to load referral data');
      message.error('Failed to load referral data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchReferrals(true);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchReferrals();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setDateRange([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (referralCode) {
      fetchReferrals();
    }
  }, [referralCode, currentPage, pageSize]);

  // Table columns
  const columns: ColumnsType<ReferralUser> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <UserOutlined className="text-white" />
          </div>
          <div>
            <div className="font-medium">
              {record.firstName || record.lastName ? 
                `${record.firstName || ''} ${record.lastName || ''}`.trim() : 
                record.username
              }
            </div>
            <div className="text-sm text-gray-500">
              @{record.username} • {record.telegramId}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'orange'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <span className="font-medium text-green-600">
          {formatNumber(balance)} pts
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Total Earned',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      render: (totalEarned: number) => (
        <span className="font-medium text-blue-600">
          {formatNumber(totalEarned)} pts
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Referrals',
      dataIndex: 'referralCount',
      key: 'referralCount',
      render: (count: number) => (
        <span className="font-medium text-purple-600">
          {formatNumber(count)}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Ads Viewed',
      dataIndex: 'totalAdsViewed',
      key: 'totalAdsViewed',
      render: (count: number) => (
        <span className="font-medium text-orange-600">
          {formatNumber(count || 0)}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'Total Tasks',
      dataIndex: 'totalTasks',
      key: 'totalTasks',
      render: (count: number) => (
        <span className="font-medium text-green-600">
          {formatNumber(count || 0)}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string) => (
        <span className="font-mono text-xs text-gray-600">
          {ip || 'Not recorded'}
        </span>
      ),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/users/${record._id}`}>
            <Button size="small" type="primary">
              View Details
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
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
            title: 'Referral List',
          },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/users">
            <Button icon={<ArrowLeftOutlined />}>
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Referral List - {referralCode}
            </h1>
            <p className="text-gray-600">
              Users referred by referral code: {referralCode}
            </p>
          </div>
        </div>
        <Button
          icon={<ReloadOutlined spin={refreshing} />}
          onClick={handleRefresh}
          loading={refreshing}
        >
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Referrals"
                  value={stats.totalReferrals}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Referrals"
                  value={stats.activeReferrals}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Earnings"
                  value={formatNumber(stats.totalEarnings)}
                  suffix="pts"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Avg. per Referral"
                  value={formatNumber(stats.averageEarningsPerReferral)}
                  suffix="pts"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Total Ads Viewed"
                  value={formatNumber(stats.totalAdsViewed || 0)}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#ff7a45' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Total Tasks Completed"
                  value={formatNumber(stats.totalTasks || 0)}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Filters */}
      <Card title="Filters" size="small">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by username or Telegram ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '100%' }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
            <RangePicker
              value={dateRange.length === 2 ? [dateRange[0], dateRange[1]] : undefined}
              onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : [])}
              placeholder={['Start Date', 'End Date']}
              style={{ width: '100%' }}
            />
          <div className="flex gap-2">
            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
              Search
            </Button>
            <Button onClick={clearFilters} type="default">
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card 
        title={`Referrals (${total})`}
        loading={refreshing}
      >
        <Table
          columns={columns}
          dataSource={referrals}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} referrals`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 20);
            },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1600 }}
        />
      </Card>
    </div>
  );
}
