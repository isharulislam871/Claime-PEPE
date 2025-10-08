'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Tag, Modal, Input, Select, message, Descriptions, Timeline, Tooltip, Alert, Spin, Avatar, Steps, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, WalletOutlined, CalendarOutlined, CopyOutlined, ExclamationCircleOutlined, SecurityScanOutlined, LinkOutlined, ClockCircleOutlined, LoadingOutlined, SyncOutlined, GlobalOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { AppDispatch } from '@/modules/store';
import {
  fetchWithdrawalDetailsRequest,
  updateWithdrawalStatusRequest,
  setUpdateModalVisible,
  setConfirmModalVisible,
  setNewStatus,
  setTransactionId,
  setFailureReason,
  setAdminNotes,
  clearWithdrawalForm,
  selectCurrentWithdrawal,
  selectCurrentWithdrawalLoading,
  selectCurrentWithdrawalError,
  selectUpdateModalVisible,
  selectConfirmModalVisible,
  selectUpdating,
  selectNewStatus,
  selectTransactionId,
  selectFailureReason,
  selectAdminNotes,
  selectCanUpdateStatus,
  selectUpdateSummary,
  Withdrawal
} from '@/modules/admin/withdrawals';

const { TextArea } = Input;
const { Option } = Select;

export default function WithdrawalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const withdrawalId = params.id as string;
  
  // Redux state
  const withdrawal = useSelector(selectCurrentWithdrawal);
  const loading = useSelector(selectCurrentWithdrawalLoading);
  const error = useSelector(selectCurrentWithdrawalError);
  const updateModalVisible = useSelector(selectUpdateModalVisible);
  const confirmModalVisible = useSelector(selectConfirmModalVisible);
  const updating = useSelector(selectUpdating);
  const newStatus = useSelector(selectNewStatus);
  const transactionId = useSelector(selectTransactionId);
  const failureReason = useSelector(selectFailureReason);
  const adminNotes = useSelector(selectAdminNotes);
  const canUpdateStatus = useSelector(selectCanUpdateStatus);
  const updateSummary = useSelector(selectUpdateSummary);

  useEffect(() => {
    if (withdrawalId) {
      dispatch(fetchWithdrawalDetailsRequest(withdrawalId));
    }
  }, [withdrawalId, dispatch]);
  
  // Handle Redux errors
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleUpdateStatus = () => {
    if (!canUpdateStatus) {
      if (newStatus === 'completed' && !transactionId.trim()) {
        message.error('Transaction ID is required for completed withdrawals');
      } else if ((newStatus === 'failed' || newStatus === 'cancelled') && !failureReason.trim()) {
        message.error('Failure reason is required for failed/cancelled withdrawals');
      }
      return;
    }
    dispatch(setConfirmModalVisible(true));
  };

  const confirmUpdate = () => {
    if (withdrawal?._id) {
      dispatch(updateWithdrawalStatusRequest(
        withdrawal._id,
        newStatus,
        transactionId,
        failureReason,
        adminNotes
      ));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ExclamationCircleOutlined />;
      case 'processing': return <EditOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'failed': return <CloseCircleOutlined />;
      case 'cancelled': return <CloseCircleOutlined />;
      default: return null;
    }
  };

  const getRiskLevel = (amount: number) => {
    if (amount > 10000) return { level: 'high', color: 'red' };
    if (amount > 1000) return { level: 'medium', color: 'orange' };
    return { level: 'low', color: 'green' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBlockchainExplorers = (currency: string, transactionId: string) => {
    const currencyLower = currency.toLowerCase();
    const explorers: { [key: string]: { name: string; url: string; icon?: string }[] } = {
      'btc': [
        { name: 'Blockstream', url: `https://blockstream.info/tx/${transactionId}` },
        { name: 'Blockchain.info', url: `https://www.blockchain.com/btc/tx/${transactionId}` },
        { name: 'Blockchair', url: `https://blockchair.com/bitcoin/transaction/${transactionId}` }
      ],
      'eth': [
        { name: 'Etherscan', url: `https://etherscan.io/tx/${transactionId}` },
        { name: 'Blockchair', url: `https://blockchair.com/ethereum/transaction/${transactionId}` },
        { name: 'EtherScan.io', url: `https://etherscan.io/tx/${transactionId}` }
      ],
      'usdt': [
        { name: 'Etherscan (ERC-20)', url: `https://etherscan.io/tx/${transactionId}` },
        { name: 'BSCScan (BEP-20)', url: `https://bscscan.com/tx/${transactionId}` },
        { name: 'Tronscan (TRC-20)', url: `https://tronscan.org/#/transaction/${transactionId}` }
      ],
      'bnb': [
        { name: 'BSCScan', url: `https://bscscan.com/tx/${transactionId}` },
        { name: 'Binance Explorer', url: `https://explorer.binance.org/tx/${transactionId}` }
      ],
      'pepe': [
        { name: 'Etherscan', url: `https://etherscan.io/tx/${transactionId}` },
        { name: 'DexTools', url: `https://www.dextools.io/app/en/ether/pair-explorer/${transactionId}` }
      ],
      'doge': [
        { name: 'Dogechain', url: `https://dogechain.info/tx/${transactionId}` },
        { name: 'Blockchair', url: `https://blockchair.com/dogecoin/transaction/${transactionId}` }
      ]
    };
    return explorers[currencyLower] || [
      { name: 'Etherscan', url: `https://etherscan.io/tx/${transactionId}` }
    ];
  };

  const viewOnBlockchain = (explorerUrl?: string) => {
    if (withdrawal?.transactionId) {
      const explorers = getBlockchainExplorers(withdrawal.currency, withdrawal.transactionId);
      const url = explorerUrl || explorers[0]?.url;
      if (url) {
        window.open(url, '_blank');
      }
    }
  };

  const getNetworkInfo = (currency: string) => {
    const networks: { [key: string]: { name: string; color: string; icon: string } } = {
      'btc': { name: 'Bitcoin Network', color: 'orange', icon: '₿' },
      'eth': { name: 'Ethereum Network', color: 'blue', icon: 'Ξ' },
      'usdt': { name: 'Multi-Chain (ETH/BSC/TRX)', color: 'green', icon: '₮' },
      'bnb': { name: 'Binance Smart Chain', color: 'yellow', icon: 'BNB' },
      'pepe': { name: 'Ethereum Network', color: 'green', icon: '🐸' },
      'doge': { name: 'Dogecoin Network', color: 'yellow', icon: 'Ð' }
    };
    return networks[currency.toLowerCase()] || { name: 'Unknown Network', color: 'gray', icon: '?' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Withdrawal Not Found</h2>
        <p className="text-gray-500 mb-4">The requested withdrawal could not be located</p>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const riskLevel = getRiskLevel(withdrawal.amount);

  const getStepsData = () => {
    const steps = [
      {
        title: 'Request Submitted',
        description: 'Withdrawal request created',
        icon: <ExclamationCircleOutlined />,
        status: 'finish' as const
      },
      {
        title: 'Processing',
        description: 'Verifying and preparing transaction',
        icon: withdrawal.status === 'processing' ? <LoadingOutlined /> : <SyncOutlined />,
        status: withdrawal.status === 'pending' ? 'wait' as const : 
               withdrawal.status === 'processing' ? 'process' as const : 'finish' as const
      },
      {
        title: 'Transaction',
        description: withdrawal.status === 'completed' ? 'Transaction confirmed' :
                    withdrawal.status === 'failed' ? 'Transaction failed' :
                    withdrawal.status === 'cancelled' ? 'Transaction cancelled' :
                    'Awaiting blockchain confirmation',
        icon: withdrawal.status === 'completed' ? <CheckCircleOutlined /> :
              withdrawal.status === 'failed' || withdrawal.status === 'cancelled' ? <CloseCircleOutlined /> :
              <ClockCircleOutlined />,
        status: withdrawal.status === 'completed' ? 'finish' as const :
               withdrawal.status === 'failed' || withdrawal.status === 'cancelled' ? 'error' as const :
               withdrawal.status === 'processing' ? 'process' as const : 'wait' as const
      }
    ];
    return steps;
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            className="text-blue-600"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Withdrawal Details</h1>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                {withdrawal._id}
              </code>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(withdrawal._id, 'Withdrawal ID')}
                className="text-blue-500"
              />
            </div>
          </div>
        </div>
        
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => dispatch(setUpdateModalVisible(true))}
        >
          Update Status
        </Button>
      </div>

      {/* Risk Alert */}
      {riskLevel.level === 'high' && (
        <Alert
          message="High Value Withdrawal Alert"
          description="This withdrawal requires additional verification due to its high value."
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {/* Withdrawal Process Steps */}
   

     
      <Card className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Withdrawal Process</h3>
          <p className="text-sm text-gray-500">Track the progress of this withdrawal request</p>
        </div>
        <Steps
          current={withdrawal.status === 'pending' ? 0 :
                  withdrawal.status === 'processing' ? 1 :
                  withdrawal.status === 'completed' || withdrawal.status === 'failed' || withdrawal.status === 'cancelled' ? 2 : 0}
          status={withdrawal.status === 'failed' || withdrawal.status === 'cancelled' ? 'error' : 'process'}
          items={getStepsData()}
          className="mb-4"
        />
        {withdrawal.transactionId && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircleOutlined />
              <span className="font-medium">Transaction Hash Available</span>
            </div>
            <div className="mt-1 font-mono text-xs text-green-600 break-all">
              {withdrawal.transactionId}
            </div>
          </div>
        )}
      </Card>
 

   
      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
        {/* Left Column - Main Details */}
        <div className="xl:col-span-3">
          {/* Basic Information */}
          
          <Card title="Withdrawal Details" className="mt-6 mb-6">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Amount">
                <span className="font-mono text-lg font-bold text-blue-600">
                  {withdrawal.amount.toFixed(6)} {withdrawal.currency.toUpperCase()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Network">
                {withdrawal.method?.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {withdrawal.username} (@{withdrawal.telegramId})
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(withdrawal.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Wallet Address */}
          <Card title="Destination Wallet" className="mb-6">
            <div className="flex items-center gap-3">
              <div className="font-mono text-sm bg-gray-100 p-3 rounded flex-1 break-all">
                {withdrawal.walletId}
              </div>
              <Button 
                icon={<CopyOutlined />} 
                onClick={() => copyToClipboard(withdrawal.walletId, 'Wallet Address')}
              />
            </div>
          </Card>

          {/* Transaction Details */}
          {withdrawal.transactionId && (
            <Card title="Transaction Hash" className="mb-6">
              <div className="flex items-center gap-3">
                <div className="font-mono text-sm bg-green-50 p-3 rounded flex-1 break-all">
                  {withdrawal.transactionId}
                </div>
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={() => copyToClipboard(withdrawal.transactionId!, 'Transaction ID')}
                />
              </div>
            </Card>
          )}

          {/* Failure Reason */}
          {withdrawal.failureReason && (
            <Card title="Failure Reason" className="mb-6">
              <Alert
                message={withdrawal.failureReason}
                type="error"
                showIcon
              />
            </Card>
          )}

          {/* Admin Notes */}
          {withdrawal.adminNotes && (
            <Card title="Admin Notes" className="mb-6">
              <div className="bg-blue-50 p-3 rounded">
                {withdrawal.adminNotes}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* User Info */}
          <Card title="User Information">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Full Name</div>
                <div className="font-medium">
                  {withdrawal.firstName || withdrawal.lastName 
                    ? `${withdrawal.firstName || ''} ${withdrawal.lastName || ''}`.trim()
                    : 'Not provided'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">User ID</div>
                <div className="font-mono text-xs break-all">{withdrawal.userId}</div>
              </div>
              {withdrawal.ipAddress && (
                <div>
                  <div className="text-sm text-gray-500">IP Address</div>
                  <div className="font-mono text-xs">{withdrawal.ipAddress}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Status Timeline">
            <Timeline  >
              <Timeline.Item color="blue">
                <div className="text-sm">
                  <div className="font-medium">Created</div>
                  <div className="text-gray-500">{formatDate(withdrawal.createdAt)}</div>
                </div>
              </Timeline.Item>
              
              {withdrawal.processedAt && (
                <Timeline.Item color={withdrawal.status === 'completed' ? 'green' : 'red'}>
                  <div className="text-sm">
                    <div className="font-medium">
                      {withdrawal.status === 'completed' ? 'Completed' : 'Failed'}
                    </div>
                    <div className="text-gray-500">{formatDate(withdrawal.processedAt)}</div>
                  </div>
                </Timeline.Item>
              )}
              
              <Timeline.Item color="gray">
                <div className="text-sm">
                  <div className="font-medium">Last Updated</div>
                  <div className="text-gray-500">{formatDate(withdrawal.updatedAt)}</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* Network Information */}
          <Card title="Network Information">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getNetworkInfo(withdrawal.currency).icon}</span>
                  <div>
                    <div className="font-medium text-sm">{withdrawal.currency.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{getNetworkInfo(withdrawal.currency).name}</div>
                  </div>
                </div>
                <Tag color={getNetworkInfo(withdrawal.currency).color} className="font-semibold">
                  {withdrawal.method?.toUpperCase() || 'MAINNET'}
                </Tag>
              </div>
              
              {withdrawal.transactionId && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Blockchain Explorers</div>
                  {getBlockchainExplorers(withdrawal.currency, withdrawal.transactionId).map((explorer, index) => (
                    <Button
                      key={index}
                      block
                      size="small"
                      icon={<GlobalOutlined />}
                      onClick={() => viewOnBlockchain(explorer.url)}
                      className="text-left justify-start"
                    >
                      View on {explorer.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>


 
      {/* Update Status Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-gray-500" />
            <span className="text-lg font-semibold">Update Withdrawal Status</span>
          </div>
        }
        open={updateModalVisible}
        onCancel={() => dispatch(setUpdateModalVisible(false))}
        onOk={handleUpdateStatus}
        confirmLoading={updating}
        okText="Update Status"
        className="admin-modal"
        width={600}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <Select
              value={newStatus}
              onChange={(value) => dispatch(setNewStatus(value))}
              className="w-full"
              placeholder="Select new status"
            >
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="completed">Completed</Option>
              <Option value="failed">Failed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </div>

          {newStatus === 'completed' && (
            <div>
              <label className="block text-sm font-medium mb-2">Transaction ID *</label>
              <Input
                value={transactionId}
                onChange={(e) => dispatch(setTransactionId(e.target.value))}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {(newStatus === 'failed' || newStatus === 'cancelled') && (
            <div>
              <label className="block text-sm font-medium mb-2">Failure Reason *</label>
              <TextArea
                value={failureReason}
                onChange={(e) => dispatch(setFailureReason(e.target.value))}
                placeholder="Enter failure reason"
                rows={3}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Admin Notes</label>
            <TextArea
              value={adminNotes}
              onChange={(e) => dispatch(setAdminNotes(e.target.value))}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>
        </div>
      </Modal>
 
      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-gray-500" />
            <span className="text-lg font-semibold">Confirm Status Update</span>
          </div>
        }
        open={confirmModalVisible}
        onCancel={() => dispatch(setConfirmModalVisible(false))}
        onOk={confirmUpdate}
        confirmLoading={updating}
        okText="Confirm Update"
        okType="primary"
        className="admin-modal"
        width={500}
      >
        <div className="space-y-3">
          <p>Are you sure you want to update this withdrawal status?</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Current Status:</span>
                <Tag color={getStatusColor(updateSummary.currentStatus)} className="font-bold">
                  {updateSummary.currentStatus.toUpperCase()}
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">New Status:</span>
                <Tag color={getStatusColor(updateSummary.newStatus)} className="font-bold">
                  {updateSummary.newStatus.toUpperCase()}
                </Tag>
              </div>
              {updateSummary.newStatus === 'completed' && updateSummary.transactionId && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-700 mb-1">Transaction ID:</div>
                  <div className="font-mono text-sm text-green-600 break-all">{updateSummary.transactionId}</div>
                </div>
              )}
              {(updateSummary.newStatus === 'failed' || updateSummary.newStatus === 'cancelled') && updateSummary.failureReason && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="font-semibold text-red-700 mb-1">Reason:</div>
                  <div className="text-red-600">{updateSummary.failureReason}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
