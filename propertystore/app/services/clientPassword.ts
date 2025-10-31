import { authHeaders } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const clientPasswordService = {
  async changePassword(newPassword: string): Promise<ChangePasswordResponse> {
    try {
      const requestBody = {
        newPassword: newPassword
      };

      const response = await fetch(`${BASE_URL}/client/auth/change-password`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Ошибка смены пароля'
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка сети при смене пароля'
      };
    }
  },
};