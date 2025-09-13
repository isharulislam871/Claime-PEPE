'use client';

import { BellOutlined, CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CloseCircleOutlined, DeleteOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { Badge, Button, Popup } from "antd-mobile";
import { useState } from "react";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircleOutlined style={{ color: '#10B981' }} />;
        case 'warning': return <ExclamationCircleOutlined style={{ color: '#F59E0B' }} />;
        case 'error': return <CloseCircleOutlined style={{ color: '#EF4444' }} />;
        case 'info': return <InfoCircleOutlined style={{ color: '#3B82F6' }} />;
        default: return <BellOutlined style={{ color: '#6B7280' }} />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'success': return '#10B981';
        case 'warning': return '#F59E0B';
        case 'error': return '#EF4444';
        case 'info': return '#3B82F6';
        default: return '#6B7280';
    }
};

const notifications = [
    {
        id: '1',
        title: 'New Withdrawal Request',
        message: 'User @john_doe requested withdrawal of 0.5 BTC ($21,625)',
        type: 'warning',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        action: 'Review withdrawal request',
        category: 'withdrawal'
    },
    {
        id: '2',
        title: 'System Maintenance Complete',
        message: 'Scheduled maintenance has been completed successfully. All systems are operational.',
        type: 'success',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
        action: 'View system status',
        category: 'system'
    },
    {
        id: '3',
        title: 'Failed Payment Processing',
        message: 'Payment processing failed for user @alice_crypto. Error: Insufficient funds in hot wallet.',
        type: 'error',
        timestamp: '2024-01-15T08:45:00Z',
        read: true,
        action: 'Check wallet balance',
        category: 'payment'
    },
    {
        id: '4',
        title: 'New User Registration',
        message: '25 new users registered in the last hour. Total active users: 15,445',
        type: 'info',
        timestamp: '2024-01-15T08:00:00Z',
        read: false,
        action: 'View user analytics',
        category: 'users'
    },
    {
        id: '5',
        title: 'RPC Node Disconnected',
        message: 'Ethereum backup RPC node is offline. Switched to primary node automatically.',
        type: 'warning',
        timestamp: '2024-01-15T07:30:00Z',
        read: true,
        action: 'Check RPC status',
        category: 'rpc'
    },
    {
        id: '6',
        title: 'High Transaction Volume',
        message: 'Unusual high transaction volume detected. 150% above normal levels.',
        type: 'info',
        timestamp: '2024-01-15T07:00:00Z',
        read: false,
        action: 'View transaction analytics',
        category: 'analytics'
    },
    {
        id: '7',
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        type: 'error',
        timestamp: '2024-01-15T06:45:00Z',
        read: false,
        action: 'Review security logs',
        category: 'security'
    },
    {
        id: '8',
        title: 'Task Completion Milestone',
        message: '10,000 tasks completed today! Users earned a total of 250,000 points.',
        type: 'success',
        timestamp: '2024-01-15T06:00:00Z',
        read: true,
        action: 'View task statistics',
        category: 'tasks'
    }
];

interface NotificationComponentProps {
    onNotificationClick?: (notification: any) => void;
}

