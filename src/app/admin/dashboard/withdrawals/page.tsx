'use client';

import { Card, Table, Button, Tag, Space, Input, Select, Modal, Form, InputNumber, DatePicker, Tooltip, Spin, message } from 'antd';
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
  ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface Withdrawal {
  _id: string;
  userId: string;
  telegramId: string;
  username: string;
  amount: number;
  method: string;
  walletId: string;
  currency: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  processedAt : Date;
}

export default function WithdrawalsPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [withdrawalsData, setWithdrawalsData] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [totalCount, setTotalCount] = useState(0);
  const [statusStats, setStatusStats] = useState<any>({});
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  // Fetch withdrawals from API
  const fetchWithdrawals = async (page = 1, limit = pageSize, filters = {}) => {
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
      
      const response = await fetch(`/api/admin/withdrawals?${params}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setWithdrawalsData(data.data.withdrawals);
        setTotalCount(data.data.pagination.totalCount);
        setCurrentPage(data.data.pagination.currentPage);
        
        // Update stats from API response
        const stats = data.data.summary.statusBreakdown.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
        setStatusStats(stats);
        setTotalCompletedAmount(data.data.summary.totalCompletedAmount);
      } else {
        throw new Error('Failed to fetch withdrawals');
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setError('Failed to load withdrawals');
      message.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(currentPage, pageSize);
  }, [currentPage, pageSize, statusFilter, dateRange]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== '') {
        fetchWithdrawals(1, pageSize);
      } else {
        fetchWithdrawals(currentPage, pageSize);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText]);

  

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

  const columns = [
    {
      title: 'Withdrawal Info',
      key: 'info',
      render: (_: any, record: Withdrawal) => (
        <div>
          
          <div className="text-sm text-gray-500 mt-1">
            User: {record.username} ({record.telegramId})
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(record.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_: any, record: Withdrawal) => (
        <div>
          <div className="font-semibold text-lg text-green-600">
            {record.amount.toFixed(2)} {record.currency.toUpperCase()}
          </div>
          <div className="text-sm text-gray-500">{record.method}</div>
        </div>
      ),
    },
    {
      title: 'Wallet Details',
      key: 'wallet',
      render: (_: any, record: Withdrawal) => (
        <div>
          <div className="font-medium text-gray-900">{record.method}</div>
          <div className="text-sm text-gray-500 font-mono">
            {record.walletId.length > 20 ? `${record.walletId.slice(0, 20)}...` : record.walletId}
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              className="ml-1"
              onClick={() => navigator.clipboard.writeText(record.walletId)}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Withdrawal) => (
        <div>
          <Tag color={getStatusColor(status)} className="mb-1">
            {status.toUpperCase()}
          </Tag>
          {record.processedAt && (
            <div className="text-xs text-gray-500">
              Processed: {new Date(record.processedAt).toLocaleDateString()}
            </div>
          )}
         
        </div>
      ),
    },
    {
      title: 'Transaction',
      key: 'transaction',
      render: (_: any, record: Withdrawal) => (
        <div>
          {record.transactionId ? (
            <div className="text-sm font-mono text-blue-600">
              {record.transactionId.length > 15 ? `${record.transactionId.slice(0, 15)}...` : record.transactionId}
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                className="ml-1"
                onClick={() => navigator.clipboard.writeText(record.transactionId!)}
              />
            </div>
          ) : (
            <span className="text-gray-400 text-sm">No transaction yet</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-500 hover:bg-blue-50"
              onClick={() => showWithdrawalDetails(record)}
              title="View Details"
            />
            {record.status === 'pending' && (
              <>
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  className="text-green-500 hover:bg-green-50"
                  onClick={() => handleApprove(record)}
                  title="Approve"
                />
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleReject(record)}
                  title="Reject"
                />
              </>
            )}
          </Space>
        </Space>
      ),
    },
  ];

  // Data is now filtered on the server side, so we use withdrawalsData directly
  const filteredData = withdrawalsData;

  const showWithdrawalDetails = (withdrawal: any) => {
    router.push(`/admin/dashboard/withdrawals/${withdrawal._id}`);
  };

  const handleApprove = (record: any) => {
    confirm({
      title: 'Approve Withdrawal',
      icon: <CheckCircleOutlined />,
      content: `Are you sure you want to approve withdrawal ${record.id} for ${record.amount}?`,
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        console.log('Approved:', record.id);
        // Here you would update the withdrawal status
      },
    });
  };

  const handleReject = (record: any) => {
    confirm({
      title: 'Reject Withdrawal',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to reject withdrawal ${record.id}? Please provide a reason.`,
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('Rejected:', record.id);
        // Here you would update the withdrawal status
      },
    });
  };

  // Stats are now provided by the API
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };
  
  const handleRefresh = () => {
    fetchWithdrawals(currentPage, pageSize);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
          <p className="text-gray-600 mt-1">Review and process user withdrawal requests</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button icon={<DollarOutlined />}>
            Export Report
          </Button>
          <Button type="primary" icon={<WalletOutlined />} className="bg-blue-500">
            Bulk Process
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
          <div className="text-gray-500">Total Requests</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{statusStats.pending || 0}</div>
          <div className="text-gray-500">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{statusStats.completed || 0}</div>
          <div className="text-gray-500">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-cyan-600">{statusStats.processing || 0}</div>
          <div className="text-gray-500">Processing</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{totalCompletedAmount.toLocaleString()}</div>
          <div className="text-gray-500">Total USDT</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Search
              placeholder="Search withdrawals..."
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
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="processing">Processing</Option>
              <Option value="completed">Completed</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <RangePicker 
              placeholder={['Start Date', 'End Date']} 
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {withdrawalsData.length} of {totalCount} withdrawals
          </div>
        </div>
      </Card>

      {/* Withdrawals Table */}
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
                `${range[0]}-${range[1]} of ${total} withdrawals`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            className="overflow-x-auto"
            scroll={{ x: 1200 }}
            rowKey="_id"
          />
        )}
      </Card>

      {/* Withdrawal Details Modal */}
      <Modal
        title="Withdrawal Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          selectedWithdrawal?.status === 'pending' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleApprove(selectedWithdrawal)}
              className="bg-green-500"
            >
              Approve
            </Button>
          ),
          selectedWithdrawal?.status === 'pending' && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleReject(selectedWithdrawal)}
            >
              Reject
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Withdrawal ID</label>
                <div className="text-lg font-semibold">{'selectedWithdrawal.id'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div>
                  <Tag color={getStatusColor(selectedWithdrawal.status)} className="text-sm">
                    {selectedWithdrawal.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">User</label>
                <div className="font-medium">{selectedWithdrawal.username}</div>
                <div className="text-sm text-gray-500">ID: {selectedWithdrawal.telegramId}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <div className="text-lg font-semibold text-green-600">{selectedWithdrawal.amount}</div>
                <div className="text-sm text-gray-500">{'selectedWithdrawal.amountUSD'}</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Wallet Address</label>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                {'selectedWithdrawal.walletAddress'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Wallet Type: {'selectedWithdrawal.walletType'}</div>
            </div>

            {selectedWithdrawal.transactionId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {selectedWithdrawal.transactionId}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Request Date</label>
                <div>{'selectedWithdrawal.requestDate'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Processing Time</label>
                <div>'selectedWithdrawal.processingTime' ||{ 'Not processed yet'}</div>
              </div>
            </div>

            
          </div>
        )}
      </Modal>
    </div>
  );
}
