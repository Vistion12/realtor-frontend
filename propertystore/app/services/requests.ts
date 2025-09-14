import { Client } from "./clients";

const BASE_URL = "http://localhost:5100/api";

export interface Request {
  id: string;
  clientId: string;
  propertyId?: string;
  type: string; // consultation, viewing, callback
  status: string; // new, in_progress, completed
  message: string;
  createdAt: Date;
  client?: Client; // опционально, если нужны детали
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

// Создать заявку
export const createRequest = async (requestData: RequestRequest): Promise<string> => {
  const response = await fetch(`${BASE_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) throw new Error('Ошибка создания заявки');
  return response.text(); // Возвращает GUID
};

// Получить все заявки
export const getAllRequests = async (): Promise<Request[]> => {
  const response = await fetch(`${BASE_URL}/requests`);
  if (!response.ok) throw new Error('Ошибка загрузки заявок');
  return response.json();
};

// Получить заявки по статусу
export const getRequestsByStatus = async (status: string): Promise<Request[]> => {
  const response = await fetch(`${BASE_URL}/requests/status/${status}`);
  if (!response.ok) throw new Error('Ошибка загрузки заявок');
  return response.json();
};

// Обновить статус заявки
export const updateRequestStatus = async (id: string, status: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/requests/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });
  
  if (!response.ok) throw new Error('Ошибка обновления статуса');
};