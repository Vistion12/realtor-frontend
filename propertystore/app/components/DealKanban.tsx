'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, Button, message, Spin, Modal, Form, Input, Select, InputNumber, Tag, Descriptions, Space, Timeline } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Deal, DealStage, getActiveDeals, getStagesByPipeline, moveDealToStage, createDeal, DealRequest, getDealWithDetails, updateDeal, closeDeal, getAllDeals } from '../services/deals';
import { getAllClients, Client } from '../services/clients';

interface DealKanbanProps {
  pipelineId: string;
}

interface Filters {
  searchQuery: string;
  selectedClient: string | null;
  showOnlyOverdue: boolean;
  showCompleted: boolean;
}

export const DealKanban = ({ pipelineId }: DealKanbanProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [editForm] = Form.useForm();


  
  // State для фильтров
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    selectedClient: null,
    showOnlyOverdue: false,
    showCompleted: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dealsData, stagesData, clientsData] = await Promise.all([
        getAllDeals(),
        getStagesByPipeline(pipelineId),
        getAllClients()
      ]);
      
      // Фильтруем сделки только для этой воронки
      const pipelineDeals = dealsData.filter(deal => deal.pipelineId === pipelineId);
    setDeals(pipelineDeals);
    setStages(stagesData.sort((a, b) => a.order - b.order));
    setClients(clientsData);
  } catch (error) {
    message.error('Ошибка загрузки данных');
  } finally {
    setLoading(false);
  }
};

  // Функция открытия деталей
const handleCardClick = async (deal: Deal) => {
  setSelectedDeal(deal);
  setIsDetailModalOpen(true);
  
  // ВРЕМЕННО: Mock-данные для истории
  const mockHistory = [
    {
      id: '1',
      fromStage: { name: 'Первичный контакт' },
      toStage: { name: 'Оценка и договор' },
      changedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      notes: 'Клиент проявил интерес к объекту'
    },
    {
      id: '2', 
      fromStage: { name: 'Оценка и договор' },
      toStage: { name: 'Показы объекта' },
      changedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      notes: 'Подписан договор на реализацию'
    },
    {
      id: '3',
      fromStage: { name: 'Показы объекта' },
      toStage: { name: 'Оформление сделки' },
      changedAt: new Date().toISOString(),
      notes: 'Найдены покупатели, начато оформление'
    }
  ];
  
  // Добавляем mock-историю к сделке
  setSelectedDeal(prev => prev ? { ...prev, history: mockHistory } : null);
};

const handleEditClick = (deal: Deal) => {
  setEditingDeal(deal);
  editForm.setFieldsValue({
    title: deal.title,
    clientId: deal.clientId,
    stageId: deal.currentStageId,
    dealAmount: deal.dealAmount,
    notes: deal.notes
  });
  setIsEditModalOpen(true);
};

// Функция сохранения изменений
const handleUpdateDeal = async (values: any) => {
  if (!editingDeal) return;
  
  try {
    const dealRequest: DealRequest = {
      title: values.title,
      clientId: values.clientId,
      pipelineId: pipelineId,
      currentStageId: values.stageId,
      dealAmount: values.dealAmount,
      notes: values.notes
    };

    await updateDeal(editingDeal.id, dealRequest);
    message.success('Сделка обновлена');
    setIsEditModalOpen(false);
    setEditingDeal(null);
    loadData(); // Перезагружаем данные
  } catch (error) {
    message.error('Ошибка обновления сделки');
  }
};

