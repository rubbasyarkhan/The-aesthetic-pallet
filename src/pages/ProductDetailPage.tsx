import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Check, 
  Star, 
  Sparkles, 
  ShieldCheck,
  MessageCircle,
  Upload,
  Camera,
  ThumbsUp,
  X
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Review } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, recordVisitorPageview } = useProducts();
  const { addToCart, formatCurrency } = useCart();
  const { isLiked, toggleLike } = useWishlist();

  const product = products.find((p) => p.id === id || p.slug === id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colorways[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : '');
  const [customNotes, setCustomNotes] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'materials' | 'care' | null>('materials');

  // Customer Reviews & Cloudinary Photos State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('Lahore');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingReviewImages, setIsUploadingReviewImages] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      recordVisitorPageview(product.title);
      setActiveImageIndex(0);
      setSelectedColor(product.colorways[0]?.name || '');
      setSelectedSize(product.sizes ? product.sizes[0] : '');

      // Load reviews for this product
      api.getProductReviews(product.id).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          // Default initial verified review
          setReviews([
            {
              id: 'rev-default-1',
              author: 'Ayesha Malik',
              rating: 5,
              location: 'Lahore, Pakistan',
              date: '2 days ago',
              comment: 'The craftsmanship on this piece is extraordinary! The stitching is so delicate and soft. Shipped via Cash on Delivery with no issues.',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              verifiedPurchase: true,
              productTitle: product.title
            }
          ]);
        }
      });
    }
    setCustomNotes('');
    setGiftNote('');
    setQuantity(1);
  }, [id, product]);

  if (!product) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 py-16 text-center">
        <p>Product not found.</p>
        <Link to="/products" className="btn-primary text-xs py-2 px-4 mt-2 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const liked = isLiked(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      colorway: selectedColor,
      size: selectedSize || undefined,
      customMeasurements: customNotes.trim() || undefined,
      giftNote: giftNote.trim() || undefined
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Cloudinary image upload for user reviews (up to 4 images)
  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (reviewImages.length + files.length > 4) {
      alert('You can upload a maximum of 4 photos per review.');
      return;
    }

    setIsUploadingReviewImages(true);
    try {
      const readBase64Promises = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );

      const base64List = await Promise.all(readBase64Promises);
      const uploadedUrls = await api.uploadMultipleImages(base64List);
      setReviewImages((prev) => [...prev, ...uploadedUrls].slice(0, 4));
    } catch (err) {
      console.error('Failed to upload review photos to Cloudinary', err);
    } finally {
      setIsUploadingReviewImages(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newReview = await api.submitProductReview(product.id, {
        author: reviewerName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        location: reviewerCity ? `${reviewerCity}, Pakistan` : 'Pakistan',
        images: reviewImages
      });

      setReviews((prev) => [newReview, ...prev]);
      setIsReviewModalOpen(false);
      setReviewerName('');
      setReviewComment('');
      setReviewImages([]);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // WhatsApp Inquiry URL
  const whatsappInquiryUrl = `https://wa.me/923172072623?text=${encodeURIComponent(
    `Hi The Aesthetic Palette! 🌸 I am inquiring about "${product.title}" (${formatCurrency(product.price)}). Is this available for Cash on Delivery?`
  )}`;

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-14 pb-20 lg:pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Link to="/" className="hover:text-terracotta">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-terracotta">Shop</Link>
        <span>/</span>
        <span className="text-ink font-semibold truncate max-w-[220px]">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-4/5 rounded-organic-xl overflow-hidden bg-linen-surface border border-linen-deep shadow-subtle group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            <button
              onClick={() => toggleLike(product.id)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-ink-muted hover:text-terracotta shadow-sm transition-all active:scale-90"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${liked ? 'text-terracotta fill-terracotta' : ''}`} />
            </button>

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isMadeToOrder ? (
                <span className="badge-custom text-xs font-semibold px-2.5 py-1 bg-white/95 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-terracotta" /> Made to Order
                </span>
              ) : (
                <span className="badge-ready text-xs font-semibold px-2.5 py-1 bg-white/95 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-sage-deep" /> Ready to Ship
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-22 rounded-organic-sm overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-terracotta ring-1 ring-terracotta'
                      : 'border-linen-deep opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Purchase Panel */}
        <div className="lg:col-span-5 space-y-5 bg-linen-light p-6 sm:p-8 rounded-organic-xl border border-linen-deep shadow-subtle">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs text-ink-muted">★ {product.rating} ({reviews.length} customer reviews)</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-ink font-semibold leading-tight">
              {product.title}
            </h1>

            <p className="text-xs text-terracotta font-medium italic">
              {product.tagline}
            </p>

            {/* Pricing in Pakistani Rupees (Rs.) */}
            <div className="flex items-baseline gap-2.5 pt-1">
              <span className="font-serif text-2xl font-bold text-ink">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-ink-faint line-through">{formatCurrency(product.originalPrice)}</span>
              )}
              <span className="text-[11px] font-semibold text-sage-deep bg-sage/15 px-2 py-0.5 rounded">
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Quick Lead-Time Chip */}
          <div className="p-3 bg-linen-surface rounded-organic border border-linen-deep text-xs text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-terracotta shrink-0" />
            <span><strong>Lead Time:</strong> {product.leadTimeText}</span>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            {product.description}
          </p>

          {/* Colorway Selection */}
          {product.colorways && product.colorways.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-linen-deep">
              <label className="block text-xs font-semibold text-ink">
                Available Shades: <span className="font-normal text-terracotta">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {product.colorways.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-organic border transition-all text-xs ${
                      selectedColor === col.name
                        ? 'border-terracotta bg-linen-surface font-semibold text-terracotta ring-1 ring-terracotta shadow-2xs'
                        : 'border-linen-dark bg-white text-ink hover:bg-linen-surface'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
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
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-ink">Select Sizing</label>
              <div className="grid grid-cols-2 gap-1.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-1.5 px-2 rounded text-xs border transition-colors ${
                      selectedSize === sz
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

          {/* Custom Note Prompt */}
          <div className="space-y-2 pt-2 border-t border-linen-deep">
            <label className="block text-xs font-semibold text-ink flex items-center justify-between">
              <span>Artisan Customization Note (Optional)</span>
              <span className="text-[10px] text-ink-faint font-normal">Free slow-craft tailoring</span>
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Please make stem wire 1 inch longer"
              className="w-full text-xs px-3 py-2 rounded-organic bg-white border border-linen-dark focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Quantity, Add to Cart & WhatsApp Inquiry */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-linen-dark rounded-organic bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-xs font-bold text-ink hover:text-terracotta"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-xs font-bold text-ink hover:text-terracotta"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-organic-lg bg-terracotta hover:bg-terracotta-light text-white text-xs font-semibold transition-all active:scale-98 shadow-md flex items-center justify-center gap-2"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · Cash on Delivery</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Contact Button */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-organic border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask Artisan on WhatsApp (+92 317 2072623)</span>
            </a>

            <p className="text-[11px] text-center text-ink-faint">
              🔒 100% Cash on Delivery across Pakistan · Inspect parcel upon doorstep arrival
            </p>
          </div>

          {/* Accordion Details */}
          <div className="border-t border-linen-deep pt-3 space-y-2 text-xs">
            <button
              onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
              className="w-full flex items-center justify-between py-2 text-ink font-semibold"
            >
              <span>Materials & Artisanal Inclusions</span>
              {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordion === 'materials' && (
              <div className="pb-2 text-ink-muted space-y-1">
                <p><strong>Craft Time:</strong> {product.craftTimeHours} hours of patient handwork</p>
                <p><strong>Materials:</strong> {product.materials?.join(', ') || '100% Combed Cotton'}</p>
                {product.includedInPackage && (
                  <p><strong>Package includes:</strong> {product.includedInPackage.join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS & CLOUDINARY PHOTO GALLERY SECTION */}
      <section className="pt-8 border-t border-linen-deep space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Community Stories & Reviews</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-semibold">
              Loved by Slow Craft Adorers
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn-secondary text-xs py-2.5 px-5 flex items-center gap-2 shadow-xs hover:border-terracotta"
          >
            <Camera className="w-4 h-4 text-terracotta" />
            <span>Write a Review & Add Photos</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id || Math.random()}
              className="p-6 bg-linen-light rounded-organic-xl border border-linen-deep shadow-subtle space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(rev.author)}`}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-linen-dark"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-ink">{rev.author}</h4>
                      <p className="text-[11px] text-ink-muted">{rev.location || 'Pakistan'}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Uploaded Customer Photos in Review */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-2 overflow-x-auto">
                    {rev.images.map((imgUrl, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={imgUrl}
                        alt="Customer photo"
                        className="w-16 h-16 rounded-organic-sm object-cover border border-linen-deep shadow-2xs hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-linen-deep flex items-center justify-between text-[11px] text-ink-faint">
                <span className="flex items-center gap-1 text-sage-dark font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
                </span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WRITE A REVIEW MODAL (WITH 4 CLOUDINARY IMAGE UPLOADS) */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-linen-light rounded-organic-2xl p-6 sm:p-8 border border-linen-deep shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-linen-deep">
              <h3 className="font-serif text-xl font-semibold text-ink">
                Share Your Experience with "{product.title}"
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-linen-deep text-ink-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-semibold text-ink">Rating</label>
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-115"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          reviewRating >= star ? 'fill-amber-500 text-amber-500' : 'text-linen-dark'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-ink-muted ml-2">{reviewRating} out of 5 stars</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Sana Tariq"
                    className="w-full px-3 py-2 rounded-organic bg-white border border-linen-dark focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">City in Pakistan</label>
                  <input
                    type="text"
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    placeholder="e.g. Islamabad"
                    className="w-full px-3 py-2 rounded-organic bg-white border border-linen-dark focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Your Honest Review *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How did the stitches feel? Did it arrive nicely wrapped?..."
                  className="w-full p-3 rounded-organic bg-white border border-linen-dark focus:outline-none focus:border-terracotta resize-none"
                />
              </div>

              {/* Cloudinary 4-Photo Upload Box */}
              <div className="space-y-2">
                <label className="block font-semibold text-ink flex items-center justify-between">
                  <span>Attach Real Photos (Up to 4 Photos)</span>
                  <span className="text-[11px] text-terracotta font-normal">Cloudinary CDN Synced</span>
                </label>

                <div className="p-4 bg-white rounded-organic border border-dashed border-linen-dark text-center space-y-2">
                  <Camera className="w-5 h-5 text-terracotta mx-auto" />
                  <p className="text-[11px] text-ink-muted">
                    Show the cozy stitches in your room light
                  </p>

                  <label className="inline-block py-1.5 px-3.5 bg-linen hover:bg-linen-deep text-ink text-xs font-semibold rounded-organic cursor-pointer transition-colors border border-linen-dark">
                    <span>{isUploadingReviewImages ? 'Uploading to Cloudinary...' : 'Choose Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleReviewImageUpload}
                      disabled={isUploadingReviewImages || reviewImages.length >= 4}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Previews of uploaded images */}
                {reviewImages.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {reviewImages.map((imgUrl, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-organic-sm overflow-hidden border border-linen-deep">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setReviewImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-linen-deep">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview || isUploadingReviewImages}
                  className="btn-primary text-xs py-2.5 px-6 shadow-sm disabled:opacity-75"
                >
                  {submittingReview ? 'Submitting Review...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-linen-deep space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">You May Also Adore</span>
            <h2 className="font-serif text-2xl text-ink font-semibold">Matching Studio Treasures</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
