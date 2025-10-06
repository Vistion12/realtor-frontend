'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { ServicesModal } from './ServicesModal'; 
import { ContactsModal } from './ContactsModal';

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
  const { isAuthenticated, username, logout } = useAuth();

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

  const adminItems = [
    { name: "Управление объектами", href: "/admin/properties" },
    { name: "Клиенты", href: "/clients" },
    { name: "Заявки", href: "/requests" },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsMenuOpen(false);
  };

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
                    href={item.href!} // Добавляем ! чтобы указать что href точно есть
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
            
            {/* Админские пункты меню */}
            {isAuthenticated && adminItems.map((item, index) => (
              <li key={`admin-${index}`} className="header-menu-item">
                <Link 
                  className="header-menu-link" 
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: '#1890ff' }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="header-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-dark-gray)' }}>
                {username}
              </span>
              <button 
                className="button"
                onClick={logout}
                style={{ height: '32px', fontSize: '11px' }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="button" style={{ height: '32px', fontSize: '11px' }}>
                Вход
              </button>
            </Link>
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