// Функция завершения сделки
const handleCloseDeal = async () => {
  if (!selectedDeal) return;
  
  try {
    await closeDeal(selectedDeal.id);
    message.success('Сделка завершена');
    setIsDetailModalOpen(false);
    setSelectedDeal(null);
    loadData(); // Обновляем список
  } catch (error) {
    message.error('Ошибка завершения сделки');
  }
};

  // Функция фильтрации сделок
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Поиск по названию
      if (filters.searchQuery && 
          !deal.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Фильтр по клиенту
      if (filters.selectedClient && deal.clientId !== filters.selectedClient) {
        return false;
      }
      
      // Только просроченные
      if (filters.showOnlyOverdue && !deal.isOverdue) {
        return false;
      }

      // Фильтр по завершенным сделкам
      if (!filters.showCompleted && !deal.isActive) {
        return false;
      }      
      return true;
    });
  }, [deals, filters]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const dealId = result.draggableId;
    const newStageId = result.destination.droppableId;
    const oldStageId = result.source.droppableId;

    if (newStageId === oldStageId) return;

    try {
      await moveDealToStage(dealId, {
        newStageId,
        notes: 'Перемещено через канбан-доску'
      });
      
      // Обновляем локальное состояние
      setDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, currentStageId: newStageId }
          : deal
      ));
      
      message.success('Сделка перемещена');
    } catch (error) {
      message.error('Ошибка перемещения сделки');
    }
  };

  const handleCreateDeal = async (values: any) => {
    try {
      const dealRequest: DealRequest = {
        title: values.title,
        clientId: values.clientId,
        pipelineId: pipelineId,
        currentStageId: values.stageId,
        dealAmount: values.dealAmount,
        notes: values.notes
      };

      const dealId = await createDeal(dealRequest);
      message.success('Сделка создана успешно');
      setIsCreateModalOpen(false);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error('Ошибка создания сделки');
    }
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedClient: null,
      showOnlyOverdue: false,
      showCompleted: true
    });
  };

  useEffect(() => {
    loadData();
  }, [pipelineId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* ЗАГОЛОВОК И КНОПКИ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Канбан-доска сделок</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
            + Новая сделка
          </Button>
          <Button onClick={loadData}>Обновить</Button>
        </div>
      </div>

      {/* ФИЛЬТРЫ */}
      <div style={{ 
        background: '#fafafa', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #d9d9d9'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {/* Поиск по названию */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Поиск</div>
            <Input
              placeholder="Поиск по названию сделки..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              allowClear
            />
          </div>

          {/* Фильтр по клиенту */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Клиент</div>
            <Select
              placeholder="Все клиенты"
              value={filters.selectedClient}
              onChange={(value) => setFilters(prev => ({ ...prev, selectedClient: value }))}
              style={{ width: '100%' }}
              allowClear
            >
              {clients.map(client => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name} ({client.phone})
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Фильтр просроченных */}
          <div>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Просроченные</div>
            <Button
              type={filters.showOnlyOverdue ? 'primary' : 'default'}
              danger={filters.showOnlyOverdue}
              onClick={() => setFilters(prev => ({ ...prev, showOnlyOverdue: !prev.showOnlyOverdue }))}
            >
              {filters.showOnlyOverdue ? 'Только просроченные' : 'Все'}
            </Button>
          </div>

          {/* Фильтр завершенных */}
          <div>
            <div style={{ fontSize: '12px', marginBottom: '4px', color: '#666' }}>Завершенные</div>
            <Button
              type={filters.showCompleted ? 'default' : 'primary'}
              onClick={() => setFilters(prev => ({ ...prev, showCompleted: !prev.showCompleted }))}
            >
              {filters.showCompleted ? 'Показаны' : 'Скрыты'}
            </Button>
          </div>

          {/* Сброс фильтров */}
          <div>
            <Button onClick={resetFilters}>
              Сбросить
            </Button>
          </div>
        </div>

        {/* Информация о фильтрации */}
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          Показано: {filteredDeals.length} из {deals.length} сделок
          {filters.selectedClient && (
            <Tag color="blue" style={{ marginLeft: '8px' }}>
              Клиент: {clients.find(c => c.id === filters.selectedClient)?.name}
            </Tag>
          )}
          {filters.showOnlyOverdue && (
            <Tag color="red" style={{ marginLeft: '8px' }}>Только просроченные</Tag>
          )}
          {!filters.showCompleted && (
            <Tag color="orange" style={{ marginLeft: '8px' }}>Завершенные скрыты</Tag>
          )}
        </div>
      </div>

      {/* КАНБАН-ДОСКА */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(deal => deal.currentStageId === stage.id);
            
            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minWidth: '300px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      padding: '16px',
                      minHeight: '500px'
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ margin: 0 }}>{stage.name}</h3>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {stageDeals.length} сделок
                      </div>
                    </div>

                    {stageDeals.map((deal, index) => (
                    <Draggable key={deal.id} draggableId={deal.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: '8px',
                            cursor: 'pointer' 
                          }}
                          onClick={() => handleCardClick(deal)}
                        >
                          <Card
                            size="small"
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{deal.title}</span>
                                <div>
                                  {!deal.isActive && (
                                    <Tag color="default" style={{ fontSize: '10px', marginRight: '8px' }}>
                                      ЗАВЕРШЕНА
                                    </Tag>
                                  )}
                                  {deal.isOverdue && deal.isActive && (
                                    <span style={{ 
                                      color: '#ff4d4f', 
                                      fontSize: '10px',
                                      fontWeight: 'bold'
                                    }}>
                                      ⚠️ ПРОСРОЧЕНО
                                    </span>
                                  )}
                                </div>
                              </div>
                            }
                            style={{
                              border: deal.isOverdue ? '2px solid #ff4d4f' : 
                                      !deal.isActive ? '2px solid #d9d9d9' : '1px solid #d9d9d9',
                              opacity: !deal.isActive ? 0.7 : 1
                            }}
                          >
                            <div style={{ fontSize: '12px' }}>
                              <div><strong>👤 Клиент:</strong> {deal.client?.name || 'Неизвестно'}</div>
                              <div><strong>📞 Телефон:</strong> {deal.client?.phone || 'Нет'}</div>
                              {deal.dealAmount && (
                                <div><strong>💰 Сумма:</strong> {deal.dealAmount.toLocaleString()} ₽</div>
                              )}
                              {deal.stageDeadline && (
                                <div><strong>📅 Дедлайн:</strong> {new Date(deal.stageDeadline).toLocaleDateString('ru-RU')}</div>
                              )}
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ СДЕЛКИ */}
      <Modal
        title="Создать новую сделку"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDeal}
        >
          <Form.Item
            name="title"
            label="Название сделки"
            rules={[{ required: true, message: 'Введите название сделки' }]}
          >
            <Input placeholder="Например: Продажа квартиры на Ленина 25" />
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
            <Input.TextArea placeholder="Дополнительная информация о сделке" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsCreateModalOpen(false)}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                Создать сделку
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {/* Модальное окно редактирования сделки */}
<Modal
  title="Редактировать сделку"
  open={isEditModalOpen}
  onCancel={() => {
    setIsEditModalOpen(false);
    setEditingDeal(null);
    editForm.resetFields();
  }}
  footer={null}
  width={600}
>
  <Form
    form={editForm}
    layout="vertical"
    onFinish={handleUpdateDeal}
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
      name="stageId"
      label="Текущий этап"
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
      <Input.TextArea placeholder="Дополнительная информация о сделке" />
    </Form.Item>

    <Form.Item>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button onClick={() => {
          setIsEditModalOpen(false);
          setEditingDeal(null);
        }}>
          Отмена
        </Button>
        <Button type="primary" htmlType="submit">
          Сохранить изменения
        </Button>
      </div>
    </Form.Item>
  </Form>
</Modal>
      <Modal
  title={`Сделка: ${selectedDeal?.title}`}
  open={isDetailModalOpen}
  onCancel={() => {
    setIsDetailModalOpen(false);
    setSelectedDeal(null);
  }}
  footer={[
  <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
    Закрыть
  </Button>,
  <Button 
    key="edit" 
    type="primary"
    onClick={() => {
      setIsDetailModalOpen(false);
      handleEditClick(selectedDeal!);
    }}
  >
    Редактировать
  </Button>,
  <Button 
    key="close-deal" 
    type="primary" 
    danger
    onClick={handleCloseDeal}
    disabled={!selectedDeal?.isActive}
  >
    Завершить сделку
  </Button>
]}
  width={800}
>
  {selectedDeal && (
    <div>
      {/* Основная информация */}
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Название" span={2}>
          {selectedDeal.title}
        </Descriptions.Item>
        
        <Descriptions.Item label="Клиент">
          <div>
            <div><strong>{selectedDeal.client?.name || 'Неизвестно'}</strong></div>
            <div>📞 {selectedDeal.client?.phone || 'Нет телефона'}</div>
            {selectedDeal.client?.email && (
              <div>📧 {selectedDeal.client.email}</div>
            )}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="Текущий этап">
          <Tag color="blue">
            {stages.find(s => s.id === selectedDeal.currentStageId)?.name || 'Неизвестно'}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Сумма сделки">
          {selectedDeal.dealAmount ? (
            <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
              {selectedDeal.dealAmount.toLocaleString()} ₽
            </span>
          ) : 'Не указана'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Статус">
          <Space>
            <Tag color={selectedDeal.isActive ? 'green' : 'red'}>
              {selectedDeal.isActive ? 'Активна' : 'Завершена'}
            </Tag>
            {selectedDeal.isOverdue && (
              <Tag color="red">ПРОСРОЧЕНО</Tag>
            )}
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label="Дедлайн этапа">
          {selectedDeal.stageDeadline ? (
            <span style={{ 
              color: selectedDeal.isOverdue ? '#ff4d4f' : 'inherit',
              fontWeight: selectedDeal.isOverdue ? 'bold' : 'normal'
            }}>
              {new Date(selectedDeal.stageDeadline).toLocaleDateString('ru-RU')}
            </span>
          ) : 'Не установлен'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Дата создания">
          {new Date(selectedDeal.createdAt).toLocaleDateString('ru-RU')}
        </Descriptions.Item>
        
        <Descriptions.Item label="Примечания" span={2}>
          {selectedDeal.notes || 'Нет примечаний'}
        </Descriptions.Item>
      </Descriptions>

      {/* История перемещений */}
      <div style={{ marginTop: '24px' }}>
        <h4>История перемещений по этапам</h4>
        {selectedDeal.history && selectedDeal.history.length > 0 ? (
          <Timeline>
            {selectedDeal.history.map((historyItem, index) => (
              <Timeline.Item key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    {historyItem.fromStage?.name || 'Начало'} → {historyItem.toStage?.name || 'Неизвестно'}
                  </span>
                  <span style={{ color: '#666', fontSize: '12px' }}>
                    {new Date(historyItem.changedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {historyItem.notes && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    📝 {historyItem.notes}
                  </div>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            История перемещений пока отсутствует
          </div>
        )}
      </div>
    </div>
  )}
</Modal>
    </div>
  );
};