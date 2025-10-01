"use client";

import { useEffect, useState, useMemo } from "react";
import { Property } from "../Models/Property";
import { getAllProperties } from "../services/properties";
import { message } from "antd";
import { PropertiesPublic } from "../components/PropertiesPublic";
import { PropertyFilters } from "../components/PropertyFilters";
import { useSearchParams } from "next/navigation";

interface FilterState {
  types: string[];
  priceRange: [number, number];
  areaRange: [number, number];
  rooms: number[];
  searchQuery: string;
}

export default function PropertiesCatalogPage() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get('type');
  
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    types: urlType ? [urlType] : [], // Инициализируем фильтр из URL
    priceRange: [0, 100000000],
    areaRange: [0, 500],
    rooms: [],
    searchQuery: ''
  });

  // Загрузка всех объектов
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await getAllProperties();
        // Фильтруем только активные объекты для публичного каталога
        const activeProperties = data.filter((property: Property) => property.isActive);
        setAllProperties(activeProperties);
      } catch (error) {
        message.error('Ошибка загрузки объектов');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Обновляем фильтры при изменении URL параметров
  useEffect(() => {
    if (urlType && !filters.types.includes(urlType)) {
      const newFilters = {
        ...filters,
        types: [urlType]
      };
      setFilters(newFilters);
    }
  }, [urlType]); // Только при изменении urlType

  // Фильтрация объектов
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      // Фильтр по типу
      if (filters.types.length > 0 && !filters.types.includes(property.type)) {
        return false;
      }

      // Фильтр по цене
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // Фильтр по площади
      if (property.area < filters.areaRange[0] || property.area > filters.areaRange[1]) {
        return false;
      }

      // Фильтр по комнатам
      if (filters.rooms.length > 0 && !filters.rooms.includes(property.rooms)) {
        return false;
      }

      // Поиск по названию и адресу
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [allProperties, filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Получаем название активного типа для отображения
  const getActiveTypeLabel = () => {
    if (filters.types.length === 1) {
      const typeMap: { [key: string]: string } = {
        'novostroyki': 'Новостройки',
        'secondary': 'Вторичное жилье', 
        'rent': 'Аренда',
        'countryside': 'Загородная недвижимость',
        'invest': 'Инвестиционная недвижимость'
      };
      return typeMap[filters.types[0]] || filters.types[0];
    }
    return null;
  };

  const activeTypeLabel = getActiveTypeLabel();

  return (
    <div className="catalog-page">
      <div className="catalog-header container">
        <h1 className="catalog-title">
          {activeTypeLabel ? activeTypeLabel : 'Каталог недвижимости'}
        </h1>
        <p className="catalog-subtitle">
          Найдено объектов: {filteredProperties.length}
          {activeTypeLabel && ` в категории "${activeTypeLabel}"`}
        </p>
      </div>

      <div className="catalog-layout container">
        <aside className="filters-column">
          <PropertyFilters onFiltersChange={handleFiltersChange} />
        </aside>
        
        <main className="properties-grid">
          {loading ? (
            <div className="loading-state">
              <h3>Загрузка объектов...</h3>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="empty-state">
              <h3>Объекты не найдены</h3>
              <p>
                {activeTypeLabel 
                  ? `В категории "${activeTypeLabel}" пока нет объектов`
                  : 'Попробуйте изменить параметры фильтрации'
                }
              </p>
            </div>
          ) : (
            <div className="cards public-cards">
              <PropertiesPublic properties={filteredProperties} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}