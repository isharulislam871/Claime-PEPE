import React from 'react';
import { Avatar, Space, Badge } from 'antd-mobile';
import { UserOutlined } from '@ant-design/icons';
import { selectCurrentUser } from '@/modules';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const user = useSelector(selectCurrentUser);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: '16px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      animation: 'slideInLeft 0.6s ease-out'
    }}>
      <Space direction="vertical" style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          color: '#8b5cf6',
          fontWeight: '500',
          animation: 'fadeIn 0.8s ease-out 0.2s both'
        }}>
          🌟 Welcome back,
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeIn 0.8s ease-out 0.4s both'
        }}>
          {user?.username || 'User'}
        </div>
      </Space>
      
      <div style={{
        position: 'relative',
        animation: 'bounceIn 0.8s ease-out 0.3s both'
      }}>
        <Badge content="" style={{ '--right': '-2px', '--top': '-2px' }}>
          <Avatar
            src={user?.profilePicUrl && user.profilePicUrl.trim() ? user.profilePicUrl : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1NiA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4='}
            fallback={<UserOutlined />}
            style={{
              '--size': '56px',
              border: '3px solid transparent',
              background: 'linear-gradient(135deg, #a855f7, #3b82f6) border-box',
              borderRadius: '50%',
              boxShadow: '0 8px 24px rgba(168,85,247,0.3)'
            }}
          />
        </Badge>
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '16px',
          height: '16px',
          background: '#10b981',
          borderRadius: '50%',
          border: '2px solid white',
          animation: 'pulse 2s infinite'
        }} />
      </div>
    </div>
  );
}
