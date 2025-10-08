'use client';

import { CloseOutlined, SaveOutlined, UserOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Input, Popup, Selector, TextArea, Toast } from "antd-mobile";
import { useState } from "react";

interface Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    category: 'Ads' | 'Social' | 'Survey' | 'Referral' | 'Daily';
    status: 'active' | 'inactive' | 'banned' | 'paused';
    completions: number;
    duration?: number;
    url?: string;
    type?: string;
}

interface TaskAddPopupProps {
    visible: boolean;
    onClose: () => void;
    onSave: (newTask: Task) => void;
}

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Paused', value: 'paused' }
];

const socialPlatforms = [
    { label: 'Twitter/X', value: 'twitter' }
];

export const TaskAddPopup = ({ visible, onClose, onSave }: TaskAddPopupProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<Task, 'id'>>({
        title: '',
        description: '',
        reward: 100,
        category: 'Social',
        status: 'active',
        completions: 0,
        url: '',
        type: 'twitter'
    });

    const handleSave = async () => {
        // Validation
        if (!formData.title.trim()) {
            Toast.show({ content: 'Task title is required', icon: 'fail' });
            return;
        }
        if (!formData.description.trim()) {
            Toast.show({ content: 'Task description is required', icon: 'fail' });
            return;
        }
        if (formData.reward <= 0) {
            Toast.show({ content: 'Reward must be greater than 0', icon: 'fail' });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newTask: Task = {
                ...formData,
                id: Date.now().toString() // Simple ID generation
            };
            
            onSave(newTask);
            Toast.show({ content: 'Task created successfully', icon: 'success' });
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                reward: 100,
                category: 'Social',
                status: 'active',
                completions: 0,
                url: '',
                type: 'twitter'
            });
            
            onClose();
        } catch (error) {
            Toast.show({ content: 'Failed to create task', icon: 'fail' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Omit<Task, 'id'>, value: string | number) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

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
                        Add New Task
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
                        {/* Task Header */}
                        <div className="text-center pb-6 border-b" style={{ borderColor: '#F3F4F6' }}>
                            <div 
                                className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl shadow-lg"
                                style={{ backgroundColor: '#8B5CF6' }}
                            >
                                <UserOutlined />
                            </div>
                            <h4 className="font-semibold text-xl" style={{ color: '#111827' }}>
                                Create Social Media Task
                            </h4>
                            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                                Add a new social media follow task
                            </p>
                        </div>

                        {/* Add Form */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Basic Information</h5>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Task Title
                                        </label>
                                        <Input
                                            value={formData.title}
                                            onChange={(value) => handleInputChange('title', value)}
                                            placeholder="Enter task title"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Description
                                        </label>
                                        <TextArea
                                            value={formData.description}
                                            onChange={(value) => handleInputChange('description', value)}
                                            placeholder="Enter task description"
                                            rows={3}
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Social Media URL
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                                <LinkOutlined style={{ color: '#9CA3AF' }} />
                                            </div>
                                            <Input
                                                value={formData.url || ''}
                                                onChange={(value) => handleInputChange('url', value)}
                                                placeholder="https://twitter.com/taskup"
                                                style={{ 
                                                    '--color': '#111827',
                                                    paddingLeft: '2.5rem'
                                                } as any}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Status
                                        </label>
                                        <Selector
                                            options={statusOptions}
                                            value={[formData.status]}
                                            onChange={(value) => handleInputChange('status', value[0])}
                                            style={{
                                                '--border': '1px solid #E5E7EB',
                                                '--border-radius': '8px',
                                                '--color': '#111827',
                                                '--background-color': '#FFFFFF'
                                            } as any}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Settings */}
                            <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Social Media Settings</h5>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                                Reward Points
                                            </label>
                                            <Input
                                                value={formData.reward.toString()}
                                                onChange={(value) => handleInputChange('reward', parseInt(value) || 0)}
                                                placeholder="100"
                                                type="number"
                                                style={{ 
                                                    '--color': '#111827'
                                                } as any}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                                Platform Type
                                            </label>
                                            <Selector
                                                options={socialPlatforms}
                                                value={[formData.type || 'twitter']}
                                                onChange={(value) => handleInputChange('type', value[0])}
                                                style={{
                                                    '--border': '1px solid #E5E7EB',
                                                    '--border-radius': '8px',
                                                    '--color': '#111827',
                                                    '--background-color': '#FFFFFF'
                                                } as any}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                                            Initial Completions
                                        </label>
                                        <Input
                                            value={formData.completions.toString()}
                                            onChange={(value) => handleInputChange('completions', parseInt(value) || 0)}
                                            placeholder="0"
                                            type="number"
                                            style={{ 
                                                '--color': '#111827'
                                            } as any}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Task Preview */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                    <div className="text-3xl font-bold mb-1" style={{ color: '#059669' }}>
                                        {formData.reward}
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                        Reward Points
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                    <div className="text-3xl font-bold mb-1" style={{ color: '#8B5CF6' }}>
                                        {formData.completions.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                        Initial Completions
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Information */}
                            <div className="bg-purple-50 rounded-xl p-4" style={{ border: '1px solid #E9D5FF' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#7C3AED' }}>Task Preview</h5>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium" style={{ color: '#374151' }}>Task Type:</span>
                                        <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ 
                                            backgroundColor: '#E9D5FF', 
                                            color: '#7C3AED' 
                                        }}>
                                            Social Media Follow
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium" style={{ color: '#374151' }}>Platform:</span>
                                        <span className="px-2 py-1 rounded-md text-xs font-medium capitalize" style={{ 
                                            backgroundColor: '#F3E8FF',
                                            color: '#8B5CF6'
                                        }}>
                                            {formData.type || 'Twitter'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium" style={{ color: '#374151' }}>Status:</span>
                                        <span className="px-2 py-1 rounded-md text-xs font-medium capitalize" style={{ 
                                            backgroundColor: formData.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                                            color: formData.status === 'active' ? '#065F46' : '#92400E'
                                        }}>
                                            {formData.status}
                                        </span>
                                    </div>
                                    {formData.url && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium" style={{ color: '#374151' }}>Target URL:</span>
                                            <span className="text-xs font-mono" style={{ color: '#6B7280' }}>
                                                {formData.url.length > 30 ? formData.url.substring(0, 30) + '...' : formData.url}
                                            </span>
                                        </div>
                                    )}
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
                                backgroundColor: '#8B5CF6',
                                borderColor: '#8B5CF6',
                                color: '#FFFFFF'
                            }}
                        >
                            <SaveOutlined /> Create Task
                        </Button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};
