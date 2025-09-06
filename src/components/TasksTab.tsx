'use client';

import { useCallback, useEffect } from 'react';
import { selectCurrentUser, selectUserLoading } from '@/modules';
import { 
  selectTasks, 
  selectTasksLoading, 
  selectAds, 
  selectAdStats, 
  selectAdsLoading,
  fetchTasksRequest,
  completeTaskRequest,
  fetchAdsRequest,
  watchAdRequest
} from '@/modules/private/task';
import Header from './Header';
 
import { useDispatch, useSelector } from 'react-redux';
  
import { 
  Card, 
  Button, 
  Progress, 
  Space, 
  Typography, 
  Tag, 
  Row, 
  Col, 
  Avatar,
  Statistic,
  Badge,
  Divider
} from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TrophyOutlined,
  GiftOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
 

export default function TasksTab() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const tasks = useSelector(selectTasks);
  const tasksLoading = useSelector(selectTasksLoading);
  const ads = useSelector(selectAds);
  const adsLoading = useSelector(selectAdsLoading);
  const adStats = useSelector(selectAdStats);
 

useEffect(() => {
  dispatch(fetchTasksRequest());
  dispatch(fetchAdsRequest());
}, [dispatch]);

  const handleAdView = useCallback(() => {
       window?.showGiga?.().then((e)=>{
          dispatch(watchAdRequest());
       })
     
  }, [dispatch ] );

  const handleTaskComplete = useCallback((taskId: string, taskUrl?: string) => {
    if (!user) return;
    dispatch(completeTaskRequest(taskId, taskUrl));
  }, [dispatch, user ]);

  

   

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: '16px 0' }}>
      {/* Header */}
      <Header />

      {/* Daily Ads Card */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 16,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          margin: '0 16px'
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={4} style={{ margin: 0, color: '#1565c0' }}>
                <GiftOutlined style={{ marginRight: 8 }} />
                Today's Ad Tasks
              </Title>
            </Col>
            <Col>
              <Badge 
                count={adStats?.adsLeftToday || 0} 
                style={{ backgroundColor: '#52c41a' }}
                showZero
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Completed"
                value={adStats?.todayAdsViewed || 0}
                suffix={`/ ${adStats?.dailyLimit || 100}`}
                valueStyle={{ color: '#1890ff', fontSize: 18 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Ads Left"
                value={adStats?.adsLeftToday || 0}
                valueStyle={{ color: '#52c41a', fontSize: 18 }}
              />
            </Col>
          </Row>

          <Progress
            percent={((adStats?.todayAdsViewed || 0) / (adStats?.dailyLimit || 100)) * 100}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{ margin: '8px 0' }}
          />

          <Text type="secondary">
            Get <Text strong style={{ color: '#faad14' }}>250 Points</Text> for each ad view. Tasks reset every 24 hours.
          </Text>

          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleAdView}
            disabled={!adStats?.adsLeftToday || adsLoading}
            loading={adsLoading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              background: !adStats?.adsLeftToday ? undefined : 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              border: 'none'
            }}
          >
            {adsLoading ? 'Loading...' : `Watch Ad (${adStats?.adsLeftToday || 0} left)`}
          </Button>
        </Space>
      </Card>


      {/* Progress Summary Card */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 16,
          background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          margin: '0 16px'
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0, color: '#389e0d' }}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            Your Progress
          </Title>

          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Tasks Completed"
                value={tasks.filter(task => task.completed).length}
                valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Tasks Remaining"
                value={tasks.filter(task => !task.completed).length}
                valueStyle={{ color: '#fa8c16', fontSize: 24, fontWeight: 'bold' }}
              />
            </Col>
          </Row>

          {tasks.length > 0 && (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Text type="secondary">Overall Progress</Text>
                <Text strong>{Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}%</Text>
              </Row>
              <Progress 
                percent={(tasks.filter(task => task.completed).length / tasks.length) * 100}
                strokeColor={{
                  '0%': '#52c41a',
                  '100%': '#722ed1',
                }}
              />
            </Space>
          )}
        </Space>
      </Card>

      {/* Available Ads Section */}
      {ads.length > 0 && (
        <Space direction="vertical" size="middle" style={{ width: '100%', padding: '0 16px' }}>
          <Row justify="space-between" align="middle">
            <Title level={4} style={{ margin: 0 }}>Available Ads</Title>
            <Badge count={ads.filter(ad => ad.available).length} style={{ backgroundColor: '#52c41a' }} />
          </Row>
          
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {ads.map((ad) => (
              <Card
                key={ad.id}
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  opacity: ad.available ? 1 : 0.6
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Row gutter={16} align="middle">
                  <Col flex="none">
                    <Avatar 
                      size={64} 
                      src={ad.imageUrl} 
                      style={{ borderRadius: 8 }}
                    />
                  </Col>
                  <Col flex="auto">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Space wrap>
                        <Tag color={ad.type === 'video' ? 'red' : ad.type === 'banner' ? 'blue' : 'purple'}>
                          {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                        </Tag>
                        <Tag>{ad.category}</Tag>
                        <Text type="secondary">
                          <ClockCircleOutlined /> {ad.duration}s
                        </Text>
                      </Space>
                      
                      <Title level={5} style={{ margin: 0 }}>{ad.title}</Title>
                      <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                        {ad.description}
                      </Paragraph>
                      
                      <Row justify="space-between" align="middle">
                        <Text strong style={{ color: '#faad14' }}>
                          +{ad.reward} Points
                        </Text>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlayCircleOutlined />}
                          onClick={handleAdView}
                          disabled={!ad.available || adsLoading}
                          loading={adsLoading}
                          style={{ borderRadius: 8 }}
                        >
                          Watch Ad
                        </Button>
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Space>
      )}

      {/* Available Tasks Section */}
      <Space direction="vertical" size="middle" style={{ width: '100%', padding: '0 16px' }}>
        <Row justify="space-between" align="middle">
          <Title level={4} style={{ margin: 0 }}>Available Tasks</Title>
          <Badge count={tasks.filter(task => !task.completed).length} style={{ backgroundColor: '#1890ff' }} />
        </Row>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {tasks.filter(task => task.type !== 'daily').map((task) => {
            const completed = task.completed;
            const isLoading = tasksLoading;

            return (
              <Card
                key={task.id}
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  opacity: completed ? 0.6 : 1
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space wrap>
                    <Tag color={task.type === 'social' ? 'green' : task.type === 'special' ? 'purple' : 'blue'}>
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Tag>
                    <Tag>{task.category}</Tag>
                    {completed && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        Done
                      </Tag>
                    )}
                  </Space>
                  
                  <Title level={5} style={{ margin: 0 }}>{task.title}</Title>
                  <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                    {task.description}
                  </Paragraph>
                  
                  <Row justify="space-between" align="middle">
                    <Text strong style={{ color: '#faad14' }}>
                      +{task.reward} Points
                    </Text>
                    {task.duration && (
                      <Text type="secondary">
                        <ClockCircleOutlined /> {task.duration}
                      </Text>
                    )}
                  </Row>

                  {!completed && task.progress && (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Row justify="space-between">
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Completed: {task.progress.current}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Left: {task.progress.max - task.progress.current}
                        </Text>
                      </Row>
                      <Progress 
                        percent={task.progress.percentage} 
                        size="small"
                        strokeColor="#1890ff"
                      />
                    </Space>
                  )}

                  <Row gutter={8}>
                    {task.url && !completed && (
                      <Col>
                        <Button
                          size="small"
                          onClick={() => window.open(task.url, '_blank')}
                          style={{ borderRadius: 8 }}
                        >
                          Join
                        </Button>
                      </Col>
                    )}
                    <Col flex="auto">
                      <Button
                        type={completed ? "default" : "primary"}
                        size="small"
                        onClick={() => handleTaskComplete(task.id, task.url)}
                        disabled={completed || isLoading}
                        loading={isLoading}
                        style={{ 
                          width: '100%',
                          borderRadius: 8,
                          backgroundColor: completed ? '#f6ffed' : undefined,
                          borderColor: completed ? '#b7eb8f' : undefined,
                          color: completed ? '#52c41a' : undefined
                        }}
                      >
                        {completed ? 'Completed' : 'Verify'}
                      </Button>
                    </Col>
                  </Row>
                </Space>
              </Card>
            );
          })}
        </Space>
      </Space>

      {/* Daily Reset Info Card */}
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 16,
          background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          margin: '0 16px'
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Row gutter={12} align="middle">
          <Col flex="none">
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#1890ff' }}
              icon={<InfoCircleOutlined />}
            />
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size={0}>
              <Text strong style={{ color: '#1890ff' }}>
                Daily Reset Information
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Tasks reset every 24 hours. Complete them regularly to maximize your earnings!
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}
