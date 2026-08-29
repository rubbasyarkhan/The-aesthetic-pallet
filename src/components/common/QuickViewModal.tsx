import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatCurrency } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentColor = selectedColor || product?.colorways?.[0]?.name || '';
  const currentSize = selectedSize || (product?.sizes ? product.sizes[0] : '');

  const handleAdd = () => {
    addToCart(product, 1, {
      colorway: currentColor,
      size: currentSize
    });
    setQuickViewProduct(null);
  };

  const defaultImg = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85';
  const currentImg = product?.images?.[activeImageIndex] || product?.images?.[0] || defaultImg;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-ink-sepia/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-linen-light rounded-organic-xl shadow-float max-w-3xl w-full overflow-hidden border border-linen-deep z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery */}
          <div className="p-4 sm:p-6 bg-linen flex flex-col justify-between space-y-4">
            <div className="aspect-4/5 rounded-organic overflow-hidden bg-linen-surface border border-linen-deep/80">
              <img
                src={currentImg}
                alt={product?.title || 'Handmade Item'}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {product?.images && product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-14 rounded-organic-sm overflow-hidden border transition-all ${
                      activeImageIndex === idx
                        ? 'border-terracotta ring-1 ring-terracotta'
                        : 'border-linen-dark opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {product.isMadeToOrder ? (
                  <span className="badge-custom text-[10px] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-terracotta" /> Made to Order
                  </span>
                ) : (
                  <span className="badge-ready text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-sage-deep" /> Ready to Ship
                  </span>
                )}
                <span className="text-[11px] text-ink-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {product.leadTimeText}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-semibold text-ink leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-terracotta font-medium italic mt-0.5">
                  {product.tagline}
                </p>
              </div>

              {/* Price in Rs. */}
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-bold text-ink">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-ink-faint line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] text-sage-deep bg-sage/20 px-1.5 py-0.5 rounded font-medium ml-1">
                  Cash on Delivery
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Colorways */}
              {product.colorways && product.colorways.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-linen-deep">
                  <label className="block text-xs font-semibold text-ink">
                    Available Shades: <span className="font-normal text-terracotta">{currentColor}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.colorways.map((col: { name: string; hex: string }) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-organic border transition-all text-xs ${
                          currentColor === col.name
                            ? 'border-terracotta bg-linen-surface font-semibold text-terracotta ring-1 ring-terracotta shadow-2xs'
                            : 'border-linen-dark bg-white text-ink hover:bg-linen-surface'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizing if applicable */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-ink">Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz: string) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-1 px-2.5 rounded text-xs border transition-colors ${
                          currentSize === sz
                            ? 'bg-terracotta text-white border-terracotta font-semibold'
                            : 'bg-linen-surface text-ink border-linen-dark hover:bg-linen-deep'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal CTAs */}
            <div className="space-y-2 pt-3 border-t border-linen-deep">
              <button
                onClick={handleAdd}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag ({formatCurrency(product.price)})</span>
              </button>
              
              <Link
                to={`/products/${product.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-xs text-center block text-ink-muted hover:text-terracotta hover:underline font-medium"
              >
                View Full Details & Customization Options →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
