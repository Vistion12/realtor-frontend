'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface FilterState {
  types: string[];
  priceRange: [number, number];
  areaRange: [number, number];
  rooms: number[];
  searchQuery: string;
}

interface Props {
  onFiltersChange: (filters: FilterState) => void;
}

export const PropertyFilters = ({ onFiltersChange }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlType = searchParams.get('type');
  
  const [filters, setFilters] = useState<FilterState>({
    types: urlType ? [urlType] : [],
    priceRange: [0, 100000000],
    areaRange: [0, 500],
    rooms: [],
    searchQuery: ''
  });

  const propertyTypes = [
    { value: 'novostroyki', label: 'Новостройки' },
    { value: 'secondary', label: 'Вторичное жилье' },
    { value: 'rent', label: 'Аренда' },
    { value: 'countryside', label: 'Загородная' },
    { value: 'invest', label: 'Инвестиционная' }
  ];

  const roomOptions = [
    { value: 1, label: '1 комната' },
    { value: 2, label: '2 комнаты' },
    { value: 3, label: '3 комнаты' },
    { value: 4, label: '4+ комнаты' }
  ];

  // Обновляем URL при изменении типа
  useEffect(() => {
    if (filters.types.length === 1) {
      const params = new URLSearchParams(searchParams);
      params.set('type', filters.types[0]);
      router.replace(`/properties?${params.toString()}`, { scroll: false });
    } else if (filters.types.length === 0 && urlType) {
      const params = new URLSearchParams(searchParams);
      params.delete('type');
      router.replace(`/properties?${params.toString()}`, { scroll: false });
    }
  }, [filters.types, router, searchParams, urlType]);

  const handleTypeChange = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    const newFilters: FilterState = { 
      ...filters, 
      types: newTypes 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const newPriceRange: [number, number] = 
      field === 'min' 
        ? [numValue, filters.priceRange[1]]
        : [filters.priceRange[0], numValue];
    
    const newFilters: FilterState = { 
      ...filters, 
      priceRange: newPriceRange 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAreaChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const newAreaRange: [number, number] = 
      field === 'min' 
        ? [numValue, filters.areaRange[1]]
        : [filters.areaRange[0], numValue];
    
    const newFilters: FilterState = { 
      ...filters, 
      areaRange: newAreaRange 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRoomsChange = (room: number) => {
    const newRooms = filters.rooms.includes(room)
      ? filters.rooms.filter(r => r !== room)
      : [...filters.rooms, room];
    
    const newFilters: FilterState = { 
      ...filters, 
      rooms: newRooms 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (query: string) => {
    const newFilters: FilterState = { 
      ...filters, 
      searchQuery: query 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterState = {
      types: [],
      priceRange: [0, 100000000],
      areaRange: [0, 500],
      rooms: [],
      searchQuery: ''
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Очищаем URL параметры
    router.replace('/properties', { scroll: false });
  };

  return (
    <div className="filters-sidebar">
      <div className="filters-header">
        <h3>Фильтры</h3>
        {urlType && (
          <span className="active-filter-badge">
            Активный фильтр: {propertyTypes.find(t => t.value === urlType)?.label}
          </span>
        )}
      </div>

      {/* Поиск */}
      <div className="filter-group">
        <h4>Поиск</h4>
        <input
          type="text"
          placeholder="Название или адрес..."
          className="input"
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Тип недвижимости */}
      <div className="filter-group">
        <h4>Тип недвижимости</h4>
        {propertyTypes.map(type => (
          <label key={type.value} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.types.includes(type.value)}
              onChange={() => handleTypeChange(type.value)}
            />
            <span>{type.label}</span>
          </label>
        ))}
      </div>

      {/* Цена */}
      <div className="filter-group">
        <h4>Цена, ₽</h4>
        <div className="range-inputs">
          <div className="range-input-group">
            <label>От</label>
            <input
              type="number"
              className="input"
              placeholder="0"
              value={filters.priceRange[0] || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              min="0"
              max="100000000"
            />
          </div>
          <div className="range-input-group">
            <label>До</label>
            <input
              type="number"
              className="input"
              placeholder="100000000"
              value={filters.priceRange[1] || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              min="0"
              max="100000000"
            />
          </div>
        </div>
      </div>

      {/* Площадь */}
      <div className="filter-group">
        <h4>Площадь, м²</h4>
        <div className="range-inputs">
          <div className="range-input-group">
            <label>От</label>
            <input
              type="number"
              className="input"
              placeholder="0"
              value={filters.areaRange[0] || ''}
              onChange={(e) => handleAreaChange('min', e.target.value)}
              min="0"
              max="500"
            />
          </div>
          <div className="range-input-group">
            <label>До</label>
            <input
              type="number"
              className="input"
              placeholder="500"
              value={filters.areaRange[1] || ''}
              onChange={(e) => handleAreaChange('max', e.target.value)}
              min="0"
              max="500"
            />
          </div>
        </div>
      </div>

      {/* Количество комнат */}
      <div className="filter-group">
        <h4>Комнаты</h4>
        {roomOptions.map(room => (
          <label key={room.value} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.rooms.includes(room.value)}
              onChange={() => handleRoomsChange(room.value)}
            />
            <span>{room.label}</span>
          </label>
        ))}
      </div>

      {/* Кнопка сброса внизу */}
      <div className="filter-actions">
        <button 
          className="button transparent" 
          onClick={clearFilters}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};