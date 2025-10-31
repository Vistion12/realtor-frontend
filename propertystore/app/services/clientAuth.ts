import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface ClientAuthResponse {
  token: string;
  clientName: string;
  expires: string;
}

export const clientAuthService = {
  async login(login: string, password: string): Promise<ClientAuthResponse> {
    const response = await fetch(`${BASE_URL}/client/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Login: login, Password: password }),
    });

    if (!response.ok) {
      throw new Error('Ошибка авторизации');
    }

    return response.json();
  },

  async changePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/client/auth/change-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      throw new Error('Ошибка смены пароля');
    }

    return response.json();
  },

  async giveConsent(ipAddress: string, userAgent: string): Promise<{ success: boolean; message: string }> {
    console.log('🟡 Sending consent request with:', { ipAddress, userAgent }); // ОТЛАДКА
    
    const response = await fetch(`${BASE_URL}/client/auth/consent`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ 
        acceptPersonalData: true,
        acceptDocumentStorage: true,
        ipAddress: ipAddress,
        userAgent: userAgent
      }),
    });

    console.log('🟡 Consent response status:', response.status); // ОТЛАДКА

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 Consent API error:', errorText); // ОТЛАДКА
      throw new Error('Ошибка сохранения согласия');
    }

    const result = await response.json();
    console.log('🟢 Consent API success:', result); // ОТЛАДКА
    return result;
  },
};