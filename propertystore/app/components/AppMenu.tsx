'use client';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'antd';

export function AppMenu() {
  const { isAuthenticated, username, logout } = useAuth();
  
  const publicItems = [
    { key: "home", label: <Link href={"/"}>Главная страница</Link> }, 
    { key: "catalog", label: <Link href={"/properties"}>Каталог недвижимости</Link> },
  ];

   const adminItems = [
  { key: "dashboard", label: <Link href={"/dashboard"}>Дашборд</Link> }, // ← ДОБАВЛЯЕМ
  { key: "admin-properties", label: <Link href={"/admin/properties"}>Управление объектами</Link> },
  { key: "clients", label: <Link href={"/clients"}>Клиенты</Link> },
  { key: "requests", label: <Link href={"/requests"}>Заявки</Link> },
  { 
    key: "logout", 
    label: <span onClick={logout}>Выйти ({username})</span> 
  },
];

  const items = [...publicItems, ...(isAuthenticated ? adminItems : [])];

  return (
    <Menu 
      theme="dark" 
      mode="horizontal" 
      items={items} 
      style={{flex: 1, minWidth: 0}}
    />
  );
}