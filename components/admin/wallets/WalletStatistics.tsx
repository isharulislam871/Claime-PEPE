import { Card, Row, Col, Statistic  } from 'antd';
import { 
  WalletOutlined, 
  DollarOutlined, 
  SwapOutlined, 
  HistoryOutlined 
} from '@ant-design/icons';

interface Wallet {
  _id: string;
  address: string;
  type: 'hot' | 'cold';
  currency: string;
  balance: number;
  status: 'active' | 'inactive' | 'maintenance';
  network?: string;
  createdAt: string;
  lastTransaction?: string;
}

interface WalletStatisticsProps {
  wallets: Wallet[];
}

export default function WalletStatistics({ wallets }: WalletStatisticsProps) {
  const totalBalance = wallets.reduce((sum, wallet) => {
    if (wallet.currency === 'PEPE') {
      return sum + wallet.balance;
    }
    return sum;
  }, 0);

  const activeWallets = wallets.filter(w => w.status === 'active').length;

  return (
    <>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total PEPE Balance"
              value={totalBalance}
              formatter={(value) => `${Number(value).toLocaleString()}`}
              prefix={<WalletOutlined />}
              suffix="PEPE"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Wallets"
              value={activeWallets}
              prefix={<DollarOutlined />}
              suffix={`/ ${wallets.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hot Wallets"
              value={wallets.filter(w => w.type === 'hot').length}
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cold Wallets"
              value={wallets.filter(w => w.type === 'cold').length}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
      </Row>

       
    </>
  );
}
