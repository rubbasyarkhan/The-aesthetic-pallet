import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, VisitorLog, AnalyticsSummary } from '../types';
import { firestoreService, isFirebaseConfigured } from '../services/firebase';
import { PRODUCTS as STARTER_PRODUCTS } from '../data/products';
import { api } from '../services/api';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  visitorLogs: VisitorLog[];
  analytics: AnalyticsSummary;
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedInitialCatalog: () => Promise<number>;
  createOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], artisanNotes?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  recordVisitorPageview: (page: string, action?: string) => void;
  formatPrice: (price: number) => string;
  refreshAll: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_CACHE_KEY = 'the_aesthetic_palette_products_fb_cache';
const ORDERS_CACHE_KEY = 'the_aesthetic_palette_orders_fb_cache';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem(ORDERS_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Live real-time Firestore synchronization
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // 1. Subscribe to Firestore Products in Real-time
    const unsubscribeProducts = firestoreService.subscribeProducts((liveProducts) => {
      setProducts(liveProducts);
      try {
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProducts));
      } catch (e) {
        console.warn('Cache error:', e);
      }
      setIsLoading(false);
    });

    // 2. Subscribe to Firestore Orders in Real-time
    const unsubscribeOrders = firestoreService.subscribeOrders((liveOrders) => {
      setOrders(liveOrders);
      try {
        localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrders));
      } catch (e) {
        console.warn('Cache error:', e);
      }
    });

    // 3. Load dynamic Visitor Logs from Firestore
    api.getVisitorLogs().then((logs) => {
      if (Array.isArray(logs) && logs.length > 0) {
        setVisitorLogs(logs);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, logs] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getVisitorLogs()
      ]);
      setProducts(prods);
      setOrders(ords);
      setVisitorLogs(logs);
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(prods));
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(ords));
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    try {
      const saved = await api.createProduct(newProductData);
      setProducts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
    } catch (err) {
      console.error('Failed to create product in Firestore:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) => (item.id === id || item.slug === id ? { ...item, ...updates } : item))
    );

    try {
      await api.updateProduct(id, updates);
    } catch (e) {
      console.warn('Firestore updateProduct warning:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id && item.slug !== id));
    try {
      await api.deleteProduct(id);
    } catch (e) {
      console.warn('Firestore deleteProduct warning:', e);
    }
  };

  // One-click starter seed into Firestore
  const seedInitialCatalog = async (): Promise<number> => {
    setIsLoading(true);
    let count = 0;
    try {
      for (const starter of STARTER_PRODUCTS) {
        const { id, ...dataWithoutId } = starter;
        await api.createProduct(dataWithoutId);
        count++;
      }
      await refreshAll();
      return count;
    } catch (err) {
      console.error('Seed catalog error:', err);
      return count;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    try {
      await api.createOrder(order);
    } catch (err) {
      console.warn('Order save error:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], artisanNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status, artisanNotes: artisanNotes ?? o.artisanNotes } : o
      )
    );
    try {
      await api.updateOrderStatus(orderId, status, artisanNotes);
    } catch (e) {
      console.warn('Firestore updateOrderStatus warning:', e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    try {
      await api.deleteOrder(orderId);
    } catch (e) {
      console.warn('Firestore deleteOrder warning:', e);
    }
  };

  const recordVisitorPageview = (page: string, action: string = 'Viewed Page') => {
    const newLog: VisitorLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      city: 'Karachi',
      country: 'PK',
      pageViewed: page,
      device: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile Web' : 'Desktop Web',
      action
    };
    setVisitorLogs((prev) => [newLog, ...prev.slice(0, 9)]);
    api.logVisitor(newLog);
  };

  const formatPrice = (price: number): string => {
    return `Rs. ${(price || 0).toLocaleString()}`;
  };

  const analytics: AnalyticsSummary = {
    totalRevenue: (orders || []).reduce((sum, o) => sum + (o?.total || 0), 0),
    totalVisitors: Math.max((visitorLogs || []).length, 1),
    totalPageviews: Math.max((visitorLogs || []).length * 3, 1),
    uniqueSessions: Math.max((visitorLogs || []).length, 1),
    conversionRate: (orders || []).length > 0 ? parseFloat((((orders || []).length / Math.max((visitorLogs || []).length, 1)) * 100).toFixed(1)) : 0,
    pendingOrdersCount: (orders || []).filter((o) => o?.status === 'PENDING_CONFIRMATION').length,
    activeShoppers: Math.max((visitorLogs || []).length, 1),
    lowStockItemsCount: (products || []).filter((p) => p && (p.stockQuantity || 0) <= (p.lowStockThreshold || 5)).length,
    totalInventoryUnits: (products || []).reduce((sum, p) => sum + (p?.stockQuantity || 0), 0)
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        visitorLogs,
        analytics,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        seedInitialCatalog,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        recordVisitorPageview,
        formatPrice,
        refreshAll
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
