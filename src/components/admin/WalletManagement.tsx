'use client';

import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, WalletOutlined, SendOutlined, DownloadOutlined, CopyOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Badge, Button, Card, SearchBar } from "antd-mobile";
import { useState } from "react";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10B981';
        case 'locked': return '#EF4444';
        case 'maintenance': return '#F59E0B';
        case 'cold': return '#6366F1';
        default: return '#6B7280';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active': return <CheckCircleOutlined />;
        case 'locked': return <LockOutlined />;
        case 'maintenance': return <ExclamationCircleOutlined />;
        case 'cold': return <UnlockOutlined />;
        default: return <WalletOutlined />;
    }
};

const wallets = [
    {
        id: '1',
        name: 'Bitcoin Hot Wallet',
        type: 'hot',
        currency: 'BTC',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 5.42837291,
        usdValue: 234567.89,
        status: 'active',
        lastTransaction: '2024-01-15T09:30:00Z',
        transactionCount: 1247,
        privateKeyEncrypted: true,
        multisig: false,
        threshold: null,
        network: 'Bitcoin Mainnet',
        derivationPath: "m/44'/0'/0'/0/0",
        createdAt: '2023-06-15T10:00:00Z'
    },
    {
        id: '2',
        name: 'Bitcoin Cold Storage',
        type: 'cold',
        currency: 'BTC',
        address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        balance: 25.18394756,
        usdValue: 1089234.56,
        status: 'cold',
        lastTransaction: '2024-01-10T14:22:00Z',
        transactionCount: 89,
        privateKeyEncrypted: true,
        multisig: true,
        threshold: '2/3',
        network: 'Bitcoin Mainnet',
        derivationPath: "m/44'/0'/1'/0/0",
        createdAt: '2023-01-20T08:00:00Z'
    },
    {
        id: '3',
        name: 'Ethereum Main Wallet',
        type: 'hot',
        currency: 'ETH',
        address: '0x742d35Cc6634C0532925a3b8D4C5C2c8c5c5c5c5',
        balance: 127.456789123456789,
        usdValue: 337861.23,
        status: 'active',
        lastTransaction: '2024-01-15T11:45:00Z',
        transactionCount: 2891,
        privateKeyEncrypted: true,
        multisig: false,
        threshold: null,
        network: 'Ethereum Mainnet',
        derivationPath: "m/44'/60'/0'/0/0",
        createdAt: '2023-03-10T12:30:00Z'
    },
    {
        id: '4',
        name: 'USDT Treasury Wallet',
        type: 'hot',
        currency: 'USDT',
        address: '0x8ba1f109551bD432803012645Hac136c22C501e',
        balance: 500000.50,
        usdValue: 500000.50,
        status: 'active',
        lastTransaction: '2024-01-15T08:15:00Z',
        transactionCount: 5672,
        privateKeyEncrypted: true,
        multisig: true,
        threshold: '3/5',
        network: 'Ethereum Mainnet',
        derivationPath: "m/44'/60'/0'/0/1",
        createdAt: '2023-05-01T09:00:00Z'
    },
    {
        id: '5',
        name: 'BNB Operations Wallet',
        type: 'hot',
        currency: 'BNB',
        address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
        balance: 2847.123456789,
        usdValue: 897834.12,
        status: 'maintenance',
        lastTransaction: '2024-01-14T16:30:00Z',
        transactionCount: 1834,
        privateKeyEncrypted: true,
        multisig: false,
        threshold: null,
        network: 'BSC Mainnet',
        derivationPath: "m/44'/714'/0'/0/0",
        createdAt: '2023-08-15T14:20:00Z'
    },
    {
        id: '6',
        name: 'Emergency Reserve Wallet',
        type: 'cold',
        currency: 'ETH',
        address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
        balance: 89.234567890123456789,
        usdValue: 236572.34,
        status: 'locked',
        lastTransaction: '2024-01-05T10:00:00Z',
        transactionCount: 12,
        privateKeyEncrypted: true,
        multisig: true,
        threshold: '4/7',
        network: 'Ethereum Mainnet',
        derivationPath: "m/44'/60'/1'/0/0",
        createdAt: '2022-12-01T16:00:00Z'
    }
];

