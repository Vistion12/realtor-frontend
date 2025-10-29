"use client";

import { useEffect, useState } from "react";
import { Button, Tag, message, Modal, Form, Input, Select, InputNumber, Row, Col } from "antd";
import { Request, getAllRequests, updateRequestStatus } from "../services/requests";
import { useAuth } from "../contexts/AuthContext";
import { createDeal, DealRequest, getStagesByPipeline, DealStage } from "../services/deals";
import { getAllClients, Client } from "../services/clients";
import { RequestCard } from "../components/RequestCard";

// Вспомогательные функции
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

const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'consultation': 'blue',
    'viewing': 'green',
    'callback': 'orange'
  };
  return colors[type] || 'default';
};

const getTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    'consultation': 'Консультация',
    'viewing': 'Просмотр',
    'callback': 'Звонок'
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

interface FilterState {
  status: string | null;
  type: string | null;
  searchQuery: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [selectedRequestForDeal, setSelectedRequestForDeal] = useState<Request | null>(null);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [dealForm] = Form.useForm();
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    type: null,
    searchQuery: ''
  });
  
  const { checkAuthError } = useAuth();

  // ID стандартных воронок
  const STANDARD_PIPELINES = [
    { id: "d7f300ba-bb60-4f99-9a9d-027e184279ee", name: "Продажа недвижимости" },
    { id: "cf83f63e-c7bc-4f18-a1cc-40ba1577702d", name: "Покупка недвижимости" },
    { id: "cc72076f-4351-477e-aa89-69396d47c4d7", name: "Аренда" }
  ];

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data);
    } catch (error: any) {
      checkAuthError(error);
      message.error("Ошибка загрузки заявок");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация заявок
  const filteredRequests = requests.filter(request => {
    const messageData = parseMessage(request.message);
    const clientName = messageData.name || request.client?.name || '';
    const clientPhone = messageData.phone || request.client?.phone || '';
    
    // Поиск
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        clientName.toLowerCase().includes(searchLower) ||
        clientPhone.includes(searchLower) ||
        messageData.email?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Фильтр по статусу
    if (filters.status && request.status !== filters.status) return false;
    
    // Фильтр по типу
    if (filters.type && request.type !== filters.type) return false;
    
    return true;
  });

  // Функция открытия формы создания сделки из заявки
  const handleCreateDealFromRequest = async (request: Request) => {
  try {
    // Если заявка новая - переводим в "в работе"
    if (request.status === 'new') {
      await updateRequestStatus(request.id, 'in_progress');
      // Обновляем локальное состояние
      setRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'in_progress' } : req
      ));
      message.success('Заявка переведена в работу');
    }
    
    setSelectedRequestForDeal(request);
    
    // Загружаем клиентов и этапы воронки продаж
    const [clientsData, stagesData] = await Promise.all([
      getAllClients(),
      getStagesByPipeline("d7f300ba-bb60-4f99-9a9d-027e184279ee") // Воронка продаж
    ]);
    
    setClients(clientsData);
    setStages(stagesData.sort((a, b) => a.order - b.order));
    
    // Автозаполняем форму данными из заявки
    const messageData = parseMessage(request.message);
    dealForm.setFieldsValue({
      title: `Сделка по заявке: ${messageData.name || 'Клиент'}`,
      clientId: request.clientId,
      notes: `Создано из заявки: ${getTypeLabel(request.type)}\n${messageData.message || ''}`
    });
    
    setIsCreateDealModalOpen(true);
  } catch (error) {
    message.error('Ошибка загрузки данных для создания сделки');
  }
};

  // Функция создания сделки из заявки
  const handleCreateDeal = async (values: any) => {
    if (!selectedRequestForDeal) return;
    
    try {
      const dealRequest: DealRequest = {
        title: values.title,
        clientId: values.clientId,
        pipelineId: values.pipelineId || "d7f300ba-bb60-4f99-9a9d-027e184279ee",
        currentStageId: values.stageId,
        dealAmount: values.dealAmount,
        notes: values.notes,
        requestId: selectedRequestForDeal.id
      };

      await createDeal(dealRequest);
      
      // Обновляем статус заявки на "completed"
      await updateRequestStatus(selectedRequestForDeal.id, 'completed');
      
      message.success('Сделка создана успешно! Заявка помечена как завершенная.');
      setIsCreateDealModalOpen(false);
      setSelectedRequestForDeal(null);
      dealForm.resetFields();
      loadRequests();
    } catch (error: any) {
      checkAuthError(error);
      message.error('Ошибка создания сделки');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus(id, newStatus);
      message.success("Статус обновлен");
      loadRequests();
    } catch (error: any) {
      checkAuthError(error);
      message.error("Ошибка обновления статуса");
    }
  };

  const showDetails = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      status: null,
      type: null,
      searchQuery: ''
    });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="catalog-page">
      <div className="catalog-header container">
        <h1 className="catalog-title">
          Управление заявками
        </h1>
        <p className="catalog-subtitle">
          Найдено заявок: {filteredRequests.length}
        </p>
      </div>

      <div className="catalog-layout container">
        {/* Фильтры слева */}
        <aside className="filters-column">
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Фильтры заявок</h3>
              <Button 
                onClick={clearFilters}
                size="small"
                type="text"
                style={{ fontSize: '12px' }}
              >
                Сбросить
              </Button>
            </div>

            {/* Поиск */}
            <div className="filter-group">
              <h4>Поиск</h4>
              <Input.Search
                placeholder="Клиент или телефон..."
                value={filters.searchQuery}
                onChange={(e) => handleFiltersChange({ ...filters, searchQuery: e.target.value })}
                size="small"
              />
            </div>

            {/* Статус */}
            <div className="filter-group">
              <h4>Статус</h4>
              <Select
                placeholder="Все статусы"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFiltersChange({ ...filters, status: value })}
                allowClear
                size="small"
              >
                <Select.Option value="new">🟦 Новые</Select.Option>
                <Select.Option value="in_progress">🟧 В работе</Select.Option>
                <Select.Option value="completed">🟩 Завершены</Select.Option>
              </Select>
            </div>

            {/* Тип заявки */}
            <div className="filter-group">
              <h4>Тип заявки</h4>
              <Select
                placeholder="Все типы"
                style={{ width: '100%' }}
                value={filters.type}
                onChange={(value) => handleFiltersChange({ ...filters, type: value })}
                allowClear
                size="small"
              >
                <Select.Option value="consultation">Консультация</Select.Option>
                <Select.Option value="viewing">Просмотр</Select.Option>
                <Select.Option value="callback">Звонок</Select.Option>
              </Select>
            </div>

            {/* Кнопка обновления */}
            <div className="filter-actions">
              <Button 
                onClick={loadRequests} 
                loading={loading}
                style={{ width: '100%' }}
                size="small"
              >
                Обновить заявки
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Карточки заявок */}
        <main className="properties-grid">
          {loading ? (
            <div className="loading-state">
              <h3>Загрузка заявок...</h3>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="empty-state">
              <h3>Заявки не найдены</h3>
              <p>Попробуйте изменить параметры фильтрации</p>
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onShowDetails={showDetails}
                  onCreateDeal={handleCreateDealFromRequest}
                  getTypeLabel={getTypeLabel}
                  getTypeColor={getTypeColor}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                  parseMessage={parseMessage}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Модальные окна остаются без изменений */}
      <Modal
        title="Детали заявки"
        open={!!selectedRequest}
        onCancel={() => setSelectedRequest(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedRequest(null)}>
            Закрыть
          </Button>
        ]}
        width={500}
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
                  <strong>{key}:</strong> {String(value)}
                </p>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Создать сделку из заявки"
        open={isCreateDealModalOpen}
        onCancel={() => {
          setIsCreateDealModalOpen(false);
          setSelectedRequestForDeal(null);
          dealForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={dealForm}
          layout="vertical"
          onFinish={handleCreateDeal}
        >
          <Form.Item
            name="title"
            label="Название сделки"
            rules={[{ required: true, message: 'Введите название сделки' }]}
          >
            <Input placeholder="Название сделки" />
          </Form.Item>

          <Form.Item
            name="clientId"
            label="Клиент"
            rules={[{ required: true, message: 'Выберите клиента' }]}
          >
            <Select placeholder="Выберите клиента">
              {clients.map(client => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name} ({client.phone})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="pipelineId"
            label="Воронка"
          >
            <Select placeholder="Выберите воронку" defaultValue="d7f300ba-bb60-4f99-9a9d-027e184279ee">
              {STANDARD_PIPELINES.map(pipeline => (
                <Select.Option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stageId"
            label="Начальный этап"
            rules={[{ required: true, message: 'Выберите этап' }]}
          >
            <Select placeholder="Выберите этап">
              {stages.map(stage => (
                <Select.Option key={stage.id} value={stage.id}>
                  {stage.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dealAmount"
            label="Сумма сделки"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Введите сумму"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              parser={value => value!.replace(/\s/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Примечания"
          >
            <Input.TextArea 
              placeholder="Дополнительная информация о сделке" 
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsCreateDealModalOpen(false);
                setSelectedRequestForDeal(null);
              }}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Создать сделку
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}