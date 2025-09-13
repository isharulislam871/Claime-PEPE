'use client';

import { EditOutlined, EyeOutlined, CloseOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Popup, SearchBar, Dialog } from "antd-mobile";
import { useState } from "react";
import { UserDetailsEditPopup } from "./UserDetailsEditPopup";
import { formatNumber, formatNumberWithCommas } from "../../lib/formatNumber";

const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#F59E0B';
      case 'banned': return '#EF4444';
      case 'paused': return '#F59E0B';
      default: return '#6B7280';
    }
  };

 const users = [
        {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            balance: 15000,
            tasksCompleted: 25,
            joinDate: '2024-01-15',
            status: 'active'
        },
        {
            id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            balance: 8500,
            tasksCompleted: 18,
            joinDate: '2024-02-01',
            status: 'active'
        },
        {
            id: '3',
            username: 'mike_wilson',
            email: 'mike@example.com',
            balance: 2300,
            tasksCompleted: 5,
            joinDate: '2024-03-10',
            status: 'inactive'
        }
    ]

export const Users = () => {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [usersData, setUsersData] = useState(users);
    const [searchValue, setSearchValue] = useState('');

    const handleViewUser = (user: any) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setShowEditPopup(true);
    };

    const handleClosePopup = () => {
        setShowUserDetails(false);
        setSelectedUser(null);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (updatedUser: any) => {
        setUsersData(prevUsers => 
            prevUsers.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };
 

    const filteredUsers = usersData.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchValue.toLowerCase())  
        return matchesSearch;
    });

    const renderUserItem = (user: any) => (
        <Card key={user.id} className="mb-3">
            <div className="flex items-center justify-between p-1">
                <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <UserOutlined className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-800">{user.username}</div>
                    
                        <div className="text-xs flex items-center gap-4">
                            <span>
                                Balance: <span style={{ color: '#10B981' }}>{formatNumber(user.balance)} pts</span>
                            </span>
                            <span>
                                Tasks: <span style={{ color: '#3F83F8' }}>{formatNumberWithCommas(user.tasksCompleted)}</span>
                            </span>
                          
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        content={user.status}
                        style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                    <Button size="small" fill="none" style={{ color: '#3F83F8' }} onClick={() => handleViewUser(user)}>
                        <EyeOutlined />
                    </Button>
                    <Button size="small" fill="none" style={{ color: '#F59E0B' }} onClick={() => handleEditUser(user)}>
                        <EditOutlined />
                    </Button>
                </div>
            </div>
        </Card>
    );
   
    return (
        <div className="space-y-4">
            {/* Header */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <UserOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                            <p className="text-sm text-gray-500">Manage and monitor user accounts</p>
                        </div>
                    </div>
               
                </div>

                {/* Search */}
                <div className="mb-4">
                    <SearchBar
                        placeholder="Search users..."
                        value={searchValue}
                        onChange={setSearchValue}
                        style={{ backgroundColor: 'white' }}
                    />
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{formatNumberWithCommas(usersData.filter(u => u.status === 'active').length)}</div>
                        <div className="text-xs text-green-600">Active Users</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{formatNumberWithCommas(usersData.filter(u => u.status === 'inactive').length)}</div>
                        <div className="text-xs text-yellow-600">Inactive Users</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{formatNumber(usersData.reduce((sum, u) => sum + u.balance, 0))}</div>
                        <div className="text-xs text-blue-600">Total Balance</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{formatNumber(usersData.reduce((sum, u) => sum + u.tasksCompleted, 0))}</div>
                        <div className="text-xs text-purple-600">Total Tasks</div>
                    </div>
                </div>
            </Card>

            {/* Users List */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">All Users</h3>
                    <Badge 
                        content={filteredUsers.length} 
                        style={{ backgroundColor: '#8B5CF6' }} 
                    />
                </div>
                
                <div className="space-y-3">
                    {filteredUsers.map(renderUserItem)}
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <SearchOutlined className="text-4xl mb-2" />
                            <div>No users found</div>
                        </div>
                    )}
                </div>
            </Card>

            {/* User Details Popup */}
            <Popup
                visible={showUserDetails}
                onMaskClick={handleClosePopup}
                bodyStyle={{
                    height: '100vh',
                    width: '100vw',
                    borderRadius: '0px',
                    margin: 0,
                    padding: 0,
                }}
              
            >
                {selectedUser && (
                    <div className="h-full flex flex-col bg-white">
                        {/* Full Screen Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10" style={{ borderColor: '#F3F4F6' }}>
                            <h3 className="text-lg font-semibold" style={{ color: '#111827' }}>
                                User Details
                            </h3>
                            <Button 
                                fill="none" 
                                size="small" 
                                onClick={handleClosePopup}
                                style={{ color: '#9CA3AF', backgroundColor: '#F9FAFB' }}
                            >
                                <CloseOutlined />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-6">
                            {/* User Avatar and Basic Info */}
                            <div className="text-center pb-6 border-b" style={{ borderColor: '#F3F4F6' }}>
                                <div 
                                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                                    style={{ backgroundColor: '#6366F1' }}
                                >
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <h4 className="font-semibold text-xl mb-1" style={{ color: '#111827' }}>
                                    @{selectedUser.username}
                                </h4>
                                <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                                    {selectedUser.email}
                                </p>
                                <Badge
                                    content={selectedUser.status.toUpperCase()}
                                    style={{ 
                                        backgroundColor: getStatusColor(selectedUser.status),
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '4px 12px',
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>

                            {/* User Statistics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                    <div className="text-3xl font-bold mb-1" style={{ color: '#059669' }}>
                                        {selectedUser.balance.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                        Points Balance
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                    <div className="text-3xl font-bold mb-1" style={{ color: '#6366F1' }}>
                                        {selectedUser.tasksCompleted}
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                                        Tasks Completed
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                <h5 className="font-semibold mb-4" style={{ color: '#111827' }}>Account Information</h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                                        <span className="font-medium" style={{ color: '#374151' }}>User ID:</span>
                                        <span className="font-mono text-sm" style={{ color: '#6B7280' }}>{selectedUser.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F3F4F6' }}>
                                        <span className="font-medium" style={{ color: '#374151' }}>Join Date:</span>
                                        <span style={{ color: '#6B7280' }}>
                                            {new Date(selectedUser.joinDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="font-medium" style={{ color: '#374151' }}>Account Status:</span>
                                        <span className="font-semibold" style={{ color: getStatusColor(selectedUser.status) }}>
                                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button 
                                    block 
                                    fill="outline"
                                    style={{ 
                                        flex: 1,
                                        borderColor: '#6366F1',
                                        color: '#6366F1',
                                        backgroundColor: '#FFFFFF',
                                        fontWeight: '500'
                                    }}
                                >
                                    <EditOutlined /> Edit User
                                </Button>
                                <Button 
                                    block 
                                    fill="outline"
                                    style={{ 
                                        flex: 1,
                                        borderColor: '#EF4444',
                                        color: '#EF4444',
                                        backgroundColor: '#FFFFFF',
                                        fontWeight: '500'
                                    }}
                                >
                                    Suspend User
                                </Button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            {/* User Details Edit Popup */}
            <UserDetailsEditPopup
                visible={showEditPopup}
                user={selectedUser}
                onClose={handleCloseEditPopup}
                onSave={handleSaveUser}
            />
        </div>
    )
};