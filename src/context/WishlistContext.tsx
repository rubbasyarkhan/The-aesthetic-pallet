import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useProducts } from './ProductContext';
import confetti from 'canvas-confetti';

interface WishlistContextType {
  likedIds: string[];
  likedProducts: Product[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  likedCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'the_aesthetic_palette_wishlist_v2';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['crochet-forever-roses', 'crochet-strawberry-keychain'];
    } catch {
      return ['crochet-forever-roses', 'crochet-strawberry-keychain'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(likedIds));
    } catch (e) {
      console.error('Failed to sync wishlist to storage', e);
    }
  }, [likedIds]);

  const isLiked = (id: string) => likedIds.includes(id);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const isAlready = prev.includes(id);
      if (isAlready) {
        return prev.filter((item) => item !== id);
      } else {
        try {
          confetti({
            particleCount: 20,
            spread: 45,
            origin: { y: 0.75 },
            colors: ['#E8B4A2', '#C06C4D', '#8DA399']
          });
        } catch {
          // safe
        }
        return [...prev, id];
      }
    });
  };

  const likedProducts = products.filter((p) => likedIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        likedIds,
        likedProducts,
        isLiked,
        toggleLike,
        likedCount: likedIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
