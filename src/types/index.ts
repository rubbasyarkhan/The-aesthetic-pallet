export type Category = 
  | 'all'
  | 'crochet-bags'
  | 'crochet-flowers'
  | 'crochet-keychains'
  | 'hair-accessories'
  | 'crochet-wear'
  | 'paintings'
  | 'custom-portraits'
  | 'gift-sets';

export type Occasion = 
  | 'all'
  | 'birthday'
  | 'housewarming'
  | 'welcome-gifts'
  | 'anniversary-love'
  | 'self-care';

export interface ProductColorway {
  name: string;
  hex: string;
  stockQuantity?: number;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku?: string;
  category: Category;
  occasion: Occasion;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  leadTimeDays: number;
  leadTimeText: string;
  isMadeToOrder: boolean;
  isReadyToShip: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  tagline: string;
  description: string;
  images: string[];
  materials: string[];
  dimensions?: string;
  craftTimeHours: number;
  colorways: ProductColorway[];
  sizes?: string[];
  careInstructions: string[];
  includedInPackage: string[];
  customOptions?: {
    allowCustomColor?: boolean;
    allowCustomMeasurements?: boolean;
    allowGiftNote?: boolean;
    allowPhotoUploadPrompt?: boolean;
  };
}

export interface CartItemCustomization {
  colorway?: string;
  size?: string;
  customMeasurements?: string;
  giftNote?: string;
  specialInstructions?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  customization: CartItemCustomization;
  unitPrice: number;
}

export interface CheckoutFormData {
  fullName: string;
  email?: string;
  phoneNumber: string;
  streetAddress: string;
  apartmentSuite?: string;
  city: string;
  postalCode: string;
  deliveryNotes?: string;
  paymentMethod: 'COD' | 'ONLINE';
}

export interface Order {
  orderId: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  packagingCost: number;
  total: number;
  customer: CheckoutFormData;
  estimatedDeliveryDate: string;
  status: 'PENDING_CONFIRMATION' | 'CRAFTING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  artisanNotes?: string;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  rating: number;
  date?: string;
  location?: string;
  verifiedPurchase?: boolean;
  productTitle?: string;
  avatar?: string;
  comment: string;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  provider: 'google' | 'email' | 'guest_demo';
  createdAt: string;
  phone?: string;
  savedAddress?: {
    streetAddress: string;
    apartmentSuite?: string;
    city: string;
    postalCode: string;
  };
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  city: string;
  country: string;
  pageViewed: string;
  device: string;
  action: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageviews: number;
  uniqueSessions: number;
  conversionRate: number;
  totalRevenue: number;
  pendingOrdersCount: number;
  activeShoppers: number;
  lowStockItemsCount: number;
  totalInventoryUnits: number;
}
