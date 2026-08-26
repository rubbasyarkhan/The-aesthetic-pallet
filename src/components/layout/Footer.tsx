import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Leaf, 
  Mail, 
  MessageCircle,
  PackageCheck
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-linen-surface text-ink pt-12 sm:pt-16 pb-8 border-t border-linen-deep mt-16">
      {/* 1. Top Modern Trust Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-10 sm:pb-12 border-b border-linen-deep">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs text-ink-muted">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-terracotta" />
            <div>
              <p className="font-semibold text-ink">100% Handmade</p>
              <p className="text-[11px] text-ink-muted">Crochet & oil art</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sage-deep" />
            <div>
              <p className="font-semibold text-ink">Cash on Delivery</p>
              <p className="text-[11px] text-ink-muted">Pay upon doorstep arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-terracotta" />
            <div>
              <p className="font-semibold text-ink">Free Gift Packaging</p>
              <p className="text-[11px] text-ink-muted">Wax seal & seed paper</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Leaf className="w-5 h-5 text-sage-deep" />
            <div>
              <p className="font-semibold text-ink">Organic Fibers</p>
              <p className="text-[11px] text-ink-muted">OEKO-TEX combed cotton</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Navigation Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <img
              src="/logo/logo.png"
              alt="The Aesthetic Palette"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              An artisanal workshop dedicated to everlasting crochet flowers, soft cotton wearables, and bespoke oil portraits of the ones you love.
            </p>
            <div className="text-[11px] text-ink-faint pt-2 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-terracotta" /> hello@theaestheticpalette.com
              </p>
              <p className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-sage-deep" /> WhatsApp Studio Support: +1 (555) 342-8821
              </p>
            </div>
          </div>

          {/* Quick Shop Col */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink">Shop Drops</h4>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li><Link to="/products?category=crochet-flowers" className="hover:text-terracotta transition-colors">Crochet Roses</Link></li>
              <li><Link to="/products?category=crochet-keychains" className="hover:text-terracotta transition-colors">Keychains & Clips</Link></li>
              <li><Link to="/products?category=crochet-wear" className="hover:text-terracotta transition-colors">Cloud Sweaters</Link></li>
              <li><Link to="/products?category=paintings" className="hover:text-terracotta transition-colors">Oil Paintings</Link></li>
              <li><Link to="/custom-commissions" className="hover:text-terracotta transition-colors">Custom Portraits</Link></li>
            </ul>
          </div>

          {/* Occasion Gifts Col */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink">Gift Specials</h4>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li><Link to="/products?occasion=birthday" className="hover:text-terracotta transition-colors">Birthday Gifts</Link></li>
              <li><Link to="/products?occasion=housewarming" className="hover:text-terracotta transition-colors">Housewarming</Link></li>
              <li><Link to="/products?occasion=welcome-gifts" className="hover:text-terracotta transition-colors">Welcome Baby/Home</Link></li>
              <li><Link to="/products?occasion=anniversary-love" className="hover:text-terracotta transition-colors">Love & Keepsakes</Link></li>
              <li><Link to="/about" className="hover:text-terracotta transition-colors">Our Craft Story</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink">Studio Journal</h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Get notified of seasonal flower drops and secret handmade previews.
            </p>

            {subscribed ? (
              <div className="p-3 bg-sage/20 border border-sage/40 rounded text-xs text-sage-deep flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-deep shrink-0" />
                <span>Thank you! We've saved your spot in the circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex rounded-organic overflow-hidden border border-linen-dark bg-white focus-within:border-terracotta transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-3 py-2 text-xs text-ink bg-transparent focus:outline-none placeholder:text-ink-faint"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-terracotta text-white hover:bg-terracotta-dark transition-colors text-xs font-semibold"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-ink-faint flex items-center gap-1">
                  <Heart className="w-3 h-3 text-blush-dark fill-blush-dark" /> No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. MASSIVE BRAND TYPOGRAPHY */}
      <div className="w-full border-t border-b border-linen-deep py-6 sm:py-8 my-4 overflow-hidden select-none bg-linen-muted/40">
        <div className="w-full text-center">
          <p className="font-serif font-black text-3xl sm:text-5xl md:text-7xl lg:text-[7.5vw] tracking-tight uppercase text-ink-sepia/10 leading-none whitespace-nowrap px-4 hover:text-ink-sepia/20 transition-colors duration-300">
            THE AESTHETIC PALETTE
          </p>
        </div>
      </div>

      {/* 4. Bottom Modern Copyright & Badges */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-faint gap-3">
        <p>© {new Date().getFullYear()} The Aesthetic Palette. Slow-crafted with intention.</p>
        <div className="flex items-center gap-4">
          <span>Nationwide Cash on Delivery</span>
          <span>•</span>
          <span>Zero Plastic Waste</span>
          <span>•</span>
          <span>GOTS Certified Organic</span>
        </div>
      </div>
    </footer>
  );
};
