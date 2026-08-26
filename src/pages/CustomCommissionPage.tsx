import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Flower2, 
  Shirt, 
  Home 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';

export const CustomCommissionPage: React.FC = () => {
  const { addToCart } = useCart();
  const [commissionType, setCommissionType] = useState<'portrait' | 'roses' | 'crochet' | 'housewarming'>('portrait');
  const [customDetails, setCustomDetails] = useState('');
  const [paletteWish, setPaletteWish] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const targetProduct = commissionType === 'portrait' 
      ? PRODUCTS.find(p => p.id === 'custom-loved-ones-portrait')!
      : commissionType === 'roses'
      ? PRODUCTS.find(p => p.id === 'crochet-forever-roses')!
      : commissionType === 'housewarming'
      ? PRODUCTS.find(p => p.id === 'housewarming-wildflower-painting')!
      : PRODUCTS.find(p => p.id === 'crochet-cloud-sweater')!;

    addToCart(targetProduct, 1, {
      colorway: 'Custom Bespoke Request',
      customMeasurements: `Request: ${customDetails} | Tones: ${paletteWish}`
    });

    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="badge-leadtime text-xs font-semibold px-3 py-1">
          Bespoke Studio Orders
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
          Create a Custom One-of-a-Kind Piece
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Portraits of loved ones, custom flower colors, or tailored crochet sizing. We review your request and photos over WhatsApp before crafting!
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-linen-light rounded-organic-xl border border-linen-deep text-center space-y-4 shadow-soft max-w-2xl mx-auto"
        >
          <div className="w-14 h-14 rounded-full bg-sage/20 text-sage-deep mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-ink">Custom Ticket Added to Your Bag!</h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            Your bespoke custom order is ready in your shopping bag. You can confirm it with <strong>Cash on Delivery (COD)</strong>. We will message your WhatsApp ({phone}) to review your photos before we start handcrafting.
          </p>
          <div className="pt-2">
            <button
              onClick={() => (window.location.href = '/products')}
              className="btn-primary text-xs py-2.5 px-6"
            >
              Continue Browsing Studio
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-linen-light rounded-organic-2xl p-6 sm:p-10 border border-linen-deep shadow-subtle space-y-6">
          {/* Visual Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2.5">
              1. What would you like us to create?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setCommissionType('portrait')}
                className={`p-3.5 rounded-organic border text-center transition-all flex flex-col items-center justify-center ${
                  commissionType === 'portrait'
                    ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-xs'
                    : 'border-linen-dark bg-linen hover:bg-linen-surface'
                }`}
              >
                <Heart className="w-6 h-6 text-terracotta mb-1" />
                <p className="font-serif text-xs font-bold text-ink">Loved Ones / Pet Portrait</p>
                <p className="text-[10px] text-ink-muted mt-0.5">From $185</p>
              </button>

              <button
                type="button"
                onClick={() => setCommissionType('roses')}
                className={`p-3.5 rounded-organic border text-center transition-all flex flex-col items-center justify-center ${
                  commissionType === 'roses'
                    ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-xs'
                    : 'border-linen-dark bg-linen hover:bg-linen-surface'
                }`}
              >
                <Flower2 className="w-6 h-6 text-terracotta mb-1" />
                <p className="font-serif text-xs font-bold text-ink">Custom Color Roses</p>
                <p className="text-[10px] text-ink-muted mt-0.5">From $48</p>
              </button>

              <button
                type="button"
                onClick={() => setCommissionType('crochet')}
                className={`p-3.5 rounded-organic border text-center transition-all flex flex-col items-center justify-center ${
                  commissionType === 'crochet'
                    ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-xs'
                    : 'border-linen-dark bg-linen hover:bg-linen-surface'
                }`}
              >
                <Shirt className="w-6 h-6 text-terracotta mb-1" />
                <p className="font-serif text-xs font-bold text-ink">Custom Fit Crochet</p>
                <p className="text-[10px] text-ink-muted mt-0.5">From $135</p>
              </button>

              <button
                type="button"
                onClick={() => setCommissionType('housewarming')}
                className={`p-3.5 rounded-organic border text-center transition-all flex flex-col items-center justify-center ${
                  commissionType === 'housewarming'
                    ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-xs'
                    : 'border-linen-dark bg-linen hover:bg-linen-surface'
                }`}
              >
                <Home className="w-6 h-6 text-terracotta mb-1" />
                <p className="font-serif text-xs font-bold text-ink">Housewarming Canvas</p>
                <p className="text-[10px] text-ink-muted mt-0.5">From $165</p>
              </button>
            </div>
          </div>

          {/* Prompt Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Preferred Color Tones
              </label>
              <input
                type="text"
                value={paletteWish}
                onChange={(e) => setPaletteWish(e.target.value)}
                placeholder="e.g. Sage green & blush, or warm sunset terracotta..."
                className="w-full px-3 py-2 text-xs rounded border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Target Date / Occasion
              </label>
              <input
                type="text"
                placeholder="e.g. Birthday gift, anniversary..."
                className="w-full px-3 py-2 text-xs rounded border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Details & Photo Notes <span className="text-terracotta">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={customDetails}
              onChange={(e) => setCustomDetails(e.target.value)}
              placeholder="Tell us about the pet portrait photo, desired crochet measurements, or special colors..."
              className="w-full p-2.5 text-xs rounded border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta resize-none"
            />
          </div>

          {/* Contact Details */}
          <div className="pt-3 border-t border-linen-deep space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              2. Your Contact for WhatsApp Photo Review
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Olivia Wilde"
                  className="w-full px-3 py-2 text-xs rounded border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 342-9988"
                  className="w-full px-3 py-2 text-xs rounded border border-linen-dark bg-linen text-ink focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ink-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sage-deep" /> Zero upfront payment · Pay Cash on Delivery
            </p>
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto text-xs font-semibold py-3 px-8 shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Custom Order to Bag (COD)</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
