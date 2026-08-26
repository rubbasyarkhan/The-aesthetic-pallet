import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Flower2, 
  Key, 
  Scissors, 
  Shirt, 
  Palette, 
  Heart, 
  Gift, 
  Home, 
  Smile, 
  Layers
} from 'lucide-react';
import { OCCASIONS_LIST } from '../data/products';
import { Category, Occasion } from '../types';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/common/ProductCard';

export const CatalogPage: React.FC = () => {
  const { products, recordVisitorPageview } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = (searchParams.get('category') as Category) || 'all';
  const occasionParam = (searchParams.get('occasion') as Occasion) || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<Category>(categoryParam);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>(occasionParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    recordVisitorPageview('Shop Gallery');
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (occasionParam) setSelectedOccasion(occasionParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, occasionParam, searchParam]);

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'crochet-flowers', label: 'Crochet Roses', icon: <Flower2 className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'crochet-keychains', label: 'Keychains & Charms', icon: <Key className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'hair-accessories', label: 'Hair Clips & Bows', icon: <Scissors className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'crochet-wear', label: 'Sweaters & Hats', icon: <Shirt className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'paintings', label: 'Oil Paintings', icon: <Palette className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'custom-portraits', label: 'Loved Ones Portraits', icon: <Heart className="w-3.5 h-3.5 text-terracotta" /> },
    { id: 'gift-sets', label: 'Gift Sets', icon: <Gift className="w-3.5 h-3.5 text-terracotta" /> },
  ];

  const getOccasionIcon = (id: string) => {
    switch (id) {
      case 'birthday': return <Gift className="w-3 h-3 text-terracotta" />;
      case 'housewarming': return <Home className="w-3 h-3 text-sage-deep" />;
      case 'welcome-gifts': return <Gift className="w-3 h-3 text-ochre-dark" />;
      case 'anniversary-love': return <Heart className="w-3 h-3 text-blush-dark" />;
      case 'self-care': return <Smile className="w-3 h-3 text-terracotta" />;
      default: return <Sparkles className="w-3 h-3 text-terracotta" />;
    }
  };

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handleOccasionChange = (occ: Occasion) => {
    setSelectedOccasion(occ);
    const newParams = new URLSearchParams(searchParams);
    if (occ === 'all') newParams.delete('occasion');
    else newParams.set('occasion', occ);
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedOccasion !== 'all') {
      result = result.filter((p) => p.occasion === selectedOccasion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, selectedCategory, selectedOccasion, searchQuery]);

  const otherSuggestedProducts = useMemo(() => {
    if (selectedCategory === 'all' && selectedOccasion === 'all') {
      return [];
    }
    const filteredIds = new Set(filteredProducts.map((p) => p.id));
    return products.filter((p) => !filteredIds.has(p.id)).slice(0, 4);
  }, [products, filteredProducts, selectedCategory, selectedOccasion]);

  const getMasonryAspect = (index: number) => {
    const patterns = ['aspect-4/5', 'aspect-square', 'aspect-3/4', 'aspect-4/5'];
    return patterns[index % patterns.length];
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8">
      {/* Top Filter Strip */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-ink text-white shadow-xs'
                  : 'bg-linen-surface text-ink hover:bg-linen-deep border border-linen-deep'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Gift Occasions Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-ink-muted font-semibold shrink-0">Gift For:</span>
          {OCCASIONS_LIST.map((occ) => (
            <button
              key={occ.id}
              onClick={() => handleOccasionChange(occ.id as Occasion)}
              className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedOccasion === occ.id
                  ? 'bg-terracotta text-white font-semibold'
                  : 'bg-white text-ink-muted hover:text-ink border border-linen-deep'
              }`}
            >
              {getOccasionIcon(occ.id)}
              <span>{occ.label}</span>
            </button>
          ))}
          {(selectedCategory !== 'all' || selectedOccasion !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-xs font-semibold text-terracotta hover:underline ml-2 shrink-0"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* PINTEREST-STYLE PRODUCT GALLERY / LISTING */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-ink">
            {selectedCategory !== 'all'
              ? categories.find((c) => c.id === selectedCategory)?.label
              : selectedOccasion !== 'all'
              ? `${OCCASIONS_LIST.find((o) => o.id === selectedOccasion)?.label} Collection`
              : 'Curated Gallery'}
          </h2>
          <span className="text-xs text-ink-muted">{filteredProducts.length} creations</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                aspectRatioClass={getMasonryAspect(idx)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white rounded-organic-xl border border-linen-deep">
            <Sparkles className="w-6 h-6 text-terracotta mx-auto" />
            <p className="font-serif text-base font-semibold text-ink">No creations in this filter</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
                setSearchParams({});
              }}
              className="btn-primary text-xs py-2 px-4"
            >
              Show All Creations
            </button>
          </div>
        )}
      </section>

      {/* "OTHER THINGS BASED ON FILTER" */}
      {otherSuggestedProducts.length > 0 && (
        <section className="pt-10 border-t border-linen-deep/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <span>Other Things You Might Cherish</span>
              </h3>
              <p className="text-xs text-ink-muted">Handmade pieces from other aesthetic categories</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
                setSearchParams({});
              }}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              Browse All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {otherSuggestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} aspectRatioClass="aspect-4/5" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
