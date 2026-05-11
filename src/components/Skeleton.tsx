// Skeleton component dùng chung — bọc ngoài từng phần tử cần loading
export function Sk({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// Skeleton cho 1 dòng trong bảng admin
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Sk className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Sk className="h-4 w-3/4" />
            <Sk className="h-3 w-1/2" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <Sk className="h-3 w-24" />
          <Sk className="h-4 w-32" />
        </div>
      </td>
      <td className="px-6 py-4">
        <Sk className="h-5 w-28" />
      </td>
      <td className="px-6 py-4">
        <Sk className="h-6 w-12 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Sk className="w-8 h-8 rounded-lg" />
          <Sk className="w-8 h-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

// Skeleton bảng sản phẩm admin (5 cột)
export function ProductTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-soft-gray/50 text-gray-200 uppercase tracking-widest text-[10px] font-bold">
        <tr>
          <th className="px-6 py-4 rounded-tl-3xl"><Sk className="h-3 w-20" /></th>
          <th className="px-6 py-4"><Sk className="h-3 w-16" /></th>
          <th className="px-6 py-4"><Sk className="h-3 w-8" /></th>
          <th className="px-6 py-4"><Sk className="h-3 w-14" /></th>
          <th className="px-6 py-4 rounded-tr-3xl"><Sk className="h-3 w-16 ml-auto" /></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  );
}

// Skeleton card sản phẩm (trang shop)
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-50 overflow-hidden">
      <Sk className="aspect-[4/3] w-full rounded-none" />
      <div className="p-8 space-y-4">
        <Sk className="h-6 w-3/4" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-2/3" />
        <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
          <Sk className="h-7 w-28" />
          <Sk className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Skeleton danh mục (sidebar shop)
export function CategorySidebarSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Sk key={i} className={`h-10 rounded-xl ${i % 3 === 2 ? 'w-3/4 ml-4' : 'w-full'}`} />
      ))}
    </div>
  );
}

// Skeleton bộ lọc admin
export function FilterBarSkeleton() {
  return (
    <div className="p-6 flex gap-4">
      <Sk className="h-10 w-72 rounded-xl" />
      <Sk className="h-10 w-64 rounded-xl" />
    </div>
  );
}
