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

          {/* Right Visual Featured Hero Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-organic-xl overflow-hidden border border-linen-deep shadow-md bg-white">
              <div className="aspect-16/10 sm:aspect-16/9 w-full overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisanal Handcrafted Creations"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold w-fit mb-2 border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Featured Studio Collection</span>
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">
                    Eternal Cotton Roses & Handcrafted Treasures
                  </h3>
                  <p className="text-xs text-white/80 mt-1 max-w-md">
                    Individually hand-stitched by Pakistani artisans with pure combed cotton and textured oil paints.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Feature Strip */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAF7F2] border-t border-linen-deep text-center text-xs">
                <Link to="/products?category=crochet-flowers" className="p-2 rounded-lg bg-white border border-linen-deep hover:border-terracotta transition-colors">
                  <p className="font-serif font-bold text-ink truncate">Crochet Flowers</p>
                  <p className="text-[10px] text-terracotta">From Rs. 3,200</p>
                </Link>
                <Link to="/products?category=crochet-bags" className="p-2 rounded-lg bg-white border border-linen-deep hover:border-terracotta transition-colors">
                  <p className="font-serif font-bold text-ink truncate">Bags & Totes</p>
                  <p className="text-[10px] text-terracotta">From Rs. 4,200</p>
                </Link>
                <Link to="/products?category=crochet-keychains" className="p-2 rounded-lg bg-white border border-linen-deep hover:border-terracotta transition-colors">
                  <p className="font-serif font-bold text-ink truncate">Keychains</p>
                  <p className="text-[10px] text-terracotta">From Rs. 1,800</p>
                </Link>
                <Link to="/custom-commissions" className="p-2 rounded-lg bg-white border border-linen-deep hover:border-terracotta transition-colors">
                  <p className="font-serif font-bold text-ink truncate">Custom Portraits</p>
                  <p className="text-[10px] text-terracotta">Original Oils</p>
                </Link>
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

      {/* 3. PROFESSIONAL E-COMMERCE PRODUCT GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex items-center justify-between border-b border-linen-deep/60 pb-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Featured Handcrafted Catalog
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">Authentic artisan creations ready to cherish and gift</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1">
            <span>Explore All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingPieces.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              aspectRatioClass="aspect-[4/5]"
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
