import { apiClient } from './apiClient';
import { Order, CartItem, CheckoutDetails, CreateOrderPayload } from '../types';

export const orderApi = {
  // Create client order
  createOrder: async (
  orderData: CreateOrderPayload
): Promise<{ success: boolean; message: string; order: Order }> => {
    return apiClient<{ success: boolean; message: string; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Retrieve client order summary by order ID
  getOrderById: async (id: string): Promise<Order> => {
    return apiClient<Order>(`/orders/${id}`);
  },

  // ADMIN ONLY: List all orders
  getOrders: async (): Promise<Order[]> => {
    return apiClient<Order[]>('/admin/orders');
  },

  // ADMIN ONLY: Update shipping status
  updateOrderStatus: async (
    id: string,
    status: 'processing' | 'shipped' | 'delivered'
  ): Promise<{ success: boolean; order: Order }> => {
    return apiClient<{ success: boolean; order: Order }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
};
