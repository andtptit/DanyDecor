import { Sk, ProductTableSkeleton, FilterBarSkeleton } from '@/components/Skeleton';

export default function AdminLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Sk className="h-3 w-12" />
        <Sk className="h-3 w-3 rounded-none" />
        <Sk className="h-3 w-32" />
      </div>

      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Sk className="h-9 w-64" />
            <Sk className="h-7 w-24 rounded-full" />
          </div>
          <Sk className="h-4 w-80" />
        </div>
        <Sk className="h-10 w-36 rounded-xl" />
      </div>

      {/* Table card skeleton */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter bar skeleton */}
        <FilterBarSkeleton />

        {/* Table skeleton */}
        <ProductTableSkeleton rows={8} />

        {/* Pagination skeleton */}
        <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
          <Sk className="h-4 w-32" />
          <div className="flex gap-2">
            <Sk className="h-8 w-8 rounded-lg" />
            <Sk className="h-8 w-8 rounded-lg" />
            <Sk className="h-8 w-8 rounded-lg" />
            <Sk className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
