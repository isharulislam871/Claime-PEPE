'use client';

import { Card, Table, Button, Tag, Space, Input, Select, DatePicker, Spin, message, Avatar, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { formatTimestampWithTooltip } from '@/lib/utils/timeFormat';
import { formatNumberWithTooltip } from '@/lib/utils/numberFormat';
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
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import { AppDispatch } from '@/modules/store';
import {
  Activity,
  selectActivities,
  selectActivitiesLoading,
  selectActivitiesError,
  selectActivitiesPagination,
  selectActivitiesSummary,
  selectSearchText,
  selectTypeFilter,
  selectDateRange,
  selectTypeStatsForDisplay,
  selectHasActiveFilters,
  selectCurrentFilters,
  fetchActivitiesRequest,
  setSearchText,
  setTypeFilter,
  setDateRange,
  clearFilters,
  clearActivityError,
} from '@/modules/admin/activities';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ActivitiesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const activitiesData = useSelector(selectActivities);
  const loading = useSelector(selectActivitiesLoading);
  const error = useSelector(selectActivitiesError);
  const pagination = useSelector(selectActivitiesPagination);
  const summary = useSelector(selectActivitiesSummary);
  const searchText = useSelector(selectSearchText);
  const typeFilter = useSelector(selectTypeFilter);
  const dateRange = useSelector(selectDateRange);
  const typeStatsDisplay = useSelector(selectTypeStatsForDisplay);
  const hasActiveFilters = useSelector(selectHasActiveFilters);
  const currentFilters = useSelector(selectCurrentFilters);

  // Destructure pagination and summary
  const { currentPage, pageSize, totalCount } = pagination;
  const { totalRewards, avgReward } = summary;

  // Fetch activities using Redux
  const fetchActivities = (page = 1, limit = pageSize, filters = {}) => {
    dispatch(fetchActivitiesRequest(page, limit, { ...currentFilters, ...filters }));
  };

  // Fetch activities on component mount and when filters change
  useEffect(() => {
    fetchActivities(currentPage, pageSize);
  }, [currentPage, pageSize, typeFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities(1, pageSize);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText]);

  // Error handling
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearActivityError());
    }
  }, [error, dispatch]);

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
              +{reward.toLocaleString()} pts
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
      render: (timestamp: string) => {
        const { relative, absolute } = formatTimestampWithTooltip(timestamp);
        return (
          <Tooltip title={absolute} placement="top">
            <div className="text-sm">
              <div className="text-gray-900 cursor-help">
                {relative}
              </div>
            </div>
          </Tooltip>
        );
      },
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
            title="View Activity Details"
            onClick={() => router.push(`/admin/dashboard/activities/${record._id}`)}
          />
        </Space>
      ),
    },
  ];

  // Data is filtered on server side
  const filteredData = activitiesData;
  
  // Pagination handlers
  const handlePageChange = (page: number, size?: number) => {
    fetchActivities(page, size || pageSize);
  };
  
  const handleRefresh = () => {
    fetchActivities(currentPage, pageSize);
  };

  // Handle search text change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    dispatch(setTypeFilter(value));
  };

  // Handle date range change
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      dispatch(setDateRange([dates[0].toISOString(), dates[1].toISOString()]));
    } else {
      dispatch(setDateRange(null));
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

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
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(totalCount);
            return shouldShowTooltip ? (
              <Tooltip title={`Total: ${full}`} placement="top">
                <div className="text-2xl font-bold text-blue-600 cursor-help">{abbreviated}</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-blue-600">{abbreviated}</div>
            );
          })()}
          <div className="text-gray-500">Total Activities</div>
        </Card>
        <Card className="text-center">
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(typeStatsDisplay.ad_view || 0);
            return shouldShowTooltip ? (
              <Tooltip title={`Ad Views: ${full}`} placement="top">
                <div className="text-2xl font-bold text-orange-600 cursor-help">{abbreviated}</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-orange-600">{abbreviated}</div>
            );
          })()}
          <div className="text-gray-500">Ad Views</div>
        </Card>
        <Card className="text-center">
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(typeStatsDisplay.task_complete || 0);
            return shouldShowTooltip ? (
              <Tooltip title={`Tasks: ${full}`} placement="top">
                <div className="text-2xl font-bold text-blue-600 cursor-help">{abbreviated}</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-blue-600">{abbreviated}</div>
            );
          })()}
          <div className="text-gray-500">Tasks</div>
        </Card>
        <Card className="text-center">
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(typeStatsDisplay.referral || 0);
            return shouldShowTooltip ? (
              <Tooltip title={`Referrals: ${full}`} placement="top">
                <div className="text-2xl font-bold text-purple-600 cursor-help">{abbreviated}</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-purple-600">{abbreviated}</div>
            );
          })()}
          <div className="text-gray-500">Referrals</div>
        </Card>
        <Card className="text-center">
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(totalRewards);
            return shouldShowTooltip ? (
              <Tooltip title={`Total Rewards: ${full}`} placement="top">
                <div className="text-2xl font-bold text-green-600 cursor-help">{abbreviated} pts</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-green-600">{abbreviated} pts</div>
            );
          })()}
          <div className="text-gray-500">Total Rewards</div>
        </Card>
        <Card className="text-center">
          {(() => {
            const { abbreviated, full, shouldShowTooltip } = formatNumberWithTooltip(Math.round(avgReward || 0));
            return shouldShowTooltip ? (
              <Tooltip title={`Average Reward: ${full}`} placement="top">
                <div className="text-2xl font-bold text-cyan-600 cursor-help">{abbreviated} pts</div>
              </Tooltip>
            ) : (
              <div className="text-2xl font-bold text-cyan-600">{abbreviated} pts</div>
            );
          })()}
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
              value={searchText}
              onChange={handleSearchChange}
            />
            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              style={{ width: 150 }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Types</Option>
              <Option value="ad_view">Ad Views</Option>
              <Option value="task_complete">Tasks</Option>
              <Option value="referral">Referrals</Option>
              <Option value="bonus">Bonus</Option>
              <Option value="login">Login</Option>
              <Option value="other">Other</Option>
            </Select>
            <RangePicker 
              placeholder={['Start Date', 'End Date']} 
              value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
              onChange={handleDateRangeChange}
            />
            {hasActiveFilters && (
              <Button 
                onClick={handleClearFilters}
                icon={<ReloadOutlined />}
              >
                Clear Filters
              </Button>
            )}
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
