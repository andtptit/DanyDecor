'use client';

import { Heart } from 'lucide-react';
import { useWishlist, type WishlistItem } from './WishlistContext';

interface FavoriteButtonProps {
  product: WishlistItem;
  className?: string;
  size?: 'sm' | 'lg';
}

export default function FavoriteButton({ product, className = '', size = 'sm' }: FavoriteButtonProps) {
  const { isFavorite, toggle, mounted } = useWishlist();
  const active = mounted && isFavorite(product.id);

  const dim = size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const icon = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      type="button"
      aria-label={active ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={`${dim} rounded-full flex items-center justify-center backdrop-blur shadow-sm transition-all active:scale-90 ${
        active ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:text-red-500'
      } ${className}`}
    >
      <Heart className={`${icon} ${active ? 'fill-current' : ''}`} />
    </button>
  );
}
