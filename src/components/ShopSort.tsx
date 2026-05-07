"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", val);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
      <span className="text-xs font-bold text-gray-400 ml-3">Sắp xếp:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none bg-transparent pr-8 pl-2 py-1 text-xs font-bold text-dark focus:outline-none cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
      </div>
    </div>
  );
}
