'use client';

import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Input, Popup, Selector, Toast } from "antd-mobile";
import { useState, useEffect } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    balance: number;
    tasksCompleted: number;
    joinDate: string;
    status: string;
}

interface UserDetailsEditPopupProps {
    visible: boolean;
    user: User | null;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Banned', value: 'banned' },
    { label: 'Paused', value: 'paused' }
];

export const UserDetailsEditPopup = ({ visible, user, onClose, onSave }: UserDetailsEditPopupProps) => {
    const [formData, setFormData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        }
    }, [user]);

    const handleSave = async () => {
        if (!formData) return;

        // Validation
        if (!formData.username.trim()) {
            Toast.show({ content: 'Username is required', icon: 'fail' });
            return;
        }
        if (!formData.email.trim()) {
            Toast.show({ content: 'Email is required', icon: 'fail' });
            return;
        }
        if (formData.balance < 0) {
            Toast.show({ content: 'Balance cannot be negative', icon: 'fail' });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSave(formData);
            Toast.show({ content: 'User updated successfully', icon: 'success' });
            onClose();
        } catch (error) {
            Toast.show({ content: 'Failed to update user', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof User, value: string | number) => {
        if (!formData) return;
        setFormData({
            ...formData,
            [field]: value
        });
    };

    if (!formData) return null;

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
                        Edit User Details
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
                        {/* User Avatar */}
                        <div className="text-center pb-6 border-b" style={{ borderColor: '#F3F4F6' }}>
                            <div 
                                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                style={{ backgroundColor: '#6366F1' }}
                            >
                                {formData.username.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="font-semibold text-xl" style={{ color: '#111827' }}>
                                Editing: @{formData.username}
                            </h4>
                        </div>

                        {/* Edit Form */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Basic Information</h5>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Username
                                        </label>
                                        <Input
                                            value={formData.username}
                                            onChange={(value) => handleInputChange('username', value)}
                                            placeholder="Enter username"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Email Address
                                        </label>
                                        <Input
                                            value={formData.email}
                                            onChange={(value) => handleInputChange('email', value)}
                                            placeholder="Enter email address"
                                            type="email"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Account Status
                                        </label>
                                        <Selector
                                            options={statusOptions}
                                            value={[formData.status]}
                                            onChange={(value) => handleInputChange('status', value[0])}
                                            style={{
                                                '--border': '1px solid #E5E7EB',
                                                '--border-radius': '8px',
                                                '--color': '#111827'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Statistics */}
                            <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Account Statistics</h5>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Points Balance
                                        </label>
                                        <Input
                                            value={formData.balance.toString()}
                                            onChange={(value) => handleInputChange('balance', parseInt(value) || 0)}
                                            placeholder="Enter points balance"
                                            type="number"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Tasks Completed
                                        </label>
                                        <Input
                                            value={formData.tasksCompleted.toString()}
                                            onChange={(value) => handleInputChange('tasksCompleted', parseInt(value) || 0)}
                                            placeholder="Enter tasks completed"
                                            type="number"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Read-only Information */}
                            <div className="bg-gray-50 rounded-xl p-4" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Read-only Information</h5>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium" style={{ color: '#6B7280' }}>User ID:</span>
                                        <span className="font-mono text-sm" style={{ color: '#9CA3AF' }}>{formData.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium" style={{ color: '#6B7280' }}>Join Date:</span>
                                        <span style={{ color: '#9CA3AF' }}>
                                            {new Date(formData.joinDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-white" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex gap-3">
                        <Button 
                            block 
                            fill="outline"
                            onClick={onClose}
                            style={{ 
                                flex: 1,
                                borderColor: '#D1D5DB',
                                color: '#6B7280',
                                backgroundColor: '#FFFFFF'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            block 
                            loading={loading}
                            onClick={handleSave}
                            style={{ 
                                flex: 1,
                                backgroundColor: '#6366F1',
                                borderColor: '#6366F1',
                                color: '#FFFFFF'
                            }}
                        >
                            <SaveOutlined /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};
