import { Product, Order, Review, VisitorLog } from '../types';
import { firestoreService } from './firebase';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'wweasl6y';

export const api = {
  // ================= CLOUDINARY & IMAGE UPLOADS =================
  async uploadImage(base64OrFile: string): Promise<string> {
    try {
      // If already a hosted URL, return directly
      if (base64OrFile.startsWith('http://') || base64OrFile.startsWith('https://')) {
        return base64OrFile;
      }

      // Direct Cloudinary upload via unsigned preset
      if (base64OrFile.startsWith('data:image') || base64OrFile.startsWith('blob:')) {
        const presets = ['aesthetic_palette', 'ml_default', 'unsigned', 'preset1'];
        
        for (const preset of presets) {
          try {
            const formData = new FormData();
            formData.append('file', base64OrFile);
            formData.append('upload_preset', preset);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: formData
            });

            if (res.ok) {
              const data = await res.json();
              if (data.secure_url) {
                console.log(`☁️ Cloudinary upload successful with preset "${preset}":`, data.secure_url);
                return data.secure_url;
              }
            }
          } catch (presetError) {
            // continue to next preset
          }
        }
      }
      return base64OrFile;
    } catch (e: any) {
      console.warn('Cloudinary upload warning, using local buffer:', e);
      return base64OrFile;
    }
  },

  async uploadMultipleImages(base64Images: string[]): Promise<string[]> {
    try {
      const uploadPromises = base64Images.map((img) => this.uploadImage(img));
      return await Promise.all(uploadPromises);
    } catch (e: any) {
      console.warn('Multiple upload fallback:', e);
      return base64Images;
    }
  },

  async deleteImage(url: string): Promise<void> {
    // Cloudinary client deletions require signature, no-op on client for security
    console.log('Image reference removed:', url);
  },

  // ================= PRODUCT REVIEWS (FIRESTORE) =================
  async getProductReviews(productId: string): Promise<Review[]> {
    return await firestoreService.getProductReviews(productId);
  },

  async getFeaturedReviews(count: number = 6): Promise<Review[]> {
    return await firestoreService.getFeaturedReviews(count);
  },

  async submitProductReview(
    productId: string,
    reviewData: {
      author: string;
      rating: number;
      comment: string;
      location?: string;
      images?: string[];
      avatar?: string;
    }
  ): Promise<Review> {
    return await firestoreService.submitProductReview(productId, {
      ...reviewData,
      location: reviewData.location || 'Pakistan',
      date: 'Just now',
      verifiedPurchase: true,
      avatar: reviewData.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(reviewData.author)}`
    });
  },

  // ================= PRODUCTS CRUD (FIRESTORE) =================
  async getProducts(): Promise<Product[]> {
    return await firestoreService.getProducts();
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return await firestoreService.addProduct(product);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await firestoreService.updateProduct(id, updates);
    return { id, ...updates } as Product;
  },

  async updateStock(id: string, stockQuantity: number): Promise<void> {
    await firestoreService.updateStock(id, stockQuantity);
  },

  async deleteProduct(id: string): Promise<void> {
    await firestoreService.deleteProduct(id);
  },

  // ================= ORDERS (FIRESTORE) =================
  async getOrders(): Promise<Order[]> {
    return await firestoreService.getOrders();
  },

  async createOrder(order: Order): Promise<Order> {
    return await firestoreService.createOrder(order);
  },

  async updateOrderStatus(orderId: string, status: Order['status'], artisanNotes?: string): Promise<void> {
    await firestoreService.updateOrderStatus(orderId, status, artisanNotes);
  },

  // ================= VISITOR LOGS (FIRESTORE) =================
  async getVisitorLogs(): Promise<VisitorLog[]> {
    return await firestoreService.getVisitorLogs();
  },

  async logVisitor(log: VisitorLog): Promise<void> {
    await firestoreService.addVisitorLog(log);
  }
};
