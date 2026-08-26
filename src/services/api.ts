import { Product, Order, Review } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Admin Login via Database
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; admin?: any; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      console.warn('API login request failed, falling back:', e);
      return { success: false, message: 'Could not connect to authentication server' };
    }
  },

  // Cloudinary Upload
  async uploadImage(base64Image: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data.url;
    } catch (e: any) {
      console.error('Image upload failed, using local blob/fallback', e);
      return base64Image;
    }
  },

  async uploadMultipleImages(base64Images: string[]): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: base64Images })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data.urls;
    } catch (e: any) {
      console.error('Multi-image upload failed', e);
      return base64Images;
    }
  },

  async deleteImage(url: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/delete-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
    } catch (e) {
      console.warn('Delete image fallback', e);
    }
  },

  // Product Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch (e) {
      console.warn('Reviews API offline, using local store:', e);
      return [];
    }
  },

  async submitProductReview(productId: string, reviewData: {
    author: string;
    rating: number;
    comment: string;
    location?: string;
    images?: string[];
  }): Promise<Review> {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  },

  // Products API
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.map((item: any) => ({
        ...item,
        id: item._id || item.id
      }));
    } catch (e) {
      console.warn('Backend API offline, using local store:', e);
      return [];
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    return { ...data, id: data._id || data.id };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return { ...data, id: data._id || data.id };
  },

  async updateStock(id: string, stockQuantity: number): Promise<void> {
    await fetch(`${API_BASE}/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockQuantity })
    });
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders API
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (e) {
      console.warn('Orders API offline, using local store:', e);
      return [];
    }
  },

  async createOrder(order: Order): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }
};
