"use client";

import { Input, Select, Button, Space } from "antd";

interface RequestFiltersProps {
  filters: {
    status: string | null;
    type: string | null;
    search: string;
  };
  viewMode: 'table' | 'cards';
  onFiltersChange: (filters: any) => void;
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onResetFilters: () => void;
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onResetFilters
}) => {
  return (
    <div className="filters-section" style={{ 
      display: 'flex', 
      gap: '12px', 
      marginBottom: '20px', 
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '16px',
      background: 'var(--color-light)',
      border: '1px solid var(--color-light-gray)',
      borderRadius: 'var(--border-radius)'
    }}>
      <Input.Search
        placeholder="Поиск по клиенту или телефону..."
        style={{ width: '250px' }}
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        size="small"
      />
      
      <Select
        placeholder="Статус"
        style={{ width: '130px' }}
        value={filters.status}
        onChange={(value) => onFiltersChange({ ...filters, status: value })}
        allowClear
        size="small"
      >
        <Select.Option value="new">Новые</Select.Option>
        <Select.Option value="in_progress">В работе</Select.Option>
        <Select.Option value="completed">Завершены</Select.Option>
      </Select>

      <Select
        placeholder="Тип заявки"
        style={{ width: '140px' }}
        value={filters.type}
        onChange={(value) => onFiltersChange({ ...filters, type: value })}
        allowClear
        size="small"
      >
        <Select.Option value="consultation">Консультация</Select.Option>
        <Select.Option value="viewing">Просмотр</Select.Option>
        <Select.Option value="callback">Звонок</Select.Option>
      </Select>

      <Button onClick={onResetFilters} size="small">
        Сбросить
      </Button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Вид:</span>
        <Space.Compact>
          <Button 
            type={viewMode === 'table' ? 'primary' : 'default'}
            onClick={() => onViewModeChange('table')}
            size="small"
          >
            Таблица
          </Button>
          <Button 
            type={viewMode === 'cards' ? 'primary' : 'default'}
            onClick={() => onViewModeChange('cards')}
            size="small"
          >
            Карточки
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};