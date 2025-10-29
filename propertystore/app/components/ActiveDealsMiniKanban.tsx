'use client';

import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Tag, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { getActiveDeals, Deal, getStagesByPipeline, DealStage } from '../services/deals';

interface ActiveDealsMiniKanbanProps {
  pipelineId: string;
  maxDealsPerStage?: number;
  height?: number;
}

export const ActiveDealsMiniKanban: React.FC<ActiveDealsMiniKanbanProps> = ({ 
  pipelineId,
  maxDealsPerStage = 3,
  height = 350
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stages, setStages] = useState<DealStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadData = async () => {
    try {
      setLoading(true);
      const [dealsData, stagesData] = await Promise.all([
        getActiveDeals(),
        getStagesByPipeline(pipelineId)
      ]);

      // Фильтруем сделки только для этой воронки и добавляем клиентов
      const pipelineDeals = dealsData.filter(deal => 
        deal.pipelineId === pipelineId && deal.client
      );

      setDeals(pipelineDeals);
      setStages(stagesData.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      setError('Ошибка загрузки активных сделок');
      console.error('Mini kanban error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pipelineId) {
      loadData();
    }
  }, [pipelineId]);

  // Группируем сделки по этапам
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals
      .filter(deal => deal.currentStageId === stage.id)
      .slice(0, maxDealsPerStage);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDealClick = (dealId: string) => {
    router.push(`/deals?deal=${dealId}`);
  };

  const handleViewAll = () => {
    router.push('/deals');
  };

  if (error) {
    return (
      <Card title="Активные сделки" className="metric-card">
        <Alert message={error} type="error" />
      </Card>
    );
  }

  return (
    <Card 
      title="Активные сделки" 
      className="metric-card"
      extra={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a onClick={loadData} style={{ cursor: 'pointer', fontSize: '12px' }}>
            Обновить
          </a>
          <Button 
            type="link" 
            size="small" 
            onClick={handleViewAll}
            style={{ padding: 0, height: 'auto', fontSize: '12px' }}
          >
            Все сделки →
          </Button>
        </div>
      }
    >
      <div style={{ minHeight: `${height}px` }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0' }}>
            {stages.map(stage => {
              const stageDeals = dealsByStage[stage.id] || [];
              const totalDealsInStage = deals.filter(d => d.currentStageId === stage.id).length;
              const hasMoreDeals = totalDealsInStage > stageDeals.length;

              return (
                <div 
                  key={stage.id}
                  style={{
                    minWidth: '220px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid var(--color-light-gray)',
                    padding: '12px'
                  }}
                >
                  {/* Заголовок этапа */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--color-light-gray)'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      fontSize: '13px',
                      color: 'var(--color-dark)'
                    }}>
                      {stage.name}
                    </span>
                    <Tag 
                      color={stageDeals.length > 0 ? 'blue' : 'default'}
                      style={{ margin: 0, fontSize: '11px' }}
                    >
                      {totalDealsInStage}
                    </Tag>
                  </div>

                  {/* Список сделок */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        onClick={() => handleDealClick(deal.id)}
                        style={{
                          background: 'white',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #e8e8e8',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '12px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-dark-gray)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e8e8';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {deal.title}
                        </div>
                        {deal.client && (
                          <div style={{ color: 'var(--color-dark-gray)' }}>
                            {deal.client.name}
                          </div>
                        )}
                        {deal.isOverdue && (
                          <Tag color="red" style={{ fontSize: '10px', marginTop: '4px' }}>
                            Просрочено
                          </Tag>
                        )}
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        color: 'var(--color-light-gray)',
                        fontSize: '11px',
                        padding: '8px'
                      }}>
                        Нет активных сделок
                      </div>
                    )}

                    {/* Показать еще */}
                    {hasMoreDeals && (
                      <div style={{ 
                        textAlign: 'center', 
                        fontSize: '11px',
                        color: 'var(--color-dark-gray)',
                        marginTop: '4px'
                      }}>
                        +{totalDealsInStage - stageDeals.length} еще
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Статистика */}
        {!loading && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px',
            background: 'var(--color-light-gray)',
            borderRadius: '6px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Всего активных сделок:</span>
              <strong>{deals.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span>Просроченных:</span>
              <strong style={{ color: '#ff4d4f' }}>
                {deals.filter(d => d.isOverdue).length}
              </strong>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};