export const WalletManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWallets = wallets.filter(wallet => 
        wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUSDValue = wallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);
    const hotWallets = wallets.filter(w => w.type === 'hot');
    const coldWallets = wallets.filter(w => w.type === 'cold');

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>
                    Wallet Management
                </h2>
                <Button 
                    color="primary" 
                    size="small"
                    style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: '#fff' }}
                >
                    <PlusOutlined /> Add Wallet
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                <SearchBar
                    placeholder="Search by name, currency, address, or type..."
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
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        ${totalUSDValue.toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Total Value</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>
                        {hotWallets.length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Hot Wallets</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#6366F1' }}>
                        {coldWallets.length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Cold Storage</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                    <div className="text-lg font-bold" style={{ color: '#10B981' }}>
                        {wallets.filter(w => w.status === 'active').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Active</div>
                </div>
            </div>

            {/* Wallets List */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                {/* Header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: '#F3F4F6', backgroundColor: '#FAFAFA' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#374151' }}>Wallet List</h3>
                </div>

                {/* List Items */}
                <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                    {filteredWallets.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <WalletOutlined style={{ fontSize: '24px' }} />
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                No wallets found matching "{searchQuery}"
                            </div>
                        </div>
                    ) : (
                        filteredWallets.map((wallet) => (
                            <div key={wallet.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                                {/* Main Row */}
                                <div className="flex items-center justify-between mb-3">
                                    {/* Left: Wallet Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
                                            style={{ backgroundColor: getStatusColor(wallet.status) }}
                                        >
                                            {getStatusIcon(wallet.status)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-base" style={{ color: '#111827' }}>
                                                    {wallet.name}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                    backgroundColor: wallet.type === 'hot' ? '#FEF3C7' : '#DBEAFE',
                                                    color: wallet.type === 'hot' ? '#92400E' : '#1E40AF'
                                                }}>
                                                    {wallet.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                    backgroundColor: wallet.status === 'active' ? '#DCFCE7' : 
                                                                    wallet.status === 'locked' ? '#FEE2E2' : 
                                                                    wallet.status === 'maintenance' ? '#FEF3C7' : '#F3E8FF',
                                                    color: wallet.status === 'active' ? '#166534' : 
                                                           wallet.status === 'locked' ? '#991B1B' : 
                                                           wallet.status === 'maintenance' ? '#92400E' : '#6B21A8'
                                                }}>
                                                    {getStatusIcon(wallet.status)} {wallet.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                                {wallet.currency} • {wallet.network}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Balance & Value */}
                                    <div className="text-right">
                                        <div className="font-semibold text-sm" style={{ color: '#111827' }}>
                                            {wallet.balance.toFixed(8)} {wallet.currency}
                                        </div>
                                        <div className="text-xs font-semibold" style={{ color: '#10B981' }}>
                                            ${wallet.usdValue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Row */}
                                <div className="mb-3">
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Address:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs" style={{ color: '#3B82F6' }}>
                                            {wallet.address.slice(0, 20)}...{wallet.address.slice(-10)}
                                        </span>
                                        <Button 
                                            size="mini" 
                                            fill="none"
                                            style={{ 
                                                color: '#6B7280',
                                                fontSize: '10px',
                                                padding: '1px 4px',
                                                height: '18px'
                                            }}
                                        >
                                            <CopyOutlined />
                                        </Button>
                                    </div>
                                </div>

                                {/* Metrics Row */}
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Transactions:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {wallet.transactionCount.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Last Activity:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {new Date(wallet.lastTransaction).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Security:</span>
                                        <div className="font-mono text-xs" style={{ 
                                            color: wallet.multisig ? '#10B981' : '#F59E0B'
                                        }}>
                                            {wallet.multisig ? `MultiSig ${wallet.threshold}` : 'Single Key'}
                                        </div>
                                    </div>
                                </div>

                                {/* Derivation Path */}
                                <div className="mb-3">
                                    <span className="text-xs" style={{ color: '#6B7280' }}>Derivation Path:</span>
                                    <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                        {wallet.derivationPath}
                                    </div>
                                </div>

                                {/* Security Features */}
                                <div className="mb-3">
                                    <div className="flex gap-4 text-xs">
                                        <span style={{ 
                                            color: wallet.privateKeyEncrypted ? '#10B981' : '#EF4444'
                                        }}>
                                            {wallet.privateKeyEncrypted ? '🔒 Encrypted' : '🔓 Not Encrypted'}
                                        </span>
                                        <span style={{ color: '#6B7280' }}>
                                            Created: {new Date(wallet.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-wrap">
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
                                        <DownloadOutlined /> Receive
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#3B82F6', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <SendOutlined /> Send
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: '#F59E0B', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        <EditOutlined /> Edit
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: wallet.status === 'locked' ? '#10B981' : '#EF4444', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        {wallet.status === 'locked' ? <UnlockOutlined /> : <LockOutlined />}
                                        {wallet.status === 'locked' ? 'Unlock' : 'Lock'}
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
