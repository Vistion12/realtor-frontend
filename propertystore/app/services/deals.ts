import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface Deal {
  id: string;
  title: string;
  notes?: string;
  dealAmount?: number;
  expectedCloseDate?: string;
  clientId: string;
  pipelineId: string;
  currentStageId: string;
  propertyId?: string;
  requestId?: string;
  stageStartedAt: string;
  stageDeadline?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  isActive: boolean;
  isOverdue: boolean;
  client?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: string;
    notes?: string;
    createdAt: string;
  };
  pipeline?: any;
  currentStage?: any;
  history: any[];
}

export interface DealRequest {
  title: string;
  clientId: string;
  pipelineId: string;
  currentStageId: string;
  propertyId?: string;
  requestId?: string;
  notes?: string;
  dealAmount?: number;
  expectedCloseDate?: string;
}

export interface DealStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  expectedDuration: string;
  pipelineId: string;
  createdAt: string;
}

export interface MoveDealStageRequest {
  newStageId: string;
  notes?: string;
}

// Получить все сделки С клиентами
export const getAllDeals = async (): Promise<Deal[]> => {
  const response = await fetch(`${BASE_URL}/deals`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки сделок');
  const deals = await response.json();
  
  // Загружаем данные клиентов для каждой сделки
  const dealsWithClients = await Promise.all(
    deals.map(async (deal: Deal) => {
      if (deal.clientId) {
        try {
          const clientResponse = await fetch(`${BASE_URL}/clients/${deal.clientId}`, {
            headers: authHeaders(),
          });
          if (clientResponse.ok) {
            const client = await clientResponse.json();
            return { ...deal, client };
          }
        } catch (error) {
          console.error('Ошибка загрузки клиента:', error);
        }
      }
      return deal;
    })
  );
  
  return dealsWithClients;
};

// Получить активные сделки С клиентами
export const getActiveDeals = async (): Promise<Deal[]> => {
  const response = await fetch(`${BASE_URL}/deals/active`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки активных сделок');
  const deals = await response.json();
  
  // Загружаем данные клиентов для каждой сделки
  const dealsWithClients = await Promise.all(
    deals.map(async (deal: Deal) => {
      if (deal.clientId) {
        try {
          const clientResponse = await fetch(`${BASE_URL}/clients/${deal.clientId}`, {
            headers: authHeaders(),
          });
          if (clientResponse.ok) {
            const client = await clientResponse.json();
            return { ...deal, client };
          }
        } catch (error) {
          console.error('Ошибка загрузки клиента:', error);
        }
      }
      return deal;
    })
  );
  
  return dealsWithClients;
};

// Получить этапы воронки
export const getStagesByPipeline = async (pipelineId: string): Promise<DealStage[]> => {
  const response = await fetch(`${BASE_URL}/dealstages/pipeline/${pipelineId}`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки этапов');
  return response.json();
};

export const getDealWithDetails = async (dealId: string): Promise<Deal | null> => {
  try {
    const response = await fetch(`${BASE_URL}/deals/${dealId}/with-details`, {
      headers: authHeaders(),
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки деталей сделки:', error);
    return null;
  }
};

export const updateDeal = async (dealId: string, dealRequest: DealRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/deals/${dealId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(dealRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка обновления сделки');
};

// Переместить сделку на другой этап
export const moveDealToStage = async (dealId: string, request: MoveDealStageRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/deals/${dealId}/move-stage`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Ошибка перемещения сделки');
};

// Создать сделку
export const createDeal = async (dealRequest: DealRequest): Promise<string> => {
  const response = await fetch(`${BASE_URL}/deals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(dealRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка создания сделки');
  return response.text();
};

// Завершить сделку
export const closeDeal = async (dealId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/deals/${dealId}/close`, {
    method: "PUT",
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка завершения сделки');
};

// Реопен сделки (если нужно будет)
export const reopenDeal = async (dealId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/deals/${dealId}/reopen`, {
    method: "PUT",
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка reopening сделки');
};