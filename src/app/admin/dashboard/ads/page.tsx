'use client';

import { useState } from 'react';
import { Card, Typography, message } from 'antd';
import AdsSettings from '@/components/admin/adNetworks';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function AdsPage() {
  const [loading, setLoading] = useState(false);

 
  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <Title level={2} className="!mb-2 text-gray-800">
          Ads Configuration
        </Title>
        <Text className="text-gray-600">
          Configure advertisement settings, rewards, and GigaPub integration for your crypto task app
        </Text>
      </div>

      <AdsSettings  />
    </div>
  );
}
