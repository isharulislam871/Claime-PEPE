'use client';

import { useState, useEffect } from 'react';
import { Card, Select, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const { Option } = Select;

interface AdData {
  date: string;
  adsWatched: number;
  earnings: number;
  activeUsers: number;
  label: string;
}

interface AdPerformanceChartProps {
  className?: string;
}

export default function AdPerformanceChart({ className }: AdPerformanceChartProps) {
  const [data, setData] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/chart?type=ad_performance&days=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data.adPerformance);
      } else {
        setError('Failed to fetch ad performance data');
      }
    } catch (error) {
      console.error('Error fetching ad performance data:', error);
      setError('Error fetching ad performance data');
    } finally {
      setLoading(false);
    }
  };

  const totalAdsWatched = data.reduce((sum, d) => sum + d.adsWatched, 0);
  const totalEarnings = data.reduce((sum, d) => sum + d.earnings, 0);
  const avgDailyViews = data.length > 0 ? Math.round(totalAdsWatched / data.length) : 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format numbers for Y-axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <Card title="Ad Performance" className={`shadow-sm ${className}`}>
        <div className="h-80 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Ad Performance" className={`shadow-sm ${className}`}>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={fetchChartData}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center">
          <EyeOutlined className="mr-2 text-green-500" />
          Ad Performance
        </div>
      }
      className={`shadow-sm ${className}`}
      extra={
        <Select value={period} onChange={setPeriod} size="small">
          <Option value="7">7 days</Option>
          <Option value="30">30 days</Option>
          <Option value="90">90 days</Option>
        </Select>
      }
    >
    

      {/* Chart Area */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              stroke="#666"
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={formatYAxis}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              yAxisId="left"
              dataKey="adsWatched" 
              name="Ad Views"
              fill="#10b981"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="earnings" 
              name="Earnings"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="activeUsers" 
              name="Active Users"
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
