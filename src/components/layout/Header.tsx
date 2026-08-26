import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User as UserIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { totalItemsCount, openCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Custom Request', path: '/custom-commissions' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-linen/90 backdrop-blur-md border-b border-linen-deep/60">
      {/* Top Simple Micro-Bar */}
      <div className="bg-ink-sepia text-linen-light text-[11px] py-1.5 px-4 text-center tracking-wider font-medium">
        Handmade with love · Cash on Delivery nationwide
      </div>

      {/* Main Clean Navbar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-ink hover:text-terracotta transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-ink-muted hover:text-ink transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo/logo.png"
              alt="The Aesthetic Palette"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </Link>

          {/* Center: Clean Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-ink-light">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors py-1 relative hover:text-terracotta ${
                    isActive ? 'text-terracotta font-bold' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-terracotta rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Account & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-linen-deep hover:border-terracotta bg-white text-xs font-medium text-ink transition-all"
                title="Your Account"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-linen-dark bg-white hover:bg-linen-surface text-xs font-semibold text-ink transition-all active:scale-95"
              >
                <UserIcon className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Clean Bag Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-full bg-ink text-white hover:bg-ink-sepia text-xs font-semibold transition-all active:scale-95 shadow-xs"
              aria-label={`Open bag, ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-linen-light" />
              <span>Bag ({totalItemsCount})</span>
            </button>
          </div>
        </div>

        {/* Clean Search Input */}
        {searchOpen && (
          <div className="border-t border-linen-deep/60 py-3 animate-fade-in">
            <div className="max-w-md mx-auto flex items-center gap-2 bg-white px-3 py-1.5 rounded-organic border border-linen-dark">
              <Search className="w-4 h-4 text-ink-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                placeholder="Search roses, strawberry keychain, sweater, portraits..."
                className="w-full bg-transparent border-none text-xs text-ink placeholder:text-ink-faint focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-semibold text-terracotta hover:underline ml-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-linen-deep/60 bg-linen/98 backdrop-blur-lg px-6 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-serif text-ink border-b border-linen-deep/40"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
