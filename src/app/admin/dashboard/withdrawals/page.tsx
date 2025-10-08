'use client';

import { Card, Table, Button, Tag, Space, Input, Select, Modal, Form, InputNumber, DatePicker, Tooltip, Spin, message, Badge, Progress, Statistic, Row, Col } from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,           
  CopyOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  UserOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FieldTimeOutlined,
  EditOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'antd-mobile';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
import { coinIcons, networkIcons } from '@/lib/networkIcons';
import { AppDispatch } from '@/modules/store';
import {
  fetchWithdrawalsRequest,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
  setWithdrawalFilters,
  clearWithdrawalError,
  setSearchText,
  setStatusFilter,
  setDateRange,
  clearFilters,
  selectWithdrawals,
  selectWithdrawalsLoading,
  selectWithdrawalsError,
  selectStatusStats,
  selectTotalCount,
  selectCurrentPage,
  selectPageSize,
  selectTotalCompletedAmount,
  selectWithdrawalsFilters,
  selectSearchText,
  selectStatusFilter,
  selectDateRange,
  Withdrawal
} from '@/modules/admin/withdrawals';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export default function WithdrawalsPage() {
  
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const withdrawalsData = useSelector(selectWithdrawals);
  const loading = useSelector(selectWithdrawalsLoading);
  const error = useSelector(selectWithdrawalsError);
  const statusStats = useSelector(selectStatusStats);
  const totalCount = useSelector(selectTotalCount);
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);
  const totalCompletedAmount = useSelector(selectTotalCompletedAmount);
  const filters = useSelector(selectWithdrawalsFilters);
  
  // UI state from Redux
  const searchText = useSelector(selectSearchText);
  const statusFilter = useSelector(selectStatusFilter);
  const dateRange = useSelector(selectDateRange);

  // Fetch withdrawals using Redux
  const fetchWithdrawals = (page = 1, limit = pageSize, additionalFilters = {}) => {
    const filters = {
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(searchText && { username: searchText }),
      ...(dateRange && dateRange[0] && dateRange[1] && {
        startDate: dateRange[0],
        endDate: dateRange[1]
      }),
      ...additionalFilters
    };
    
    dispatch(fetchWithdrawalsRequest(page, limit, filters));
  };

  const router = useRouter();

  useEffect(() => {
    fetchWithdrawals(currentPage, pageSize);
  }, [currentPage, pageSize, statusFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWithdrawals(1, pageSize);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText, dispatch, pageSize]);
  
  // Handle Redux errors
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearWithdrawalError());
    }
  }, [error, dispatch]);

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  // Format date with timezone support and relative time
  const formatDateTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();
    const diffInHours = now.diff(date, 'hour');
    
    if (diffInHours < 24) {
      return {
        relative: date.fromNow(),
        absolute: date.format('MMM DD, HH:mm'),
        full: date.format('YYYY-MM-DD HH:mm:ss')
      };
    } else {
      return {
        relative: date.fromNow(),
        absolute: date.format('MMM DD, YYYY HH:mm'),
        full: date.format('YYYY-MM-DD HH:mm:ss')
      };
    }
  };

   

  const columns = [
    {
      title: (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-500" />
          <span>User Information</span>
        </div>
      ),
      key: 'info',
   
      render: (_: any, record: Withdrawal) => (
        <div className="py-2">
          <div className="font-medium text-xs text-gray-900">
            {record.username.length > 10 ? `${record.username.slice(0, 25)}...` : record.username}
            <div className="text-xs text-gray-500">ID: {record.telegramId}</div>
            
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-gray-500" />
          <span>Amount & Currency</span>
        </div>
      ),
      key: 'amount',
      
      render: (_: any, record: Withdrawal) => (
        <div className="py-2">
          <div className="flex items-center gap-2">
            <Image src={coinIcons[record.currency.toLowerCase()]} height={16} width={16}/>
            <span className="font-semibold text-sm text-gray-900">
              {record.amount.toFixed(6)} {record.currency.toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <GlobalOutlined className="text-gray-500" />
          <span>Network</span>
        </div>
      ),
      key: 'method',
   
      render: (_: any, record: Withdrawal) => (
        <div className="flex items-center gap-2 py-2">
          <Image src={networkIcons[record.method.toLowerCase()]} height={16} width={16}/>
          <span className="font-medium text-xs text-gray-800">
            {record.method?.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <WalletOutlined className="text-gray-500" />
          <span>Destination Address</span>
        </div>
      ),
      key: 'wallet',
      
      render: (_: any, record: Withdrawal) => (
        <div className="flex items-center justify-between gap-2 py-2">
          <span className="text-xs font-mono text-gray-700 flex-1 truncate">
            {record.walletId.length > 16 ? `${record.walletId.slice(0, 8)}...${record.walletId.slice(-8)}` : record.walletId}
          </span>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            className="text-xs h-6 px-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
            onClick={() => {
              navigator.clipboard.writeText(record.walletId);
              message.success('Address copied!');
            }}
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <SecurityScanOutlined className="text-gray-500" />
          <span>Status</span>
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string, record: Withdrawal) => {
        const getStatusIcon = (status: string) => {
          switch (status) {
            case 'pending':
              return <ClockCircleOutlined />;
            case 'processing':
              return <SecurityScanOutlined className="animate-spin" />;
            case 'completed':
              return <CheckCircleOutlined />;
            case 'failed':
            case 'cancelled':
              return <CloseCircleOutlined />;
            default:
              return <ClockCircleOutlined />;
          }
        };
        
        return (
          <div className="py-2">
            <Tag 
              color={getStatusColor(status)} 
              icon={getStatusIcon(status)}
              className="px-3 py-1 text-sm font-semibold"
            >
              {status.toUpperCase()}
            </Tag>
            {record.processedAt && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(record.processedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <GlobalOutlined className="text-gray-500" />
          <span>Transaction Hash</span>
        </div>
      ),
      key: 'transaction',
     
      render: (_: any, record: Withdrawal) => (
        <div className="py-2">
          {record.transactionId ? (
            <div className="flex items-center justify-between gap-2 p-2">
              <a
                href={`https://etherscan.io/tx/${record.transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-blue-700 hover:text-blue-800 break-all underline hover:no-underline cursor-pointer flex-1"
                title="Click to view on Etherscan"
              >
                {record.transactionId.length > 12 ? `${record.transactionId.slice(0, 6)}...${record.transactionId.slice(-6)}` : record.transactionId}
              </a>
             
            </div>
          ) : (
            <div className="p-2 text-center">
              <Tag color="warning"  icon={ <ClockCircleOutlined />}>
              No transaction yet
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <FieldTimeOutlined className="text-gray-500" />
          <span>Created At</span>
        </div>
      ),
      key: 'createdAt',
      
      sorter: (a: Withdrawal, b: Withdrawal) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_: any, record: Withdrawal) => {
        const dateInfo = formatDateTime(record.createdAt);
        return (
          <div className="py-2">
           
              <div className=" p-2 transition-colors duration-200 cursor-help">
                <div className="flex items-center gap-2 mb-1">
                  <HistoryOutlined className="text-blue-600 text-xs" />
                  <span className="text-sm font-semibold text-blue-800">
                    {dateInfo.relative}
                  </span>
                </div>
                <div className="text-xs text-gray-600 font-mono">
                  {dateInfo.absolute}
                </div>
            
              </div>
           
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <EditOutlined className="text-gray-500" />
          <span>Updated At</span>
        </div>
      ),
      key: 'updatedAt',
    
      sorter: (a: Withdrawal, b: Withdrawal) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (_: any, record: Withdrawal) => {
        const dateInfo = formatDateTime(record.updatedAt);
        const isRecent = dayjs().diff(dayjs(record.updatedAt), 'hour') < 1;
        const wasUpdated = record.createdAt !== record.updatedAt;
        
        return (
          <div className="py-2">
            
              <div className={` p-2 transition-colors duration-200 cursor-help`}>
                <div className="flex items-center gap-2 mb-1">
                  <EditOutlined className={`${wasUpdated ? 'text-amber-600' : 'text-gray-500'} text-xs`} />
                  <span className={`text-sm font-semibold ${wasUpdated ? 'text-amber-800' : 'text-gray-700'}`}>
                    {dateInfo.relative}
                  </span>
                  {isRecent && wasUpdated && (
                    <Badge 
                      status="processing" 
                      className="animate-pulse"
                      title="Recently updated"
                    />
                  )}
                </div>
                <div className="text-xs text-gray-600 font-mono">
                  {dateInfo.absolute}
                </div>
                {wasUpdated && (
                  <div className="text-xs text-amber-600 mt-1 font-medium">
                    Modified
                  </div>
                )}
                
              </div>
          
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <div className="py-2">
          <Space size="small" direction="vertical" className="flex items-center">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={ () => router.push(`/admin/dashboard/withdrawals/${record._id}`) }
              title="View Details"
            />
            
          </Space>
        </div>
      ),
    },
  ];

  // Data is now filtered on the server side, so we use withdrawalsData directly
  const filteredData = withdrawalsData || [];

  

 

  const handlePageChange = (page: number, size?: number) => {
    fetchWithdrawals(page, size || pageSize);
  };
  
  const handleRefresh = () => {
    fetchWithdrawals(currentPage, pageSize);
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6 space-y-6">

        {/* Binance-style Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Withdrawals</span>}
              value={totalCount}
              prefix={<WalletOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="mt-2 flex items-center text-xs text-green-600">
              <ArrowUpOutlined className="mr-1" />
              +12.5% from last month
            </div>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Pending Review</span>}
              value={statusStats.pending || 0}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="mt-2">
              <Progress percent={((statusStats.pending || 0) / totalCount * 100)} size="small" strokeColor="#fa8c16" />
            </div>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Processing</span>}
              value={statusStats.processing || 0}
              prefix={<SecurityScanOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="mt-2">
              <Progress percent={((statusStats.processing || 0) / totalCount * 100)} size="small" strokeColor="#1890ff" />
            </div>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Completed</span>}
              value={statusStats.completed || 0}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="mt-2 flex items-center text-xs text-green-600">
              <ArrowUpOutlined className="mr-1" />
              +8.2% success rate
            </div>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Volume</span>}
              value={totalCompletedAmount}
              prefix={<DollarOutlined className="text-purple-500" />}
              suffix="USDT"
              precision={2}
              valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
            />
            <div className="mt-2 flex items-center text-xs text-purple-600">
              <ArrowUpOutlined className="mr-1" />
              +15.3% volume growth
            </div>
          </Card>
        </div>

        {/* Binance-style Filters */}
        <Card className="border-0 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
              <div className="relative">
                <Search
                  placeholder="Search by username, ID, or address..."
                  allowClear
                  style={{ width: 320 }}
                  size="large"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={(e) => dispatch(setSearchText(e.target.value))}
                  value={searchText}
                  className="border-gray-300 hover:border-blue-400 focus:border-blue-500"
                />
              </div>
              
              <Select
                value={statusFilter}
                onChange={(value) => dispatch(setStatusFilter(value))}
                style={{ width: 160 }}
                size="large"
                className="border-gray-300"
              >
                <Option value="all">
                  <Space>
                    <FilterOutlined />
                    All Status
                  </Space>
                </Option>
                <Option value="pending">
                  <Space>
                    <ClockCircleOutlined className="text-orange-500" />
                    Pending
                  </Space>
                </Option>
                <Option value="processing">
                  <Space>
                    <SecurityScanOutlined className="text-blue-500" />
                    Processing
                  </Space>
                </Option>
                <Option value="completed">
                  <Space>
                    <CheckCircleOutlined className="text-green-500" />
                    Completed
                  </Space>
                </Option>
                <Option value="failed">
                  <Space>
                    <CloseCircleOutlined className="text-red-500" />
                    Failed
                  </Space>
                </Option>
              </Select>
              
              <RangePicker 
                placeholder={['Start Date', 'End Date']} 
                value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    dispatch(setDateRange([dates[0].toISOString(), dates[1].toISOString()]));
                  } else {
                    dispatch(setDateRange(null));
                  }
                }}
                size="large"
                className="border-gray-300"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                size="small"
                icon={<FilterOutlined />}
                onClick={() => dispatch(clearFilters())}
                disabled={!searchText && statusFilter === 'all' && !dateRange}
                title="Clear all filters"
              >
                Clear Filters
              </Button>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">{withdrawalsData?.length || 0}</span> of <span className="font-medium">{totalCount}</span> withdrawals
              </div>
            </div>
          </div>
        </Card>

        {/* Binance-style Withdrawals Table */}
        <Card className="border-0 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SecurityScanOutlined className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button size="small" icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Spin size="large" />
              <div className="mt-4 text-gray-500">Loading withdrawal data...</div>
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
                pageSizeOptions: ['10', '25', '50', '100', '500'],
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} withdrawal requests`,
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
                className: "border-t border-gray-200"
              }}
              className="overflow-x-auto"
              scroll={{ x: 1400 }}
              rowKey="_id"
              size="middle"
              bordered={false}
              rowClassName={(record, index) => 
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }
            />
          )}
        </Card>

      </div>
    </div>
  );
}
