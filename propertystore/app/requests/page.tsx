"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tag, message, Space, Modal } from "antd";
import { Request, getAllRequests, updateRequestStatus } from "../services/requests";

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const loadRequests = async () => {
    try {
      const data = await getAllRequests();
      setRequests(data);
    } catch (error) {
      message.error("Ошибка загрузки заявок");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus(id, newStatus);
      message.success("Статус обновлен");
      loadRequests();
    } catch (error) {
      message.error("Ошибка обновления статуса");
    }
  };

  const showDetails = (request: Request) => {
    setSelectedRequest(request);
  };

  const getFieldLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      'name': 'Имя',
      'phone': 'Телефон',
      'email': 'Email',
      'purpose': 'Цель',
      'message': 'Сообщение',
      'preferredDate': 'Предпочтительная дата'
    };
    return labels[key] || key;
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'new': 'blue',
      'in_progress': 'orange', 
      'completed': 'green'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'new': 'Новая',
      'in_progress': 'В работе',
      'completed': 'Завершена'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'consultation': 'Консультация',
      'viewing': 'Просмотр объекта',
      'callback': 'Обратный звонок'
    };
    return labels[type] || type;
  };

  const parseMessage = (message: string) => {
    try {
      return JSON.parse(message);
    } catch (e) {
      return { message };
    }
  };

  const StatusButtons = ({ record }: { record: Request }) => (
    <Space direction="vertical" size="small">
      <Button 
        size="small" 
        type={record.status === 'new' ? 'primary' : 'default'}
        onClick={() => handleStatusChange(record.id, 'new')}
        disabled={record.status === 'new'}
      >
        Новая
      </Button>
      <Button 
        size="small" 
        type={record.status === 'in_progress' ? 'primary' : 'default'}
        onClick={() => handleStatusChange(record.id, 'in_progress')}
        disabled={record.status === 'in_progress'}
      >
        В работе
      </Button>
      <Button 
        size="small" 
        type={record.status === 'completed' ? 'primary' : 'default'}
        onClick={() => handleStatusChange(record.id, 'completed')}
        disabled={record.status === 'completed'}
      >
        Завершена
      </Button>
    </Space>
  );

  const columns = [
    {
      title: "Тип заявки",
      dataIndex: "type",
      key: "type",
      render: (type: string) => getTypeLabel(type)
    },
    {
      title: "Клиент",
      key: "client",
      render: (record: Request) => {
        const messageData = parseMessage(record.message);
        return (
          <div>
            <div><strong>{messageData.name || record.client?.name || 'Неизвестно'}</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              📞 {messageData.phone || record.client?.phone || 'Нет телефона'}
            </div>
            {messageData.email && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                📧 {messageData.email}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: "Изменить статус",
      key: "statusActions",
      render: (record: Request) => <StatusButtons record={record} />
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      title: "Детали заявки",
      key: "actions",
      render: (record: Request) => (
        <Button 
          size="small"
          onClick={() => showDetails(record)}
        >
          Подробнее
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1>Управление заявками</h1>
        <Button onClick={loadRequests} loading={loading}>
          Обновить
        </Button>
      </div>

      <Table 
        dataSource={requests} 
        columns={columns} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Детали заявки"
        open={!!selectedRequest}
        onCancel={() => setSelectedRequest(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedRequest(null)}>
            Закрыть
          </Button>
        ]}
        width={600}
      >
        {selectedRequest && (
          <div>
            <p><strong>Тип:</strong> {getTypeLabel(selectedRequest.type)}</p>
            <p><strong>Статус:</strong> 
              <Tag color={getStatusColor(selectedRequest.status)} style={{ marginLeft: 8 }}>
                {getStatusLabel(selectedRequest.status)}
              </Tag>
            </p>
            <p><strong>Дата:</strong> {new Date(selectedRequest.createdAt).toLocaleString('ru-RU')}</p>
            
            <div style={{ marginTop: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
              <h4>Данные клиента:</h4>
              {Object.entries(parseMessage(selectedRequest.message)).map(([key, value]) => (
                <p key={key} style={{ margin: '4px 0' }}>
                  <strong>{getFieldLabel(key)}:</strong> {String(value)}
                </p>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}