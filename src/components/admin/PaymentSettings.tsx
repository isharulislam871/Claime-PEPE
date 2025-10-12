'use client';

import { useState } from "react";
import MinimumInvitesPopup from './MinimumInvitesPopup';

// Custom Icons
const SettingsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const ShieldIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const StopIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

const UserGroupIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM2 8v1h2V8H2zm8 3a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
  </svg>
);

const ExclamationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const BellIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
);

// Toggle Switch Component
const ToggleSwitch = ({ 
  checked, 
  onChange, 
  disabled = false, 
  color = "blue" 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  disabled?: boolean;
  color?: "blue" | "green" | "yellow" | "purple" | "red";
}) => {
  const colorClasses = {
    blue: "peer-checked:bg-blue-600",
    green: "peer-checked:bg-green-600", 
    yellow: "peer-checked:bg-yellow-500",
    purple: "peer-checked:bg-purple-600",
    red: "peer-checked:bg-red-600"
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${color}-300 rounded-full peer ${colorClasses[color]} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
    </label>
  );
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
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaveStatus('saving');
        
        // Simulate API call
        setTimeout(() => {
            setSaveStatus('saved');
            setLastUpdated(new Date());
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <SettingsIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Payment Settings</h1>
                                <p className="text-gray-300 mt-1 text-sm">Manage your platform's payment configurations and security settings</p>
                            </div>
                        </div>
                        
                        {/* Save Status & Last Updated */}
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                                {saveStatus === 'saving' && (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span className="text-xs text-gray-300">Saving...</span>
                                    </>
                                )}
                                {saveStatus === 'saved' && (
                                    <>
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400">Saved</span>
                                    </>
                                )}
                                {saveStatus === 'error' && (
                                    <>
                                        <ExclamationIcon className="w-4 h-4 text-red-400" />
                                        <span className="text-xs text-red-400">Error</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <ClockIcon className="w-3 h-3" />
                                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Security Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Emergency Controls */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                                <div className="flex items-center space-x-3">
                                    <StopIcon className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Emergency Controls</h2>
                                </div>
                                <p className="text-red-100 mt-1 text-sm">Critical system controls for emergency situations</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="group flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 hover:border-red-200 transition-all duration-200 hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors duration-200">
                                                <StopIcon className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-900 transition-colors duration-200">Suspend All Payment Services</h3>
                                                <p className="text-xs text-gray-600 mt-1">Temporarily disable all payment processing</p>
                                                {settings.suspendAllPaymentServices && (
                                                    <div className="flex items-center space-x-1 mt-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-red-600 font-medium">ACTIVE</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        checked={settings.suspendAllPaymentServices}
                                        onChange={(checked) => handleSettingChange('suspendAllPaymentServices', checked)}
                                        color="red"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* User Requirements */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                                <div className="flex items-center space-x-3">
                                    <UserGroupIcon className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">User Requirements</h2>
                                </div>
                                <p className="text-purple-100 mt-1 text-sm">Configure user verification and invitation requirements</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="group flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-200 hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors duration-200">
                                                <UserGroupIcon className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-900 transition-colors duration-200">Require Invites for Withdrawal</h3>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Users must invite {settings.minimumInvitesRequired} people before withdrawal acceptance
                                                </p>
                                                {settings.requireInvitesForWithdrawal && (
                                                    <div className="flex items-center space-x-1 mt-2">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-purple-600 font-medium">REQUIRED</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        checked={settings.requireInvitesForWithdrawal}
                                        onChange={(checked) => handleSettingChange('requireInvitesForWithdrawal', checked)}
                                        disabled={settings.suspendAllPaymentServices || settings.emergencyMode}
                                        color="purple"
                                    />
                                </div>

                                {settings.requireInvitesForWithdrawal && (
                                    <div className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md animate-in slide-in-from-top-2">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-900 transition-colors duration-200">Minimum Invites Required</h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Number of successful invites required before withdrawal
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsMinimumInvitesPopupOpen(true)}
                                            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 hover:scale-105 transition-all duration-200 min-w-[80px] shadow-lg hover:shadow-xl"
                                        >
                                            {settings.minimumInvitesRequired}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Processing Settings */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                                <div className="flex items-center space-x-3">
                                    <CheckIcon className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Processing Settings</h2>
                                </div>
                                <p className="text-green-100 mt-1 text-sm">Configure automatic processing and security features</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="group flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors duration-200">
                                                <CheckIcon className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-900 transition-colors duration-200">Auto Process Withdrawals</h3>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Automatically process withdrawals under security thresholds
                                                </p>
                                                {settings.autoProcessWithdrawals && !settings.suspendAllPaymentServices && (
                                                    <div className="flex items-center space-x-1 mt-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-xs text-green-600 font-medium">ENABLED</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ToggleSwitch
                                        checked={settings.autoProcessWithdrawals}
                                        onChange={(checked) => handleSettingChange('autoProcessWithdrawals', checked)}
                                        disabled={settings.suspendAllPaymentServices || settings.suspendWithdrawals || settings.emergencyMode}
                                        color="green"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Quick Actions */}
                    <div className="space-y-6">
                        {/* System Status */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">System Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Payment Services</span>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        settings.suspendAllPaymentServices 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {settings.suspendAllPaymentServices ? 'Suspended' : 'Active'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Auto Processing</span>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        settings.autoProcessWithdrawals 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {settings.autoProcessWithdrawals ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Invite Requirements</span>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        settings.requireInvitesForWithdrawal 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {settings.requireInvitesForWithdrawal ? 'Required' : 'Optional'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Limits & Thresholds</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <CurrencyIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">Daily Limit</span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900">
                                        ${settings.maxDailyWithdrawals.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <WalletIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">Monthly Limit</span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900">
                                        ${settings.maxMonthlyWithdrawals.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ShieldIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">Security Level</span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 capitalize">
                                        {settings.securityLevel}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-600">Cooldown</span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900">
                                        {settings.withdrawalCooldown}h
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                                <BellIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="p-1 bg-blue-100 rounded-full">
                                        <SettingsIcon className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-900">Auto processing enabled</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="p-1 bg-purple-100 rounded-full">
                                        <UserGroupIcon className="w-3 h-3 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">Invite requirement updated</p>
                                        <p className="text-xs text-gray-500">5 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="p-1 bg-green-100 rounded-full">
                                        <TrendingUpIcon className="w-3 h-3 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">System performance optimal</p>
                                        <p className="text-xs text-gray-500">10 minutes ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <SettingsIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">Export Settings</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <ShieldIcon className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">Security Audit</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <TrendingUpIcon className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">View Analytics</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
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
        </div>
    );
};
