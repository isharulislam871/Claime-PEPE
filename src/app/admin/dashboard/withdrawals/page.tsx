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
import { useEffect, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { fetchWithdrawalsRequest, setStatusFilter, setSearchText, setDateRange, clearFilters } from '@/modules/admin/withdrawals/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/modules/store';
// Types
interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
}

 

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
 

export default function WithdrawalsPage() {
  
  
  const dispatch = useDispatch<AppDispatch>();
  const { withdrawals, pagination, summary, searchText, statusFilter, dateRange  , loading } = useSelector((state: RootState) => state.admin.withdrawals);

  useEffect(() => {
    dispatch(fetchWithdrawalsRequest(1, 25));
  }, [dispatch]);
 
  const router = useRouter();

 
  

  // Memoized utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  }, []);

  // Format date with timezone support and relative time - memoized
  const formatDateTime = useCallback((dateString: string) => {
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
  }, []);

   

  // Memoized columns array to prevent re-renders
  const columns = useMemo(() => [
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
  ], [formatDateTime, getStatusColor, router]);

 
 

  const handleStatusChange = useCallback((value: string) => {
    dispatch(setStatusFilter(value));
    dispatch(fetchWithdrawalsRequest(1, pagination?.pageSize || 25, { status: value }));
  }, [dispatch, pagination?.pageSize]);

  const handleDateRangeChange = useCallback((dates: any) => {
    const dateRange = dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] as [string, string] : null;
    dispatch(setDateRange(dateRange));
    dispatch(fetchWithdrawalsRequest(1, pagination?.pageSize || 25, { 
      status: statusFilter, 
      startDate: dateRange?.[0], 
      endDate: dateRange?.[1] 
    }));
  }, [dispatch, pagination?.pageSize, statusFilter]);

  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchText(value));
    dispatch(fetchWithdrawalsRequest(1, pagination?.pageSize || 25, { 
      status: statusFilter, 
      username: value,
      startDate: dateRange?.[0], 
      endDate: dateRange?.[1] 
    }));
  }, [dispatch, pagination?.pageSize, statusFilter, dateRange]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    dispatch(fetchWithdrawalsRequest(1, pagination?.pageSize || 25));
  }, [dispatch, pagination?.pageSize]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchWithdrawalsRequest(
      pagination?.currentPage || 1, 
      pagination?.pageSize || 25, 
      { 
        status: statusFilter, 
        username: searchText,
        startDate: dateRange?.[0], 
        endDate: dateRange?.[1] 
      }
    ));
  }, [dispatch, pagination?.currentPage, pagination?.pageSize, statusFilter, searchText, dateRange]);
  

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6 space-y-6">

        {/* Binance-style Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Spin spinning={loading} size="small">
              <Statistic
                title={<span className="text-gray-600 font-medium">Total Withdrawals</span>}
                value={pagination?.totalCount || 0}
                prefix={<WalletOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Spin>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Spin spinning={loading} size="small">
              <Statistic
                title={<span className="text-gray-600 font-medium">Pending Review</span>}
                value={summary?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0}
                prefix={<ClockCircleOutlined className="text-orange-500" />}
                valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div className="mt-2">
                <Progress 
                  percent={pagination?.totalCount ? Math.round((summary?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0) / pagination.totalCount * 100) : 0} 
                  size="small" 
                  strokeColor="#fa8c16" 
                />
              </div>
            </Spin>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Spin spinning={loading} size="small">
              <Statistic
                title={<span className="text-gray-600 font-medium">Processing</span>}
                value={summary?.statusBreakdown?.find(s => s._id === 'processing')?.count || 0}
                prefix={<SecurityScanOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div className="mt-2">
                <Progress 
                  percent={pagination?.totalCount ? Math.round((summary?.statusBreakdown?.find(s => s._id === 'processing')?.count || 0) / pagination.totalCount * 100) : 0} 
                  size="small" 
                  strokeColor="#1890ff" 
                />
              </div>
            </Spin>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Spin spinning={loading} size="small">
              <Statistic
                title={<span className="text-gray-600 font-medium">Completed</span>}
                value={summary?.statusBreakdown?.find(s => s._id === 'completed')?.count || 0}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpOutlined className="mr-1" />
                {pagination?.totalCount ? Math.round((summary?.statusBreakdown?.find(s => s._id === 'completed')?.count || 0) / pagination.totalCount * 100) : 0}% success rate
              </div>
            </Spin>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <Spin spinning={loading} size="small">
              <Statistic
                title={<span className="text-gray-600 font-medium">Total Volume</span>}
                value={summary?.totalCompletedAmount || 0}
                prefix={<DollarOutlined className="text-purple-500" />}
                suffix="USDT"
                precision={2}
                valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div className="mt-2 flex items-center text-xs text-purple-600">
                <ArrowUpOutlined className="mr-1" />
                Completed withdrawals only
              </div>
            </Spin>
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
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onSearch={handleSearchChange}
                  className="border-gray-300 hover:border-blue-400 focus:border-blue-500"
                />
              </div>
              
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
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
                onChange={handleDateRangeChange}
                size="large"
                className="border-gray-300"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                size="small"
                icon={<FilterOutlined />}
                onClick={handleClearFilters}
                disabled={!searchText && statusFilter === 'all' && !dateRange}
                title="Clear all filters"
              >
                Clear Filters
              </Button>
              
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
              <Button 
                size="small" 
                icon={<ReloadOutlined className={loading ? 'animate-spin' : ''} />} 
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          
         
            <Table
              columns={columns}
              dataSource={withdrawals}
              loading={loading}
              pagination={{
                current: pagination?.currentPage || 1,
                pageSize: pagination?.pageSize || 25,
                total: pagination?.totalCount || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} withdrawals`,
                pageSizeOptions: ['10', '25', '50', '100'],
                onChange: (page, pageSize) => {
                  dispatch(fetchWithdrawalsRequest(page, pageSize));
                },
                onShowSizeChange: (current, size) => {
                  dispatch(fetchWithdrawalsRequest(1, size));
                }
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
       
        </Card>

      </div>
    </div>
  );
}
