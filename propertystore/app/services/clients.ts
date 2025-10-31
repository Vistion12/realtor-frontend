import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  notes?: string;
  createdAt: Date;

  hasPersonalAccount: boolean;
  accountLogin?: string;
  isAccountActive: boolean;
  consentToPersonalData: boolean;
}

export interface ClientRequest {
  name: string;
  phone: string;
  email?: string;
  source: string;
  notes?: string;
}

export const getAllClients = async (): Promise<Client[]> => {
  const response = await fetch(`${BASE_URL}/Clients`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка загрузки клиентов');
  return response.json();
  
};

export const getClientById = async (id: string): Promise<Client> => {
  const response = await fetch(`${BASE_URL}/Clients/${id}`, {
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Клиент не найден');
  return response.json();
};

export const createClient = async (clientRequest: ClientRequest): Promise<string> => {
  const response = await fetch(`${BASE_URL}/Clients`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(clientRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка создания клиента');
  return response.text();
};

export const updateClient = async (id: string, clientRequest: ClientRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/Clients/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(clientRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка обновления клиента');
};

export const deleteClient = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/Clients/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  
  if (!response.ok) throw new Error('Ошибка удаления клиента');
};