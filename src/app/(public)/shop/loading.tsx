import { ProductCardSkeleton, CategorySidebarSkeleton, Sk } from '@/components/Skeleton';

export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-300">
      {/* Page header skeleton */}
      <div className="bg-soft-gray/50 border-b border-gray-100 py-10">
        <div className="container-custom">
          <Sk className="h-10 w-56 mb-3" />
          <Sk className="h-4 w-80" />
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex gap-10">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Search */}
              <Sk className="h-10 w-full rounded-xl" />
              {/* Categories */}
              <div>
                <Sk className="h-4 w-20 mb-4" />
                <CategorySidebarSkeleton />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar skeleton */}
            <div className="flex justify-between items-center mb-8">
              <Sk className="h-4 w-36" />
              <Sk className="h-10 w-40 rounded-xl" />
            </div>

            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
