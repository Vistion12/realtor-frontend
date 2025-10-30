"use client";

import { useEffect, useState } from "react";
import { Button, message, Row, Col } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { MetricCards } from "../components/MetricCards";
import { DealFunnelChart } from "../components/DealFunnelChart";
import { DashboardMetrics, getDashboardMetrics } from "../services/analitics";
import { ActiveDealsMiniKanban } from "../components/ActiveDealsMiniKanban";
import { DealsTrendChart } from "../components/DealsTrendChart";
import { PropertyTypeChart } from "../components/PropertyTypeChart";

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
        
        {/* Воронка конверсии и мини-канбан */}
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
        
        {/* График динамики и распределение по типам */}
        <Row gutter={[20, 20]} style={{ marginTop: '40px' }}>
          <Col xs={24} lg={12}>
            <DealsTrendChart height={350} />
          </Col>
          <Col xs={24} lg={12}>
            <PropertyTypeChart height={350} />
          </Col>
        </Row>
      </div>
    </div>
  );
}