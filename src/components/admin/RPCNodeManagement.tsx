'use client';

import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, WifiOutlined, DisconnectOutlined } from "@ant-design/icons";
import { Badge, Button, Card, SearchBar } from "antd-mobile";
import { useState } from "react";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'online': return '#10B981';
        case 'offline': return '#EF4444';
        case 'slow': return '#F59E0B';
        case 'maintenance': return '#8B5CF6';
        default: return '#6B7280';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'online': return <CheckCircleOutlined />;
        case 'offline': return <CloseCircleOutlined />;
        case 'slow': return <ExclamationCircleOutlined />;
        case 'maintenance': return <ClockCircleOutlined />;
        default: return <DisconnectOutlined />;
    }
};

const rpcNodes = [
    {
        id: '1',
        name: 'Bitcoin Mainnet Primary',
        network: 'Bitcoin',
        url: 'https://bitcoin-rpc.example.com',
        port: 8332,
        username: 'btc_user',
        password: '***********',
        status: 'online',
        responseTime: 145,
        lastChecked: '2024-01-15T10:30:00Z',
        blockHeight: 825000,
        isPrimary: true,
        ssl: true,
        requests24h: 15420,
        uptime: 99.8
    },
    {
        id: '2',
        name: 'Bitcoin Mainnet Backup',
        network: 'Bitcoin',
        url: 'https://bitcoin-backup.example.com',
        port: 8332,
        username: 'btc_backup',
        password: '***********',
        status: 'online',
        responseTime: 230,
        lastChecked: '2024-01-15T10:29:00Z',
        blockHeight: 825000,
        isPrimary: false,
        ssl: true,
        requests24h: 3200,
        uptime: 98.5
    },
    {
        id: '3',
        name: 'Ethereum Mainnet Primary',
        network: 'Ethereum',
        url: 'https://ethereum-rpc.example.com',
        port: 8545,
        username: null,
        password: null,
        status: 'online',
        responseTime: 89,
        lastChecked: '2024-01-15T10:30:00Z',
        blockHeight: 18900000,
        isPrimary: true,
        ssl: true,
        requests24h: 28500,
        uptime: 99.9
    },
    {
        id: '4',
        name: 'BSC Mainnet',
        network: 'BSC',
        url: 'https://bsc-dataseed1.binance.org',
        port: 443,
        username: null,
        password: null,
        status: 'slow',
        responseTime: 850,
        lastChecked: '2024-01-15T10:28:00Z',
        blockHeight: 35000000,
        isPrimary: true,
        ssl: true,
        requests24h: 12800,
        uptime: 97.2
    },
    {
        id: '5',
        name: 'Polygon Mainnet',
        network: 'Polygon',
        url: 'https://polygon-rpc.com',
        port: 443,
        username: null,
        password: null,
        status: 'offline',
        responseTime: 0,
        lastChecked: '2024-01-15T10:15:00Z',
        blockHeight: 52000000,
        isPrimary: true,
        ssl: true,
        requests24h: 0,
        uptime: 85.3
    },
    {
        id: '6',
        name: 'Ethereum Testnet',
        network: 'Ethereum Testnet',
        url: 'https://goerli.infura.io/v3/your-key',
        port: 443,
        username: null,
        password: null,
        status: 'maintenance',
        responseTime: 0,
        lastChecked: '2024-01-15T09:45:00Z',
        blockHeight: 10200000,
        isPrimary: true,
        ssl: true,
        requests24h: 450,
        uptime: 92.1
    }
];

