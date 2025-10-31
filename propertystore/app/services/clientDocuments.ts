import { authHeaders, authHeadersFormData } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface ClientDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  category: string;
  uploadedBy: 'client' | 'realtor';
  uploadedAt: string;
  dealId?: string;
}

export const clientDocumentsService = {
  async getDocuments(dealId?: string): Promise<ClientDocument[]> {
    const url = dealId 
      ? `${BASE_URL}/client/documents?dealId=${dealId}`
      : `${BASE_URL}/client/documents`;
    
    const response = await fetch(url, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки документов');
    }

    return response.json();
  },

  async uploadDocument(file: File, category: string, dealId?: string): Promise<{ documentId: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    if (dealId) {
      formData.append('dealId', dealId);
    }

    const response = await fetch(`${BASE_URL}/client/documents/upload`, {
      method: 'POST',
      headers: authHeadersFormData(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки документа');
    }

    return response.json();
  },

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await fetch(`${BASE_URL}/client/documents/${documentId}/download`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка скачивания документа');
    }

    return response.blob();
  },

  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${BASE_URL}/client/documents/${documentId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка удаления документа');
    }

    return response.json();
  },
};