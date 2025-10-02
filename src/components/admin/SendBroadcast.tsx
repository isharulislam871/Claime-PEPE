'use client';

import { SendOutlined, BellOutlined, UserOutlined, TeamOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Input, TextArea, Selector, SearchBar, Toast } from "antd-mobile";
import { useState } from "react";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'sent': return '#10B981';
        case 'scheduled': return '#F59E0B';
        case 'draft': return '#6B7280';
        case 'failed': return '#EF4444';
        default: return '#6B7280';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'sent': return <CheckCircleOutlined />;
        case 'scheduled': return <ClockCircleOutlined />;
        case 'draft': return <ExclamationCircleOutlined />;
        case 'failed': return <ExclamationCircleOutlined />;
        default: return <BellOutlined />;
    }
};

const broadcastHistory = [
    {
        id: '1',
        title: 'New Task Categories Available!',
        message: 'We\'ve added exciting new task categories including Gaming, Social Media, and Shopping. Check them out now and earn more rewards!',
        targetAudience: 'All Users',
        sentDate: '2024-01-15T10:30:00Z',
        status: 'sent',
        recipients: 15420,
        opened: 12336,
        clicked: 8924,
        type: 'announcement'
    },
    {
        id: '2',
        title: 'Maintenance Notice',
        message: 'Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM UTC. The app will be temporarily unavailable during this time.',
        targetAudience: 'All Users',
        sentDate: '2024-01-14T16:45:00Z',
        status: 'sent',
        recipients: 15420,
        opened: 14230,
        clicked: 2145,
        type: 'maintenance'
    },
    {
        id: '3',
        title: 'Weekly Bonus Rewards',
        message: 'Complete 10 tasks this week and get 50% bonus rewards! Limited time offer ending Sunday.',
        targetAudience: 'Active Users',
        sentDate: '2024-01-16T09:00:00Z',
        status: 'scheduled',
        recipients: 8750,
        opened: 0,
        clicked: 0,
        type: 'promotion'
    },
    {
        id: '4',
        title: 'Welcome New Users!',
        message: 'Welcome to TaskUp! Complete your first task to earn 100 bonus points. Get started now!',
        targetAudience: 'New Users',
        sentDate: '2024-01-13T14:20:00Z',
        status: 'sent',
        recipients: 234,
        opened: 198,
        clicked: 156,
        type: 'welcome'
    },
    {
        id: '5',
        title: 'Payment System Update',
        message: 'We\'ve improved our withdrawal system for faster processing. New minimum withdrawal limits apply.',
        targetAudience: 'Premium Users',
        sentDate: '2024-01-12T11:15:00Z',
        status: 'failed',
        recipients: 2340,
        opened: 0,
        clicked: 0,
        type: 'update'
    }
];

const audienceOptions = [
    { label: 'All Users', value: 'all' },
    { label: 'Active Users (Last 7 days)', value: 'active' },
    { label: 'New Users (Last 30 days)', value: 'new' },
    { label: 'Premium Users', value: 'premium' },
    { label: 'Inactive Users (30+ days)', value: 'inactive' },
    { label: 'High Earners (1000+ points)', value: 'high_earners' }
];