export const RPCNodeManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNodes = rpcNodes.filter(node => 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatUptime = (uptime: number) => {
        if (uptime >= 99) return 'Excellent';
        if (uptime >= 95) return 'Good';
        if (uptime >= 90) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#8B5CF6' }}>
                    RPC Node Management
                </h2>
                <Button 
                    color="primary" 
                    size="small"
                    style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}
                >
                    <PlusOutlined /> Add Node
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                <SearchBar
                    placeholder="Search by name, network, or URL..."
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

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {rpcNodes.filter(n => n.status === 'online').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Online</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {rpcNodes.filter(n => n.status === 'offline').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Offline</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {rpcNodes.filter(n => n.status === 'slow').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Slow</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {rpcNodes.length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Total</div>
                </div>
            </div>

            {/* RPC Nodes List */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                {/* Header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFC' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>RPC Node List</h3>
                </div>

                {/* List Items */}
                <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
                    {filteredNodes.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <WifiOutlined style={{ fontSize: '24px' }} />
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                No RPC nodes found matching "{searchQuery}"
                            </div>
                        </div>
                    ) : (
                        filteredNodes.map((node) => (
                            <div key={node.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                                {/* Main Row */}
                                <div className="flex items-center justify-between mb-3">
                                    {/* Left: Node Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
                                            style={{ backgroundColor: '#8B5CF6' }}
                                        >
                                            {getStatusIcon(node.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-base" style={{ color: '#111827' }}>
                                                    {node.name}
                                                </span>
                                                {node.isPrimary && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                        backgroundColor: '#F3E8FF',
                                                        color: '#8B5CF6'
                                                    }}>
                                                        PRIMARY
                                                    </span>
                                                )}
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                    backgroundColor: node.status === 'online' ? '#DCFCE7' : 
                                                                    node.status === 'offline' ? '#FEE2E2' : 
                                                                    node.status === 'slow' ? '#FEF3C7' : '#F3E8FF',
                                                    color: node.status === 'online' ? '#166534' : 
                                                           node.status === 'offline' ? '#991B1B' : 
                                                           node.status === 'slow' ? '#92400E' : '#6B21A8'
                                                }}>
                                                    {getStatusIcon(node.status)} {node.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                                {node.network} • {node.url}:{node.port}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Performance Metrics */}
                                    <div className="text-right">
                                        <div className="font-semibold text-sm" style={{ color: '#111827' }}>
                                            {node.responseTime > 0 ? `${node.responseTime}ms` : 'N/A'}
                                        </div>
                                        <div className="text-xs" style={{ color: '#6B7280' }}>
                                            Response Time
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Row */}
                                <div className="grid grid-cols-4 gap-4 mb-3">
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Block Height:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {node.blockHeight.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>24h Requests:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {node.requests24h.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Uptime:</span>
                                        <div className="font-mono text-xs" style={{ 
                                            color: node.uptime >= 99 ? '#8B5CF6' : 
                                                   node.uptime >= 95 ? '#8B5CF6' : '#6B7280'
                                        }}>
                                            {node.uptime}% ({formatUptime(node.uptime)})
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>SSL:</span>
                                        <div className="font-mono text-xs" style={{ 
                                            color: node.ssl ? '#8B5CF6' : '#6B7280'
                                        }}>
                                            {node.ssl ? '✓ Enabled' : '✗ Disabled'}
                                        </div>
                                    </div>
                                </div>

                                {/* Authentication Info */}
                                {(node.username || node.password) && (
                                    <div className="mb-3">
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Authentication:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            Username: {node.username || 'N/A'} • Password: {node.password ? '***' : 'N/A'}
                                        </div>
                                    </div>
                                )}

                                {/* Last Checked */}
                                <div className="mb-3">
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Last Checked:</span>
                                    <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                        {new Date(node.lastChecked).toLocaleString()}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#8B5CF6', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <WifiOutlined /> Test
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#8B5CF6', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <EditOutlined /> Edit
                                    </Button>
                                    {!node.isPrimary && (
                                        <Button 
                                            size="mini" 
                                            style={{ 
                                                backgroundColor: '#8B5CF6', 
                                                color: 'white',
                                                fontSize: '10px',
                                                padding: '2px 8px',
                                                height: '24px'
                                            }}
                                        >
                                            Set Primary
                                        </Button>
                                    )}
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: node.status === 'online' ? '#6B7280' : '#8B5CF6', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        {node.status === 'online' ? 'Disable' : 'Enable'}
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#6B7280', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <DeleteOutlined /> Delete
                                    </Button>
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
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
