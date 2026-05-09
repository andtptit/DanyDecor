'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductFilterProps {
  categories: Category[];
  totalResults: number;
}

export default function ProductFilter({ categories, totalResults }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');

  // Debounced search
  useEffect(() => {
    // Không chạy nếu search trùng với query hiện tại (tránh loop hoặc ghi đè)
    if (search === (searchParams.get('q') || '')) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set('q', search);
      else params.delete('q');
      router.push(`/admin/products?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, router, searchParams]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryId(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('category', value);
    else params.delete('category');
    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <div className="border-b border-gray-100">
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-soft-gray border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full bg-soft-gray border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentId ? `↳ ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Thông báo bộ lọc đang hoạt động */}
      {(categoryId || searchParams.get('q')) && (
        <div className="px-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Đang lọc theo:</span>
            <div className="flex flex-wrap gap-2">
            {categoryId && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                Danh mục: {categories.find(c => c.id === categoryId)?.name}
                <button 
                  onClick={() => {
                    setCategoryId('');
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('category');
                    router.push(`/admin/products?${params.toString()}`);
                  }}
                  className="hover:text-dark transition-colors"
                >
                  &times;
                </button>
              </span>
            )}
            {searchParams.get('q') && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                Từ khóa: "{searchParams.get('q')}"
                <button 
                  onClick={() => {
                    setSearch('');
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('q');
                    router.push(`/admin/products?${params.toString()}`);
                  }}
                  className="hover:text-dark transition-colors"
                >
                  &times;
                </button>
              </span>
            )}
            <button 
              onClick={() => {
                setSearch('');
                setCategoryId('');
                router.push('/admin/products');
              }}
              type="button"
              className="text-xs text-red-500 hover:underline ml-2 cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200 shrink-0">
          Tìm thấy {totalResults} kết quả
        </span>
      </div>
    )}
    </div>
  );
}
