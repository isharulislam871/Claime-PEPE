'use client'; 
import { selectCurrentUser } from '@/modules';
import { useSelector } from 'react-redux';
import { Card, Avatar, Typography, Space, Row, Col, Statistic } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Header() {
  const user = useSelector(selectCurrentUser);
  
  // Conversion rate: 10,000 Points = $0.25 USDT
  const convertToUSDT = (points: number) => {
    return (points / 10000 * 0.25).toFixed(4);
  };

  if (!user) return null;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
      {/* User Info Card */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center">
              <Avatar 
                size={48}
                src={user.profilePicUrl || "https://i.pravatar.cc/100"}
                icon={<UserOutlined />}
                style={{ border: '2px solid rgba(255,255,255,0.3)' }}
              />
              <Space direction="vertical" size={0}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  Welcome,
                </Text>
                <Title level={5} style={{ color: 'white', margin: 0 }}>
                  {user.username}
                </Title>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" size={0} align="end">
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Balance
              </Text>
              <Title level={4} style={{ color: '#FFD700', margin: 0 }}>
                {user.balance || 0} Points
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
                ≈ ${convertToUSDT(user.balance || 0)} USDT
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      
    </Space>
  );
}
