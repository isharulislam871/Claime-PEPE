'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Progress, Alert, Spin, Timeline } from 'antd';
import {
  ToolOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  estimatedCompletion: string | null;
  progress: number;
  currentStep: string;
  lastUpdated: string;
}

export default function MaintenancePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceStatus | null>(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchMaintenanceStatus();
    
    // Check status every 30 seconds
    const statusTimer = setInterval(fetchMaintenanceStatus, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (response.ok) {
        const data = await response.json();
        const maintenance = data.maintenance;
        
        // If maintenance is disabled or complete (100%), redirect to home
        if (!maintenance.enabled || maintenance.progress >= 100) {
          //router.push('/');
          return;
        }
        
        setMaintenanceData(maintenance);
      }
    } catch (error) {
     
    } 
  };

  const getTimeRemaining = () => {
    if (!maintenanceData?.estimatedCompletion) return '';
    
    const completion = new Date(maintenanceData.estimatedCompletion);
    const diff = completion.getTime() - currentTime.getTime();
    
    if (diff <= 0) return 'Completing soon...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <ToolOutlined className="text-3xl text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            System Maintenance
          </h1>
          <p className="text-lg text-gray-600">
            We're working hard to improve your experience
          </p>
        </div>

        {/* Status Alert */}
        <Alert
          message="Scheduled Maintenance in Progress"
          description={maintenanceData?.message || "Our team is currently performing system upgrades."}
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Progress Overview */}
        <Card className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Maintenance Progress
            </h3>
            <Progress
              type="circle"
              percent={maintenanceData?.progress || 0}
              size={120}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div className="mt-3 text-gray-600">
              {maintenanceData?.currentStep || 'Preparing...'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ClockCircleOutlined className="text-blue-500 mr-2" />
                <span className="font-semibold">Current Time</span>
              </div>
              <div className="text-lg font-mono text-gray-700">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ExclamationCircleOutlined className="text-orange-500 mr-2" />
                <span className="font-semibold">Estimated Completion</span>
              </div>
              <div className="text-lg font-mono text-gray-700">
                {getTimeRemaining()}
              </div>
            </div>
          </div>
        </Card>


        {/* Information Section */}
        <Card title="What's Being Updated?" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Performance Improvements</h4>
                <p className="text-gray-600">Optimizing database queries and server response times</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">New Features</h4>
                <p className="text-gray-600">Adding enhanced task management and user analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Security Updates</h4>
                <p className="text-gray-600">Implementing latest security patches and protocols</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900">UI/UX Enhancements</h4>
                <p className="text-gray-600">Improving user interface and experience</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Assistance?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have any urgent questions or concerns, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                size="large"
                className="bg-blue-500"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                size="large"
                onClick={() => window.location.reload()}
              >
                Check Status
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Thank you for your patience while we improve our services.</p>
          <p className="mt-1">
            Last updated: {maintenanceData?.lastUpdated ? 
              new Date(maintenanceData.lastUpdated).toLocaleString() : 
              currentTime.toLocaleString()
            }
          </p>
        </div>
      </div>
    </div>
  );
}
