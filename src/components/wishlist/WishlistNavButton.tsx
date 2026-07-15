'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';

export default function WishlistNavButton() {
  const { count, mounted } = useWishlist();

  return (
    <Link
      href="/favorites"
      aria-label="Danh sách yêu thích"
      className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-dark hover:text-primary hover:bg-soft-gray transition-colors"
    >
      <Heart className="w-5 h-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
