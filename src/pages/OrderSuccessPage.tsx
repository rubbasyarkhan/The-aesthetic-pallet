import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Truck, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useProducts();
  const { formatCurrency } = useCart();

  const foundOrder = orders.find((o) => o.orderId === orderId);

  const customer = foundOrder?.customer || {
    fullName: 'Valued Client',
    phoneNumber: '+92 (300) 000-0000',
    streetAddress: 'Your Delivery Address',
    city: 'Islamabad',
    postalCode: '44000',
    paymentMethod: 'COD' as const
  };

  const displayOrderId = foundOrder?.orderId || orderId || 'TAP-COD-98214';
  const displayTotal = foundOrder?.total || 4800;
  const createdAt = foundOrder?.createdAt || new Date().toISOString();

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-sage/20 text-sage-deep mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="badge-ready text-xs font-semibold px-3 py-1 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sage-deep" /> Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-semibold">
            Thank you, {customer.fullName.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            We have received your custom order ticket. Your artisan has received the order slip and is preparing the yarn & pigments.
          </p>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="max-w-2xl mx-auto bg-linen-light rounded-organic-2xl p-6 sm:p-8 border border-linen-deep shadow-subtle space-y-6">
        {/* Order Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-linen-deep text-xs">
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Order Reference</span>
            <span className="font-mono font-bold text-terracotta text-sm">{displayOrderId}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Order Date</span>
            <span className="font-medium text-ink">{formattedDate}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Payment Status</span>
            <span className="font-semibold text-sage-deep flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Cash on Delivery ({formatCurrency(displayTotal)})
            </span>
          </div>
        </div>

        {/* Timeline Status */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-semibold text-ink">Handcrafting & Delivery Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-linen rounded border border-linen-dark space-y-1">
              <span className="font-bold text-terracotta flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 1. Verification
              </span>
              <p className="text-[11px] text-ink-muted">WhatsApp/SMS confirmation sent before dispatch.</p>
            </div>
            <div className="p-3 bg-linen rounded border border-linen-dark space-y-1">
              <span className="font-bold text-ink flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-ochre-dark" /> 2. Slow Crafting
              </span>
              <p className="text-[11px] text-ink-muted">Hand-hooked stitches & palette painting.</p>
            </div>
            <div className="p-3 bg-linen rounded border border-linen-dark space-y-1">
              <span className="font-bold text-ink flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-sage-deep" /> 3. Doorstep Arrival
              </span>
              <p className="text-[11px] text-ink-muted">Inspect package and pay cash to the courier.</p>
            </div>
          </div>
        </div>

        {/* Delivery Address & Contact */}
        <div className="p-4 bg-linen rounded border border-linen-deep text-xs space-y-2">
          <h4 className="font-serif font-semibold text-ink">Delivery Destination:</h4>
          <p className="text-ink-muted leading-relaxed">
            {customer.fullName} · {customer.phoneNumber}<br />
            {customer.streetAddress}, {customer.city}, {customer.postalCode}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            to="/products"
            className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 flex items-center justify-center gap-1.5"
          >
            <span>Explore More Creations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/account"
            className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-6 flex items-center justify-center"
          >
            Track in Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};
