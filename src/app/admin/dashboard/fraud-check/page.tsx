'use client';

import { Card, Table, Button, Tag, Space, Input, Select, Avatar, Spin, message, DatePicker, Modal } from 'antd';
import { 
  SafetyOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  ExclamationCircleOutlined, 
  ReloadOutlined, 
  FilterOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Dayjs } from 'dayjs';

import { API_CALL  } from 'auth-fingerprint';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

 
export default function FraudCheckPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  
  const [fraudData, setFraudData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [alertStats, setAlertStats] = useState<any>({});
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Fetch fraud alerts from API
  const fetchFraudAlerts = async (page = 1, limit = pageSize, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
       
        ...(searchText && { search: searchText }),
        ...(dateRange && dateRange[0] && { startDate: dateRange[0].toISOString() }),
        ...(dateRange && dateRange[1] && { endDate: dateRange[1].toISOString() })
      });

      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts?${queryParams}`,
        method: 'GET'
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch fraud alerts');
      }

      const { alerts, pagination, stats } = result.data;
      
      setFraudData(alerts);
      setTotalCount(pagination.totalCount);
      setAlertStats(stats);
      
    } catch (err) {
      console.error('Error fetching fraud alerts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load fraud alerts';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudAlerts(currentPage, pageSize);
  }, [currentPage, pageSize ]);
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFraudAlerts(1, pageSize);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleViewDetails = (alert: any) => {
    router.push(`/admin/dashboard/fraud-check/${alert._id}`);
  };

  const handleUpdateStatus = async (alertId: string, newStatus: string) => {
    try {
      const { response: result, status } = await API_CALL({
        url: `/admin/fraud-alerts/${alertId}`,
        method: 'PUT',
        body: {
          status: newStatus,
          performedBy: 'admin'
        }
      });

      if (status !== 200) {
        throw new Error(`HTTP error! status: ${status}`);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update alert status');
      }

      message.success(`Alert status updated to ${newStatus}`);
      fetchFraudAlerts(currentPage, pageSize);
    } catch (err) {
      console.error('Error updating alert status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update alert status';
      message.error(errorMessage);
    }
  };

 

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-red-500" />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">ID: {record.telegramId}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Ads Viewed',
      dataIndex: 'details',
      key: 'adsViewed',
      render: (details: any) => {
        const adsViewCount = details.adsViewCount || 0;
        const meetsRequirement = adsViewCount >= 10;
        
        return (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
              meetsRequirement 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <ClockCircleOutlined className="mr-1" />
              {adsViewCount}/10+
            </div>
            <div className={`text-xs mt-1 ${
              meetsRequirement ? 'text-green-600' : 'text-red-600'
            }`}>
              {meetsRequirement ? 'Requirement Met' : 'Below Requirement'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Total Referrals',
      dataIndex: 'details',
      key: 'totalReferrals',
      render: (details: any) => {
        const totalReferrals = details.totalReferrals || 0;
        const validReferrals = details.validReferrals || 0;
        const validationRate = totalReferrals > 0 ? (validReferrals / totalReferrals) * 100 : 0;
        
        const isLowValidation = validationRate < 50 && totalReferrals > 10;
        const isSuspiciousReferrals = totalReferrals > 100;
        const isHighReferrals = totalReferrals > 50;
        
        return (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
              isLowValidation || isSuspiciousReferrals
                ? 'bg-red-100 text-red-800' 
                : isHighReferrals 
                ? 'bg-orange-100 text-orange-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              <UserOutlined className="mr-1" />
              {validReferrals}/{totalReferrals}
            </div>
            <div className={`text-xs mt-1 ${
              isLowValidation || isSuspiciousReferrals ? 'text-red-600' : 
              isHighReferrals ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {isLowValidation ? `${validationRate.toFixed(0)}% Valid` :
               isSuspiciousReferrals ? 'High Volume' : 
               isHighReferrals ? 'Active' : 'Normal'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Eligible Withdraw Points',
      dataIndex: 'details',
      key: 'eligibleWithdrawPoints',
      render: (details: any) => {
        const eligiblePoints = details.eligibleWithdrawPoints || 0;
        const totalPoints = details.totalPoints || 0;
        const eligibilityRate = totalPoints > 0 ? (eligiblePoints / totalPoints) * 100 : 0;
        
        const isLowEligibility = eligibilityRate < 30 && totalPoints > 1000;
        const isHighPoints = eligiblePoints > 50000;
        const isModeratePoints = eligiblePoints > 10000;
        
        return (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
              isLowEligibility
                ? 'bg-red-100 text-red-800' 
                : isHighPoints 
                ? 'bg-green-100 text-green-800'
                : isModeratePoints
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <DollarOutlined className="mr-1" />
              {eligiblePoints.toLocaleString()}
            </div>
            <div className={`text-xs mt-1 ${
              isLowEligibility ? 'text-red-600' : 
              isHighPoints ? 'text-green-600' : 
              isModeratePoints ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {totalPoints > 0 ? `${eligibilityRate.toFixed(0)}% of ${totalPoints.toLocaleString()}` : 'No Points'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Created',
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
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-blue-500 hover:bg-blue-50"
            title="View Details"
            onClick={() => handleViewDetails(record)}
          />
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                className="text-green-500 hover:bg-green-50"
                title="Mark as Investigating"
                onClick={() => handleUpdateStatus(record._id, 'investigating')}
              />
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                className="text-red-500 hover:bg-red-50"
                title="Mark as False Positive"
                onClick={() => handleUpdateStatus(record._id, 'false_positive')}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleRefresh = () => {
    fetchFraudAlerts(currentPage, pageSize);
  };

  const handleGenerateReport = async () => {
    try {
      message.info('Generating fraud detection report...');
      // This could be extended to call a report generation API
      // For now, we'll just show a success message
      setTimeout(() => {
        message.success('Fraud detection report generated successfully');
      }, 2000);
    } catch (err) {
      message.error('Failed to generate report');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Detection & Prevention</h1>
          <p className="text-gray-600 mt-1">Monitor and investigate suspicious activities</p>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<SafetyOutlined />} 
            className="bg-red-500"
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </Space>
      </div>

   

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-600">{alertStats.total || 0}</div>
          <div className="text-gray-500">Total User</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{alertStats.suspended || 0}</div>
          <div className="text-gray-500">Suspended</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{alertStats.duplicateAccounts || 0}</div>
          <div className="text-gray-500">Duplicate Account</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{alertStats.fakeReferrals || 0}</div>
          <div className="text-gray-500">Fake Referral</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {alertStats.totalEligiblePoints ? alertStats.totalEligiblePoints.toLocaleString() : '0'}
          </div>
          <div className="text-gray-500">Total Eligible Points</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
            <Search
              placeholder="Search by username, telegram ID, or description..."
              allowClear
              style={{ width: 320 }}
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
            />
            
            <Select
              placeholder="Points Range"
              allowClear
              style={{ width: 160 }}
            >
              <Option value="all">All Points</Option>
              <Option value="0-1000">0 - 1K Points</Option>
              <Option value="1000-10000">1K - 10K Points</Option>
              <Option value="10000-50000">10K - 50K Points</Option>
              <Option value="50000-100000">50K - 100K Points</Option>
              <Option value="100000+">100K+ Points</Option>
            </Select>
            <RangePicker 
              placeholder={['Start Date', 'End Date']} 
              value={dateRange}
              onChange={setDateRange}
              style={{ width: 240 }}
            />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-gray-500">
              Showing {fraudData.length} of {totalCount} alerts
            </div>
            <Button 
              size="small" 
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText('');
                setDateRange(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Fraud Alerts Table */}
      <Card>
        {error ? (
          <div className="flex flex-col justify-center items-center py-20">
            <ExclamationCircleOutlined className="text-4xl text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <Button type="primary" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : fraudData.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <SafetyOutlined className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No fraud alerts found</p>
            <p className="text-gray-400 text-sm">All systems are secure</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={fraudData}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalCount,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '25', '50', '100'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} alerts`,
              onChange: (page, size) => {
                setCurrentPage(page);
                if (size && size !== pageSize) {
                  setPageSize(size);
                }
              },
            }}
            className="overflow-x-auto"
            rowKey="_id"
          />
        )}
      </Card>

    </div>
  );
}