const messageTypeOptions = [
    { label: 'Announcement', value: 'announcement' },
    { label: 'Promotion', value: 'promotion' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Welcome', value: 'welcome' },
    { label: 'Update', value: 'update' },
    { label: 'Alert', value: 'alert' }
];

export const SendBroadcast = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedAudience, setSelectedAudience] = useState(['all']);
    const [selectedType, setSelectedType] = useState(['announcement']);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    const filteredBroadcasts = broadcastHistory.filter(broadcast => 
        broadcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broadcast.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broadcast.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broadcast.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendBroadcast = () => {
        if (!title.trim() || !message.trim()) {
            Toast.show({
                content: 'Please fill in both title and message',
                icon: 'fail'
            });
            return;
        }

        const isScheduled = scheduleDate && scheduleTime;
        
        Toast.show({
            content: isScheduled ? 'Broadcast scheduled successfully!' : 'Broadcast sent successfully!',
            icon: 'success'
        });

        // Reset form
        setTitle('');
        setMessage('');
        setScheduleDate('');
        setScheduleTime('');
    };

    const getAudienceCount = (audience: string) => {
        switch (audience) {
            case 'all': return 15420;
            case 'active': return 8750;
            case 'new': return 1240;
            case 'premium': return 2340;
            case 'inactive': return 3890;
            case 'high_earners': return 1850;
            default: return 0;
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>
                    Send Broadcast
                </h2>
            </div>

            {/* Compose Broadcast */}
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #F3F4F6' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#374151' }}>
                    <BellOutlined /> Compose New Broadcast
                </h3>

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Broadcast Title
                    </label>
                    <Input
                        placeholder="Enter broadcast title..."
                        value={title}
                        onChange={setTitle}
                        style={{
                            '--border-color': '#D1D5DB',
                            '--placeholder-color': '#9CA3AF'
                        } as any}
                    />
                </div>

                {/* Message Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Message Content
                    </label>
                    <TextArea
                        placeholder="Enter your broadcast message..."
                        value={message}
                        onChange={setMessage}
                        rows={4}
                        style={{
                            '--border-color': '#D1D5DB',
                            '--placeholder-color': '#9CA3AF'
                        } as any}
                    />
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                        {message.length}/500 characters
                    </div>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Target Audience
                    </label>
                    <Selector
                        options={audienceOptions}
                        value={selectedAudience}
                        onChange={setSelectedAudience}
                        style={{
                            '--border': '1px solid #D1D5DB',
                            '--border-radius': '8px'
                        } as any}
                    />
                    <div className="text-xs mt-1" style={{ color: '#10B981' }}>
                        Estimated recipients: {getAudienceCount(selectedAudience[0]).toLocaleString()} users
                    </div>
                </div>

                {/* Message Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        Message Type
                    </label>
                    <Selector
                        options={messageTypeOptions}
                        value={selectedType}
                        onChange={setSelectedType}
                        style={{
                            '--border': '1px solid #D1D5DB',
                            '--border-radius': '8px'
                        } as any}
                    />
                </div>

                {/* Schedule Options */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                        <CalendarOutlined /> Schedule (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="date"
                            placeholder="Select date"
                            value={scheduleDate}
                            onChange={setScheduleDate}
                            style={{
                                '--border-color': '#D1D5DB'
                            } as any}
                        />
                        <Input
                            type="time"
                            placeholder="Select time"
                            value={scheduleTime}
                            onChange={setScheduleTime}
                            style={{
                                '--border-color': '#D1D5DB'
                            } as any}
                        />
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                        Leave empty to send immediately
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button 
                        color="primary" 
                        onClick={handleSendBroadcast}
                        style={{ 
                            backgroundColor: '#10B981', 
                            borderColor: '#10B981',
                            flex: 1
                        }}
                    >
                        <SendOutlined /> {scheduleDate && scheduleTime ? 'Schedule Broadcast' : 'Send Now'}
                    </Button>
                    <Button 
                        fill="outline"
                        onClick={() => {
                            setTitle('');
                            setMessage('');
                            setScheduleDate('');
                            setScheduleTime('');
                        }}
                        style={{ 
                            borderColor: '#D1D5DB',
                            color: '#6B7280'
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#10B981' }}>
                        {broadcastHistory.filter(b => b.status === 'sent').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Sent</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>
                        {broadcastHistory.filter(b => b.status === 'scheduled').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Scheduled</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#EF4444' }}>
                        {broadcastHistory.filter(b => b.status === 'failed').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Failed</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#10B981' }}>
                        {Math.round(broadcastHistory.reduce((sum, b) => sum + (b.opened / Math.max(b.recipients, 1)), 0) / broadcastHistory.length * 100)}%
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Avg Open Rate</div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                <SearchBar
                    placeholder="Search broadcast history..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    style={{
                        '--background': '#FFFFFF',
                        '--border-radius': '8px',
                        '--placeholder-color': '#9CA3AF'
                    } as any}
                    showCancelButton={() => true}
                    onCancel={() => setSearchQuery('')}
                />
            </div>

            {/* Broadcast History */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                {/* Header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: '#F3F4F6', backgroundColor: '#FAFAFA' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#374151' }}>Broadcast History</h3>
                </div>

                {/* List Items */}
                <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                    {filteredBroadcasts.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <BellOutlined style={{ fontSize: '24px' }} />
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                No broadcasts found matching "{searchQuery}"
                            </div>
                        </div>
                    ) : (
                        filteredBroadcasts.map((broadcast) => (
                            <div key={broadcast.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                                {/* Main Row */}
                                <div className="flex items-center justify-between mb-3">
                                    {/* Left: Broadcast Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
                                            style={{ backgroundColor: getStatusColor(broadcast.status) }}
                                        >
                                            {getStatusIcon(broadcast.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-base" style={{ color: '#111827' }}>
                                                    {broadcast.title}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                    backgroundColor: broadcast.type === 'announcement' ? '#DBEAFE' : 
                                                                    broadcast.type === 'promotion' ? '#DCFCE7' : 
                                                                    broadcast.type === 'maintenance' ? '#FEF3C7' : '#F3E8FF',
                                                    color: broadcast.type === 'announcement' ? '#1E40AF' : 
                                                           broadcast.type === 'promotion' ? '#166534' : 
                                                           broadcast.type === 'maintenance' ? '#92400E' : '#6B21A8'
                                                }}>
                                                    {broadcast.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                                {broadcast.targetAudience} • {new Date(broadcast.sentDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status */}
                                    <div className="text-right">
                                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ 
                                            backgroundColor: broadcast.status === 'sent' ? '#DCFCE7' : 
                                                            broadcast.status === 'scheduled' ? '#FEF3C7' : 
                                                            broadcast.status === 'failed' ? '#FEE2E2' : '#F3F4F6',
                                            color: broadcast.status === 'sent' ? '#166534' : 
                                                   broadcast.status === 'scheduled' ? '#92400E' : 
                                                   broadcast.status === 'failed' ? '#991B1B' : '#6B7280'
                                        }}>
                                            {getStatusIcon(broadcast.status)} {broadcast.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Message Preview */}
                                <div className="mb-3">
                                    <div className="text-sm" style={{ color: '#374151' }}>
                                        {broadcast.message.length > 100 ? 
                                            `${broadcast.message.substring(0, 100)}...` : 
                                            broadcast.message
                                        }
                                    </div>
                                </div>

                                {/* Analytics Row */}
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Recipients:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {broadcast.recipients.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Opened:</span>
                                        <div className="font-mono text-xs" style={{ color: '#10B981' }}>
                                            {broadcast.opened.toLocaleString()} ({Math.round((broadcast.opened / broadcast.recipients) * 100)}%)
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Clicked:</span>
                                        <div className="font-mono text-xs" style={{ color: '#3B82F6' }}>
                                            {broadcast.clicked.toLocaleString()} ({Math.round((broadcast.clicked / broadcast.recipients) * 100)}%)
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button 
                                        size="mini" 
                                        fill="none" 
                                        style={{ 
                                            color: '#6B7280',
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            height: '24px'
                                        }}
                                    >
                                        <EyeOutlined />
                                    </Button>
                                    {broadcast.status === 'failed' && (
                                        <Button 
                                            size="mini" 
                                            style={{ 
                                                backgroundColor: '#10B981', 
                                                color: 'white',
                                                fontSize: '10px',
                                                padding: '2px 8px',
                                                height: '24px'
                                            }}
                                        >
                                            <SendOutlined /> Retry
                                        </Button>
                                    )}
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#EF4444', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <DeleteOutlined /> Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
