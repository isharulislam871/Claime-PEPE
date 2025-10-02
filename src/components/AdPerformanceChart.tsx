'use client';

import { useState, useEffect } from 'react';
import { Card, Select, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

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

  const maxAdsWatched = Math.max(...data.map(d => d.adsWatched));
  const maxEarnings = Math.max(...data.map(d => d.earnings));
  const totalAdsWatched = data.reduce((sum, d) => sum + d.adsWatched, 0);
  const totalEarnings = data.reduce((sum, d) => sum + d.earnings, 0);

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
      <div className="h-80 p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="bg-green-50 p-3 rounded">
            <div className="text-2xl font-bold text-green-600">{totalAdsWatched.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Ad Views</div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-2xl font-bold text-blue-600">{totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {data.length > 0 ? Math.round(totalAdsWatched / data.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Daily Views</div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-48">
          {/* Y-axis labels for ads watched */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{maxAdsWatched}</span>
            <span>{Math.round(maxAdsWatched * 0.75)}</span>
            <span>{Math.round(maxAdsWatched * 0.5)}</span>
            <span>{Math.round(maxAdsWatched * 0.25)}</span>
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
            
            {/* Chart bars and earnings line */}
            <div className="absolute inset-0 flex items-end justify-between px-1">
              {data.map((item, index) => {
                const barHeight = maxAdsWatched > 0 ? (item.adsWatched / maxAdsWatched) * 100 : 0;
                const earningsHeight = maxEarnings > 0 ? (item.earnings / maxEarnings) * 100 : 0;
                
                return (
                  <div key={item.date} className="relative flex-1 mx-px group">
                    {/* Ad views bar */}
                    <div 
                      className="bg-green-400 hover:bg-green-500 transition-colors rounded-t"
                      style={{ height: `${barHeight}%` }}
                      title={`${item.adsWatched} ads watched on ${item.label}`}
                    />
                    
                    {/* Earnings line point */}
                    <div 
                      className="absolute w-2 h-2 bg-blue-500 rounded-full -ml-1 transform -translate-x-1/2"
                      style={{ bottom: `${earningsHeight}%` }}
                      title={`${item.earnings} PEPE earned on ${item.label}`}
                    />
                    
                    {/* Connect earnings line to next point */}
                    {index < data.length - 1 && (
                      <div 
                        className="absolute w-full h-px bg-blue-500"
                        style={{ 
                          bottom: `${earningsHeight}%`,
                          transform: `rotate(${Math.atan2(
                            (data[index + 1].earnings - item.earnings) / maxEarnings * 100,
                            100 / data.length
                          )}rad)`
                        }}
                      />
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      <div>{item.label}</div>
                      <div>Views: {item.adsWatched}</div>
                      <div>Earnings: {item.earnings}</div>
                      <div>Active: {item.activeUsers}</div>
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
            <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
            <span>Ad Views</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Earnings (PEPE)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
