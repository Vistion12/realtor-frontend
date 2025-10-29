'use client';

import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import { getStagesAnalytics, DealStageAnalytics } from '../services/analitics';

interface DealFunnelChartProps {
  pipelineId: string;
  height?: number;
}

interface FunnelDataItem {
  stage: string;
  count: number;
  conversion: number;
  overdue: number;
  averageTime: string;
}

export const DealFunnelChart: React.FC<DealFunnelChartProps> = ({ 
  pipelineId, 
  height = 400 
}) => {
  const [data, setData] = useState<FunnelDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFunnelData = async () => {
    try {
      setLoading(true);
      const analytics = await getStagesAnalytics(pipelineId);
      
      const funnelData = analytics.map((stage: DealStageAnalytics, index: number) => ({
        stage: stage.stageName,
        count: stage.dealCount,
        conversion: index === 0 ? 100 : (stage.dealCount / analytics[0].dealCount) * 100,
        overdue: stage.overdueDeals,
        averageTime: stage.averageTimeInStage
      }));

      setData(funnelData);
    } catch (err: any) {
      setError('Ошибка загрузки данных воронки');
      console.error('Funnel data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pipelineId) {
      loadFunnelData();
    }
  }, [pipelineId]);

  // Кастомная визуализация воронки
  const renderCustomFunnel = () => {
    if (data.length === 0) return null;

    const maxCount = Math.max(...data.map(item => item.count));
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        padding: '20px 0'
      }}>
        {data.map((item, index) => {
          const widthPercent = (item.count / maxCount) * 80 + 20; // Минимальная ширина 20%
          const isFirst = index === 0;
          const isLast = index === data.length - 1;
          
          return (
            <div key={index} style={{ position: 'relative' }}>
              {/* Блок этапа */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: isFirst 
                  ? 'var(--color-light-gray)' 
                  : isLast 
                    ? 'var(--color-dark-gray)' 
                    : '#e8f4fd',
                padding: '16px 20px',
                borderRadius: '12px',
                border: `2px solid ${isFirst ? 'var(--color-light-gray)' : isLast ? 'var(--color-dark-gray)' : '#1890ff'}`,
                marginLeft: `${(index * 8)}%`, // Смещение для воронки
                width: `${widthPercent}%`,
                transition: 'all 0.3s ease',
                position: 'relative',
                minHeight: '60px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ 
                      fontWeight: '700', 
                      fontSize: '14px',
                      color: isLast ? 'var(--color-light)' : 'var(--color-dark)'
                    }}>
                      {item.stage}
                    </span>
                    <span style={{ 
                      fontWeight: '700', 
                      fontSize: '16px',
                      color: isLast ? 'var(--color-light)' : 'var(--color-dark)'
                    }}>
                      {item.count}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px',
                    fontSize: '12px',
                    color: isLast ? 'rgba(255,255,255,0.8)' : 'var(--color-dark-gray)'
                  }}>
                    <span>Конверсия: <strong>{item.conversion.toFixed(1)}%</strong></span>
                    {item.overdue > 0 && (
                      <span style={{ color: '#ff4d4f' }}>
                        ⚠️ Просрочено: {item.overdue}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Индикатор конверсии */}
                {!isFirst && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '12px',
                    background: '#52c41a',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {item.conversion.toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Стрелка между этапами (кроме последнего) */}
              {!isLast && (
                <div style={{
                  textAlign: 'center',
                  margin: '4px 0',
                  color: 'var(--color-light-gray)',
                  fontSize: '16px'
                }}>
                  ↓
                </div>
              )}
            </div>
          );
        })}
        
        {/* Легенда */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
          fontSize: '12px',
          color: 'var(--color-dark-gray)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--color-light-gray)', borderRadius: '2px' }}></div>
            <span>Начало воронки</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: '#e8f4fd', borderRadius: '2px' }}></div>
            <span>Промежуточные этапы</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--color-dark-gray)', borderRadius: '2px' }}></div>
            <span>Завершение</span>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card title="Воронка конверсии" className="metric-card">
        <Alert message={error} type="error" />
      </Card>
    );
  }

  return (
    <Card 
      title="Воронка конверсии" 
      className="metric-card"
      extra={
        <a onClick={loadFunnelData} style={{ cursor: 'pointer', fontSize: '12px' }}>
          Обновить
        </a>
      }
    >
      <div style={{ minHeight: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Spin size="large" />
        ) : data.length > 0 ? (
          renderCustomFunnel()
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <p>Нет данных для отображения</p>
            <p>Создайте сделки в воронке</p>
          </div>
        )}
      </div>
    </Card>
  );
};