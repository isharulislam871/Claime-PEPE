'use client';

import { Card, Form, Input, InputNumber, Switch, Button, Select, Divider, Tabs, Upload, message, Modal, Table, Tag, Space } from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  UploadOutlined,
  KeyOutlined,
  DollarOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import TelegramBotConfig from '@/components/TelegramBotConfig';
import AdminUsersTable from '@/components/AdminUsersTable';
import GeneralSettings from '@/components/GeneralSettings';
 
 
 
const { TabPane } = Tabs;
 
export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async (formName: string, values: any) => {
    setLoading(true);
    try {
      // Simulate API call for settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`${formName} settings saved successfully!`);
      console.log(`${formName} settings:`, values);
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBotSave = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bot/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Bot settings saved successfully!');
      } else {
        throw new Error('Failed to save bot settings');
      }
    } catch (error) {
      message.error('Failed to save bot settings');
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <Button icon={<DatabaseOutlined />}>
          Backup Settings
        </Button>
      </div>

      <Tabs defaultActiveKey="general" type="card">
        {/* General Settings */}
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              General
            </span>
          } 
          key="general"
        >
          <GeneralSettings 
            onSave={(values) => handleSaveSettings('General', values)}
            loading={loading}
          />
        </TabPane>

   

        {/* Telegram Bot Settings */}
        <TabPane 
          tab={
            <span>
              <RobotOutlined />
              Telegram Bot
            </span>
          } 
          key="bot"
        >
          <TelegramBotConfig 
            onSave={handleBotSave}
            loading={loading}
          />
        </TabPane>

       
        {/* Admin Management */}
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Admin Management
            </span>
          } 
          key="admin"
        >
          <AdminUsersTable 
            onUserAdd={(user) => console.log('User added:', user)}
            onUserEdit={(user) => console.log('User edited:', user)}
            onUserDelete={(userId) => console.log('User deleted:', userId)}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
