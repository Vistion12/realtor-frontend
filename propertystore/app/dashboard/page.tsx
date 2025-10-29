"use client";

import { useEffect, useState } from "react";
import { Button, message, Row, Col, Card } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { MetricCards } from "../components/MetricCards";
import { DealFunnelChart } from "../components/DealFunnelChart";
import { DashboardMetrics, getDashboardMetrics } from "../services/analitics";
import { ActiveDealsMiniKanban } from "../components/ActiveDealsMiniKanban";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalDeals: 0,
    activeDeals: 0,
    completedDeals: 0,
    overdueDeals: 0,
    totalDealAmount: 0,
    conversionRate: 0,
    averageDealTime: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { checkAuthError } = useAuth();

  // ID основной воронки "Продажа недвижимости"
  const salesPipelineId = "d7f300ba-bb60-4f99-9a9d-027e184279ee";

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (error: any) {
      checkAuthError(error);
      message.error("Ошибка загрузки метрик");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="catalog-title">Дашборд аналитики</h1>
          <Button onClick={loadMetrics} loading={loading}>
            Обновить
          </Button>
        </div>
        <p className="catalog-subtitle">
          Ключевые метрики эффективности
        </p>
      </div>

      <div className="dashboard-content container">
        {/* KPI карточки */}
        <MetricCards metrics={metrics} loading={loading} />
        
        {/* Воронка конверсии и дополнительная аналитика */}
        <Row gutter={[20, 20]} style={{ marginTop: '40px' }}>
        <Col xs={24} lg={12}>
            <DealFunnelChart 
            pipelineId={salesPipelineId} 
            height={400}
            />
        </Col>
        <Col xs={24} lg={12}>
            <ActiveDealsMiniKanban 
            pipelineId={salesPipelineId}
            height={400}
            maxDealsPerStage={3}
            />
        </Col>
        </Row>

        {/* Заглушка для будущих графиков */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <h3 style={{ color: 'var(--color-dark)', marginBottom: '16px' }}>
            Дополнительная аналитика в разработке
          </h3>
          <p style={{ fontSize: '14px' }}>
            Графики динамики сделок и распределение по типам недвижимости скоро будут добавлены
          </p>
        </div>
      </div>
    </div>
  );
}