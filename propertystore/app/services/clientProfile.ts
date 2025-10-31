import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hasPersonalAccount: boolean;
  isAccountActive: boolean;
  consentToPersonalData: boolean;
}

export interface ClientDeal {
  id: string;
  title: string;
  status: string;
  currentStage: string;
  propertyType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDealDetails {
  id: string;
  title: string;
  status: string;
  currentStage: string;
  propertyType: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  currentStageDeadline?: string;
}

export const clientProfileService = {
  async getProfile(token: string): Promise<Client> {
    const response = await fetch(`${BASE_URL}/client/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки профиля');
    }

    return response.json();
  },

  async getClientDeals(): Promise<ClientDeal[]> {
    const response = await fetch(`${BASE_URL}/client/profile/deals`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки сделок');
    }

    const data = await response.json();
    return data.deals || [];
  },

  async getDealDetails(dealId: string): Promise<ClientDealDetails> {
    const response = await fetch(`${BASE_URL}/client/profile/deals/${dealId}`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки деталей сделки');
    }

    return response.json();
  },
};