'use client';

import { Button, Input, Popup, Switch, Toast, Selector } from "antd-mobile";
import { useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

interface AddCoinPopupProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (coinData: any) => void;
}

const networkOptions = [
    { label: 'Bitcoin', value: 'Bitcoin' },
    { label: 'Ethereum', value: 'Ethereum' },
    { label: 'BSC', value: 'BSC' },
    { label: 'Polygon', value: 'Polygon' },
    { label: 'Arbitrum', value: 'Arbitrum' },
    { label: 'Optimism', value: 'Optimism' },
    { label: 'Avalanche', value: 'Avalanche' },
    { label: 'Solana', value: 'Solana' }
];

export const AddCoinPopup = ({ visible, onClose, onAdd }: AddCoinPopupProps) => {
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        network: '',
        contractAddress: '',
        decimals: 18,
        minWithdrawal: 0,
        maxWithdrawal: 0,
        withdrawalFee: 0,
        status: 'active',
        icon: '',
        price: 0,
        rpcEndpoint: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.symbol.trim()) {
            newErrors.symbol = 'Symbol is required';
        } else if (formData.symbol.length > 10) {
            newErrors.symbol = 'Symbol must be 10 characters or less';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.network) {
            newErrors.network = 'Network is required';
        }

        if (formData.minWithdrawal < 0) {
            newErrors.minWithdrawal = 'Minimum withdrawal must be positive';
        }

        if (formData.maxWithdrawal <= formData.minWithdrawal) {
            newErrors.maxWithdrawal = 'Maximum withdrawal must be greater than minimum';
        }

        if (formData.withdrawalFee < 0) {
            newErrors.withdrawalFee = 'Withdrawal fee must be positive';
        }

        if (formData.decimals < 0 || formData.decimals > 18) {
            newErrors.decimals = 'Decimals must be between 0 and 18';
        }

        if (!formData.rpcEndpoint.trim()) {
            newErrors.rpcEndpoint = 'RPC endpoint is required';
        } else if (!formData.rpcEndpoint.startsWith('http')) {
            newErrors.rpcEndpoint = 'RPC endpoint must be a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Toast.show({ content: 'Please fix the errors below', icon: 'fail' });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newCoin = {
                ...formData,
                id: Date.now().toString(),
                totalBalance: 0,
                symbol: formData.symbol.toUpperCase()
            };

            onAdd(newCoin);
            Toast.show({ content: 'Coin added successfully', icon: 'success' });
            handleClose();
        } catch (error) {
            Toast.show({ content: 'Failed to add coin', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            symbol: '',
            name: '',
            network: '',
            contractAddress: '',
            decimals: 18,
            minWithdrawal: 0,
            maxWithdrawal: 0,
            withdrawalFee: 0,
            status: 'active',
            icon: '',
            price: 0,
            rpcEndpoint: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Popup
            visible={visible}
            onMaskClick={handleClose}
            position="bottom"
            bodyStyle={{
               
                minHeight: '100vh',
                maxHeight: '100vh',
                overflow: 'auto'
            }}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#8B5CF6' }}>
                            <PlusOutlined style={{ color: 'white', fontSize: '16px' }} />
                        </div>
                        <h2 className="text-lg font-semibold" style={{ color: '#8B5CF6' }}>Add New Coin</h2>
                    </div>
                    <Button 
                        fill="none" 
                        onClick={handleClose}
                        style={{ color: '#6B7280' }}
                    >
                        <CloseOutlined />
                    </Button>
                </div>

                <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-medium mb-3" style={{ color: '#8B5CF6' }}>Basic Information</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Symbol *
                                </label>
                                <Input
                                    placeholder="e.g., BTC, ETH"
                                    value={formData.symbol}
                                    onChange={(value) => handleInputChange('symbol', value)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: errors.symbol ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                {errors.symbol && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.symbol}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Name *
                                </label>
                                <Input
                                    placeholder="e.g., Bitcoin, Ethereum"
                                    value={formData.name}
                                    onChange={(value) => handleInputChange('name', value)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: errors.name ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                {errors.name && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Icon/Emoji
                                </label>
                                <Input
                                    placeholder="e.g., ₿, Ξ, 🔶"
                                    value={formData.icon}
                                    onChange={(value) => handleInputChange('icon', value)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Current Price (USD)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price.toString()}
                                    onChange={(value) => handleInputChange('price', parseFloat(value) || 0)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Network Configuration */}
                    <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-medium mb-3" style={{ color: '#8B5CF6' }}>Network Configuration</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Network *
                                </label>
                                <Selector
                                    options={networkOptions}
                                    value={formData.network ? [formData.network] : []}
                                    onChange={(arr) => handleInputChange('network', arr[0] || '')}
                                    style={{
                                        '--border': errors.network ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        '--border-radius': '8px',
                                        '--background': '#F8FAFC'
                                    } as any}
                                />
                                {errors.network && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.network}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Contract Address
                                </label>
                                <Input
                                    placeholder="Leave empty for native tokens"
                                    value={formData.contractAddress}
                                    onChange={(value) => handleInputChange('contractAddress', value)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                                    Only required for ERC-20/BEP-20 tokens
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Decimals
                                </label>
                                <Input
                                    type="number"
                                    placeholder="18"
                                    value={formData.decimals.toString()}
                                    onChange={(value) => handleInputChange('decimals', parseInt(value) || 18)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: errors.decimals ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                {errors.decimals && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.decimals}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    RPC Endpoint *
                                </label>
                                <Input
                                    placeholder="https://..."
                                    value={formData.rpcEndpoint}
                                    onChange={(value) => handleInputChange('rpcEndpoint', value)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: errors.rpcEndpoint ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                {errors.rpcEndpoint && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.rpcEndpoint}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Settings */}
                    <div className="bg-white rounded-lg p-4" style={{ border: '1px solid #E5E7EB' }}>
                        <h3 className="font-medium mb-3" style={{ color: '#8B5CF6' }}>Withdrawal Settings</h3>
                        
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                        Min Withdrawal *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0.001"
                                        value={formData.minWithdrawal.toString()}
                                        onChange={(value) => handleInputChange('minWithdrawal', parseFloat(value) || 0)}
                                        style={{
                                            backgroundColor: '#F8FAFC',
                                            border: errors.minWithdrawal ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    {errors.minWithdrawal && (
                                        <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.minWithdrawal}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                        Max Withdrawal *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="100"
                                        value={formData.maxWithdrawal.toString()}
                                        onChange={(value) => handleInputChange('maxWithdrawal', parseFloat(value) || 0)}
                                        style={{
                                            backgroundColor: '#F8FAFC',
                                            border: errors.maxWithdrawal ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    {errors.maxWithdrawal && (
                                        <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.maxWithdrawal}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>
                                    Withdrawal Fee
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0.005"
                                    value={formData.withdrawalFee.toString()}
                                    onChange={(value) => handleInputChange('withdrawalFee', parseFloat(value) || 0)}
                                    style={{
                                        backgroundColor: '#F8FAFC',
                                        border: errors.withdrawalFee ? '1px solid #EF4444' : '1px solid #E5E7EB',
                                        borderRadius: '8px'
                                    }}
                                />
                                {errors.withdrawalFee && (
                                    <div className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.withdrawalFee}</div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: '#374151' }}>Enable Coin</div>
                                    <div className="text-xs" style={{ color: '#6B7280' }}>Make coin available for transactions</div>
                                </div>
                                <Switch 
                                    checked={formData.status === 'active'}
                                    onChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button 
                            block 
                            fill="outline" 
                            onClick={handleClose}
                            style={{ 
                                borderColor: '#E5E7EB',
                                color: '#6B7280'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            block 
                            onClick={handleSubmit}
                            loading={loading}
                            style={{ 
                                backgroundColor: '#8B5CF6',
                                borderColor: '#8B5CF6',
                                color: 'white'
                            }}
                        >
                            Add Coin
                        </Button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};
