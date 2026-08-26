import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, VisitorLog, AnalyticsSummary } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { api } from '../services/api';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  visitorLogs: VisitorLog[];
  analytics: AnalyticsSummary;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], artisanNotes?: string) => void;
  recordVisitorPageview: (page: string, action?: string) => void;
  formatPrice: (price: number) => string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'the_aesthetic_palette_products_v3_rs';
const ORDERS_STORAGE_KEY = 'the_aesthetic_palette_orders_master_v3_rs';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].price > 500) {
          return parsed;
        }
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return [
        {
          orderId: 'TAP-COD-98214',
          userEmail: 'sophia.reynolds@gmail.com',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          items: [
            {
              id: 'item-1',
              productId: 'crochet-forever-roses',
              product: DEFAULT_PRODUCTS[0],
              quantity: 1,
              unitPrice: 4800,
              customization: { colorway: 'Romantic Blush & Cream' }
            }
          ],
          subtotal: 4800,
          shipping: 0,
          packagingCost: 0,
          total: 4800,
          customer: {
            fullName: 'Sophia Reynolds',
            phoneNumber: '+92 (300) 892-1244',
            streetAddress: 'House 42, Street 8, F-7/2',
            city: 'Islamabad',
            postalCode: '44000',
            paymentMethod: 'COD'
          },
          estimatedDeliveryDate: 'In 2 Days',
          status: 'CRAFTING'
        },
        {
          orderId: 'TAP-COD-97103',
          userEmail: 'olivia.h@outlook.com',
          createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
          items: [
            {
              id: 'item-2',
              productId: 'custom-loved-ones-portrait',
              product: DEFAULT_PRODUCTS[5],
              quantity: 1,
              unitPrice: 18500,
              customization: { colorway: 'Warm Cream Glow', customMeasurements: 'Golden Retriever portrait' }
            }
          ],
          subtotal: 18500,
          shipping: 0,
          packagingCost: 0,
          total: 18500,
          customer: {
            fullName: 'Ayesha Khan',
            phoneNumber: '+92 (321) 431-7788',
            streetAddress: 'Plot 18-C, Phase 6, DHA',
            city: 'Lahore',
            postalCode: '54000',
            paymentMethod: 'COD'
          },
          estimatedDeliveryDate: 'In 5 Days',
          status: 'PENDING_CONFIRMATION'
        }
      ];
    } catch {
      return [];
    }
  });

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
    },
    {
      id: 'log-4',
      timestamp: '12 mins ago',
      city: 'Rawalpindi',
      country: 'PK',
      pageViewed: 'Marshmallow Cardigan',
      device: 'Mobile Android',
      action: 'Viewed Product'
    }
  ]);

  // Fetch initial data from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const fetchedProducts = await api.getProducts();
        if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
        const fetchedOrders = await api.getOrders();
        if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
        }
      } catch (e) {
        console.warn('API sync fallback active', e);
      }
    }
    loadData();
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const id = `tap-item-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Asynchronously sync with backend API
    api.createProduct(newProductData).catch((err) => console.warn('API save fallback', err));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    // Asynchronously sync with backend API
    if (updates.stockQuantity !== undefined) {
      api.updateStock(id, updates.stockQuantity).catch(() => {});
    } else {
      api.updateProduct(id, updates).catch(() => {});
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    api.deleteProduct(id).catch(() => {});
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    } catch (e) {
      console.error(e);
    }
  };

  const createOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);

    // Decrement stock in local state
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = order.items.find((it) => it.productId === p.id);
        if (matchingItem) {
          return { ...p, stockQuantity: Math.max(0, (p.stockQuantity || 0) - matchingItem.quantity) };
        }
        return p;
      })
    );

    // Sync with backend API
    api.createOrder(order).catch((err) => console.warn('Order API sync fallback', err));
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], artisanNotes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status, artisanNotes: artisanNotes ?? o.artisanNotes } : o
      )
    );
    api.updateOrderStatus(orderId, status).catch(() => {});
  };

  const recordVisitorPageview = (page: string, action: string = 'Browsed Page') => {
    const cities = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Multan'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    const newLog: VisitorLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      city: randomCity,
      country: 'PK',
      pageViewed: page,
      device: 'Mobile',
      action
    };

    setVisitorLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const formatPrice = (price: number): string => {
    return `Rs. ${price.toLocaleString()}`;
  };

  // Compute analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_CONFIRMATION' || o.status === 'CRAFTING').length;
  const lowStockItemsCount = products.filter((p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 5)).length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);

  const analytics: AnalyticsSummary = {
    totalVisitors: 1420 + visitorLogs.length * 7,
    totalPageviews: 4890 + visitorLogs.length * 15,
    uniqueSessions: 940 + visitorLogs.length * 4,
    conversionRate: 4.8,
    totalRevenue: totalRevenue,
    pendingOrdersCount: pendingOrdersCount,
    activeShoppers: Math.floor(Math.random() * 6) + 8,
    lowStockItemsCount,
    totalInventoryUnits
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
