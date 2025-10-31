"use client";

import { Card, Button, Tag, message, Space, Tooltip, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, KeyOutlined, CopyOutlined } from "@ant-design/icons";
import { Client } from "../services/clients";
import { ExpandableText } from "./ExpandableText";
import { activateClientAccount } from "../services/clientAccount";
import { useState } from "react";

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onActivateAccount?: (clientId: string, tempPassword: string) => void;
  loading?: boolean;
}

export const ClientsCard = ({ clients, onEdit, onDelete, onActivateAccount, loading }: Props) => {
  const [activePasswords, setActivePasswords] = useState<{[key: string]: string}>({});

  const getSourceLabel = (source: string) => {
    const sourceMap: { [key: string]: string } = {
      'website': '🌐 Сайт',
      'telegram': '📱 Telegram',
      'phone_call': '📞 Звонок',
      'instagram_ads': '📸 Instagram',
      'recommendation': '👥 Рекомендация'
    };
    return sourceMap[source] || source;
  };

  const handleActivateAccount = async (client: Client) => {
    if (!client.email) {
      message.error('Для активации ЛК у клиента должен быть email');
      return;
    }

    try {
      const tempPassword = generateTemporaryPassword();
      const result = await activateClientAccount(client.id, tempPassword);
      
      if (result.success) {
        message.success('Личный кабинет активирован!');
        setActivePasswords(prev => ({
          ...prev,
          [client.id]: tempPassword
        }));
        
        if (onActivateAccount) {
          onActivateAccount(client.id, tempPassword);
        }
      } else {
        message.error(result.error || 'Ошибка активации ЛК');
      }
    } catch (error) {
      message.error('Ошибка активации ЛК');
    }
  };

  const handleCopyPassword = (password: string, clientName: string) => {
    navigator.clipboard.writeText(password);
    message.success(`Пароль для ${clientName} скопирован в буфер обмена`);
  };

  const generateTemporaryPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  if (loading) {
    return <div>Загрузка клиентов...</div>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
      gap: '20px',
      padding: '20px 0'
    }}>
      {clients.map((client) => (
        <Card
          key={client.id}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{client.name}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
          }
          style={{ 
            height: 'auto',
            border: '1px solid var(--color-light-gray)',
            borderRadius: '12px',
            transition: 'all var(--transition-duration) ease'
          }}
          bodyStyle={{ padding: '16px' }}
          headStyle={{ 
            borderBottom: '1px solid var(--color-light-gray)',
            padding: '12px 16px'
          }}
          className="client-card"
        >
          {/* Информация о клиенте */}
          <div style={{ lineHeight: '1.6', fontSize: '14px', marginBottom: '16px' }}>
            <p><strong>📞 Телефон:</strong> {client.phone}</p>
            {client.email && <p><strong>📧 Email:</strong> {client.email}</p>}
            <p><strong>📊 Источник:</strong> {getSourceLabel(client.source)}</p>
            
            {/* Статус ЛК */}
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <strong>👤 Личный кабинет:</strong> 
              {client.hasPersonalAccount ? (
                <Tag color="green">Активирован</Tag>
              ) : (
                <Tag color="orange">Не активирован</Tag>
              )}
            </p>         
            {/* Заметки */}
            {client.notes && (
              <div style={{ marginTop: '12px' }}>
                <strong>📝 Заметки:</strong>
                <div style={{ 
                  padding: '8px', 
                  background: '#f5f5f5', 
                  borderRadius: '4px',
                  marginTop: '4px'
                }}>
                  <ExpandableText
                    text={client.notes} 
                    maxLength={30} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* КНОПКИ ДЕЙСТВИЙ - ИСПРАВЛЕННАЯ ВЕРСТКА */}
          <Row gutter={[8, 8]} style={{ marginTop: 'auto' }}>
            <Col xs={24} sm={8}>
              <Button 
                icon={<EditOutlined />} 
                size="small"
                block
                onClick={() => onEdit(client)}
                style={{ 
                  height: '32px',
                  fontSize: '12px',
                  borderRadius: '6px'
                }}
              >
                Редакт.
              </Button>
            </Col>
            
            <Col xs={24} sm={8}>
              <Button 
                icon={<DeleteOutlined />} 
                size="small" 
                danger
                block
                onClick={() => {
                  if (confirm('Удалить клиента?')) {
                    onDelete(client.id);
                  }
                }}
                style={{ 
                  height: '32px',
                  fontSize: '12px',
                  borderRadius: '6px'
                }}
              >
                Удалить
              </Button>
            </Col>

            {/* Кнопка активации ЛК */}
            {!client.hasPersonalAccount && (
              <Col xs={24} sm={8}>
                <Button 
                  icon={<KeyOutlined />}
                  size="small"
                  type="primary"
                  block
                  onClick={() => handleActivateAccount(client)}
                  disabled={!client.email}
                  style={{ 
                    height: '32px',
                    fontSize: '12px',
                    borderRadius: '6px'
                  }}
                >
                  Актив. ЛК
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      ))}
    </div>
  );
};