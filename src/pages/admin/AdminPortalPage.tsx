import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Search, 
  Package, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  LogOut, 
  Database, 
  Minus, 
  Check,
  Upload,
  Image as ImageIcon,
  Heart,
  ShieldCheck,
  Star,
  X,
  Palette
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Category, Occasion, Product, ProductColorway } from '../../types';
import { AdminLoginGate } from './AdminLoginGate';
import { api } from '../../services/api';

export const AdminPortalPage: React.FC = () => {
  const { 
    products, 
    orders, 
    visitorLogs, 
    analytics, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProductsToDefault, 
    updateOrderStatus,
    formatPrice 
  } = useProducts();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('the_aesthetic_palette_admin_session_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.authenticated === true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'customers' | 'database'>('inventory');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);

  // Live Visual Studio Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('crochet-flowers');
  const [newOccasion, setNewOccasion] = useState<Occasion>('birthday');
  const [newPrice, setNewPrice] = useState('3800');
  const [newOrigPrice, setNewOrigPrice] = useState('4500');
  const [newCostPrice, setNewCostPrice] = useState('1200');
  const [newStock, setNewStock] = useState('15');
  const [newLowStockThreshold, setNewLowStockThreshold] = useState('5');
  const [newTagline, setNewTagline] = useState('');
  const [newLeadTime, setNewLeadTime] = useState('Ready to Ship / 2 Days');
  const [newCraftHours, setNewCraftHours] = useState('4');
  const [newImages, setNewImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85'
  ]);
  const [newDescription, setNewDescription] = useState('');
  const [newIsMadeToOrder, setNewIsMadeToOrder] = useState(false);
  const [newColorways, setNewColorways] = useState<ProductColorway[]>([
    { name: 'Romantic Blush & Cream', hex: '#E8B4A2', stockQuantity: 10 },
    { name: 'Sunset Terracotta', hex: '#C06C4D', stockQuantity: 5 }
  ]);
  const [newMaterials, setNewMaterials] = useState<string>('100% Soft Organic Combed Cotton, Satin Bow');

  // Add Color helper state
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#E8B4A2');
  const [customColorStock, setCustomColorStock] = useState('5');

  const [previewImageIdx, setPreviewImageIdx] = useState(0);

  const handleAdminLogout = () => {
    localStorage.removeItem('the_aesthetic_palette_admin_session_v2');
    setIsAdminAuthenticated(false);
  };

  if (!isAdminAuthenticated) {
    return <AdminLoginGate onLoginSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  const openAddModal = () => {
    setEditingProductId(null);
    setNewTitle('');
    setNewSku(`TAP-${Math.floor(100 + Math.random() * 900)}`);
    setNewCategory('crochet-flowers');
    setNewOccasion('birthday');
    setNewPrice('3800');
    setNewOrigPrice('4500');
    setNewCostPrice('1200');
    setNewStock('15');
    setNewLowStockThreshold('5');
    setNewTagline('Flowers that never fade · Stitched with pure soft cotton');
    setNewLeadTime('Ready to Ship / 2 Days');
    setNewCraftHours('4');
    setNewImages([
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85'
    ]);
    setNewDescription('A cozy handmade creation crafted from organic combed cotton.');
    setNewIsMadeToOrder(false);
    setNewColorways([
      { name: 'Romantic Blush & Cream', hex: '#E8B4A2', stockQuantity: 10 },
      { name: 'Sunset Terracotta', hex: '#C06C4D', stockQuantity: 5 }
    ]);
    setNewMaterials('100% Soft Organic Combed Cotton, Satin Bow');
    setPreviewImageIdx(0);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setNewTitle(p.title);
    setNewSku(p.sku || `TAP-${p.id.slice(0, 4).toUpperCase()}`);
    setNewCategory(p.category);
    setNewOccasion(p.occasion);
    setNewPrice(p.price.toString());
    setNewOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setNewCostPrice(p.costPrice ? p.costPrice.toString() : '1000');
    setNewStock((p.stockQuantity ?? 10).toString());
    setNewLowStockThreshold((p.lowStockThreshold || 5).toString());
    setNewTagline(p.tagline);
    setNewLeadTime(p.leadTimeText);
    setNewCraftHours(p.craftTimeHours.toString());
    setNewImages(p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85']);
    setNewDescription(p.description);
    setNewIsMadeToOrder(p.isMadeToOrder);
    setNewColorways(p.colorways && p.colorways.length > 0 ? p.colorways : [{ name: 'Default Shade', hex: '#FAF7F2', stockQuantity: p.stockQuantity }]);
    setNewMaterials(p.materials ? p.materials.join(', ') : '100% Combed Cotton');
    setPreviewImageIdx(0);
    setIsModalOpen(true);
  };

  // Cloudinary image upload handler for Admin
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const readBase64Promises = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );

      const base64List = await Promise.all(readBase64Promises);
      const uploadedUrls = await api.uploadMultipleImages(base64List);

      setNewImages((prev) => [...uploadedUrls, ...prev]);
      setPreviewImageIdx(0);
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Photo removal with Cloudinary asset deletion
  const handleRemovePhoto = async (indexToRemove: number) => {
    const urlToRemove = newImages[indexToRemove];
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (previewImageIdx >= newImages.length - 1) {
      setPreviewImageIdx(Math.max(0, newImages.length - 2));
    }
    if (urlToRemove) {
      api.deleteImage(urlToRemove);
    }
  };

  // Add Colorway helper
  const handleAddColorway = () => {
    if (!customColorName.trim()) return;
    const parsedStock = parseInt(customColorStock) || 5;
    setNewColorways((prev) => [
      ...prev,
      {
        name: customColorName.trim(),
        hex: customColorHex,
        stockQuantity: parsedStock
      }
    ]);
    setCustomColorName('');
    setCustomColorStock('5');
  };

  const handleRemoveColorway = (indexToRemove: number) => {
    setNewColorways((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;

    const parsedPrice = parseFloat(newPrice) || 3000;
    const parsedStock = parseInt(newStock) || 0;
    const parsedCost = parseFloat(newCostPrice) || 0;
    const parsedLowThresh = parseInt(newLowStockThreshold) || 5;
    const splitMaterials = newMaterials.split(',').map((m) => m.trim()).filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: newTitle,
        sku: newSku,
        category: newCategory,
        occasion: newOccasion,
        price: parsedPrice,
        originalPrice: newOrigPrice ? parseFloat(newOrigPrice) : undefined,
        costPrice: parsedCost,
        stockQuantity: parsedStock,
        lowStockThreshold: parsedLowThresh,
        tagline: newTagline,
        leadTimeText: newLeadTime,
        craftTimeHours: parseInt(newCraftHours) || 3,
        images: newImages,
        description: newDescription,
        materials: splitMaterials,
        colorways: newColorways,
        isMadeToOrder: newIsMadeToOrder,
        isReadyToShip: !newIsMadeToOrder
      });
    } else {
      addProduct({
        title: newTitle,
        slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
        sku: newSku,
        category: newCategory,
        occasion: newOccasion,
        price: parsedPrice,
        originalPrice: newOrigPrice ? parseFloat(newOrigPrice) : undefined,
        costPrice: parsedCost,
        stockQuantity: parsedStock,
        lowStockThreshold: parsedLowThresh,
        leadTimeDays: 2,
        leadTimeText: newLeadTime,
        isMadeToOrder: newIsMadeToOrder,
        isReadyToShip: !newIsMadeToOrder,
        rating: 5.0,
        reviewCount: 1,
        tagline: newTagline,
        shortDescription: newTagline,
        description: newDescription,
        images: newImages,
        materials: splitMaterials.length > 0 ? splitMaterials : ['100% Organic Cotton'],
        craftTimeHours: parseInt(newCraftHours) || 3,
        colorways: newColorways,
        careInstructions: ['Handle with gentle care.'],
        includedInPackage: ['1x Handmade Item', 'Artisan Seed Paper Note']
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickStockAdjust = (id: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    updateProduct(id, { stockQuantity: nextStock });
  };

  // Inventory computations
  const totalUnitsInStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const lowStockItems = products.filter((p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 5));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchesLowStock = !onlyLowStock || ((p.stockQuantity || 0) <= (p.lowStockThreshold || 5));

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const filteredOrders = orders.filter((o) =>
    o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer.city.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1F2421] font-sans flex antialiased">
      {/* 1. DEDICATED ADMIN SIDEBAR (LIGHT THEME) */}
      <aside className="w-64 bg-white border-r border-[#E5E0D8] flex flex-col justify-between p-4 shrink-0 hidden md:flex shadow-xs">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-[#C06C4D] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
              AP
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold text-[#1F2421] tracking-wide">
                Aesthetic Palette
              </h2>
              <p className="text-[11px] text-[#C06C4D] font-semibold">Studio Back-Office</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#C06C4D] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F7F3EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Inventory & Products</span>
              </div>
              {lowStockItems.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'inventory' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {lowStockItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#C06C4D] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F7F3EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#EFEAE2] text-[#4B5563]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#C06C4D] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F7F3EE]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Visitor Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#C06C4D] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F7F3EE]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'database'
                  ? 'bg-[#C06C4D] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F7F3EE]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>MongoDB Atlas & Cloudinary</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="pt-4 border-t border-[#E5E0D8] space-y-3">
          <div className="px-2 text-xs">
            <p className="font-bold text-[#1F2421] truncate">Studio Master Admin</p>
            <p className="text-[11px] text-[#6B7280] truncate">rykoffice008@gmail.com</p>
          </div>

          <button
            onClick={handleAdminLogout}
            className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN WORKSPACE (LIGHT THEME) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E5E0D8] px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex md:hidden items-center gap-2">
              <span className="font-bold text-[#C06C4D]">AP Back-Office</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#1F2421]">MongoDB Atlas & Cloudinary Synced</span>
              <span>•</span>
              <span>All Prices in <strong className="text-[#C06C4D]">Pakistani Rupees (Rs.)</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lowStockItems.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setOnlyLowStock(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{lowStockItems.length} Low Stock</span>
              </button>
            )}

            <button
              onClick={openAddModal}
              className="py-2 px-4 bg-[#C06C4D] hover:bg-[#A95A3E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Studio Visual Creator</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {/* TAB 1: INVENTORY & PRODUCTS CRUD */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Stat Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] space-y-1 shadow-xs">
                  <span className="text-xs text-[#6B7280] font-medium">Total Creations</span>
                  <p className="font-serif text-2xl font-bold text-[#1F2421]">{products.length}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] space-y-1 shadow-xs">
                  <span className="text-xs text-[#6B7280] font-medium">Units in Stock</span>
                  <p className="font-serif text-2xl font-bold text-emerald-600">{totalUnitsInStock} pcs</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] space-y-1 shadow-xs">
                  <span className="text-xs text-[#6B7280] font-medium">Low Stock Alerts</span>
                  <p className="font-serif text-2xl font-bold text-amber-600">{lowStockItems.length} items</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] space-y-1 shadow-xs">
                  <span className="text-xs text-[#6B7280] font-medium">Total Catalog Value</span>
                  <p className="font-serif text-2xl font-bold text-[#C06C4D]">
                    {formatPrice(products.reduce((s, p) => s + p.price * (p.stockQuantity || 1), 0))}
                  </p>
                </div>
              </div>

              {/* Filters & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search SKU, creation name, category..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                  >
                    <option value="all">All Categories</option>
                    <option value="crochet-flowers">Crochet Roses & Flowers</option>
                    <option value="crochet-keychains">Keychains & Charms</option>
                    <option value="hair-accessories">Hair Clips & Bows</option>
                    <option value="crochet-wear">Sweaters & Hats</option>
                    <option value="paintings">Oil Canvas Paintings</option>
                    <option value="custom-portraits">Loved Ones Portraits</option>
                    <option value="gift-sets">Gift Sets</option>
                  </select>

                  <button
                    onClick={() => setOnlyLowStock(!onlyLowStock)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      onlyLowStock
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-[#FAFAFA] text-[#4B5563] border-[#D1D5DB] hover:text-[#1F2421] hover:bg-white'
                    }`}
                  >
                    {onlyLowStock ? 'Showing Low Stock Only' : 'Filter Low Stock'}
                  </button>
                </div>

                <button
                  onClick={resetProductsToDefault}
                  className="text-xs text-[#6B7280] hover:text-[#1F2421] flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-[#F7F3EE] transition-colors"
                  title="Reset to default handcrafted dataset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-[#4B5563] uppercase text-[10px] font-bold border-b border-[#E5E0D8] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Creation & SKU</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Selling Price (Rs.)</th>
                        <th className="py-3.5 px-4">Cost Price (Rs.)</th>
                        <th className="py-3.5 px-4">Stock Level</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {filteredProducts.map((p) => {
                        const isLow = (p.stockQuantity || 0) <= (p.lowStockThreshold || 5);
                        const isOutOfStock = (p.stockQuantity || 0) === 0;

                        return (
                          <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D8] shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-serif font-bold text-[#1F2421] truncate max-w-xs">{p.title}</p>
                                <p className="font-mono text-[11px] text-[#C06C4D] font-semibold">{p.sku || 'TAP-ITEM'}</p>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-[#4B5563]">
                              <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] capitalize text-[11px] font-medium">
                                {p.category.replace('-', ' ')}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-bold text-[#1F2421] text-sm">
                              {formatPrice(p.price)}
                              {p.originalPrice && (
                                <span className="text-[11px] text-[#9CA3AF] line-through ml-1.5 font-normal">
                                  {formatPrice(p.originalPrice)}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-[#6B7280]">
                              {formatPrice(p.costPrice || 1000)}
                            </td>

                            {/* Live Stock Stepper */}
                            <td className="py-3 px-4">
                              <div className="inline-flex items-center border border-[#D1D5DB] rounded-lg bg-white p-0.5 shadow-2xs">
                                <button
                                  onClick={() => handleQuickStockAdjust(p.id, p.stockQuantity || 0, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F3EFEA] rounded transition-colors"
                                  title="Decrease stock by 1"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-bold text-xs text-[#1F2421]">
                                  {p.stockQuantity || 0}
                                </span>
                                <button
                                  onClick={() => handleQuickStockAdjust(p.id, p.stockQuantity || 0, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#4B5563] hover:text-[#1F2421] hover:bg-[#F3EFEA] rounded transition-colors"
                                  title="Increase stock by 1"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3 px-4">
                              {isOutOfStock ? (
                                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold border border-red-200">
                                  Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1 w-fit">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Low ({p.stockQuantity})
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                  In Stock
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2 text-[#4B5563] hover:text-[#C06C4D] rounded-lg hover:bg-[#FAF7F2] transition-colors"
                                title="Edit creation"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-2 text-[#4B5563] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete creation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, customer name, city..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                  />
                </div>
                <span className="text-xs text-[#6B7280] font-semibold">{orders.length} total orders recorded</span>
              </div>

              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8] text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#C06C4D] text-sm">{ord.orderId}</span>
                        <span className="text-[#6B7280] ml-2 font-medium">
                          {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1F2421] text-sm">
                          Total: {formatPrice(ord.total)} (COD)
                        </span>
                        
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.orderId, e.target.value as any)}
                          className="px-3 py-1.5 text-xs rounded-xl border border-[#D1D5DB] bg-white font-bold text-[#1F2421] focus:outline-none focus:border-[#C06C4D]"
                        >
                          <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                          <option value="CRAFTING">Crafting by Artisan</option>
                          <option value="DISPATCHED">Dispatched for Delivery</option>
                          <option value="DELIVERED">Delivered & Paid</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5 text-[#4B5563]">
                        <p className="font-bold text-[#1F2421] text-sm">{ord.customer.fullName}</p>
                        <p className="flex items-center gap-1.5 font-semibold text-[#C06C4D]">
                          <Phone className="w-3.5 h-3.5" /> {ord.customer.phoneNumber}
                        </p>
                        <p className="flex items-start gap-1.5 text-[#6B7280]">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            {ord.customer.streetAddress}, {ord.customer.city}, {ord.customer.postalCode}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <p className="font-bold text-[#1F2421]">Items in Parcel:</p>
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[#4B5563]">
                              <span>{it.quantity}x {it.product?.title || 'Handmade Creation'}</span>
                              <span className="font-semibold text-[#1F2421]">{formatPrice(it.unitPrice * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VISITOR ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E5E0D8] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#1F2421] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Traffic & Shopper Event Stream</span>
                    </h3>
                    <span className="text-xs text-[#6B7280]">Real-time session stream</span>
                  </div>

                  <div className="divide-y divide-[#E5E0D8]">
                    {visitorLogs.map((log) => (
                      <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] flex items-center justify-center text-[#C06C4D] text-xs font-bold shrink-0">
                            {log.country}
                          </div>
                          <div>
                            <p className="font-bold text-[#1F2421]">
                              {log.city} · <span className="text-[#6B7280] font-normal">{log.device}</span>
                            </p>
                            <p className="text-[11px] text-[#6B7280]">
                              {log.action} on <span className="font-bold text-[#C06C4D]">{log.pageViewed}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#6B7280] shrink-0 font-medium">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5E0D8] space-y-4 text-xs shadow-xs">
                  <h3 className="font-serif text-base font-bold text-[#1F2421]">Audience Insights</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[#6B7280] mb-1.5 font-medium">
                        <span>Checkout Conversion</span>
                        <span className="font-bold text-[#1F2421]">4.8%</span>
                      </div>
                      <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden">
                        <div className="w-[48%] h-full bg-[#C06C4D] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#6B7280] mb-1.5 font-medium">
                        <span>Mobile Shoppers in Pakistan</span>
                        <span className="font-bold text-[#1F2421]">78%</span>
                      </div>
                      <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden">
                        <div className="w-[78%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#6B7280] mb-1.5 font-medium">
                        <span>Cash on Delivery Adoption</span>
                        <span className="font-bold text-[#1F2421]">96%</span>
                      </div>
                      <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden">
                        <div className="w-[96%] h-full bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] space-y-4 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#1F2421]">Registered Studio Clients</h3>
              <p className="text-xs text-[#6B7280]">Clients who have placed Cash on Delivery orders.</p>

              <div className="divide-y divide-[#E5E0D8] text-xs">
                {orders.map((ord, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1F2421]">{ord.customer.fullName}</p>
                      <p className="text-[#6B7280]">{ord.userEmail || ord.customer.phoneNumber} · {ord.customer.city}</p>
                    </div>
                    <span className="text-emerald-700 font-bold font-mono">
                      Order {ord.orderId} ({formatPrice(ord.total)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MONGODB & SYSTEM CONFIG */}
          {activeTab === 'database' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] space-y-4 max-w-2xl text-xs shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#1F2421] flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>MongoDB Atlas & Cloudinary Storage</span>
              </h3>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D8] space-y-2.5 font-mono text-[11px]">
                <p className="text-emerald-700 font-bold">● Database Engine: MongoDB Atlas (astheticpallettest)</p>
                <p className="text-[#4B5563]">● Cloudinary CDN Cloud: <span className="text-[#C06C4D] font-bold">wweasl6y</span></p>
                <p className="text-[#4B5563]">● Admin Email: <span className="text-[#C06C4D] font-bold">rykoffice008@gmail.com</span></p>
                <p className="text-[#4B5563]">● Order Alert Destination: <span className="text-emerald-700 font-bold">rubbasyarkhan007@gmail.com</span></p>
                <p className="text-[#4B5563]">● WhatsApp Contact: <span className="text-[#25D366] font-bold">+92 317 2072623</span></p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. LIVE VISUAL STUDIO PRODUCT EDITOR (LIGHT THEME) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-5xl bg-white rounded-2xl border border-[#E5E0D8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Topbar */}
            <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FAF7F2] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C06C4D] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1F2421]">
                    {editingProductId ? 'Studio Product Editor' : 'Create New Handcrafted Item'}
                  </h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Live Visual Studio · Real-time preview matching the website's Product Detail Page
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E5E0D8] text-[#4B5563] hover:text-[#1F2421] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs bg-[#FAF7F2]">
              
              {/* LEFT COLUMN: LIVE VISUAL GALLERY PREVIEW & PHOTO DELETER */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F2421] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#C06C4D]" />
                      <span>Live Gallery Preview</span>
                    </span>
                    <span className="text-[10px] text-[#6B7280]">Shopper View</span>
                  </div>

                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-white border border-[#E5E0D8] shadow-sm group">
                    <img
                      src={newImages[previewImageIdx] || newImages[0]}
                      alt="Preview"
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {newIsMadeToOrder ? (
                        <span className="px-2.5 py-1 rounded-full bg-white/95 text-black text-[10px] font-bold shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C06C4D]" /> Made to Order
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Ready to Ship
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-red-500 shadow-sm">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </div>
                  </div>

                  {/* Thumbnail Row with Deletion (×) Button */}
                  {newImages.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#6B7280]">Click image to preview, click × to delete from Cloudinary:</p>
                      <div className="flex gap-2.5 overflow-x-auto pb-1">
                        {newImages.map((img, idx) => (
                          <div key={idx} className="relative group shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewImageIdx(idx)}
                              className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all block ${
                                previewImageIdx === idx
                                  ? 'border-[#C06C4D] ring-1 ring-[#C06C4D]'
                                  : 'border-[#E5E0D8] opacity-75 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>

                            {/* Deletion Button on Thumbnail */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(idx);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs shadow-md"
                              title="Delete photo from Cloudinary"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cloudinary File Upload Dropzone */}
                <div className="p-4 bg-white rounded-2xl border border-dashed border-[#C06C4D]/60 space-y-2 text-center shadow-xs">
                  <Upload className="w-6 h-6 text-[#C06C4D] mx-auto" />
                  <div>
                    <p className="font-bold text-[#1F2421] text-xs">Upload to Cloudinary (wweasl6y)</p>
                    <p className="text-[11px] text-[#6B7280]">Select high-res photos from your device</p>
                  </div>

                  <label className="inline-block py-2 px-4 bg-[#FAF7F2] hover:bg-[#F3EFEA] text-[#1F2421] border border-[#E5E0D8] text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <span>{isUploading ? 'Uploading to Cloudinary...' : 'Choose Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleCloudinaryUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* RIGHT COLUMN: PDP-STYLED FORM */}
              <div className="lg:col-span-7 space-y-4 bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    <span className="text-[#6B7280] ml-1 font-semibold">★ 5.0 (Artisan Verified)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#1F2421] font-semibold">
                      <input
                        type="checkbox"
                        checked={newIsMadeToOrder}
                        onChange={(e) => setNewIsMadeToOrder(e.target.checked)}
                        className="rounded border-[#D1D5DB] text-[#C06C4D] focus:ring-0"
                      />
                      <span>Made to Order</span>
                    </label>
                  </div>
                </div>

                {/* Title & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#1F2421] mb-1">Creation Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Sunny Daisy Crochet Hair Clip Duo"
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D] font-serif text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1F2421] mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      placeholder="TAP-CLIP-003"
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#C06C4D] font-mono font-bold focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">1-Liner Hook Tagline (Displayed on PDP)</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="e.g. Cute, gentle hold · No hair snagging"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#C06C4D] italic focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                  />
                </div>

                {/* PRICING BREAKDOWN WITH INTUITIVE HELPER LABELS */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D8] space-y-3">
                  <span className="font-bold text-[#1F2421] text-xs">Pricing & Cost Structure (in PKR Rs.):</span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#1F2421]">Selling Price (Rs.) *</label>
                      <span className="text-[10px] text-[#6B7280] block mb-1">Customer purchase price</span>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white text-[#1F2421] font-bold text-sm focus:outline-none focus:border-[#C06C4D]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#374151]">Original / Cut Price (Rs.)</label>
                      <span className="text-[10px] text-[#6B7280] block mb-1">Crossed-out discount</span>
                      <input
                        type="number"
                        value={newOrigPrice}
                        onChange={(e) => setNewOrigPrice(e.target.value)}
                        placeholder="e.g. 4500"
                        className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white text-[#6B7280] focus:outline-none focus:border-[#C06C4D]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#374151]">Cost Price (Rs.)</label>
                      <span className="text-[10px] text-[#6B7280] block mb-1">Private studio production cost</span>
                      <input
                        type="number"
                        value={newCostPrice}
                        onChange={(e) => setNewCostPrice(e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white text-[#6B7280] focus:outline-none focus:border-[#C06C4D]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock & Low Stock Alert */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-700 mb-1">Total Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-emerald-700 font-bold focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-amber-700 mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      value={newLowStockThreshold}
                      onChange={(e) => setNewLowStockThreshold(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-amber-800 focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#374151] mb-1">Craft Hours</label>
                    <input
                      type="number"
                      value={newCraftHours}
                      onChange={(e) => setNewCraftHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    />
                  </div>
                </div>

                {/* DYNAMIC COLORWAY & VARIANT STOCK MANAGER */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5E0D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F2421] text-xs flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#C06C4D]" />
                      <span>Available Colors & Variant Stock (Counts Hidden from Shoppers)</span>
                    </span>
                  </div>

                  {/* Add Color Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        placeholder="Color name (e.g. Sage Green)"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#1F2421] focus:outline-none focus:border-[#C06C4D]"
                      />
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        className="w-8 h-8 rounded border border-[#D1D5DB] p-0.5 cursor-pointer bg-white"
                        title="Pick color shade"
                      />
                      <span className="text-[11px] font-mono text-[#6B7280]">{customColorHex}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        value={customColorStock}
                        onChange={(e) => setCustomColorStock(e.target.value)}
                        placeholder="Qty"
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#1F2421] focus:outline-none focus:border-[#C06C4D]"
                        title="Stock count for this color"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddColorway}
                        className="w-full py-1.5 px-3 bg-[#1F2421] hover:bg-[#C06C4D] text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* List of active colorways */}
                  {newColorways.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {newColorways.map((cw, cwIdx) => (
                        <div
                          key={cwIdx}
                          className="flex items-center gap-2 py-1 px-2.5 bg-white rounded-lg border border-[#E5E0D8] text-xs shadow-2xs"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: cw.hex }}
                          />
                          <span className="font-semibold text-[#1F2421]">{cw.name}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                            {cw.stockQuantity || 0} pcs
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColorway(cwIdx)}
                            className="text-red-500 hover:text-red-700 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category & Occasion */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#374151] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    >
                      <option value="crochet-flowers">Crochet Roses & Flowers</option>
                      <option value="crochet-keychains">Keychains & Charms</option>
                      <option value="hair-accessories">Hair Clips & Bows</option>
                      <option value="crochet-wear">Sweaters & Hats</option>
                      <option value="paintings">Oil Canvas Paintings</option>
                      <option value="custom-portraits">Loved Ones Portraits</option>
                      <option value="gift-sets">Gift Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#374151] mb-1">Occasion</label>
                    <select
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value as Occasion)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                    >
                      <option value="birthday">Birthday Specials</option>
                      <option value="housewarming">Housewarming</option>
                      <option value="welcome-gifts">Welcome Gifts</option>
                      <option value="anniversary-love">Love & Keepsakes</option>
                      <option value="self-care">Soft Treats</option>
                    </select>
                  </div>
                </div>

                {/* Lead Time Text */}
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Lead Time Text (Displayed in Chip)</label>
                  <input
                    type="text"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(e.target.value)}
                    placeholder="Ready to Ship / 2 Days"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                  />
                </div>

                {/* Materials & Inclusions */}
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Materials (Comma separated)</label>
                  <input
                    type="text"
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    placeholder="100% Combed Cotton, Satin Ribbon"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe the texture, soft touch, and inspiration..."
                    className="w-full p-3 rounded-xl border border-[#D1D5DB] bg-[#FAFAFA] text-[#1F2421] focus:bg-white focus:outline-none focus:border-[#C06C4D] resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#4B5563] hover:text-[#1F2421] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#C06C4D] hover:bg-[#A95A3E] text-white rounded-xl font-bold shadow-md transition-all active:scale-98"
                  >
                    Save & Publish Creation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
