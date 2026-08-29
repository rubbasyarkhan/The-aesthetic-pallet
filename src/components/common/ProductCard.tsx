import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  aspectRatioClass?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
}) => {
  const { addToCart, formatCurrency } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const [selectedColor] = useState(product?.colorways?.[0]?.name || '');
  const [isAdded, setIsAdded] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85';
  const initialImage = (product?.images && product.images.length > 0 && product.images[0]) 
    ? product.images[0] 
    : defaultImage;
  const [imgSrc, setImgSrc] = useState(initialImage);

  const liked = isLiked(product?.id || '');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, {
      colorway: selectedColor,
      size: product?.sizes ? product.sizes[0] : undefined
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-organic-lg overflow-hidden border border-linen-deep/80 shadow-2xs hover:shadow-soft transition-all duration-300">
      {/* 100% Exact Same Height Image Container */}
      <Link
        to={`/products/${product.id}`}
        className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden bg-linen-surface block shrink-0"
      >
        <img
          src={imgSrc}
          alt={product.title || 'Handmade Creation'}
          loading="lazy"
          onError={() => setImgSrc(defaultImage)}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.isMadeToOrder ? (
            <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-ink shadow-2xs">
              Made to Order
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full bg-sage-deep text-white shadow-2xs">
              Ready to Ship
            </span>
          )}
        </div>

        {/* Heart Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-ink-muted hover:text-terracotta transition-all shadow-2xs active:scale-90"
          aria-label="Save item"
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'text-terracotta fill-terracotta' : ''}`} />
        </button>

        {/* Quick Add Pill */}
        <div className="absolute bottom-2.5 right-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end">
          <button
            onClick={handleQuickAdd}
            className="py-1.5 px-3 rounded-full bg-ink text-white text-xs font-semibold hover:bg-terracotta shadow-md flex items-center gap-1.5 transition-colors active:scale-95"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add (COD)</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Structured, Aligned Info Block */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2 bg-white">
        <div className="space-y-1">
          <div className="h-5 flex items-center justify-between text-[10px] text-ink-muted">
            <span className="uppercase font-bold tracking-wider text-terracotta/90 truncate">
              {(product.category || 'Handcrafted').replace('-', ' ')}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                ★ {product.rating.toFixed(1)} {product.reviewCount ? `(${product.reviewCount})` : ''}
              </span>
            )}
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-terracotta transition-colors">
            <h3 className="h-10 font-serif text-xs sm:text-sm font-semibold text-ink line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="h-4 text-[11px] text-ink-muted line-clamp-1 leading-tight truncate">
            {product.tagline || product.shortDescription}
          </p>
        </div>

        {/* Pricing in Pakistani Rupees (Rs.) */}
        <div className="h-9 flex items-center justify-between pt-2 border-t border-linen-deep/60">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-ink-faint line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-sage-deep font-semibold tracking-wide bg-sage/10 px-2 py-0.5 rounded-full shrink-0">
            {product.craftTimeHours}h craft
          </span>
        </div>
      </div>
    </div>
  );
};
