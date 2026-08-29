import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Package, 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  LogOut, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Truck,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';

export const AccountPage: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { orders, formatPrice } = useProducts();
  const { likedProducts, toggleLike } = useWishlist();
  const { addToCart, formatCurrency } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address'>('orders');

  if (!user) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 text-center space-y-4 min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-linen-surface border border-linen-deep mx-auto flex items-center justify-center text-terracotta">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-semibold">
          Customer Studio Account
        </h1>
        <p className="text-xs text-ink-muted max-w-sm mx-auto">
          Please sign in to track your slow-crafted Cash on Delivery orders, view saved treasures, and manage your delivery address.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="btn-primary text-xs py-3 px-8 shadow-sm"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  // Filter orders for this user
  const userOrders = (orders || []).filter(
    (o) =>
      o &&
      ((user.email && o.userEmail?.toLowerCase() === user.email.toLowerCase()) ||
        (user.id && o.userId === user.id) ||
        (user.email && o.customer?.email?.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && o.customer?.phoneNumber === user.phone))
  );

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-linen-light rounded-organic-2xl p-6 sm:p-8 border border-linen-deep shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name || 'Studio Client')}`}
            alt={user.name || 'User'}
            className="w-16 h-16 rounded-full object-cover border-2 border-terracotta/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
                {user.name || 'Valued Studio Client'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-sage/20 text-sage-deep text-[10px] font-bold uppercase tracking-wider">
                Studio Client
              </span>
            </div>
            <p className="text-xs text-ink-muted">{user.email}</p>
            <p className="text-[11px] text-ink-faint mt-0.5">
              Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={logout}
            className="btn-secondary text-xs py-2 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto text-ink-muted hover:text-red-600"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-linen-deep gap-2 sm:gap-6 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'text-terracotta font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist' ? 'text-terracotta font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Treasures ({likedProducts.length})</span>
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`py-3 px-3 relative transition-colors flex items-center gap-2 ${
            activeTab === 'address' ? 'text-terracotta font-bold' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Address</span>
          {activeTab === 'address' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="py-12 text-center bg-linen-light rounded-organic-xl border border-linen-deep space-y-3">
              <Package className="w-8 h-8 text-ink-faint mx-auto" />
              <h3 className="font-serif text-base font-semibold text-ink">No Orders Placed Yet</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Your future slow-crafted crochet creations and custom oil portraits will appear here with live tracking.
              </p>
              <Link to="/products" className="btn-primary text-xs py-2 px-5 inline-block mt-2">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-linen-light rounded-organic-xl p-5 sm:p-6 border border-linen-deep shadow-subtle space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-linen-deep text-xs">
                    <div>
                      <span className="font-mono font-bold text-terracotta">{ord.orderId}</span>
                      <span className="text-ink-muted ml-2">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-ink">{formatCurrency(ord.total)} (COD)</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'CRAFTING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-linen-deep text-ink'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 text-xs">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-ink">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-terracotta">{item.quantity}x</span>
                          <span className="font-medium">{item.product?.title || 'Handmade Item'}</span>
                        </div>
                        <span className="text-ink-muted">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Destination */}
                  <div className="pt-2 border-t border-linen-deep text-xs text-ink-muted flex items-start gap-2">
                    <Truck className="w-3.5 h-3.5 text-sage-deep shrink-0 mt-0.5" />
                    <span>
                      Delivering to: {ord.customer.streetAddress}, {ord.customer.city} · {ord.customer.phoneNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Liked Treasures / Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {likedProducts.length === 0 ? (
            <div className="py-12 text-center bg-linen-light rounded-organic-xl border border-linen-deep space-y-3">
              <Heart className="w-8 h-8 text-ink-faint mx-auto" />
              <h3 className="font-serif text-base font-semibold text-ink">No Saved Treasures</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Tap the heart icon on any handmade crochet flowers or paintings to save them to your wishlist.
              </p>
              <Link to="/products" className="btn-primary text-xs py-2 px-5 inline-block mt-2">
                Discover Treasures
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {likedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} aspectRatioClass="aspect-[4/5]" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Delivery Address */}
      {activeTab === 'address' && (
        <div className="bg-linen-light rounded-organic-xl p-6 border border-linen-deep shadow-subtle space-y-4 max-w-lg">
          <h3 className="font-serif text-base font-semibold text-ink">Saved Cash on Delivery Address</h3>
          <div className="space-y-2 text-xs text-ink-muted">
            <p><strong>Recipient:</strong> {user.name}</p>
            <p><strong>Contact Phone:</strong> {user.phone || '+92 (300) 123-4567'}</p>
            <p><strong>Address:</strong> {user.savedAddress?.streetAddress || 'House 42, Sector F-7/2'}</p>
            <p><strong>City:</strong> {user.savedAddress?.city || 'Islamabad'}</p>
            <p><strong>Postal Code:</strong> {user.savedAddress?.postalCode || '44000'}</p>
          </div>
          <p className="text-[11px] text-ink-faint">
            ℹ️ This address is automatically filled during Cash on Delivery checkout.
          </p>
        </div>
      )}
    </div>
  );
};
