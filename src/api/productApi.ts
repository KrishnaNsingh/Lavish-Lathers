import { apiClient } from './apiClient';
import { Product, Review } from '../types';

export const productApi = {
  // Get all products, optionally filtered by category, bestseller status, or collectibles
  getProducts: async (filters?: {
    category?: string;
    isBestSeller?: boolean;
    isCollectible?: boolean;
  }): Promise<Product[]> => {
    const queryParts: string[] = [];
    if (filters?.category && filters.category !== 'All') {
      queryParts.push(`category=${encodeURIComponent(filters.category)}`);
    }
    if (filters?.isBestSeller) {
      queryParts.push(`isBestSeller=true`);
    }
    if (filters?.isCollectible) {
      queryParts.push(`isCollectible=true`);
    }
    
    const queryStr = queryParts.length ? `?${queryParts.join('&')}` : '';
    return apiClient<Product[]>(`/products${queryStr}`);
  },

  // Get a single product by ID (attaches custom reviews dynamically)
  getProductById: async (id: string): Promise<Product & { customReviews?: Review[] }> => {
    return apiClient<Product & { customReviews?: Review[] }>(`/products/${id}`);
  },

  // Create a customer product review
  submitReview: async (
    id: string,
    review: { name: string; rating: number; text: string }
  ): Promise<{ success: boolean; review: Review; updatedRating: number; reviewsCount: number }> => {
    return apiClient<any>(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  // ADMIN ONLY: Add a new artisan product
  addProduct: async (product: Omit<Product, 'reviewsCount' | 'rating'>): Promise<Product> => {
    return apiClient<Product>(`/admin/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // ADMIN ONLY: Edit an existing product
  editProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    return apiClient<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  // ADMIN ONLY: Delete a product from inventory
  deleteProduct: async (id: string): Promise<{ success: boolean; id: string }> => {
    return apiClient<{ success: boolean; id: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }
};
