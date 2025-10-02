import { Table, Button, Space, Tag, Tooltip, message } from 'antd';
import { 
  CopyOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Wallet } from '@/types/wallet';

interface WalletTableProps {
  wallets: Wallet[];
  loading: boolean;
  onEdit: (wallet: Wallet) => void;
  onDelete: (walletId: string) => Promise<void>;
  selectedNetwork: string;
}

export default function WalletTable({ 
  wallets, 
  loading, 
  onEdit, 
  onDelete, 
  
  selectedNetwork 
}: WalletTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Address copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'maintenance': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Space>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : 'N/A'}
          </code>
          <Button 
            type="text" 
            size="small" 
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(address || '')}
            disabled={!address}
          />
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'hot' ? 'red' : 'blue'}>
          {type ? type.toUpperCase() : 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (currency: string) => (
        <Tag color="purple">{currency || 'N/A'}</Tag>
      )
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network: string) => {
        const networkColors = {
          'eth-main': 'blue',
          'sepolia': 'cyan',
          'bsc-mainnet': 'gold',
          'bsc-testnet': 'orange'
        };
        const networkLabels = {
          'eth-main': 'ETH Mainnet',
          'sepolia': 'Sepolia',
          'bsc-mainnet': 'BSC Mainnet',
          'bsc-testnet': 'BSC Testnet'
        };
        return (
          <Tag color={networkColors[network as keyof typeof networkColors] || 'default'}>
            {networkLabels[network as keyof typeof networkLabels] || network?.toUpperCase() || 'ETH'}
          </Tag>
        );
      }
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number, record: Wallet) => (
        <Space>
          <span className="font-semibold">
            {balance !== undefined && balance !== null
              ? (record.currency === 'PEPE' 
                  ? balance.toLocaleString() 
                  : balance.toFixed(4))
              : '0.0000'
            } {record.currency || 'N/A'}
          </span>
        
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Wallet) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit Wallet">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Wallet">
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={wallets}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} wallets`
      }}
    />
  );
}
