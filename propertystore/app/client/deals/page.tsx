'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Button, Modal, Descriptions, Spin, Empty, Timeline } from 'antd';
import { useRouter } from 'next/navigation';
import { clientProfileService } from '../../services/clientProfile';
import { ClientDeal, ClientDealDetails } from '../../services/clientProfile';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';

export default function ClientDealsPage() {
  const [deals, setDeals] = useState<ClientDeal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<ClientDealDetails | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleViewDetails = async (dealId: string) => {
    try {
      const dealDetails = await clientProfileService.getDealDetails(dealId);
      setSelectedDeal(dealDetails);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error loading deal details:', error);
    }
  };

  const handleOpenDocuments = (dealId: string) => {
    router.push(`/client/documents?dealId=${dealId}`);
  };

  const columns = [
    {
      title: 'Название сделки',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Тип недвижимости',
      dataIndex: 'propertyType',
      key: 'propertyType',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'completed' ? 'blue' : 'default'}>
          {status === 'active' ? 'Активна' : status === 'completed' ? 'Завершена' : status}
        </Tag>
      ),
    },
    {
      title: 'Текущий этап',
      dataIndex: 'currentStage',
      key: 'currentStage',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: ClientDeal) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record.id)}
          >
            Детали
          </Button>
          <Button 
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleOpenDocuments(record.id)}
          >
            Документы
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Мои сделки</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Управление и отслеживание ваших сделок с недвижимостью
          </p>
        </div>
        <Button 
          type="primary" 
          onClick={loadDeals}
          loading={loading}
        >
          Обновить
        </Button>
      </div>

      {deals.length > 0 ? (
        <Card>
          <Table 
            dataSource={deals} 
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      ) : (
        <Card>
          <Empty 
            description="У вас пока нет сделок" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      {/* Модальное окно деталей сделки */}
      <Modal
        title={`Детали сделки: ${selectedDeal?.title}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Закрыть
          </Button>,
          <Button 
            key="documents" 
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              handleOpenDocuments(selectedDeal!.id);
            }}
          >
            Перейти к документам
          </Button>,
        ]}
        width={700}
      >
        {selectedDeal && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Название сделки">
              {selectedDeal.title}
            </Descriptions.Item>
            <Descriptions.Item label="Тип недвижимости">
              <Tag color="blue">{selectedDeal.propertyType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              <Tag color={selectedDeal.status === 'active' ? 'green' : 'blue'}>
                {selectedDeal.status === 'active' ? 'Активна' : 'Завершена'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Текущий этап">
              {selectedDeal.currentStage}
            </Descriptions.Item>
            <Descriptions.Item label="Дедлайн этапа">
              {selectedDeal.currentStageDeadline 
                ? new Date(selectedDeal.currentStageDeadline).toLocaleDateString('ru-RU')
                : 'Не установлен'
              }
            </Descriptions.Item>
            <Descriptions.Item label="Описание">
              {selectedDeal.description || 'Описание отсутствует'}
            </Descriptions.Item>
            <Descriptions.Item label="Дата создания">
              {new Date(selectedDeal.createdAt).toLocaleDateString('ru-RU')}
            </Descriptions.Item>
            <Descriptions.Item label="Последнее обновление">
              {new Date(selectedDeal.updatedAt).toLocaleDateString('ru-RU')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}