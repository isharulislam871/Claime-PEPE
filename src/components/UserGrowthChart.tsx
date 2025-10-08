'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Select, Spin } from 'antd';
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

interface ChartData {
  date: string;
  users: number;
  cumulative: number;
  label: string;
}

interface UserGrowthChartProps {
  className?: string;
}

export default function UserGrowthChart({ className }: UserGrowthChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');

  const fetchChartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/chart?type=user_growth&days=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data.cumulative);
      } else {
        setError('Failed to fetch chart data');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Error fetching chart data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

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
      <Card title="User Growth" className={`shadow-sm ${className}`}>
        <div className="h-80 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="User Growth" className={`shadow-sm ${className}`}>
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
      title="User Growth" 
      className={`shadow-sm ${className}`}
      extra={
        <Select value={period} onChange={setPeriod} size="small">
          <Option value="7">7 days</Option>
          <Option value="30">30 days</Option>
          <Option value="90">90 days</Option>
        </Select>
      }
    >
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
              dataKey="users" 
              name="Daily Users"
              fill="#3b82f6"
              fillOpacity={0.6}
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulative" 
              name="Cumulative Users"
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
