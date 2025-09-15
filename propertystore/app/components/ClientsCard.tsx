"use client";

import { Card, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Client } from "../services/clients";
import { ExpandableText } from "./ExpandableText";

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ClientsCard = ({ clients, onEdit, onDelete, loading }: Props) => {
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

  if (loading) {
    return <div>Загрузка клиентов...</div>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: '16px',
      padding: '20px 0'
    }}>
      {clients.map((client) => (
        <Card
          key={client.id}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{client.name}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {new Date(client.createdAt).toLocaleDateString()}
              </span>
            </div>
          }
          actions={[
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => onEdit(client)}
            >
              Редактировать
            </Button>,
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              onClick={() => {
                if (confirm('Удалить клиента?')) {
                  onDelete(client.id);
                }
              }}
            >
              Удалить
            </Button>
          ]}
          style={{ height: 'auto' }} 
        >
          <div style={{ lineHeight: '1.6', fontSize: '14px' }}>
            <p><strong>📞 Телефон:</strong> {client.phone}</p>
            {client.email && <p><strong>📧 Email:</strong> {client.email}</p>}
            <p><strong>📊 Источник:</strong> {getSourceLabel(client.source)}</p>
            
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
        </Card>
      ))}
    </div>
  );
};