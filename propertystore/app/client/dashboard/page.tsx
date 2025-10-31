'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Tag, Alert, Spin, Empty } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { clientProfileService } from '../../services/clientProfile';
import { ClientDeal } from '../../services/clientProfile';
import { 
  RiseOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

export default function ClientDashboardPage() {
  const [deals, setDeals] = useState<ClientDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { client } = useAuth();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const clientDeals = await clientProfileService.getClientDeals();
      setDeals(clientDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDeals = deals.filter(deal => deal.status === 'active');
  const completedDeals = deals.filter(deal => deal.status === 'completed');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Добро пожаловать, {client?.name}!</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Здесь вы можете отслеживать статус ваших сделок и работать с документами
      </p>
      
      {!client?.consentToPersonalData && (
        <Alert
          message="Требуется ваше согласие на обработку персональных данных"
          description="Пожалуйста, перейдите в настройки и дайте согласие на обработку данных для продолжения работы с системой."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Всего сделок"
              value={deals.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Активные сделки"
              value={activeDeals.length}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Завершенные"
              value={completedDeals.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="В работе"
              value={activeDeals.length}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Последние сделки */}
      <Card 
        title="Ваши сделки" 
        bordered={false}
        extra={<span style={{ color: '#666', fontSize: '14px' }}>Всего: {deals.length}</span>}
      >
        {deals.length > 0 ? (
          <List
            dataSource={deals.slice(0, 5)}
            renderItem={(deal) => (
              <List.Item
                actions={[
                  <Tag color={
                    deal.status === 'active' ? 'blue' : 
                    deal.status === 'completed' ? 'green' : 'default'
                  }>
                    {deal.status === 'active' ? 'В работе' : 'Завершена'}
                  </Tag>
                ]}
              >
                <List.Item.Meta
                  title={deal.title}
                  description={`Тип: ${deal.propertyType} | Этап: ${deal.currentStage}`}
                />
                <div style={{ color: '#666', fontSize: '12px' }}>
                  Создана: {new Date(deal.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="У вас пока нет сделок" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}