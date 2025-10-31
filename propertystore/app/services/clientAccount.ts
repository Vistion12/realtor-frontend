import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface ActivateAccountResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const clientAccountService = {
  async activateClientAccount(clientId: string, temporaryPassword: string): Promise<ActivateAccountResponse> {
    try {
      // Теперь отправляем ТОЛЬКО temporaryPassword
      const requestBody = {
        temporaryPassword: temporaryPassword
      };

      console.log('Sending activation request:', {
        clientId,
        body: requestBody
      });

      // Обновляем URL на новый endpoint
      const response = await fetch(`${BASE_URL}/client/auth/activate?clientId=${clientId}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Ошибка активации ЛК';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.title || errorMessage;
          console.log('Error details:', errorData);
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }

      const data = await response.json();
      console.log('Activation success:', data);
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Network error:', error);
      return {
        success: false,
        error: 'Ошибка сети при активации ЛК'
      };
    }
  },
};

export const activateClientAccount = clientAccountService.activateClientAccount;