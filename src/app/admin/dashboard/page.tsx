'use client';

import { Card, Col, Row, Statistic, Layout, Spin } from 'antd';
import {
  TeamOutlined,
  EyeOutlined,
  DollarOutlined,
  WalletOutlined,
  
} from '@ant-design/icons';

const { Content } = Layout;
import { useState, useEffect } from 'react';
import UserGrowthChart from '@/components/UserGrowthChart';
import AdPerformanceChart from '@/components/AdPerformanceChart';
import { useSocket } from '@/components/SocketProvider';

interface AdminStats {
  users: {
    total: number;
    active: number;
    todayRegistered: number;
    inactive: number;
  };
  withdrawals: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
  };
  pepe: {
    totalDistributed: number;
    todayAdsViewed: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchAdminStats();
    
    if (socket && isConnected) {
      // Join admin room for real-time updates
      socket.emit('join_admin', { adminId: 'admin_dashboard' });
      
      // Listen for real-time stats updates
      socket.on('admin_stats_update', (data: { stats: AdminStats; timestamp: Date }) => {
        console.log('Real-time stats update:', data);
        setStats(data.stats);
        setError(null);
      });

      // Listen for stats change triggers
      socket.on('stats_changed', () => {
        console.log('Stats changed, requesting update');
        socket.emit('admin_stats_request');
      });

      // Listen for stats errors
      socket.on('admin_stats_error', (data: { error: string; timestamp: Date }) => {
        console.error('Stats error:', data);
        setError(data.error);
      });

      // Request initial stats via Socket.IO
      socket.emit('admin_stats_request');
    }

    // Cleanup socket listeners on component unmount
    return () => {
      if (socket) {
        socket.off('admin_stats_update');
        socket.off('stats_changed');
        socket.off('admin_stats_error');
      }
    };
  }, [socket, isConnected]);

  const fetchAdminStats = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }
      setError(null);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Error fetching statistics');
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <Content className="min-h-screen bg-gray-50 p-0 flex-1">
        <div className="w-full h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="min-h-screen bg-gray-50 p-0 flex-1">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => fetchAdminStats()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Content>
    );
  }

  return (
    <Content className="min-h-screen bg-gray-50 p-0 flex-1">
      <div className="w-full h-full p-6 space-y-6">
        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <Statistic
                  title="Total Users"
                  value={formatNumber(stats?.users.total || 0)}
                  valueStyle={{ color: '#1f2937' }}
                />
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TeamOutlined className="text-blue-500 text-xl" />
                </div>
              </div>
              <p className="text-green-500 text-sm mt-2">+{stats?.users.todayRegistered || 0} today</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <Statistic
                  title="Ads Viewed Today"
                  value={formatNumber(stats?.pepe.todayAdsViewed || 0)}
                  valueStyle={{ color: '#1f2937' }}
                />
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <EyeOutlined className="text-green-500 text-xl" />
                </div>
              </div>
              <p className="text-green-500 text-sm mt-2">{stats?.users.active || 0} active users</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <Statistic
                  title="Total Pts Distributed"
                  value={formatNumber(stats?.pepe.totalDistributed || 0)}
                  valueStyle={{ color: '#1f2937' }}
                />
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <WalletOutlined className="text-yellow-500 text-xl" />
                </div>
              </div>
              <p className="text-yellow-500 text-sm mt-2">{stats?.withdrawals.completed || 0} completed withdrawals</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <Statistic
                  title="Pending Withdrawals"
                  value={stats?.withdrawals.pending || 0}
                  valueStyle={{ color: '#1f2937' }}
                />
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <DollarOutlined className="text-red-500 text-xl" />
                </div>
              </div>
              <p className="text-red-500 text-sm mt-2">{stats?.withdrawals.failed || 0} failed withdrawals</p>
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UserGrowthChart />
          <AdPerformanceChart />
        </div>

  
      </div>
    </Content>
  );
}
