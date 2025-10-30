'use client';

import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Select, DatePicker } from 'antd';
import { Line } from '@ant-design/plots';
import type { LineConfig } from '@ant-design/plots';
import { getAllDeals, Deal } from '../services/deals';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Расширяем dayjs плагином для работы с диапазонами
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DealsTrendChartProps {
  height?: number;
}

type TimePeriod = '7days' | '30days' | '90days' | 'custom';

// Тип для данных графика
interface ChartDataItem {
  date: string;
  value: number;
  category: 'created' | 'completed';
}

export const DealsTrendChart: React.FC<DealsTrendChartProps> = ({ 
  height = 300 
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const dealsData = await getAllDeals();
      setDeals(dealsData);
    } catch (err: any) {
      setError('Ошибка загрузки данных для графика');
      console.error('Trend chart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Подготавливаем данные для графика
  const getChartData = (): ChartDataItem[] => {
    const now = dayjs();
    let startDate: dayjs.Dayjs;
    let endDate: dayjs.Dayjs = now;

    switch (timePeriod) {
      case '7days':
        startDate = now.subtract(7, 'day');
        break;
      case '30days':
        startDate = now.subtract(30, 'day');
        break;
      case '90days':
        startDate = now.subtract(90, 'day');
        break;
      case 'custom':
        startDate = dateRange ? dateRange[0] : now.subtract(30, 'day');
        endDate = dateRange ? dateRange[1] : now;
        break;
      default:
        startDate = now.subtract(30, 'day');
    }

    // Создаем массив всех дат в диапазоне (для заполнения нулями)
    const allDates: string[] = [];
    let currentDate = startDate;
    
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      allDates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    // Считаем сделки по дням
    const dealsByDate = allDates.reduce((acc, date) => {
      acc[date] = { created: 0, completed: 0 };
      return acc;
    }, {} as Record<string, { created: number; completed: number }>);

    // Заполняем реальными данными
    deals.forEach(deal => {
      const dealDate = dayjs(deal.createdAt);
      const dateKey = dealDate.format('YYYY-MM-DD');
      
      if (dealDate.isBetween(startDate, endDate, 'day', '[]')) {
        if (dealsByDate[dateKey]) {
          dealsByDate[dateKey].created++;
          
          if (deal.closedAt) {
            dealsByDate[dateKey].completed++;
          }
        }
      }
    });

    // Преобразуем в формат для графика
    const result: ChartDataItem[] = [];
    
    Object.entries(dealsByDate).forEach(([date, counts]) => {
      result.push(
        {
          date,
          value: counts.created,
          category: 'created' as const,
        },
        {
          date,
          value: counts.completed,
          category: 'completed' as const,
        }
      );
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  };

  const chartData = getChartData();

  const config: LineConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
      tickCount: 8,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v} сделок`,
      },
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      formatter: (datum: ChartDataItem) => {
        const label = datum.category === 'created' ? 'Создано' : 'Завершено';
        return { 
          name: label, 
          value: `${datum.value} сделок` 
        };
      },
    },
    color: ['#1890ff', '#52c41a'],
    meta: {
      date: {
        formatter: (value: string) => dayjs(value).format('DD.MM'),
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const handlePeriodChange = (value: TimePeriod) => {
    setTimePeriod(value);
    if (value !== 'custom') {
      setDateRange(null);
    }
  };

  if (error) {
    return (
      <Card title="Динамика сделок" className="metric-card">
        <Alert message={error} type="error" />
      </Card>
    );
  }

  return (
    <Card 
      title="Динамика сделок" 
      className="metric-card"
      extra={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Select
            value={timePeriod}
            onChange={handlePeriodChange}
            size="small"
            style={{ width: 120 }}
          >
            <Option value="7days">7 дней</Option>
            <Option value="30days">30 дней</Option>
            <Option value="90days">90 дней</Option>
            <Option value="custom">Произвольный</Option>
          </Select>
          
          {timePeriod === 'custom' && (
            <RangePicker
              size="small"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ width: 200 }}
            />
          )}
          
          <a onClick={loadData} style={{ cursor: 'pointer', fontSize: '12px' }}>
            Обновить
          </a>
        </div>
      }
    >
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Spin size="large" />
        ) : chartData.length > 0 ? (
          <Line {...config} />
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>Нет данных для выбранного периода</p>
            <p>Создайте сделки для анализа динамики</p>
          </div>
        )}
      </div>
    </Card>
  );
};