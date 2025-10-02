import { Table, Button, Space, Tag, message } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Transaction } from '@/types/wallet';

// Extended transaction interface for additional fields used in the table
interface ExtendedTransaction extends Transaction {
  walletAddress?: string;
  blockNumber?: number;
  fromAddress?: string;
  toAddress?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

export default function TransactionTable({ transactions, loading, onRefresh }: TransactionTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Transaction hash copied to clipboard');
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      render: (address?: string) => (
        address ? (
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </code>
        ) : '-'
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          deposit: 'green',
          withdrawal: 'red',
          transfer: 'blue'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: ExtendedTransaction) => (
        <span className="font-semibold">
          {record.currency === 'PEPE' 
            ? amount.toLocaleString() 
            : Number(amount).toFixed(4)
          } {record.currency}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getTransactionStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'TX Hash',
      dataIndex: 'txHash',
      key: 'txHash',
      render: (txHash?: string) => (
        txHash ? (
          <Space>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {`${txHash.slice(0, 8)}...${txHash.slice(-6)}`}
            </code>
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(txHash)}
            />
          </Space>
        ) : '-'
      )
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (network?: string) => (
        network ? <Tag color="blue">{network.toUpperCase()}</Tag> : '-'
      )
    },
    {
      title: 'Block',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
      render: (blockNumber?: number) => blockNumber || '-'
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div>
      {onRefresh && (
        <div className="mb-4 flex justify-end">
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            loading={loading}
          >
            Refresh from Blockchain
          </Button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} transactions`
        }}
      />
    </div>
  );
}