export const NotificationComponent = ({ onNotificationClick }: NotificationComponentProps) => {
    const [visible, setVisible] = useState(false);
    const [notificationList, setNotificationList] = useState(notifications);

    const unreadCount = notificationList.filter(n => !n.read).length;

    const handleNotificationClick = (notification: any) => {
        // Mark as read
        setNotificationList(prev => 
            prev.map(n => 
                n.id === notification.id ? { ...n, read: true } : n
            )
        );
        
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
        
        setVisible(false);
    };

    const markAllAsRead = () => {
        setNotificationList(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const deleteNotification = (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setNotificationList(prev => prev.filter(n => n.id !== id));
    };

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <>
            {/* Notification Bell Button */}
            <div className="relative">
                <Button 
                    fill="none" 
                    size="small" 
                    style={{ color: '#6B7280' }}
                    onClick={() => setVisible(true)}
                >
                    <BellOutlined />
                </Button>
                {unreadCount > 0 && (
                    <div 
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: '#EF4444', fontSize: '10px' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </div>

            {/* Full Screen Popup */}
            <Popup
                visible={visible}
                onMaskClick={() => setVisible(false)}
                position="bottom"
                bodyStyle={{
                    height: '100vh',
                    width: '100vw',
                    borderRadius: '0',
                    padding: '0'
                }}
                maskStyle={{
                    backgroundColor: 'transparent'
                }}
            >
                <div className="h-full flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Header */}
                    <div 
                        className="flex items-center justify-between p-4 border-b"
                        style={{ borderColor: '#E5E7EB' }}
                    >
                        <div className="flex items-center gap-2">
                            <BellOutlined style={{ color: '#6B7280', fontSize: '20px' }} />
                            <h3 className="font-semibold text-xl" style={{ color: '#111827' }}>
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span 
                                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: '#EF4444' }}
                                >
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <Button 
                                    size="small" 
                                    fill="outline"
                                    onClick={markAllAsRead}
                                    style={{ 
                                        borderColor: '#D1D5DB',
                                        color: '#6B7280',
                                        fontSize: '12px'
                                    }}
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Button 
                                fill="none" 
                                size="middle" 
                                onClick={() => setVisible(false)}
                                style={{ color: '#6B7280' }}
                            >
                                <CloseOutlined style={{ fontSize: '18px' }} />
                            </Button>
                        </div>
                    </div>

                    {/* Notifications List - Full Screen Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-3 max-w-4xl mx-auto">
                            {notificationList.length === 0 ? (
                                <div className="text-center py-16">
                                    <BellOutlined style={{ fontSize: '48px', color: '#D1D5DB' }} />
                                    <div className="mt-4 text-lg" style={{ color: '#6B7280' }}>
                                        No notifications
                                    </div>
                                    <div className="mt-2 text-sm" style={{ color: '#9CA3AF' }}>
                                        You're all caught up!
                                    </div>
                                </div>
                            ) : (
                                notificationList.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                                        }`}
                                        style={{ 
                                            borderColor: !notification.read ? '#BFDBFE' : '#E5E7EB',
                                            backgroundColor: !notification.read ? '#EFF6FF' : '#FFFFFF'
                                        }}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                <div 
                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{ 
                                                        backgroundColor: notification.type === 'success' ? '#DCFCE7' :
                                                                        notification.type === 'warning' ? '#FEF3C7' :
                                                                        notification.type === 'error' ? '#FEE2E2' : '#DBEAFE'
                                                    }}
                                                >
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-base" style={{ color: '#111827' }}>
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span 
                                                                className="ml-2 w-2.5 h-2.5 rounded-full inline-block"
                                                                style={{ backgroundColor: '#3B82F6' }}
                                                            />
                                                        )}
                                                    </h4>
                                                    <Button
                                                        fill="none"
                                                        size="small"
                                                        onClick={(e) => deleteNotification(notification.id, e)}
                                                        style={{ 
                                                            color: '#9CA3AF',
                                                            padding: '4px',
                                                            minWidth: 'auto'
                                                        }}
                                                    >
                                                        <DeleteOutlined style={{ fontSize: '14px' }} />
                                                    </Button>
                                                </div>
                                                
                                                <p className="text-sm mb-3 leading-relaxed" style={{ color: '#6B7280' }}>
                                                    {notification.message}
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span 
                                                            className="text-xs px-3 py-1 rounded-full font-medium"
                                                            style={{
                                                                backgroundColor: notification.type === 'success' ? '#DCFCE7' :
                                                                                notification.type === 'warning' ? '#FEF3C7' :
                                                                                notification.type === 'error' ? '#FEE2E2' : '#DBEAFE',
                                                                color: notification.type === 'success' ? '#166534' :
                                                                       notification.type === 'warning' ? '#92400E' :
                                                                       notification.type === 'error' ? '#991B1B' : '#1E40AF'
                                                            }}
                                                        >
                                                            {notification.category}
                                                        </span>
                                                        <span className="text-sm" style={{ color: '#9CA3AF' }}>
                                                            {formatTimeAgo(notification.timestamp)}
                                                        </span>
                                                    </div>
                                                    
                                              
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    );
};
