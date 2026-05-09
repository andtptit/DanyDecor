'use client';

import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';

interface SizeOption {
  name: string;
  price: number | null; // null represents "Liên hệ"
  originalPrice?: number | null;
}

export default function ProductSizeInput({ defaultSizes = [] }: { defaultSizes?: SizeOption[] }) {
  const initialSizes = defaultSizes.length > 0 ? defaultSizes : [
    { name: '30cm x 45cm', price: 99000, originalPrice: null },
    { name: '40cm x 60cm', price: 175000, originalPrice: null },
    { name: '50cm x 70cm', price: 255000, originalPrice: null },
    { name: '60cm x 90cm', price: 375000, originalPrice: null },
    { name: '80cm x 120cm', price: 695000, originalPrice: null },
    { name: 'KÍCH THƯỚC YÊU CẦU', price: null, originalPrice: null },
  ];

  const [sizes, setSizes] = useState<SizeOption[]>(initialSizes);

  const addSize = () => {
    setSizes([...sizes, { name: '', price: 0, originalPrice: null }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: keyof SizeOption, value: any) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  return (
    <div className="space-y-4">
      {/* Hidden input to store JSON for the server action */}
      <input type="hidden" name="sizesJSON" value={JSON.stringify(sizes)} />

      <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="col-span-5">Kích thước</div>
        <div className="col-span-3">Giá bán</div>
        <div className="col-span-3">Giá gốc (Gạch ngang)</div>
        <div className="col-span-1"></div>
      </div>

      {sizes.map((size, index) => (
        <div key={index} className="grid grid-cols-12 items-center gap-4 bg-soft-gray p-3 rounded-xl">
          <div className="col-span-5">
            <input
              type="text"
              value={size.name}
              onChange={(e) => updateSize(index, 'name', e.target.value)}
              placeholder="VD: 30cm x 45cm"
              className="w-full bg-white border-none rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div className="col-span-3">
            <input
              type="number"
              value={size.price === null ? '' : size.price}
              onChange={(e) => updateSize(index, 'price', e.target.value === '' ? null : parseInt(e.target.value))}
              placeholder="0 = Liên hệ"
              className="w-full bg-white border-none rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="col-span-3">
            <input
              type="number"
              value={size.originalPrice === null || size.originalPrice === undefined ? '' : size.originalPrice}
              onChange={(e) => updateSize(index, 'originalPrice', e.target.value === '' ? null : parseInt(e.target.value))}
              placeholder="Không giảm giá"
              className="w-full bg-white border-none rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              type="button"
              onClick={() => removeSize(index)}
              className="p-2 text-red-500 hover:bg-white rounded-lg transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSize}
        className="flex items-center gap-2 text-primary text-sm font-bold hover:underline"
      >
        <Plus className="w-4 h-4" /> Thêm kích thước
      </button>
    </div>
  );
}
