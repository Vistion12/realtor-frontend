'use client';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'antd';

export function AppMenu() {
  const { isAuthenticated, username, logout, userRole } = useAuth(); // Добавляем userRole
  
  const publicItems = [
    { key: "home", label: <Link href={"/"}>Главная страница</Link> }, 
    { key: "catalog", label: <Link href={"/properties"}>Каталог недвижимости</Link> },
  ];

  const adminItems = [
    { key: "dashboard", label: <Link href={"/dashboard"}>Дашборд</Link> }, 
    { key: "admin-properties", label: <Link href={"/admin/properties"}>Управление объектами</Link> },
    { key: "clients", label: <Link href={"/clients"}>Клиенты</Link> },
    { key: "requests", label: <Link href={"/requests"}>Заявки</Link> },
    { 
      key: "logout", 
      label: <span onClick={logout}>Выйти ({username})</span> 
    },
  ];

  const clientItems = [
    { key: "client-dashboard", label: <Link href={"/client/dashboard"}>Мой кабинет</Link> },
    { key: "client-deals", label: <Link href={"/client/deals"}>Мои сделки</Link> },
    { key: "client-documents", label: <Link href={"/client/documents"}>Документы</Link> },
    { key: "client-settings", label: <Link href={"/client/settings"}>Настройки</Link> },
    { 
      key: "logout", 
      label: <span onClick={logout}>Выйти ({username})</span> 
    },
  ];

  // ВЫБИРАЕМ ПРАВИЛЬНЫЕ ПУНКТЫ МЕНЮ В ЗАВИСИМОСТИ ОТ РОЛИ
  const getMenuItems = () => {
    if (!isAuthenticated) {
      return publicItems;
    }
    
    if (userRole === 'client') {
      return [...publicItems, ...clientItems];
    }
    
    if (userRole === 'realtor') {
      return [...publicItems, ...adminItems];
    }
    
    return publicItems;
  };

  const items = getMenuItems();

  return (
    <Menu 
      theme="dark" 
      mode="horizontal" 
      items={items} 
      style={{flex: 1, minWidth: 0}}
    />
  );
}