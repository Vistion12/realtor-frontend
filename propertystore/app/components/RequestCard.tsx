"use client";

import { Card, Button, Tag } from "antd";
import { Request } from "../services/requests";

interface RequestCardProps {
  request: Request;
  onShowDetails: (request: Request) => void;
  onCreateDeal: (request: Request) => void;
  getTypeLabel: (type: string) => string;
  getTypeColor: (type: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  parseMessage: (message: string) => any;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onShowDetails,
  onCreateDeal,
  getTypeLabel,
  getTypeColor,
  getStatusLabel,
  getStatusColor,
  parseMessage
}) => {
  const messageData = parseMessage(request.message);
  
  return (
    <Card 
      className="request-card"
      bodyStyle={{ 
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      styles={{
        body: {
          padding: '16px'
        }
      }}
    >
      {/* Заголовок карточки */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '12px' 
      }}>
        <Tag 
          color={getTypeColor(request.type)} 
          className="request-type-tag"
        >
          {getTypeLabel(request.type)}
        </Tag>
        <Tag 
          color={getStatusColor(request.status)} 
          className="request-status-tag"
        >
          {getStatusLabel(request.status)}
        </Tag>
      </div>
      
      {/* Информация о клиенте */}
      <div style={{ marginBottom: '12px', flex: 1 }}>
        <div className="client-name">
          {messageData.name || request.client?.name || 'Неизвестный клиент'}
        </div>
        <div className="client-contacts">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            {messageData.phone || request.client?.phone || 'Телефон не указан'}
          </div>
          {messageData.email && (
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              {messageData.email}
            </div>
          )}
        </div>
      </div>
      
      {/* Дата создания */}
      <div className="request-date">
        {new Date(request.createdAt).toLocaleDateString('ru-RU')}
      </div>
      
      {/* Кнопки действий */}
      <div className="request-actions">
        <Button 
          className="details-btn"
          onClick={() => onShowDetails(request)}
        >
          Подробнее
        </Button>
        <Button 
          type="primary" 
          className="deal-btn"
          onClick={() => onCreateDeal(request)}
          disabled={request.status === 'completed'}
        >
          Создать сделку
        </Button>
      </div>
    </Card>
  );
};