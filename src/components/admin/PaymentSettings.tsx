'use client';

import { EditOutlined, DeleteOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, DollarOutlined, CreditCardOutlined, BankOutlined, WalletOutlined, SettingOutlined, StopOutlined, QuestionCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Input, Selector, Switch, SearchBar } from "antd-mobile";
import { useState } from "react";
import MinimumInvitesPopup from './MinimumInvitesPopup';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10B981';
        case 'inactive': return '#EF4444';
        case 'maintenance': return '#F59E0B';
        default: return '#6B7280';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active': return <CheckCircleOutlined />;
        case 'inactive': return <CloseCircleOutlined />;
        case 'maintenance': return <ExclamationCircleOutlined />;
        default: return <SettingOutlined />;
    }
};


const generalSettings = {
    autoProcessWithdrawals: true,
    requireKYC: true,
    enableMultiSig: true,
    maxDailyWithdrawals: 50000,
    maxMonthlyWithdrawals: 500000,
    withdrawalCooldown: 24, // hours
    securityLevel: 'high',
    notificationEmail: 'admin@taskup.com',
    backupEmail: 'backup@taskup.com',
    suspendAllPaymentServices: false,
    requireInquiry: false,
    suspendWithdrawals: false,
    suspendDeposits: false,
    emergencyMode: false,
    requireInvitesForWithdrawal: true,
    minimumInvitesRequired: 10
};

export const PaymentSettings = () => {
    const [settings, setSettings] = useState(generalSettings);
    const [isMinimumInvitesPopupOpen, setIsMinimumInvitesPopupOpen] = useState(false);


    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
       

            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ border: '1px solid #F3F4F6' }}>
                <h3 className="font-semibold text-lg mb-4" style={{ color: '#374151' }}>
                    <SettingOutlined /> General Payment Settings
                </h3>

                <div className="space-y-4">
               
 
                    {/* Suspend All Payment Services */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-sm" style={{ color: '#374151' }}>
                                <StopOutlined style={{ color: '#F59E0B', marginRight: '8px' }} />
                                Suspend All Payment Services
                            </div>
                            <div className="text-xs" style={{ color: '#6B7280' }}>
                                Temporarily disable all payment processing
                            </div>
                        </div>
                        <Switch 
                            checked={settings.suspendAllPaymentServices}
                            onChange={(checked) => handleSettingChange('suspendAllPaymentServices', checked)}
                            style={{ backgroundColor: settings.suspendAllPaymentServices ? '#F59E0B' : undefined }}
                        />
                    </div>
 

                 
           

                    {/* Require Invites for Withdrawal */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-sm" style={{ color: '#374151' }}>
                                <UserAddOutlined style={{ color: '#8B5CF6', marginRight: '8px' }} />
                                Require Invites for Withdrawal
                            </div>
                            <div className="text-xs" style={{ color: '#6B7280' }}>
                                Users must invite {settings.minimumInvitesRequired} people before withdrawal acceptance
                            </div>
                        </div>
                        <Switch 
                            checked={settings.requireInvitesForWithdrawal}
                            onChange={(checked) => handleSettingChange('requireInvitesForWithdrawal', checked)}
                            disabled={settings.suspendAllPaymentServices || settings.emergencyMode}
                            style={{ backgroundColor: settings.requireInvitesForWithdrawal ? '#8B5CF6' : undefined }}
                        />
                    </div>

                    {/* Minimum Invites Required */}
                    {settings.requireInvitesForWithdrawal && (
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-sm" style={{ color: '#374151' }}>
                                    Minimum Invites Required
                                </div>
                                <div className="text-xs" style={{ color: '#6B7280' }}>
                                    Number of successful invites required before withdrawal
                                </div>
                            </div>
                            <Button
                                size="small"
                                onClick={() => setIsMinimumInvitesPopupOpen(true)}
                                style={{
                                    backgroundColor: '#8B5CF6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    minWidth: '80px',
                                    fontWeight: '600'
                                }}
                            >
                                {settings.minimumInvitesRequired}
                            </Button>
                        </div>
                    )}

                    {/* Auto Process Withdrawals */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-sm" style={{ color: '#374151' }}>
                                <CheckCircleOutlined style={{ color: '#10B981', marginRight: '8px' }} />
                                Auto Process Withdrawals
                            </div>
                            <div className="text-xs" style={{ color: '#6B7280' }}>
                                Automatically process withdrawals under security thresholds
                            </div>
                        </div>
                        <Switch 
                            checked={settings.autoProcessWithdrawals}
                            onChange={(checked) => handleSettingChange('autoProcessWithdrawals', checked)}
                            disabled={settings.suspendAllPaymentServices || settings.suspendWithdrawals || settings.emergencyMode}
                        />
                    </div>
 
                 
                </div>
            </div>

            <MinimumInvitesPopup
                isOpen={isMinimumInvitesPopupOpen}
                onClose={() => setIsMinimumInvitesPopupOpen(false)}
                currentValue={settings.minimumInvitesRequired}
                onSave={(value) => handleSettingChange('minimumInvitesRequired', value)}
            />

        </div>
    );
};
