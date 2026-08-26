import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Gift, 
  Sparkles,
  Home,
  Package,
  Smile,
  Flower2,
  Key,
  Shirt,
  Palette
} from 'lucide-react';
import { OCCASIONS_LIST } from '../data/products';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const { products } = useProducts();
  const trendingPieces = products.slice(0, 8);

  const getOccasionIcon = (id: string) => {
    switch (id) {
      case 'birthday':
        return <Gift className="w-5 h-5 text-terracotta" />;
      case 'housewarming':
        return <Home className="w-5 h-5 text-sage-deep" />;
      case 'welcome-gifts':
        return <Package className="w-5 h-5 text-ochre-dark" />;
      case 'anniversary-love':
        return <Heart className="w-5 h-5 text-blush-dark" />;
      case 'self-care':
        return <Smile className="w-5 h-5 text-terracotta" />;
      default:
        return <Sparkles className="w-5 h-5 text-terracotta" />;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. EXPANSIVE FULL-WIDTH HERO */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
        <div className="bg-linen-surface rounded-organic-2xl p-6 sm:p-10 lg:p-12 border border-linen-deep/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-subtle">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-terracotta bg-white px-3.5 py-1 rounded-full border border-linen-deep">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handmade with love</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink leading-tight">
              Slow-crafted treasures for your cozy spaces.
            </h1>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-lg">
              Everlasting crochet roses, strawberry keychains, cloud cardigans, and textured oil portraits of the ones you love.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/products" className="btn-primary text-xs sm:text-sm font-semibold py-3 px-6 flex items-center gap-2 shadow-sm">
                <span>Explore Shop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/custom-commissions" className="btn-secondary text-xs sm:text-sm font-medium py-3 px-5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Custom Order</span>
              </Link>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-3 flex items-center gap-5 text-xs text-ink-muted font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sage-deep" /> Cash on Delivery
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-terracotta" /> Free Gift Packaging
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-blush-dark fill-blush-dark" /> 100% Cotton & Oils
              </span>
            </div>
          </div>

          {/* Right Visual Pinterest Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square rounded-organic-xl overflow-hidden border border-linen-deep shadow-2xs group relative">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=85"
                  alt="Forever Roses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-organic-sm text-[11px] font-semibold text-ink text-center shadow-2xs flex items-center justify-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5 text-terracotta" />
                  <span>Forever Crochet Roses</span>
                </div>
              </div>
              <div className="aspect-4/3 rounded-organic-xl overflow-hidden border border-linen-deep shadow-2xs group relative">
                <img
                  src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=600&q=85"
                  alt="Strawberry Charm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-organic-sm text-[11px] font-semibold text-ink text-center shadow-2xs flex items-center justify-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-terracotta" />
                  <span>Keychains & Clips</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
              <div className="aspect-4/3 rounded-organic-xl overflow-hidden border border-linen-deep shadow-2xs group relative">
                <img
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=85"
                  alt="Cloud Cardigan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-organic-sm text-[11px] font-semibold text-ink text-center shadow-2xs flex items-center justify-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-terracotta" />
                  <span>Cloud Cardigans</span>
                </div>
              </div>
              <div className="aspect-square rounded-organic-xl overflow-hidden border border-linen-deep shadow-2xs group relative">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=85"
                  alt="Custom Oil Portrait"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-organic-sm text-[11px] font-semibold text-ink text-center shadow-2xs flex items-center justify-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-terracotta" />
                  <span>Loved Ones Portraits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OCCASION STORY BUBBLES */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {OCCASIONS_LIST.map((occ) => (
            <Link
              key={occ.id}
              to={occ.id === 'all' ? '/products' : `/products?occasion=${occ.id}`}
              className="p-3.5 rounded-organic-lg bg-white border border-linen-deep/80 hover:border-terracotta transition-all text-center space-y-1.5 shadow-2xs group flex flex-col items-center justify-center"
            >
              <div className="w-9 h-9 rounded-full bg-linen-surface group-hover:bg-terracotta/10 flex items-center justify-center transition-colors">
                {getOccasionIcon(occ.id)}
              </div>
              <p className="font-serif text-xs font-semibold text-ink group-hover:text-terracotta leading-tight truncate w-full">
                {occ.label}
              </p>
              <p className="text-[10px] text-ink-faint leading-tight truncate w-full">{occ.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PINTEREST-STYLE PRODUCT GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
              Trending Handmade Pieces
            </h2>
            <p className="text-xs text-ink-muted">Popular creations ready to cherish</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-terracotta hover:underline">
            View All ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingPieces.map((p, idx) => (
            <ProductCard
              key={p.id}
              product={p}
              aspectRatioClass={idx % 2 === 0 ? 'aspect-4/5' : 'aspect-square'}
            />
          ))}
        </div>
      </section>

      {/* 4. CLEAN CUSTOM COMMISSION BANNER */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-linen-surface rounded-organic-2xl p-6 sm:p-10 text-ink flex flex-col sm:flex-row items-center justify-between gap-6 shadow-subtle border border-linen-deep">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-white px-2.5 py-0.5 rounded-full inline-block border border-linen-deep">
              Bespoke Studio Order
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-ink font-semibold">
              Want a Portrait of Your Loved One or a Custom Colorway?
            </h3>
            <p className="text-xs text-ink-muted">
              Send us your reference photo. We review details with you over WhatsApp. Pay Cash on Delivery.
            </p>
          </div>
          <Link
            to="/custom-commissions"
            className="btn-primary text-xs font-semibold py-3 px-7 shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Custom Order</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
