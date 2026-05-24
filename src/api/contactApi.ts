import { apiClient } from './apiClient';
import { ContactMessage } from '../types';

export const contactApi = {
  // Client support ticket submit
  submitMessage: async (messageData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; ticketId: string }> => {
    return apiClient<{ success: boolean; message: string; ticketId: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // ADMIN ONLY: View support tickets
  getMessages: async (): Promise<ContactMessage[]> => {
    return apiClient<ContactMessage[]>('/admin/messages');
  }
};
