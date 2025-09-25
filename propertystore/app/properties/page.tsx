"use client";

import { useEffect, useState } from "react";
import { Property } from "../Models/Property";
import { getAllProperties } from "../services/properties";
import { Button, message, Tabs, TabsProps } from "antd";
import Title from "antd/es/typography/Title";
import { PropertiesPublic } from "../components/PropertiesPublic";

// Функция для получения свойств с фильтром
const getPropertiesByType = async (type?: string): Promise<Property[]> => {
  const url = type 
    ? `http://localhost:5100/api/Properties?type=${type}`
    : 'http://localhost:5100/api/Properties';
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Ошибка загрузки объектов');
  return response.json();
};

export default function PropertiesCatalogPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Загрузка объектов при изменении активной вкладки
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        let data: Property[];
        
        if (activeTab === "all") {
          data = await getPropertiesByType();
        } else {
          data = await getPropertiesByType(activeTab);
        }
        
        setProperties(data);
      } catch (error) {
        message.error('Ошибка загрузки объектов');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [activeTab]);

  // Конфигурация вкладок
  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: 'Все объекты',
    },
    {
      key: 'novostroyki',
      label: 'Новостройки',
    },
    {
      key: 'secondary',
      label: 'Вторичка',
    },
    {
      key: 'rent',
      label: 'Аренда',
    },
    {
      key: 'countryside',
      label: 'Загородная',
    },
    {
      key: 'invest',
      label: 'Инвестиционная',
    },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Каталог недвижимости
      </Title>

      
      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        style={{ marginBottom: '32px' }}
      />

      {loading ? (
        <Title level={3} style={{ textAlign: 'center' }}>Загрузка...</Title>
      ) : (
          <div className="cards-container"> 
          <div className="cards public-cards">
            <PropertiesPublic properties={properties} />
          </div>
        </div>
      )}
    </div>
  );
}