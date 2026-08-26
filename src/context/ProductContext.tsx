import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, VisitorLog, AnalyticsSummary } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { api } from '../services/api';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  visitorLogs: VisitorLog[];
  analytics: AnalyticsSummary;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProductsToDefault: () => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], artisanNotes?: string) => Promise<void>;
  recordVisitorPageview: (page: string, action?: string) => void;
  formatPrice: (price: number) => string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'the_aesthetic_palette_products_v3_rs';
const ORDERS_STORAGE_KEY = 'the_aesthetic_palette_orders_master_v3_rs';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([
    {
      id: 'log-1',
      timestamp: '1 min ago',
      city: 'Islamabad',
      country: 'PK',
      pageViewed: 'Eternal Bloom Roses',
      device: 'Mobile iOS',
      action: 'Added to Bag'
    },
    {
      id: 'log-2',
      timestamp: '3 mins ago',
      city: 'Lahore',
      country: 'PK',
      pageViewed: 'Custom Oil Portrait',
      device: 'Desktop Chrome',
      action: 'Liked Item'
    },
    {
      id: 'log-3',
      timestamp: '6 mins ago',
      city: 'Karachi',
      country: 'PK',
      pageViewed: 'Shop All Creations',
      device: 'Mobile Safari',
      action: 'Filtered by Occasion'
    }
  ]);

  // Load from MongoDB Atlas API as single source of truth
  const refreshProducts = async () => {
    try {
      const fetchedProducts = await api.getProducts();
      if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(fetchedProducts));
      } else {
        // Fallback to local storage if API is momentarily loading
        const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (saved) setProducts(JSON.parse(saved));
        else setProducts(DEFAULT_PRODUCTS);
      }
    } catch (e) {
      console.warn('API fetch warning:', e);
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) setProducts(JSON.parse(saved));
      else setProducts(DEFAULT_PRODUCTS);
    }
  };

  const refreshOrders = async () => {
    try {
      const fetchedOrders = await api.getOrders();
      if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(fetchedOrders));
      } else {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (saved) setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('API orders fetch warning:', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    try {
      const saved = await api.createProduct(newProductData);
      setProducts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([saved, ...products]));
    } catch (err) {
      console.error('Failed to create product on server, saving locally:', err);
      const fallback: Product = { ...newProductData, id: `tap-${Date.now()}` };
      setProducts((prev) => [fallback, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) => (item.id === id || item.slug === id ? { ...item, ...updates } : item))
    );

    try {
      const updated = await api.updateProduct(id, updates);
      if (updated && updated.id) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id || item.slug === id ? { ...item, ...updated } : item))
        );
      }
    } catch (e) {
      console.warn('Backend updateProduct fallback', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id && item.slug !== id));
    try {
      await api.deleteProduct(id);
    } catch (e) {
      console.warn('Backend deleteProduct fallback', e);
    }
  };

  const resetProductsToDefault = async () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  };

  const createOrder = async (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    try {
      await api.createOrder(order);
    } catch (err) {
      console.warn('Order save fallback', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], artisanNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status, artisanNotes: artisanNotes ?? o.artisanNotes } : o
      )
    );
    try {
      await api.updateOrderStatus(orderId, status);
    } catch (e) {
      console.warn('Backend updateOrderStatus fallback', e);
    }
  };

  const recordVisitorPageview = (page: string, action: string = 'Viewed Page') => {
    const newLog: VisitorLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      city: 'Karachi',
      country: 'PK',
      pageViewed: page,
      device: 'Mobile iOS',
      action
    };
    setVisitorLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const formatPrice = (price: number): string => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const analytics: AnalyticsSummary = {
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalVisitors: 320,
    totalPageviews: 1420,
    uniqueSessions: 290,
    conversionRate: 4.8,
    pendingOrdersCount: orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length,
    activeShoppers: 14,
    lowStockItemsCount: products.filter((p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 5)).length,
    totalInventoryUnits: products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0)
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        visitorLogs,
        analytics,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        createOrder,
        updateOrderStatus,
        recordVisitorPageview,
        formatPrice
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
