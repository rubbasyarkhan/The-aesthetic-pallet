import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag, Sparkles, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 text-center space-y-8 min-h-[65vh] flex flex-col items-center justify-center">
      {/* 404 Visual Chip */}
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-linen-surface border border-linen-deep mx-auto flex items-center justify-center text-terracotta shadow-subtle">
          <Compass className="w-8 h-8 text-terracotta animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full inline-block">
            Page Not Found · 404
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-semibold leading-tight">
            Oops, this cozy corner doesn't exist.
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been moved, renamed, or is currently being hand-stitched in our studio.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="btn-primary text-xs sm:text-sm font-semibold py-3 px-6 flex items-center gap-2 shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/products"
          className="btn-secondary text-xs sm:text-sm font-medium py-3 px-6 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Shop Creations</span>
        </Link>
      </div>

      {/* Micro Studio Help Note */}
      <div className="pt-6 border-t border-linen-deep text-xs text-ink-faint flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-terracotta" />
        <span>Looking for a bespoke request? Try our <Link to="/custom-commissions" className="text-terracotta font-semibold hover:underline">Custom Commission Desk</Link></span>
      </div>
    </div>
  );
};
