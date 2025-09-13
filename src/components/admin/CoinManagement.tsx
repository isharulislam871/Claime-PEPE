'use client';

import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Card, SearchBar, Toast } from "antd-mobile";
import { useState } from "react";
import { AddCoinPopup } from "./AddCoinPopup";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10B981';
        case 'inactive': return '#F59E0B';
        case 'maintenance': return '#EF4444';
        default: return '#6B7280';
    }
};

const initialCoins = [
    {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        network: 'Bitcoin',
        contractAddress: null,
        decimals: 8,
        minWithdrawal: 0.001,
        maxWithdrawal: 10,
        withdrawalFee: 0.0005,
        status: 'active',
        icon: '₿',
        price: 43250.50,
        totalBalance: 12.45678901,
        rpcEndpoint: 'https://bitcoin-rpc.example.com'
    },
    {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'Ethereum',
        contractAddress: null,
        decimals: 18,
        minWithdrawal: 0.01,
        maxWithdrawal: 100,
        withdrawalFee: 0.005,
        status: 'active',
        icon: 'Ξ',
        price: 2650.75,
        totalBalance: 45.123456789012345678,
        rpcEndpoint: 'https://ethereum-rpc.example.com'
    },
    {
        id: '3',
        symbol: 'USDT',
        name: 'Tether USD',
        network: 'Ethereum',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        minWithdrawal: 10,
        maxWithdrawal: 50000,
        withdrawalFee: 5,
        status: 'active',
        icon: '₮',
        price: 1.00,
        totalBalance: 125000.50,
        rpcEndpoint: 'https://ethereum-rpc.example.com'
    },
    {
        id: '4',
        symbol: 'BNB',
        name: 'Binance Coin',
        network: 'BSC',
        contractAddress: null,
        decimals: 18,
        minWithdrawal: 0.1,
        maxWithdrawal: 1000,
        withdrawalFee: 0.01,
        status: 'maintenance',
        icon: '🔶',
        price: 315.25,
        totalBalance: 89.456789,
        rpcEndpoint: 'https://bsc-rpc.example.com'
    },
    {
        id: '5',
        symbol: 'MATIC',
        name: 'Polygon',
        network: 'Polygon',
        contractAddress: null,
        decimals: 18,
        minWithdrawal: 1,
        maxWithdrawal: 10000,
        withdrawalFee: 0.1,
        status: 'inactive',
        icon: '🔷',
        price: 0.85,
        totalBalance: 5000.123456,
        rpcEndpoint: 'https://polygon-rpc.example.com'
    }
];

export const CoinManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [coins, setCoins] = useState(initialCoins);
    const [showAddPopup, setShowAddPopup] = useState(false);

    const filteredCoins = coins.filter(coin => 
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.network.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: '#8B5CF6' }}>
                    Coin Management
                </h2>
                <Button 
                    color="primary" 
                    size="small"
                    onClick={() => setShowAddPopup(true)}
                    style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' }}
                >
                    <PlusOutlined /> Add Coin
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                <SearchBar
                    placeholder="Search by symbol, name, or network..."
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
                        {coins.filter(c => c.status === 'active').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Active</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {coins.filter(c => c.status === 'inactive').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Inactive</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {coins.filter(c => c.status === 'maintenance').length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Maintenance</div>
                </div>

                <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                        {coins.length}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>Total</div>
                </div>
            </div>

            {/* Coins List */}
            <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
                {/* Header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFC' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>Cryptocurrency List</h3>
                </div>

                {/* List Items */}
                <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
                    {filteredCoins.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <PlusOutlined style={{ fontSize: '24px' }} />
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                No coins found matching "{searchQuery}"
                            </div>
                        </div>
                    ) : (
                        filteredCoins.map((coin) => (
                            <div key={coin.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                                {/* Main Row */}
                                <div className="flex items-center justify-between mb-3">
                                    {/* Left: Coin Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                            style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                                        >
                                            {coin.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-base" style={{ color: '#111827' }}>
                                                    {coin.symbol}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ 
                                                    backgroundColor: coin.status === 'active' ? '#DCFCE7' : 
                                                                    coin.status === 'inactive' ? '#FEF3C7' : '#FEE2E2',
                                                    color: coin.status === 'active' ? '#166534' : 
                                                           coin.status === 'inactive' ? '#92400E' : '#991B1B'
                                                }}>
                                                    {coin.status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} 
                                                    {coin.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                                {coin.name} • {coin.network}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Price & Balance */}
                                    <div className="text-right">
                                        <div className="font-semibold text-sm" style={{ color: '#111827' }}>
                                            ${coin.price.toLocaleString()}
                                        </div>
                                        <div className="text-xs" style={{ color: '#6B7280' }}>
                                            Balance: {coin.totalBalance.toFixed(6)}
                                        </div>
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Min/Max Withdrawal:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {coin.minWithdrawal} - {coin.maxWithdrawal} {coin.symbol}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Withdrawal Fee:</span>
                                        <div className="font-mono text-xs" style={{ color: '#374151' }}>
                                            {coin.withdrawalFee} {coin.symbol}
                                        </div>
                                    </div>
                                </div>

                                {/* Contract Address (if exists) */}
                                {coin.contractAddress && (
                                    <div className="mb-3">
                                        <span className="text-xs" style={{ color: '#6B7280' }}>Contract Address:</span>
                                        <div className="font-mono text-xs" style={{ color: '#8B5CF6' }}>
                                            {coin.contractAddress.slice(0, 20)}...{coin.contractAddress.slice(-10)}
                                        </div>
                                    </div>
                                )}

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
                                        <EditOutlined /> Edit
                                    </Button>
                                    <Button 
                                        size="mini" 
                                        style={{ 
                                            backgroundColor: coin.status === 'active' ? '#6B7280' : '#8B5CF6', 
                                            color: 'white',
                                            fontSize: '10px',
                                            padding: '2px 8px',
                                            height: '24px'
                                        }}
                                    >
                                        {coin.status === 'active' ? 'Disable' : 'Enable'}
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

            {/* Add Coin Popup */}
            <AddCoinPopup
                visible={showAddPopup}
                onClose={() => setShowAddPopup(false)}
                onAdd={(newCoin) => {
                    setCoins(prev => [...prev, newCoin]);
                    setShowAddPopup(false);
                    Toast.show({ content: `${newCoin.symbol} added successfully!`, icon: 'success' });
                }}
            />
        </div>
    );
};
