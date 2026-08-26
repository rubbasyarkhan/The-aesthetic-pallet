import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const NotificationToast: React.FC = () => {
  const { toast, dismissToast, openCart } = useCart();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-organic-md shadow-float border border-linen-deep p-3.5 flex items-center gap-3.5"
      >
        {toast.image ? (
          <img
            src={toast.image}
            alt=""
            className="w-12 h-12 object-cover rounded-organic-sm bg-linen-surface shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-sage-deep" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ink">{toast.title}</p>
          <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">{toast.message}</p>
          <button
            onClick={() => {
              dismissToast();
              openCart();
            }}
            className="text-[11px] font-semibold text-terracotta hover:underline mt-1 inline-flex items-center gap-1"
          >
            <ShoppingBag className="w-3 h-3" /> View Bag & Checkout (COD)
          </button>
        </div>

        <button
          onClick={dismissToast}
          className="p-1 text-ink-faint hover:text-ink transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
