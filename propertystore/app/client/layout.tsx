'use client';

import React from 'react';
import { Layout, Menu, Button, Avatar, Spin } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserOutlined, 
  LogoutOutlined, 
  FileTextOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Header, Sider, Content } = Layout;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { client, logout, userRole, isAuthenticated } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    if (!isAuthenticated || userRole !== 'client') {
      router.push('/client/login');
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, userRole, router]);

  const menuItems = [
    {
      key: '/client/dashboard',
      icon: <DashboardOutlined />,
      label: 'Обзор',
      onClick: () => router.push('/client/dashboard'),
    },
    {
      key: '/client/deals',
      icon: <FileTextOutlined />,
      label: 'Мои сделки',
      onClick: () => router.push('/client/deals'),
    },
    {
      key: '/client/documents',
      icon: <FileTextOutlined />,
      label: 'Документы',
      onClick: () => router.push('/client/documents'),
    },
    {
      key: '/client/settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
      onClick: () => router.push('/client/settings'),
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Пока проверяем авторизацию, показываем спиннер
  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Если не авторизован как клиент, не показываем layout
  if (!isAuthenticated || userRole !== 'client') {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, color: '#1890ff', fontSize: '20px' }}>
            Личный кабинет клиента
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#52c41a' }}
          />
          <span style={{ fontSize: '14px', color: '#666' }}>
            {client?.name || 'Клиент'}
          </span>
          <Button 
            type="text" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            size="small"
          >
            Выйти
          </Button>
        </div>
      </Header>

      <Layout>
        <Sider 
          width={250} 
          style={{ 
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{ 
              height: '100%', 
              borderRight: 0,
              paddingTop: '16px'
            }}
          />
        </Sider>
        
        <Layout style={{ padding: '24px', background: '#f5f5f5' }}>
          <Content style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}