'use client';

import { Button, Card, Input, Switch, Toast, Badge } from "antd-mobile";
import { useState } from "react";
import { SettingOutlined, RobotOutlined, LinkOutlined, PlayCircleOutlined, StopOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SecurityScanOutlined } from "@ant-design/icons";

const initialSettings = {
    appName: 'TaskUp Bot',
    maintenanceMode: false,
    newRegistrations: true,
    autoWithdrawals: true,
    botToken: '',
    botRunning: false,
    webhookUrl: '',
    webhookConfigured: false
};

export const Settings = () => {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleStartBot = async () => {
        if (!settings.botToken) {
            Toast.show({ content: 'Please configure bot token first', icon: 'fail' });
            return;
        }
        setLoading(true);
        try {
            // Simulate API call to start bot
            await new Promise(resolve => setTimeout(resolve, 2000));
            handleSettingChange('botRunning', true);
            Toast.show({ content: 'Bot started successfully', icon: 'success' });
        } catch (error) {
            Toast.show({ content: 'Failed to start bot', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    const handleStopBot = async () => {
        setLoading(true);
        try {
            // Simulate API call to stop bot
            await new Promise(resolve => setTimeout(resolve, 1000));
            handleSettingChange('botRunning', false);
            Toast.show({ content: 'Bot stopped successfully', icon: 'success' });
        } catch (error) {
            Toast.show({ content: 'Failed to stop bot', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfigureWebhook = async () => {
        if (!settings.webhookUrl || !settings.botToken) {
            Toast.show({ content: 'Please configure bot token and webhook URL first', icon: 'fail' });
            return;
        }
        setLoading(true);
        try {
            // Simulate API call to configure webhook
            await new Promise(resolve => setTimeout(resolve, 1500));
            handleSettingChange('webhookConfigured', true);
            Toast.show({ content: 'Webhook configured successfully', icon: 'success' });
        } catch (error) {
            Toast.show({ content: 'Failed to configure webhook', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#8B5CF6' }}>
                        <SettingOutlined style={{ color: 'white', fontSize: '18px' }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: '#1F2937' }}>Settings</h1>
                        <p className="text-sm" style={{ color: '#6B7280' }}>Configure your bot and system settings</p>
                    </div>
                </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="mb-6">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>Bot Status</div>
                                <div className="font-semibold" style={{ color: '#1F2937' }}>Running</div>
                            </div>
                            <Badge 
                                content={settings.botRunning ? 'ON' : 'OFF'} 
                                style={{ 
                                    backgroundColor: settings.botRunning ? '#10B981' : '#EF4444',
                                    color: 'white',
                                    fontSize: '10px'
                                }} 
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>Webhook</div>
                                <div className="font-semibold" style={{ color: '#1F2937' }}>Status</div>
                            </div>
                            <Badge 
                                content={settings.webhookConfigured ? 'OK' : 'NO'} 
                                style={{ 
                                    backgroundColor: settings.webhookConfigured ? '#8B5CF6' : '#F59E0B',
                                    color: 'white',
                                    fontSize: '10px'
                                }} 
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>System</div>
                                <div className="font-semibold" style={{ color: '#1F2937' }}>Mode</div>
                            </div>
                            <Badge 
                                content={settings.maintenanceMode ? 'MAINT' : 'LIVE'} 
                                style={{ 
                                    backgroundColor: settings.maintenanceMode ? '#EF4444' : '#10B981',
                                    color: 'white',
                                    fontSize: '10px'
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* App Configuration */}
                <Card>
                    <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center" style={{ color: '#8B5CF6' }}>
                            <SettingOutlined style={{ marginRight: '8px' }} /> App Configuration
                        </h3>
                    
                    <div className="space-y-4">
                        {/* App Name */}
                        <div>
                            <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>App Name</div>
                            <Input
                                value={settings.appName}
                                onChange={(value) => handleSettingChange('appName', value)}
                                placeholder="Enter app name"
                                style={{ 
                                    backgroundColor: '#F8FAFC',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px'
                                }}
                            />
                            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>Display name for your Telegram bot application</div>
                        </div>
                    </div>
                </div>
            </Card>

                {/* Telegram Bot Configuration */}
                <Card>
                    <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center" style={{ color: '#8B5CF6' }}>
                            <RobotOutlined style={{ marginRight: '8px' }} /> Telegram Bot Setup
                        </h3>
                    
                    <div className="space-y-4">
                        {/* Bot Token */}
                        <div>
                            <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>Bot Token</div>
                            <Input
                                type="password"
                                value={settings.botToken}
                                onChange={(value) => handleSettingChange('botToken', value)}
                                placeholder="Enter your Telegram bot token"
                                style={{ 
                                    backgroundColor: '#F8FAFC',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px'
                                }}
                            />
                            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>Get this from @BotFather on Telegram</div>
                        </div>

                        {/* Bot Status & Controls */}
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
                            <div>
                                <div className="font-medium flex items-center" style={{ color: '#1F2937' }}>
                                    {settings.botRunning ? 
                                        <CheckCircleOutlined style={{ color: '#10B981', marginRight: '8px' }} /> :
                                        <ExclamationCircleOutlined style={{ color: '#EF4444', marginRight: '8px' }} />
                                    }
                                    Bot Status
                                </div>
                                <div className="text-sm" style={{ color: '#6B7280' }}>
                                    {settings.botRunning ? 'Bot is running and accepting commands' : 'Bot is stopped'}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!settings.botRunning ? (
                                    <Button 
                                        size="small" 
                                        onClick={handleStartBot}
                                        loading={loading}
                                        disabled={!settings.botToken}
                                        style={{ 
                                            backgroundColor: '#8B5CF6', 
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <PlayCircleOutlined /> Start Bot
                                    </Button>
                                ) : (
                                    <Button 
                                        size="small" 
                                        onClick={handleStopBot}
                                        loading={loading}
                                        style={{ 
                                            backgroundColor: '#EF4444', 
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <StopOutlined /> Stop Bot
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

                {/* Webhook Configuration */}
                <Card>
                    <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center" style={{ color: '#8B5CF6' }}>
                            <LinkOutlined style={{ marginRight: '8px' }} /> Webhook Setup
                        </h3>
                    
                    <div className="space-y-4">
                        {/* Webhook URL */}
                        <div>
                            <div className="font-medium text-sm mb-2" style={{ color: '#374151' }}>Webhook URL</div>
                            <Input
                                value={settings.webhookUrl}
                                onChange={(value) => handleSettingChange('webhookUrl', value)}
                                placeholder="https://your-domain.com/api/webhook"
                                style={{ 
                                    backgroundColor: '#F8FAFC',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px'
                                }}
                            />
                            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>HTTPS URL where Telegram will send updates</div>
                        </div>

                        {/* Webhook Status & Configuration */}
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
                            <div>
                                <div className="font-medium flex items-center" style={{ color: '#1F2937' }}>
                                    {settings.webhookConfigured ? 
                                        <CheckCircleOutlined style={{ color: '#10B981', marginRight: '8px' }} /> :
                                        <ExclamationCircleOutlined style={{ color: '#F59E0B', marginRight: '8px' }} />
                                    }
                                    Webhook Status
                                </div>
                                <div className="text-sm" style={{ color: '#6B7280' }}>
                                    {settings.webhookConfigured ? 'Webhook is configured and active' : 'Webhook not configured'}
                                </div>
                            </div>
                            <Button 
                                size="small" 
                                onClick={handleConfigureWebhook}
                                loading={loading}
                                disabled={!settings.webhookUrl || !settings.botToken}
                                style={{ 
                                    backgroundColor: '#8B5CF6', 
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px'
                                }}
                            >
                                Configure Webhook
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

                {/* System Settings */}
                <Card>
                    <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center" style={{ color: '#8B5CF6' }}>
                            <SecurityScanOutlined style={{ marginRight: '8px' }} /> System Settings
                        </h3>
                    
                    <div className="space-y-4">
                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between p-3 rounded-lg mb-3" style={{ border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
                            <div>
                                <div className="font-medium text-sm flex items-center" style={{ color: '#374151' }}>
                                    <ExclamationCircleOutlined style={{ color: '#EF4444', marginRight: '6px' }} />
                                    Maintenance Mode
                                </div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>Enable system maintenance</div>
                            </div>
                            <Switch 
                                checked={settings.maintenanceMode}
                                onChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                             
                            />
                        </div>

                        {/* New Registrations */}
                        <div className="flex items-center justify-between p-3 rounded-lg mb-3" style={{ border: '1px solid #E5E7EB', backgroundColor: '#F8FAFC' }}>
                            <div>
                                <div className="font-medium text-sm flex items-center" style={{ color: '#374151' }}>
                                    <CheckCircleOutlined style={{ color: '#10B981', marginRight: '6px' }} />
                                    New Registrations
                                </div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>Allow new user registrations</div>
                            </div>
                            <Switch 
                                checked={settings.newRegistrations}
                                onChange={(checked) => handleSettingChange('newRegistrations', checked)}
                                disabled={settings.maintenanceMode}
                               
                            />
                        </div>

                   

                    </div>
                </div>
            </Card>
            </div>
        </div>
    )
};
