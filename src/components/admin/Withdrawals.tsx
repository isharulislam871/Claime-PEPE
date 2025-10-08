'use client';

import { EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Card, SearchBar } from "antd-mobile";
import { useState } from "react";
import { WithdrawalDetailsPopup } from "./WithdrawalDetailsPopup";

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

    const withdrawals =[
      {
        id: 'w1',
        userId: 'u1',
        username: 'john_doe',
        amount: 25.50,
        currency: 'USDT',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C2C8b1e6d1f1B8',
        status: 'pending',
        requestDate: '2024-01-15T10:30:00Z'
      },
      {
        id: 'w2',
        userId: 'u2',
        username: 'jane_smith',
        amount: 50.00,
        currency: 'BTC',
        walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        status: 'approved',
        requestDate: '2024-01-14T15:45:00Z',
        processedDate: '2024-01-14T16:00:00Z'
      },
      {
        id: 'w3',
        userId: 'u3',
        username: 'mike_wilson',
        amount: 15.75,
        currency: 'ETH',
        walletAddress: '0x8ba1f109551bD432803012645Hac136c22C501e',
        status: 'completed',
        requestDate: '2024-01-13T09:20:00Z',
        processedDate: '2024-01-13T11:30:00Z',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      },
      {
        id: 'w4',
        userId: 'u4',
        username: 'sarah_johnson',
        amount: 100.00,
        currency: 'USDT',
        walletAddress: '0x9f8e7d6c5b4a3928374650192837465019283746',
        status: 'rejected',
        requestDate: '2024-01-12T14:15:00Z',
        processedDate: '2024-01-12T16:45:00Z'
      }
    ] 

export const Withdrawals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const filteredWithdrawals = withdrawals.filter(withdrawal => 
    withdrawal.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    withdrawal.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    withdrawal.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    withdrawal.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsPopup(true);
  };

  const handleCloseDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedWithdrawal(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
        <SearchBar
          placeholder="Search by username, currency, status, or wallet address..."
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

      {/* Binance-style Stats Header */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
            {withdrawals.filter(w => w.status === 'pending').length}
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Pending</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
            {withdrawals.filter(w => w.status === 'approved').length}
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Approved</div>
        </div>

        <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
            {withdrawals.filter(w => w.status === 'completed').length}
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Completed</div>
        </div>

        <div className="bg-white rounded-lg p-3 text-center shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
          <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
            {withdrawals.filter(w => w.status === 'rejected').length}
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Rejected</div>
        </div>
      </div>

      {/* Binance-style Withdrawal List */}
      <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
        {/* Header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>Withdrawal History</h3>
        </div>

        {/* List Items */}
        <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
          {filteredWithdrawals.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="text-gray-400 mb-2">
                <SearchOutlined style={{ fontSize: '24px' }} />
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>
                No withdrawals found matching "{searchQuery}"
              </div>
              <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                Try searching by username, currency, status, or wallet address
              </div>
            </div>
          ) : (
            filteredWithdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
              {/* Main Row */}
              <div className="flex items-center justify-between">
                {/* Left: Currency & User Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#8B5CF6' }}
                  >
                    {getCurrencyIcon(withdrawal.currency)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: '#111827' }}>
                        {withdrawal.currency}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
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
                    <div className="text-xs" style={{ color: '#6B7280' }}>
                      @{withdrawal.username} • {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="text-right">
                  <div className="font-semibold text-sm" style={{ color: '#111827' }}>
                    -{withdrawal.amount} {withdrawal.currency}
                  </div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>
                    {withdrawal.processedDate ? 
                      `Processed ${new Date(withdrawal.processedDate).toLocaleDateString()}` : 
                      'Processing...'
                    }
                  </div>
                </div>
              </div>

              {/* Wallet Address Row */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs" style={{ color: '#6B7280' }}>To: </span>
                  <span className="font-mono text-xs" style={{ color: '#374151' }}>
                    {withdrawal.walletAddress.slice(0, 12)}...{withdrawal.walletAddress.slice(-8)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-1">
                  {withdrawal.status === 'pending' && (
                    <>
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
                        Approve
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
                        Reject
                      </Button>
                    </>
                  )}
                  {withdrawal.status === 'approved' && (
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
                      Process
                    </Button>
                  )}
                  <Button 
                    size="mini" 
                    fill="none" 
                    onClick={() => handleViewDetails(withdrawal)}
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

              {/* Transaction Hash (if completed) */}
              {withdrawal.transactionHash && (
                <div className="mt-2 pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#6B7280' }}>TxHash:</span>
                    <span className="font-mono text-xs" style={{ color: '#8B5CF6' }}>
                      {withdrawal.transactionHash.slice(0, 20)}...{withdrawal.transactionHash.slice(-12)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>

      {/* Withdrawal Details Popup */}
      <WithdrawalDetailsPopup
        visible={showDetailsPopup}
        withdrawal={selectedWithdrawal}
        onClose={handleCloseDetailsPopup}
      />
    </div>
  );
};