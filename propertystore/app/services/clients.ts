const BASE_URL = "http://localhost:5100/api";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  notes?: string;
  createdAt: Date;
}

export interface ClientRequest {
  name: string;
  phone: string;
  email?: string;
  source: string;
  notes?: string;
}

// Получить всех клиентов
export const getAllClients = async (): Promise<Client[]> => {
  const response = await fetch(`${BASE_URL}/clients`);
  if (!response.ok) throw new Error('Ошибка загрузки клиентов');
  return response.json();
};

// Получить клиента по ID
export const getClientById = async (id: string): Promise<Client> => {
  const response = await fetch(`${BASE_URL}/clients/${id}`);
  if (!response.ok) throw new Error('Клиент не найден');
  return response.json();
};

// Создать клиента
export const createClient = async (clientRequest: ClientRequest): Promise<string> => {
  const response = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка создания клиента');
  return response.text(); // Возвращает GUID
};

// Обновить клиента
export const updateClient = async (id: string, clientRequest: ClientRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientRequest),
  });
  
  if (!response.ok) throw new Error('Ошибка обновления клиента');
};

// Удалить клиента
export const deleteClient = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) throw new Error('Ошибка удаления клиента');
};

// Получить заявки клиента
export const getClientRequests = async (clientId: string): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/clients/${clientId}/requests`);
  if (!response.ok) throw new Error('Ошибка загрузки заявок');
  return response.json();
};