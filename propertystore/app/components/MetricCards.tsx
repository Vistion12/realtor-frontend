"use client";

import { Card, Statistic } from "antd";
import { DashboardMetrics } from "../services/analitics";

interface MetricCardsProps {
  metrics: DashboardMetrics;
  loading?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, loading = false }) => {
  const cards = [
    {
      title: "Всего сделок",
      value: metrics.totalDeals,
      precision: 0,
      suffix: null,
      color: "#1890ff"
    },
    {
      title: "Активные сделки",
      value: metrics.activeDeals,
      precision: 0,
      suffix: null,
      color: "#52c41a"
    },
    {
      title: "Просроченные",
      value: metrics.overdueDeals,
      precision: 0,
      suffix: null,
      color: "#ff4d4f"
    },
    {
      title: "Конверсия",
      value: metrics.conversionRate,
      precision: 1,
      suffix: "%",
      color: "#722ed1"
    },
    {
      title: "Общая сумма",
      value: metrics.totalDealAmount,
      precision: 0,
      suffix: "₽",
      color: "#fa8c16"
    },
    {
      title: "Завершено",
      value: metrics.completedDeals,
      precision: 0,
      suffix: null,
      color: "#13c2c2"
    }
  ];

  return (
    <div className="metrics-grid">
      {cards.map((card, index) => (
        <Card key={index} className="metric-card" loading={loading}>
          <Statistic
            title={card.title}
            value={card.value}
            precision={card.precision}
            suffix={card.suffix}
            valueStyle={{ color: card.color }}
          />
        </Card>
      ))}
    </div>
  );
};