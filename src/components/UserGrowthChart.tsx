'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Select, Spin } from 'antd';

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

  const maxUsers = Math.max(...data.map(d => d.cumulative));
  const maxDailyUsers = Math.max(...data.map(d => d.users));

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
      <div className="h-80 p-4">
        {/* Chart Area */}
        <div className="relative h-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{maxUsers}</span>
            <span>{Math.round(maxUsers * 0.75)}</span>
            <span>{Math.round(maxUsers * 0.5)}</span>
            <span>{Math.round(maxUsers * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Chart container */}
          <div className="ml-8 h-full relative border-l border-b border-gray-200">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map(percent => (
                <div 
                  key={percent}
                  className="absolute w-full border-t border-gray-100"
                  style={{ bottom: `${percent}%` }}
                />
              ))}
            </div>
            
            {/* Chart bars and line */}
            <div className="absolute inset-0 flex items-end justify-between px-1">
              {data.map((item, index) => {
                const barHeight = maxDailyUsers > 0 ? (item.users / maxDailyUsers) * 60 : 0;
                const lineHeight = maxUsers > 0 ? (item.cumulative / maxUsers) * 100 : 0;
                
                return (
                  <div key={item.date} className="relative flex-1 mx-px group">
                    {/* Daily users bar */}
                    <div 
                      className="bg-blue-200 hover:bg-blue-300 transition-colors rounded-t"
                      style={{ height: `${barHeight}%` }}
                      title={`${item.users} new users on ${item.label}`}
                    />
                    
                    {/* Cumulative line point */}
                    <div 
                      className="absolute w-2 h-2 bg-green-500 rounded-full -ml-1 transform -translate-x-1/2"
                      style={{ bottom: `${lineHeight}%` }}
                      title={`${item.cumulative} total users by ${item.label}`}
                    />
                    
                    {/* Connect line to next point */}
                    {index < data.length - 1 && (
                      <div 
                        className="absolute w-full h-px bg-green-500"
                        style={{ 
                          bottom: `${lineHeight}%`,
                          transform: `rotate(${Math.atan2(
                            (data[index + 1].cumulative - item.cumulative) / maxUsers * 100,
                            100 / data.length
                          )}rad)`
                        }}
                      />
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      <div>{item.label}</div>
                      <div>New: {item.users}</div>
                      <div>Total: {item.cumulative}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
            {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map(item => (
              <span key={item.date}>{item.label}</span>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
            <span>Daily New Users</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Total Users</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
