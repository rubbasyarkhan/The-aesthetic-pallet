import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CartItemCustomization, CheckoutFormData, Order } from '../types';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { emailService } from '../services/emailService';

export interface CartToast {
  title: string;
  message: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  totalItemsCount: number;
  subtotal: number;
  shipping: number;
  packagingCost: number;
  total: number;
  perkProgress: number;
  amountNeededForPerk: number;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toast: CartToast | null;
  dismissToast: () => void;
  addToCart: (product: Product, quantity?: number, customization?: CartItemCustomization) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  placeCashOnDeliveryOrder: (customer: CheckoutFormData) => Order;
  formatCurrency: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'the_aesthetic_palette_cart_v3_rs';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { createOrder } = useProducts();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<CartToast | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Reconcile user login
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCart(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const dismissToast = () => setToast(null);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    customization: CartItemCustomization = {}
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          item.customization.colorway === customization.colorway &&
          item.customization.size === customization.size
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          product,
          quantity,
          customization,
          unitPrice: product.price
        };
        return [...prevCart, newItem];
      }
    });

    setToast({
      title: 'Added to Bag',
      message: `${quantity}x ${product.title}`,
      image: product.images[0]
    });

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E8B4A2', '#C06C4D', '#8DA399', '#FAF7F2']
      });
    } catch {
      // safe
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = 0;
  const packagingCost = 0;
  const total = subtotal + shipping + packagingCost;

  // Free gift box at Rs. 10,000
  const perkThreshold = 10000;
  const perkProgress = Math.min(100, Math.round((subtotal / perkThreshold) * 100));
  const amountNeededForPerk = Math.max(0, perkThreshold - subtotal);

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const placeCashOnDeliveryOrder = (customer: CheckoutFormData): Order => {
    const orderId = `TAP-COD-${Math.floor(10000 + Math.random() * 90000)}`;

    const enrichedCustomer = {
      ...customer,
      email: customer.email || user?.email || ''
    };

    const newOrder: Order = {
      orderId,
      userId: user?.id,
      userEmail: user?.email || customer.email,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      shipping,
      packagingCost,
      total,
      customer: enrichedCustomer,
      estimatedDeliveryDate: 'In 2-4 Business Days',
      status: 'PENDING_CONFIRMATION'
    };

    createOrder(newOrder);
    
    // Asynchronously dispatch comprehensive order email to rubbasyarkhan007@gmail.com and client
    emailService.sendNewOrderNotification(newOrder).catch((err) => {
      console.warn('Email dispatch background notice:', err);
    });

    clearCart();
    setIsCartOpen(false);

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        totalItemsCount,
        subtotal,
        shipping,
        packagingCost,
        total,
        perkProgress,
        amountNeededForPerk,
        quickViewProduct,
        setQuickViewProduct,
        toast,
        dismissToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        placeCashOnDeliveryOrder,
        formatCurrency
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
