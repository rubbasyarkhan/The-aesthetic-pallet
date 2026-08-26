import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Leaf, Palette, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 space-y-12">
      {/* Visual Header */}
      <div className="text-center space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta bg-linen-surface px-3 py-1 rounded-full border border-linen-deep inline-block">
          Our Craft
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
          Slow, Mindful Making in a Fast World.
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
          Every piece is crafted by single hands using organic cotton yarns and heavy artist oil pigments.
        </p>
      </div>

      {/* Visual Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        <div className="aspect-4/5 rounded-organic-xl overflow-hidden shadow-subtle border border-linen-deep">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
            alt="Studio Portrait"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between space-y-6 p-6 sm:p-10 bg-linen-surface rounded-organic-xl border border-linen-deep">
          <div className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink">
              From Skein to Finished Treasure
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              We started The Aesthetic Palette because we wanted items that feel personal, tactile, and full of heart. No mass factory batches. When you place an order, we hand-hook the crochet stitches or prepare the raw Belgian linen canvas specifically for you.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-linen-deep text-xs text-ink-light">
            <p className="flex items-center gap-2.5">
              <Leaf className="w-4 h-4 text-sage-deep" /> 100% GOTS Organic Combed Cotton
            </p>
            <p className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-terracotta" /> Heavy Impasto Oil Paint on Belgian Linen
            </p>
            <p className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-blush-dark" /> Plantable Wildflower Seed Paper in every box
            </p>
            <p className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sage-deep" /> Zero Risk: Cash on Delivery
            </p>
          </div>

          <div className="pt-2">
            <Link to="/products" className="btn-primary text-xs font-semibold py-3 px-6 flex items-center justify-center gap-2 w-full shadow-sm">
              <span>Browse Our Creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
