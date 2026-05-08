'use client';

import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';

interface SizeOption {
  name: string;
  price: number | null; // null represents "Liên hệ"
}

export default function ProductSizeInput({ defaultSizes = [] }: { defaultSizes?: SizeOption[] }) {
  const initialSizes = defaultSizes.length > 0 ? defaultSizes : [
    { name: '30cm x 45cm', price: 99000 },
    { name: '40cm x 60cm', price: 175000 },
    { name: '50cm x 70cm', price: 255000 },
    { name: '60cm x 90cm', price: 375000 },
    { name: '80cm x 120cm', price: 695000 },
    { name: 'KÍCH THƯỚC YÊU CẦU', price: null },
  ];

  const [sizes, setSizes] = useState<SizeOption[]>(initialSizes);

  const addSize = () => {
    setSizes([...sizes, { name: '', price: 0 }]);
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

      {sizes.map((size, index) => (
        <div key={index} className="flex items-center gap-4 bg-soft-gray p-3 rounded-xl">
          <div className="flex-1">
            <input
              type="text"
              value={size.name}
              onChange={(e) => updateSize(index, 'name', e.target.value)}
              placeholder="VD: 30cm x 45cm"
              className="w-full bg-white border-none rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={size.price === null ? '' : size.price}
              onChange={(e) => updateSize(index, 'price', e.target.value === '' ? null : parseInt(e.target.value))}
              placeholder="Để trống = Liên hệ"
              className="w-full bg-white border-none rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={() => removeSize(index)}
            className="p-2 text-red-500 hover:bg-white rounded-lg transition-colors"
          >
            <Trash className="w-4 h-4" />
          </button>
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
