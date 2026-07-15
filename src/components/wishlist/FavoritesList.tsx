'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, MessageCircle, Check } from 'lucide-react';
import { useWishlist } from './WishlistContext';
import { SITE_NAME } from '@/lib/site';

function formatPrice(v?: number) {
  if (!v || v <= 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

export default function FavoritesList({ zaloPhone }: { zaloPhone: string }) {
  const { items, remove, clear, mounted } = useWishlist();
  const [copied, setCopied] = useState(false);

  // Tránh nội dung lệch khi chưa nạp xong localStorage
  if (!mounted) {
    return <div className="container-custom py-20 text-center text-gray-400">Đang tải...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-soft-gray flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-gray-500 text-sm mb-8">
            Bấm vào biểu tượng trái tim trên sản phẩm để lưu lại những mẫu tranh bạn thích.
          </p>
          <Link
            href="/shop"
            className="btn-primary inline-flex px-6 py-3 rounded-xl font-bold text-sm items-center gap-2"
          >
            Khám phá cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleSendZalo = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const message =
      `Xin chào, tôi quan tâm ${items.length} sản phẩm sau tại ${SITE_NAME}:\n` +
      items.map((it, i) => `${i + 1}. ${it.name} - ${origin}/product/${it.slug}`).join('\n');
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      /* ignore */
    }
    window.open(`https://zalo.me/${zaloPhone}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-dark font-serif mb-1">Danh sách của bạn</h2>
          <p className="text-gray-500 text-sm">{items.length} sản phẩm đã lưu</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors px-4 py-2.5"
          >
            Xóa tất cả
          </button>
          <button
            onClick={handleSendZalo}
            className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            {copied ? 'Đã copy — dán vào Zalo' : 'Gửi danh sách qua Zalo'}
          </button>
        </div>
      </div>

      {copied && (
        <p className="mb-6 text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          Đã sao chép danh sách sản phẩm. Hãy dán (Ctrl/Cmd + V) vào cửa sổ Zalo vừa mở để gửi cho nhân viên tư vấn.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="bg-white rounded-[2rem] border border-gray-50 overflow-hidden flex flex-col group hover:shadow-xl transition-all"
          >
            <Link href={`/product/${it.slug}`} className="relative aspect-[4/3] overflow-hidden block bg-gray-100">
              {it.image ? (
                <Image
                  src={it.image}
                  alt={it.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <Link href={`/product/${it.slug}`}>
                <h3 className="font-bold text-dark mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {it.name}
                </h3>
              </Link>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="font-bold text-primary">{formatPrice(it.price)}</span>
                <button
                  onClick={() => remove(it.id)}
                  aria-label="Bỏ khỏi yêu thích"
                  className="w-9 h-9 rounded-lg bg-soft-gray text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
