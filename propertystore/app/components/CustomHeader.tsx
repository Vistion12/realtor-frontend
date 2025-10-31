'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { ServicesModal } from './ServicesModal'; 
import { ContactsModal } from './ContactsModal';
import { Dropdown, Button, Avatar, MenuProps } from 'antd'; // Добавляем MenuProps
import { UserOutlined, LogoutOutlined, TeamOutlined, DashboardOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Добавляем useRouter

interface MenuItem {
  name: string;
  href?: string;
  onClick?: () => void;
  isButton?: boolean;
}

export function CustomHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const { isAuthenticated, username, userRole, logout } = useAuth();
  const router = useRouter(); // Добавляем router

  const menuItems: MenuItem[] = [
    { name: "Каталог недвижимости", href: "/properties" },
    { 
      name: "Услуги", 
      onClick: () => setIsServicesModalOpen(true),
      isButton: true 
    },
    { 
      name: "Контакты", 
      onClick: () => setIsContactsModalOpen(true),
      isButton: true 
    },
  ];

  const realtorMenuItems = [
    { name: "Дашборд", href: "/dashboard" },
    { name: "Сделки", href: "/deals" },
    { name: "Управление объектами", href: "/admin/properties" },
    { name: "Клиенты", href: "/clients" },
    { name: "Заявки", href: "/requests" },
  ];

  const clientMenuItems = [
    { name: "Мои сделки", href: "/client/dashboard" },
    { name: "Документы", href: "/client/documents" },
    { name: "Настройки", href: "/client/settings" },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsMenuOpen(false);
  };

  const getUserMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: username || 'Пользователь',
        disabled: true,
      },
      {
        type: 'divider',
      }
    ];

    // Добавляем пункты меню в зависимости от роли
    if (userRole === 'realtor') {
      realtorMenuItems.forEach(item => {
        items?.push({
          key: item.href!,
          icon: <DashboardOutlined />,
          label: item.name,
          onClick: () => router.push(item.href!)
        });
      });
    } else if (userRole === 'client') {
      clientMenuItems.forEach(item => {
        items?.push({
          key: item.href!,
          icon: <TeamOutlined />,
          label: item.name,
          onClick: () => router.push(item.href!)
        });
      });
    }

    items?.push(
      {
        type: 'divider',
      }, 
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Выйти',
        onClick: logout,
        danger: true,
      }
    );

    return items;
  };

  const getAuthMenuItems = (): MenuProps['items'] => [
    {
      key: 'realtor',
      icon: <UserOutlined />,
      label: 'Вход для риелтора',
      onClick: () => router.push('/login')
    },
    {
      key: 'client',
      icon: <TeamOutlined />,
      label: 'Личный кабинет клиента',
      onClick: () => router.push('/client-login')
    }
  ];

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">
          <img 
            className="header-logo-image"
            src="/images/logo12.png"
            alt="Alina-logo"
            width="300" height="50" loading="lazy"
          />
        </Link>
        
        <nav className={`header-menu ${isMenuOpen ? 'is-active' : ''}`}>
          <ul className="header-menu-list">
            {menuItems.map((item, index) => (
              <li key={index} className="header-menu-item">
                {item.isButton ? (
                  <button 
                    className="header-menu-link header-menu-button" 
                    onClick={() => handleMenuClick(item)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link 
                    className="header-menu-link" 
                    href={item.href!}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="header-actions">
          {isAuthenticated ? (
            <Dropdown 
              menu={{ items: getUserMenuItems() }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="text" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  height: '32px'
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: userRole === 'realtor' ? '#1890ff' : '#52c41a' 
                  }}
                />
                <span style={{ fontSize: '14px' }}>
                  {username}
                  {userRole === 'realtor' && ' (Риелтор)'}
                  {userRole === 'client' && ' (Клиент)'}
                </span>
              </Button>
            </Dropdown>
          ) : (
            <Dropdown 
              menu={{ items: getAuthMenuItems() }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="primary" 
                icon={<LogoutOutlined/>}
                size="large"
              >
                Войти в систему
              </Button>
            </Dropdown>
          )}
          
          <button 
            className={`header-burger-button ${isMenuOpen ? 'is-active' : ''}`}
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="visually-hidden">Открыть меню</span>
            <span className="header-burger-button-line"></span>
            <span className="header-burger-button-line"></span>
            <span className="header-burger-button-line"></span>
          </button>
        </div>
      </header>

      {/* Модальные окна */}
      <ServicesModal 
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />
      
      <ContactsModal 
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
      />
    </>
  );
}