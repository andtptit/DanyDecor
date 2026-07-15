'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  image?: string;
  price?: number; // giá hiển thị (thấp nhất), 0 = liên hệ
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  mounted: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'danydecor_wishlist';
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist phải được dùng bên trong <WishlistProvider>');
  return ctx;
}

function readStore(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer đọc localStorage ngay (chỉ chạy phía client),
  // tránh setState trong effect và tránh lệch hydration nhờ cờ `mounted`.
  const [items, setItems] = useState<WishlistItem[]>(readStore);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Đánh dấu đã mount phía client để lộ trạng thái đã lưu mà không lệch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Ghi lại mỗi khi thay đổi
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, mounted]);

  // Đồng bộ giữa các tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [item, ...prev]
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{ items, count: items.length, mounted, isFavorite, toggle, remove, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
