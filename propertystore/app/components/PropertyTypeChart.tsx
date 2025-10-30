'use client';

import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import { Pie } from '@ant-design/plots';
import type { PieConfig } from '@ant-design/plots';
import { getPropertyTypesAnalytics } from '../services/analitics';

interface PropertyTypeChartProps {
  height?: number;
  pipelineId?: string;
}

interface PropertyTypeData {
  type: string;
  value: number;
  percentage: number;
}

export const PropertyTypeChart: React.FC<PropertyTypeChartProps> = ({ 
  height = 300,
  pipelineId = "d7f300ba-bb60-4f99-9a9d-027e184279ee"
}) => {
  const [data, setData] = useState<PropertyTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const analyticsData = await getPropertyTypesAnalytics(pipelineId);
      
      // Преобразуем данные для диаграммы
      const chartData = analyticsData.map(item => ({
        type: item.displayName,
        value: item.dealCount,
        percentage: item.percentage
      }));

      setData(chartData);
      
    } catch (err: any) {
      console.error('Property type chart error:', err);
      setError('Ошибка загрузки данных по типам недвижимости');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pipelineId]);

  const config: PieConfig = {
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} ({percentage})%',
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value} сделок (${datum.percentage}%)`
        };
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    legend: {
      position: 'bottom',
    },
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#fa541c', '#13c2c2'],
  };

  if (error) {
    return (
      <Card title="Распределение по типам недвижимости" className="metric-card">
        <Alert message={error} type="error" />
      </Card>
    );
  }

  return (
    <Card 
      title="Распределение по типам недвижимости" 
      className="metric-card"
      extra={
        <a onClick={loadData} style={{ cursor: 'pointer', fontSize: '12px' }}>
          Обновить
        </a>
      }
    >
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Spin size="large" />
        ) : data.length > 0 ? (
          <Pie {...config} />
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>Нет данных для анализа</p>
            <p>Создайте сделки с привязанными объектами недвижимости</p>
          </div>
        )}
      </div>
    </Card>
  );
};