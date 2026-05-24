import { apiClient } from './apiClient';

export interface LoginResponse {
  success: boolean;
  token: string;
  email: string;
}

export const authApi = {
  // Auths the admin credentials and receives a token
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // ADMIN ONLY: Retrieves stats figures for dashboard metrics
  getDashboardStats: async (): Promise<{
    totalOrders: number;
    totalSales: number;
    productsCount: number;
    messagesCount: number;
    salesByCategory: Record<string, number>;
  }> => {
    return apiClient('/admin/stats');
  }
};
