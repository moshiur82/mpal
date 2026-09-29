import axios from 'axios';
import api, { tokenStorage } from './axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

interface LoginResponse {
  access: string;
  refresh: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/token/`, {
      email,
      password,
    });

    if (!response.data.access) {
      throw new Error('No access token received');
    }

    tokenStorage.setTokens(response.data.access, response.data.refresh);
    return response.data;
  },

  async logout(): Promise<void> {
    tokenStorage.clear();
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.getAccess();
  },

  async getProfile() {
    const response = await api.get('/me/');
    return response.data;
  },
};