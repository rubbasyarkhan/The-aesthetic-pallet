import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  User as UserIcon,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CheckoutFormData } from '../../types';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    total,
    formatCurrency,
    placeCashOnDeliveryOrder
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    apartmentSuite: '',
    city: '',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'COD'
  });

  // Pre-fill user information if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phoneNumber: prev.phoneNumber || user.phone || '',
        streetAddress: prev.streetAddress || user.savedAddress?.streetAddress || '',
        apartmentSuite: prev.apartmentSuite || user.savedAddress?.apartmentSuite || '',
        city: prev.city || user.savedAddress?.city || '',
        postalCode: prev.postalCode || user.savedAddress?.postalCode || ''
      }));
    }
  }, [user, isCartOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleStartCheckout = () => {
    if (!user) {
      openAuthModal(() => {
        setIsCheckingOut(true);
      });
    } else {
      setIsCheckingOut(true);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required for delivery confirmation';
    } else if (formData.phoneNumber.replace(/\D/g, '').length < 8) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.streetAddress.trim()) errors.streetAddress = 'Delivery street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const order = placeCashOnDeliveryOrder(formData);
      setIsCheckingOut(false);
      navigate(`/order-success?orderId=${order.orderId}`);
    } catch (err) {
      console.error('Order submission error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-ink-sepia/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-linen-light shadow-drawer flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-linen-deep flex items-center justify-between bg-linen">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-terracotta" />
                  <h3 className="font-serif text-lg font-semibold text-ink">
                    {isCheckingOut ? 'Cash on Delivery Checkout' : 'Your Curated Bag'}
                  </h3>
                  <span className="text-xs font-medium text-ink-muted bg-linen-deep px-2 py-0.5 rounded-full">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-linen-deep transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Gift Notice */}
              <div className="px-5 py-3 bg-linen-surface border-b border-linen-deep flex items-center justify-between text-xs">
                <span className="font-medium text-ink flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                  <span>Free Seed Paper Note & Wax-Sealed Parcel</span>
                </span>
                <span className="text-[11px] font-bold text-sage-deep">Complimentary</span>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-linen-deep mx-auto flex items-center justify-center text-ink-muted">
                      <ShoppingBag className="w-7 h-7 text-terracotta" />
                    </div>
                    <h4 className="font-serif text-lg font-medium text-ink">Your bag is empty</h4>
                    <p className="text-xs text-ink-muted max-w-xs mx-auto leading-relaxed">
                      Explore our hand-crocheted roses, charms, and oil paintings to start your slow craft collection.
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/products');
                      }}
                      className="btn-primary text-xs py-2.5 px-6"
                    >
                      Browse Creations
                    </button>
                  </div>
                ) : !isCheckingOut ? (
                  /* Cart Items List */
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-linen rounded-organic border border-linen-deep/80 flex gap-3.5 transition-all hover:border-linen-dark"
                      >
                        {/* Thumbnail */}
                        <img
                          src={(item.product?.images && item.product.images.length > 0) ? item.product.images[0] : 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85'}
                          alt={item.product?.title || 'Creation'}
                          className="w-20 h-24 object-cover rounded-organic-sm bg-linen-surface shrink-0 border border-linen-deep/60"
                        />

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-ink line-clamp-1 font-serif">
                                {item.product.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-ink-faint hover:text-terracotta transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Customization Badges */}
                            <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-ink-muted">
                              {item.customization.colorway && (
                                <span className="inline-block px-1.5 py-0.5 bg-linen-surface rounded text-ink-sepia border border-linen-deep">
                                  Color: {item.customization.colorway}
                                </span>
                              )}
                              {item.customization.size && (
                                <span className="inline-block px-1.5 py-0.5 bg-linen-surface rounded text-ink-sepia border border-linen-deep">
                                  Size: {item.customization.size}
                                </span>
                              )}
                            </div>

                            {/* Lead Time Note */}
                            <p className="text-[10px] text-sage-dark flex items-center gap-1 mt-1 font-medium">
                              <Clock className="w-3 h-3" />
                              {item.product.leadTimeText}
                            </p>
                          </div>

                          {/* Price & Quantity Stepper in PKR */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-linen-deep/60">
                            <span className="text-xs font-bold text-ink">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>

                            <div className="flex items-center border border-linen-dark rounded bg-linen-surface">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-linen-deep text-ink-muted hover:text-ink transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-ink min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-linen-deep text-ink-muted hover:text-ink transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Authentication Status Notice */}
                    {!user && (
                      <div className="p-3 bg-white rounded-organic border border-linen-deep text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-terracotta" />
                          <span className="text-ink-muted">Sign in required before order</span>
                        </div>
                        <button
                          onClick={() => openAuthModal()}
                          className="text-terracotta font-semibold hover:underline"
                        >
                          Sign In / Sign Up
                        </button>
                      </div>
                    )}

                    {/* Shipping Notice */}
                    <div className="p-3 bg-sage/10 rounded-organic border border-sage/20 text-xs text-sage-deep flex items-start gap-2.5">
                      <Truck className="w-4 h-4 text-sage-deep shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Complimentary Nationwide Delivery</span>
                        <p className="text-[11px] text-sage-dark mt-0.5">
                          Every parcel is safely packaged with lavender aroma and botanical wax seal.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cash on Delivery Checkout Form */
                  <form id="cod-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                    <div className="p-3 bg-terracotta/10 border border-terracotta/20 rounded-organic text-terracotta-dark flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Cash on Delivery (Signed in as {user?.name})</span>
                        <p className="text-[11px] text-terracotta-dark/90 mt-0.5">
                          Pay in cash when your handmade order arrives at your doorstep across Pakistan.
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Full Name <span className="text-terracotta">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Ayesha Khan"
                          className={`w-full px-3 py-2 rounded-organic-sm border ${
                            formErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-linen-dark'
                          } bg-linen focus:outline-none focus:border-terracotta text-ink`}
                        />
                        {formErrors.fullName && (
                          <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> {formErrors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Phone Number (WhatsApp / Mobile) <span className="text-terracotta">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. +92 (300) 123-4567"
                          className={`w-full px-3 py-2 rounded-organic-sm border ${
                            formErrors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-linen-dark'
                          } bg-linen focus:outline-none focus:border-terracotta text-ink`}
                        />
                        <span className="text-[10px] text-ink-muted">Used solely to confirm courier delivery</span>
                        {formErrors.phoneNumber && (
                          <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> {formErrors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Street Address & House / Flat No. <span className="text-terracotta">*</span>
                        </label>
                        <input
                          type="text"
                          name="streetAddress"
                          value={formData.streetAddress}
                          onChange={handleInputChange}
                          placeholder="e.g. House 42, Street 8, Sector F-7/2"
                          className={`w-full px-3 py-2 rounded-organic-sm border ${
                            formErrors.streetAddress ? 'border-red-400 bg-red-50/20' : 'border-linen-dark'
                          } bg-linen focus:outline-none focus:border-terracotta text-ink`}
                        />
                        {formErrors.streetAddress && (
                          <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> {formErrors.streetAddress}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-ink mb-1">
                            City <span className="text-terracotta">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Islamabad / Lahore"
                            className={`w-full px-3 py-2 rounded-organic-sm border ${
                              formErrors.city ? 'border-red-400 bg-red-50/20' : 'border-linen-dark'
                            } bg-linen focus:outline-none focus:border-terracotta text-ink`}
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-ink mb-1">
                            Postal Code <span className="text-terracotta">*</span>
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="44000"
                            className={`w-full px-3 py-2 rounded-organic-sm border ${
                              formErrors.postalCode ? 'border-red-400 bg-red-50/20' : 'border-linen-dark'
                            } bg-linen focus:outline-none focus:border-terracotta text-ink`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-ink mb-1">
                          Delivery Notes (Optional)
                        </label>
                        <textarea
                          rows={2}
                          name="deliveryNotes"
                          value={formData.deliveryNotes}
                          onChange={handleInputChange}
                          placeholder="e.g. Call before arrival..."
                          className="w-full px-3 py-2 rounded-organic-sm border border-linen-dark bg-linen focus:outline-none focus:border-terracotta text-ink text-xs resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-ink-muted hover:text-ink underline py-1"
                    >
                      ← Back to Bag review
                    </button>
                  </form>
                )}
              </div>

              {/* Drawer Footer & Checkout CTA */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-linen-deep bg-linen space-y-3">
                  {/* Totals Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-ink-muted">
                      <span>Subtotal</span>
                      <span className="font-semibold text-ink">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Nationwide Delivery</span>
                      <span className="text-sage-dark font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-linen-deep">
                      <span>Total (Cash on Delivery)</span>
                      <span className="text-terracotta-dark font-serif text-base">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  {!isCheckingOut ? (
                    <button
                      onClick={handleStartCheckout}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold shadow-md"
                    >
                      {!user && <Lock className="w-4 h-4" />}
                      <span>{!user ? 'Sign In & Proceed to COD' : 'Proceed to Cash on Delivery'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="cod-form"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold shadow-md disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Submitting COD Order Ticket...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm COD Order ({formatCurrency(total)})</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-3 text-[11px] text-ink-faint pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-sage" /> Cash on Delivery
                    </span>
                    <span>·</span>
                    <span>Inspect Parcel Before Payment</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
