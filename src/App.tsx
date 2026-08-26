import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { NotificationToast } from './components/common/NotificationToast';
import { WhatsAppButton } from './components/common/WhatsAppButton';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CustomCommissionPage } from './pages/CustomCommissionPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPortalPage } from './pages/admin/AdminPortalPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Controller that completely isolates the Admin Panel UI from Storefront
const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/peleteadmin10908');

  if (isAdminRoute) {
    // Completely isolated Admin Portal layout (No storefront header, footer, or cart drawer)
    return (
      <Routes>
        <Route path="/peleteadmin10908/*" element={<AdminPortalPage />} />
      </Routes>
    );
  }

  // Public Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-linen text-ink">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/custom-commissions" element={<CustomCommissionPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          {/* Custom 404 Route for any unmatched paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      <CartDrawer />
      <AuthModal />
      <QuickViewModal />
      <NotificationToast />
      <WhatsAppButton />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <ScrollToTop />
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
