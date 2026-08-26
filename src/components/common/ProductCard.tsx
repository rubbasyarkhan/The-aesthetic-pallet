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
  aspectRatioClass = 'aspect-4/5' 
}) => {
  const { addToCart, formatCurrency } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const [selectedColor] = useState(product.colorways[0]?.name || '');
  const [isAdded, setIsAdded] = useState(false);

  const liked = isLiked(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, {
      colorway: selectedColor,
      size: product.sizes ? product.sizes[0] : undefined
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-organic-lg overflow-hidden border border-linen-deep/60 shadow-2xs hover:shadow-soft transition-all duration-300">
      {/* Visual Container */}
      <Link
        to={`/products/${product.id}`}
        className={`relative ${aspectRatioClass} w-full overflow-hidden bg-linen-surface block`}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.isMadeToOrder ? (
            <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-ink shadow-2xs">
              Made to Order
            </span>
          ) : (
            <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-sage/90 text-white shadow-2xs">
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
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-ink-muted hover:text-terracotta transition-all shadow-2xs active:scale-90"
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

      {/* Info Block */}
      <div className="p-3.5 space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <Link to={`/products/${product.id}`} className="block group-hover:text-terracotta transition-colors flex-1 min-w-0">
            <h3 className="font-serif text-sm font-semibold text-ink truncate">
              {product.title}
            </h3>
          </Link>
        </div>

        <p className="text-[11px] text-ink-muted line-clamp-1">
          {product.tagline || product.shortDescription}
        </p>

        {/* Pricing in Pakistani Rupees (Rs.) */}
        <div className="flex items-center justify-between pt-1 border-t border-linen-deep/40">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-xs text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-ink-faint line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-terracotta font-medium tracking-wide">
            {product.craftTimeHours}h craft
          </span>
        </div>
      </div>
    </div>
  );
};
