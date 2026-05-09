'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface ProductSize {
  id: string;
  name: string;
  price: number | null;
}

interface ProductOptionsProps {
  productName: string;
  sizes: ProductSize[];
  defaultPrice: number;
  originalPrice: number | null;
  zaloLink: string;
}

export default function ProductOptions({ productName, sizes, defaultPrice, originalPrice, zaloLink }: ProductOptionsProps) {
  // Fallback to default sizes if the product doesn't have any sizes in the DB yet
  const effectiveSizes = sizes.length > 0 ? sizes : [
    { id: 'default-1', name: '30cm x 45cm', price: 99000 },
    { id: 'default-2', name: '40cm x 60cm', price: 175000 },
    { id: 'default-3', name: '50cm x 70cm', price: 255000 },
    { id: 'default-4', name: '60cm x 90cm', price: 375000 },
    { id: 'default-5', name: '80cm x 120cm', price: 695000 },
    { id: 'default-6', name: 'KÍCH THƯỚC YÊU CẦU', price: null },
  ];

  // Select the first size by default if available
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(effectiveSizes.length > 0 ? effectiveSizes[0].id : null);

  const selectedSize = effectiveSizes.find(s => s.id === selectedSizeId);
  const currentPrice = selectedSize ? selectedSize.price : defaultPrice;
  const currentOriginalPrice = selectedSize ? (selectedSize as any).originalPrice : originalPrice;

  const getZaloBuyLink = () => {
    const sizeText = selectedSize ? selectedSize.name : "Kích thước mặc định";
    const priceText = currentPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice) : "Liên hệ";
    const message = `Chào Shop, tôi muốn đặt mua tranh:\n- Tên: ${productName}\n- Kích thước: ${sizeText}\n- Giá: ${priceText}`;
    return `${zaloLink}?text=${encodeURIComponent(message)}`;
  };

  const getZaloConsultLink = () => {
    const sizeText = selectedSize ? selectedSize.name : "";
    const message = `Shop ơi, tư vấn giúp mình mẫu tranh này với:\n- Tên: ${productName}\n- Kích thước đang xem: ${sizeText}`;
    return `${zaloLink}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-baseline gap-4">
        {currentPrice === null ? (
          <span className="text-2xl lg:text-3xl font-bold text-primary">Giá liên hệ</span>
        ) : (
          <span className="text-2xl lg:text-3xl font-bold text-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)}
          </span>
        )}
        {currentOriginalPrice && currentPrice !== null && currentOriginalPrice > currentPrice && (
          <span className="text-base lg:text-lg text-gray-300 line-through">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOriginalPrice)}
          </span>
        )}
      </div>

      {/* Size Selection */}
      {effectiveSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-dark mb-3">Kích thước:</h3>
          <div className="flex flex-wrap gap-3">
            {effectiveSizes.map(size => (
              <button
                key={size.id}
                onClick={() => setSelectedSizeId(size.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  selectedSizeId === size.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-primary/30 hover:bg-soft-gray'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-row gap-2 lg:gap-4 pt-2">
        <a 
          href={getZaloBuyLink()}
          target="_blank"
          className="flex-[2] bg-primary text-white px-3 lg:px-8 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 lg:gap-3 shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 text-[10px] sm:text-xs lg:text-base whitespace-nowrap"
        >
          MUA NGAY QUA ZALO
        </a>
        <a 
          href={getZaloConsultLink()}
          target="_blank"
          className="flex-1 border-2 border-dark text-dark px-3 lg:px-8 py-3.5 lg:py-4 rounded-xl lg:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-dark hover:text-white transition-all active:scale-95 text-[10px] sm:text-xs lg:text-base whitespace-nowrap"
        >
          <MessageSquare className="w-4 h-4" /> Tư vấn thêm
        </a>
      </div>
    </div>
  );
}
