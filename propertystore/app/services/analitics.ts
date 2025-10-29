import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface DealAnalytics {
  totalDeals: number;
  activeDeals: number;
  completedDeals: number;
  totalDealAmount: number;
  averageDealAmount: number;
  averageDealDuration: string; // Изменено на string
}

export interface DealStageAnalytics {
  stageId: string;
  stageName: string;
  dealCount: number;
  averageTimeInStage: string; // Изменено на string
  overdueDeals: number;
}

export interface DashboardMetrics {
  totalDeals: number;
  activeDeals: number;
  completedDeals: number;
  overdueDeals: number;
  totalDealAmount: number;
  conversionRate: number;
  averageDealTime: number;
}

// Получить аналитику по воронке
export const getPipelineAnalytics = async (pipelineId: string): Promise<DealAnalytics> => {
  const response = await fetch(`${BASE_URL}/deals/pipeline/${pipelineId}/analytics`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки аналитики');
  return response.json();
};

// Получить аналитику по этапам воронки
export const getStagesAnalytics = async (pipelineId: string): Promise<DealStageAnalytics[]> => {
  const response = await fetch(`${BASE_URL}/deals/pipeline/${pipelineId}/stages-analytics`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки аналитики этапов');
  return response.json();
};

// Получить метрики для дашборда
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    // Сначала получим все сделки
    const dealsResponse = await fetch(`${BASE_URL}/deals`, {
      headers: authHeaders(),
    });
    
    if (!dealsResponse.ok) throw new Error('Ошибка загрузки сделок');
    const deals = await dealsResponse.json();

    // Получим все заявки для расчета конверсии
    const requestsResponse = await fetch(`${BASE_URL}/requests`, {
      headers: authHeaders(),
    });
    
    if (!requestsResponse.ok) throw new Error('Ошибка загрузки заявок');
    const requests = await requestsResponse.json();

    // Рассчитываем метрики
    const totalDeals = deals.length;
    const activeDeals = deals.filter((deal: any) => deal.isActive).length;
    const completedDeals = deals.filter((deal: any) => !deal.isActive).length;
    const overdueDeals = deals.filter((deal: any) => deal.isOverdue).length;
    
    const totalDealAmount = deals
      .filter((deal: any) => deal.dealAmount)
      .reduce((sum: number, deal: any) => sum + (deal.dealAmount || 0), 0);
    
    
    const conversionRate = requests.length > 0 ? (completedDeals / requests.length) * 100 : 0;

    return {
      totalDeals,
      activeDeals,
      completedDeals,
      overdueDeals,
      totalDealAmount,
      conversionRate,
      averageDealTime: 0 // Пока заглушка
    };
  } catch (error) {
    console.error('Error loading dashboard metrics:', error);
    throw error;
  }
};