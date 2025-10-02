'use client';

import { CloseOutlined, CopyOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Popup, Toast } from "antd-mobile";

interface Withdrawal {
    id: string;
    userId: string;
    username: string;
    amount: number;
    currency: string;
    walletAddress: string;
    status: string;
    requestDate: string;
    processedDate?: string;
    transactionHash?: string;
}

interface WithdrawalDetailsPopupProps {
    visible: boolean;
    withdrawal: Withdrawal | null;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return '#F59E0B';
        case 'approved': return '#3B82F6';
        case 'completed': return '#10B981';
        case 'rejected': return '#EF4444';
        default: return '#6B7280';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'pending': return <ClockCircleOutlined />;
        case 'approved': return <ExclamationCircleOutlined />;
        case 'completed': return <CheckCircleOutlined />;
        case 'rejected': return <CloseCircleOutlined />;
        default: return <ClockCircleOutlined />;
    }
};

const getCurrencyIcon = (currency: string) => {
    switch (currency) {
        case 'BTC': return '₿';
        case 'ETH': return 'Ξ';
        case 'USDT': return '₮';
        default: return '$';
    }
};

const copyToClipboard = async (text: string, label: string) => {
    try {
        await navigator.clipboard.writeText(text);
        Toast.show({ content: `${label} copied to clipboard`, icon: 'success' });
    } catch (error) {
        Toast.show({ content: 'Failed to copy', icon: 'fail' });
    }
};

export const WithdrawalDetailsPopup = ({ visible, withdrawal, onClose }: WithdrawalDetailsPopupProps) => {
    if (!withdrawal) return null;

    return (
        <Popup
            visible={visible}
            onMaskClick={onClose}
            bodyStyle={{
                height: '100vh',
                width: '100vw',
                borderRadius: '0px',
                margin: 0,
                padding: 0,
            }}
        >
            <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10" style={{ borderColor: '#F3F4F6' }}>
                    <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                        Withdrawal Details
                    </h3>
                    <Button 
                        fill="none" 
                        size="small" 
                        onClick={onClose}
                        style={{ color: '#9CA3AF', backgroundColor: '#F9FAFB' }}
                    >
                        <CloseOutlined />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                        {/* Withdrawal Header */}
                        <div className="text-center pb-6 border-b" style={{ borderColor: '#F3F4F6' }}>
                            <div 
                                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                                style={{ backgroundColor: '#1F2937' }}
                            >
                                {getCurrencyIcon(withdrawal.currency)}
                            </div>
                            <h4 className="font-semibold text-2xl mb-2" style={{ color: '#111827' }}>
                                -{withdrawal.amount} {withdrawal.currency}
                            </h4>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ 
                                    backgroundColor: withdrawal.status === 'completed' ? '#DCFCE7' : 
                                                    withdrawal.status === 'pending' ? '#FEF3C7' :
                                                    withdrawal.status === 'approved' ? '#DBEAFE' : '#FEE2E2',
                                    color: withdrawal.status === 'completed' ? '#166534' : 
                                           withdrawal.status === 'pending' ? '#92400E' :
                                           withdrawal.status === 'approved' ? '#1E40AF' : '#991B1B'
                                }}>
                                    {getStatusIcon(withdrawal.status)} {withdrawal.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm" style={{ color: '#6B7280' }}>
                                Withdrawal ID: {withdrawal.id}
                            </p>
                        </div>

                        {/* User Information */}
                        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                            <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>User Information</h5>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                                    <span className="font-medium" style={{ color: '#374151' }}>Username:</span>
                                    <span style={{ color: '#6B7280' }}>@{withdrawal.username}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                                    <span className="font-medium" style={{ color: '#374151' }}>User ID:</span>
                                    <span className="font-mono text-sm" style={{ color: '#6B7280' }}>{withdrawal.userId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                            <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Transaction Details</h5>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium" style={{ color: '#374151' }}>Wallet Address:</span>
                                        <Button 
                                            size="mini" 
                                            fill="none" 
                                            onClick={() => copyToClipboard(withdrawal.walletAddress, 'Wallet address')}
                                            style={{ color: '#3B82F6' }}
                                        >
                                            <CopyOutlined />
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="font-mono text-sm break-all" style={{ color: '#374151' }}>
                                            {withdrawal.walletAddress}
                                        </span>
                                    </div>
                                </div>

                                {withdrawal.transactionHash && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium" style={{ color: '#374151' }}>Transaction Hash:</span>
                                            <Button 
                                                size="mini" 
                                                fill="none" 
                                                onClick={() => copyToClipboard(withdrawal.transactionHash!, 'Transaction hash')}
                                                style={{ color: '#3B82F6' }}
                                            >
                                                <CopyOutlined />
                                            </Button>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <span className="font-mono text-sm break-all" style={{ color: '#3B82F6' }}>
                                                {withdrawal.transactionHash}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium block mb-1" style={{ color: '#374151' }}>Amount:</span>
                                        <span className="text-lg font-semibold" style={{ color: '#111827' }}>
                                            {withdrawal.amount} {withdrawal.currency}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium block mb-1" style={{ color: '#374151' }}>Currency:</span>
                                        <span className="text-lg font-semibold" style={{ color: '#111827' }}>
                                            {withdrawal.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                            <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Timeline</h5>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3B82F6' }}></div>
                                    <div className="flex-1">
                                        <div className="font-medium" style={{ color: '#374151' }}>Withdrawal Requested</div>
                                        <div className="text-sm" style={{ color: '#6B7280' }}>
                                            {new Date(withdrawal.requestDate).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {withdrawal.processedDate && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full mt-2" style={{ 
                                            backgroundColor: withdrawal.status === 'completed' ? '#10B981' : 
                                                           withdrawal.status === 'rejected' ? '#EF4444' : '#F59E0B'
                                        }}></div>
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: '#374151' }}>
                                                Withdrawal {withdrawal.status === 'completed' ? 'Completed' : 
                                                          withdrawal.status === 'rejected' ? 'Rejected' : 'Processed'}
                                            </div>
                                            <div className="text-sm" style={{ color: '#6B7280' }}>
                                                {new Date(withdrawal.processedDate).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-white" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex gap-3">
                        {withdrawal.status === 'pending' && (
                            <>
                                <Button 
                                    block 
                                    style={{ 
                                        flex: 1,
                                        backgroundColor: '#10B981',
                                        borderColor: '#10B981',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <CheckCircleOutlined /> Approve
                                </Button>
                                <Button 
                                    block 
                                    style={{ 
                                        flex: 1,
                                        backgroundColor: '#EF4444',
                                        borderColor: '#EF4444',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <CloseCircleOutlined /> Reject
                                </Button>
                            </>
                        )}
                        {withdrawal.status === 'approved' && (
                            <Button 
                                block 
                                style={{ 
                                    backgroundColor: '#3B82F6',
                                    borderColor: '#3B82F6',
                                    color: '#FFFFFF'
                                }}
                            >
                                Process Payment
                            </Button>
                        )}
                        {withdrawal.status === 'completed' && withdrawal.transactionHash && (
                            <Button 
                                block 
                                fill="outline"
                                style={{ 
                                    borderColor: '#3B82F6',
                                    color: '#3B82F6'
                                }}
                            >
                                View on Blockchain
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Popup>
    );
};
