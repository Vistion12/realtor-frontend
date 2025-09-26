import { authHeaders } from '../utils/auth';
import { Client } from "./clients";

const BASE_URL = "http://localhost:5100/api";

export interface Request {
  id: string;
  clientId: string;
  propertyId?: string;
  type: string;
  status: string;
  message: string;
  createdAt: Date;
  client?: Client;
}

export interface RequestRequest {
  propertyId?: string;
  type: string;
  message: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  source: string;
}

export const createRequest = async (requestData: RequestRequest): Promise<string> => {
  const response = await fetch(`${BASE_URL}/Requests`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) throw new Error('Ошибка создания заявки');
  return response.text();
};

export const getAllRequests = async (): Promise<Request[]> => {
  const response = await fetch(`${BASE_URL}/Requests`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки заявок');
  return response.json();
};

export const getRequestsByStatus = async (status: string): Promise<Request[]> => {
  const response = await fetch(`${BASE_URL}/Requests/status/${status}`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки заявок');
  return response.json();
};

export const updateRequestStatus = async (id: string, status: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/Requests/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(status),
  });
  
  if (!response.ok) throw new Error('Ошибка обновления статуса');
};