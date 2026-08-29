import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Product, Order, Review, User, VisitorLog } from '../types';

// Web Firebase Configuration with direct live defaults for reliable Netlify builds
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBSQsOhWoLAe0vrzOXABvU0IQ7D_Y5fn54',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'the-aesthetic-palette-ryk.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'the-aesthetic-palette-ryk',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'the-aesthetic-palette-ryk.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '311232710879',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:311232710879:web:4a1ddcf9af20487786816a',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'AIzaSy...' &&
  firebaseConfig.apiKey.length > 20
);

// Initialize Firebase App singleton safely
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Collection Names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  USERS: 'users',
  VISITOR_LOGS: 'visitor_logs'
} as const;

// Typed Firestore Collections
export const productsCol = collection(db, COLLECTIONS.PRODUCTS);
export const ordersCol = collection(db, COLLECTIONS.ORDERS);
export const reviewsCol = collection(db, COLLECTIONS.REVIEWS);
export const usersCol = collection(db, COLLECTIONS.USERS);
export const visitorLogsCol = collection(db, COLLECTIONS.VISITOR_LOGS);

// ==========================================
// FIRESTORE SERVICES & REPOSITORIES
// ==========================================

export const firestoreService = {
  // ---- PRODUCTS ----
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(productsCol);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as Product[];
    } catch (err) {
      console.error('Error fetching products from Firestore:', err);
      return [];
    }
  },

  subscribeProducts(callback: (products: Product[]) => void): Unsubscribe {
    return onSnapshot(productsCol, (snapshot) => {
      const prods = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as Product[];
      callback(prods);
    }, (error) => {
      console.warn('Products subscription warning:', error);
    });
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const docRef = await addDoc(productsCol, {
      ...product,
      createdAt: serverTimestamp()
    });
    return {
      ...product,
      id: docRef.id
    };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await deleteDoc(docRef);
  },

  async updateStock(id: string, stockQuantity: number): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    await updateDoc(docRef, { stockQuantity });
  },

  // ---- ORDERS ----
  async getOrders(): Promise<Order[]> {
    try {
      const q = query(ordersCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        orderId: docSnap.id
      })) as Order[];
    } catch (err) {
      // Fallback query if index on createdAt is still building
      try {
        const snapshot = await getDocs(ordersCol);
        return snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          orderId: docSnap.id
        })) as Order[];
      } catch (e) {
        console.error('Error fetching orders from Firestore:', e);
        return [];
      }
    }
  },

  subscribeOrders(callback: (orders: Order[]) => void): Unsubscribe {
    return onSnapshot(ordersCol, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        orderId: docSnap.id
      })) as Order[];
      callback(list);
    }, (err) => {
      console.warn('Orders subscription error:', err);
    });
  },

  async createOrder(order: Order): Promise<Order> {
    // If order has orderId, use setDoc or addDoc
    const orderDocRef = order.orderId ? doc(db, COLLECTIONS.ORDERS, order.orderId) : doc(ordersCol);
    const orderData = {
      ...order,
      orderId: orderDocRef.id,
      createdAt: order.createdAt || new Date().toISOString()
    };
    await setDoc(orderDocRef, orderData);

    // Decrement stock for ordered items in Firestore
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item.productId) {
          try {
            const pRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
            const pSnap = await getDoc(pRef);
            if (pSnap.exists()) {
              const currentStock = pSnap.data().stockQuantity ?? 10;
              const newStock = Math.max(0, currentStock - (item.quantity || 1));
              await updateDoc(pRef, { stockQuantity: newStock });
            }
          } catch (stockErr) {
            console.warn('Could not decrement stock for product', item.productId, stockErr);
          }
        }
      }
    }

    return orderData;
  },

  async updateOrderStatus(orderId: string, status: Order['status'], artisanNotes?: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const updatePayload: Record<string, any> = { status };
    if (artisanNotes !== undefined) {
      updatePayload.artisanNotes = artisanNotes;
    }
    await updateDoc(docRef, updatePayload);
  },

  // ---- REVIEWS ----
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const q = query(reviewsCol, where('productId', '==', productId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as Review[];
    } catch (err) {
      console.warn('Error fetching reviews:', err);
      return [];
    }
  },

  async getFeaturedReviews(count: number = 6): Promise<Review[]> {
    try {
      const q = query(reviewsCol, limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id
      })) as Review[];
    } catch (err) {
      console.warn('Error fetching featured reviews:', err);
      return [];
    }
  },

  async submitProductReview(productId: string, reviewData: Omit<Review, 'id'>): Promise<Review> {
    const docRef = await addDoc(reviewsCol, {
      ...reviewData,
      productId,
      createdAt: serverTimestamp()
    });

    // Update Product review count and average rating
    try {
      const allReviews = await this.getProductReviews(productId);
      const totalReviews = allReviews.length;
      const avg = totalReviews > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) : reviewData.rating;
      
      const pRef = doc(db, COLLECTIONS.PRODUCTS, productId);
      await updateDoc(pRef, {
        reviewCount: totalReviews,
        rating: parseFloat(avg.toFixed(1))
      });
    } catch (e) {
      console.warn('Error updating product rating in Firestore:', e);
    }

    return {
      ...reviewData,
      id: docRef.id
    };
  },

  // ---- USER PROFILES ----
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { ...snapshot.data(), id: uid } as User;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  },

  async syncUserProfile(user: User): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, user.id);
      await setDoc(docRef, user, { merge: true });
    } catch (err) {
      console.error('Error saving user profile to Firestore:', err);
    }
  },

  // ---- VISITOR LOGS ----
  async addVisitorLog(log: VisitorLog): Promise<void> {
    try {
      const docRef = doc(visitorLogsCol);
      await setDoc(docRef, {
        ...log,
        id: docRef.id,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Visitor log save ignored:', err);
    }
  },

  async getVisitorLogs(limitCount: number = 10): Promise<VisitorLog[]> {
    try {
      const q = query(visitorLogsCol, limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as VisitorLog[];
    } catch (e) {
      return [];
    }
  }
};
