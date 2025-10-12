'use client';

import { EditOutlined, EyeOutlined, CloseOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Popup, SearchBar, Dialog, Toast, PullToRefresh } from "antd-mobile";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserDetailsEditPopup } from "./UserDetailsEditPopup";
import { formatNumber, formatNumberWithCommas } from "../../lib/formatNumber";
import { AppDispatch } from '@/modules/store';
import {
    fetchUsersRequest,
    refreshUsersRequest,
    setSearchText,
    setStatusFilter,
    setCurrentPage,
    clearFilters
} from '@/modules/admin/users/actions';
import {
    selectUsers,
    selectUsersLoading,
    selectUsersRefreshing,
    selectUsersError,
    selectSearchText,
    selectStatusFilter,
    selectPagination,
    selectFilteredUsers,
    selectHasActiveFilters
} from '@/modules/admin/users/selectors';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10B981';
        case 'inactive': return '#F59E0B';
        case 'banned': return '#EF4444';
        case 'paused': return '#F59E0B';
        default: return '#6B7280';
    }
};

export const Users = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Redux selectors
    const users = useSelector(selectUsers);
    const loading = useSelector(selectUsersLoading);
    const refreshing = useSelector(selectUsersRefreshing);
    const error = useSelector(selectUsersError);
    const searchText = useSelector(selectSearchText);
    const statusFilter = useSelector(selectStatusFilter);
    const pagination = useSelector(selectPagination);
    const filteredUsers = useSelector(selectFilteredUsers);
    const hasActiveFilters = useSelector(selectHasActiveFilters);

    // Local UI state
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);

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
        // This would typically dispatch an update user action
        // For now, we'll just close the popup and refresh the data
        dispatch(refreshUsersRequest());
    };

    // Handle pull to refresh
    const handleRefresh = async () => {
        dispatch(refreshUsersRequest());
    };

    // Handle search
    const handleSearch = (value: string) => {
        dispatch(setSearchText(value));
    };

    // Handle status filter
    const handleStatusFilter = (status: string) => {
        dispatch(setStatusFilter(status));
    };

    // Handle clear filters
    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    // Initial data fetch
    useEffect(() => {
        dispatch(fetchUsersRequest(1, 20));
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            Toast.show({
                icon: 'fail',
                content: `Failed to load users: ${error}`,
                duration: 3000,
            });
        }
    }, [error]);

    const renderUserItem = (user: any) => (
        <Card key={user._id} className="mb-2">
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                        <UserOutlined className="text-blue-500" style={{ fontSize: '14px' }} />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{user.username}</div>
                        <div className="text-xs text-gray-500 mb-0.5">
                            {user.telegramUsername ? `@${user.telegramUsername}` : `ID: ${user.telegramId}`}
                        </div>
                        <div className="text-xs flex items-center gap-3">
                            <span>
                                Bal: <span style={{ color: '#10B981' }}>{formatNumber(user.balance)}</span>
                            </span>
                            <span>
                                Earned: <span style={{ color: '#3F83F8' }}>{formatNumber(user.totalEarned)}</span>
                            </span>
                            <span>
                                Refs: <span style={{ color: '#8B5CF6' }}>{user.referralCount}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Badge
                        content={user.status}
                        style={{ 
                            backgroundColor: getStatusColor(user.status),
                            fontSize: '10px',
                            padding: '2px 6px'
                        }}
                    />
                    <Button size="mini" fill="none" style={{ color: '#3F83F8', padding: '4px' }} onClick={() => handleViewUser(user)}>
                        <EyeOutlined style={{ fontSize: '12px' }} />
                    </Button>
                    <Button size="mini" fill="none" style={{ color: '#F59E0B', padding: '4px' }} onClick={() => handleEditUser(user)}>
                        <EditOutlined style={{ fontSize: '12px' }} />
                    </Button>
                </div>
            </div>
        </Card>
    );

    return (
        <PullToRefresh
            onRefresh={handleRefresh}
            pullingText="Pull down to refresh..."
            canReleaseText="Release to refresh"
            refreshingText="Refreshing users data..."
            completeText="Refresh completed"
        >
            <div className="p-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Users Management</h1>
                        <p className="text-xs text-gray-500">
                            {pagination.totalCount} total users
                            {refreshing && <span className="ml-2 text-blue-600">• Refreshing...</span>}
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-3 space-y-2">
                    <SearchBar
                        placeholder="Search users..."
                        value={searchText}
                        onChange={handleSearch}
                        style={{
                            '--border-radius': '6px',
                            '--background': '#f8f9fa',
                            '--height': '36px',
                           
                        }}
                    />

                    {/* Filter Buttons */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                        <Button
                            size="mini"
                            fill={statusFilter === 'all' ? 'solid' : 'outline'}
                            onClick={() => handleStatusFilter('all')}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                            All
                        </Button>
                        <Button
                            size="mini"
                            fill={statusFilter === 'active' ? 'solid' : 'outline'}
                            color="success"
                            onClick={() => handleStatusFilter('active')}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                            Active
                        </Button>
                        <Button
                            size="mini"
                            fill={statusFilter === 'inactive' ? 'solid' : 'outline'}
                            color="warning"
                            onClick={() => handleStatusFilter('inactive')}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                            Inactive
                        </Button>
                        <Button
                            size="mini"
                            fill={statusFilter === 'banned' ? 'solid' : 'outline'}
                            color="danger"
                            onClick={() => handleStatusFilter('banned')}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                            Banned
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                size="mini"
                                fill="none"
                                onClick={handleClearFilters}
                                style={{ fontSize: '12px', padding: '4px 8px' }}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Users List */}
                <div className="space-y-2">
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                            <Card key={index} className="mb-2">
                                <div className="flex items-center p-2">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                                        <div className="h-2 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-6">
                            <div className="text-sm text-gray-500">
                                {hasActiveFilters ? 'No users match your filters' : 'No users found'}
                            </div>
                        </div>
                    ) : (
                        filteredUsers.map(renderUserItem)
                    )}
                </div>

                {/* Load More Button */}
                {!loading && pagination.hasNextPage && (
                    <div className="mt-3 text-center">
                        <Button
                            size="small"
                            onClick={() => { dispatch(setCurrentPage(pagination.currentPage + 1)); }}
                            loading={loading}
                            style={{ fontSize: '12px' }}
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </div>

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
                        <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0 z-10" style={{ borderColor: '#F3F4F6' }}>
                            <h3 className="text-base font-semibold" style={{ color: '#111827' }}>
                                User Details
                            </h3>
                            <Button
                                fill="none"
                                size="mini"
                                onClick={handleClosePopup}
                                style={{ color: '#9CA3AF', backgroundColor: '#F9FAFB', padding: '4px' }}
                            >
                                <CloseOutlined style={{ fontSize: '14px' }} />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-3">
                            <div className="space-y-4">
                                {/* User Avatar and Basic Info */}
                                <div className="text-center pb-4 border-b" style={{ borderColor: '#F3F4F6' }}>
                                    <div
                                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold shadow-lg"
                                        style={{ backgroundColor: '#6366F1' }}
                                    >
                                        {selectedUser.username.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 className="font-semibold text-lg mb-1" style={{ color: '#111827' }}>
                                        @{selectedUser.username}
                                    </h4>
                                    <p className="text-xs mb-2" style={{ color: '#6B7280' }}>
                                        {selectedUser.telegramUsername ? `@${selectedUser.telegramUsername}` : `ID: ${selectedUser.telegramId}`}
                                    </p>
                                    <Badge
                                        content={selectedUser.status.toUpperCase()}
                                        style={{
                                            backgroundColor: getStatusColor(selectedUser.status),
                                            color: 'white',
                                            fontWeight: '500',
                                            padding: '3px 8px',
                                            borderRadius: '8px',
                                            fontSize: '10px'
                                        }}
                                    />
                                </div>

                                {/* User Statistics */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                        <div className="text-lg font-bold mb-0.5" style={{ color: '#059669' }}>
                                            {formatNumber(selectedUser.balance)}
                                        </div>
                                        <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                            Balance
                                        </div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #F3F4F6' }}>
                                        <div className="text-lg font-bold mb-0.5" style={{ color: '#6366F1' }}>
                                            {formatNumber(selectedUser.totalEarned)}
                                        </div>
                                        <div className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                            Total Earned
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="bg-white rounded-lg p-3 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
                                    <h5 className="font-semibold mb-3 text-sm" style={{ color: '#111827' }}>Account Information</h5>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#F3F4F6' }}>
                                            <span className="font-medium text-xs" style={{ color: '#374151' }}>User ID:</span>
                                            <span className="font-mono text-xs" style={{ color: '#6B7280' }}>{selectedUser._id}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#F3F4F6' }}>
                                            <span className="font-medium text-xs" style={{ color: '#374151' }}>Referrals:</span>
                                            <span className="text-xs" style={{ color: '#6B7280' }}>
                                                {selectedUser.referralCount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b" style={{ borderColor: '#F3F4F6' }}>
                                            <span className="font-medium text-xs" style={{ color: '#374151' }}>Created:</span>
                                            <span className="text-xs" style={{ color: '#6B7280' }}>
                                                {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="font-medium text-xs" style={{ color: '#374151' }}>Status:</span>
                                            <span className="font-semibold text-xs" style={{ color: getStatusColor(selectedUser.status) }}>
                                                {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        block
                                        size="small"
                                        fill="outline"
                                        onClick={() => handleEditUser(selectedUser)}
                                        style={{
                                            flex: 1,
                                            borderColor: '#6366F1',
                                            color: '#6366F1',
                                            backgroundColor: '#FFFFFF',
                                            fontWeight: '500',
                                            fontSize: '12px'
                                        }}
                                    >
                                        <EditOutlined style={{ fontSize: '12px' }} /> Edit
                                    </Button>
                                    <Button
                                        block
                                        size="small"
                                        fill="outline"
                                        style={{
                                            flex: 1,
                                            borderColor: '#EF4444',
                                            color: '#EF4444',
                                            backgroundColor: '#FFFFFF',
                                            fontWeight: '500',
                                            fontSize: '12px'
                                        }}
                                    >
                                        <CloseOutlined style={{ fontSize: '12px' }} /> Suspend
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
        </PullToRefresh>
    );
};