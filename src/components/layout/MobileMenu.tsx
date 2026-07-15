'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Home, Store, Heart, Star, MessageCircle, PhoneCall } from 'lucide-react';
import { useWishlist } from '@/components/wishlist/WishlistContext';

interface MobileMenuProps {
  zaloPhone: string;
  hotlinePhone: string;
}

export default function MobileMenu({ zaloPhone, hotlinePhone }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count, mounted: wlMounted } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Khóa cuộn nền khi menu mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const links = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/shop', label: 'Cửa hàng', icon: Store },
    { href: '/favorites', label: 'Yêu thích', icon: Heart, badge: wlMounted ? count : 0 },
    { href: '/#reviews', label: 'Đánh giá', icon: Star },
  ];

  const overlay = (
    <div className="lg:hidden fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col">
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <span className="font-serif font-bold text-lg">
            Dany<span className="text-primary">Decor</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-soft-gray transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-dark hover:bg-soft-gray transition-colors"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="flex-1">{l.label}</span>
                {!!l.badge && l.badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {l.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-3">
          <a href={`tel:${hotlinePhone}`} className="flex items-center gap-2 text-dark font-bold text-sm">
            <PhoneCall className="w-4 h-4 text-primary" /> {hotlinePhone}
          </a>
          <a
            href={`https://zalo.me/${zaloPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Liên hệ Zalo
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
        className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-dark hover:bg-soft-gray transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Portal ra body để thoát containing-block của header (glass-header có backdrop-filter) */}
      {mounted && open && createPortal(overlay, document.body)}
    </>
  );
}
