import { Sk, ProductCardSkeleton } from '@/components/Skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="bg-soft-gray/30 py-4 border-b border-gray-100/50">
        <div className="container-custom">
          <div className="flex items-center gap-2">
            <Sk className="h-3 w-12" />
            <Sk className="h-3 w-2 rounded-none" />
            <Sk className="h-3 w-16" />
            <Sk className="h-3 w-2 rounded-none" />
            <Sk className="h-3 w-40" />
          </div>
        </div>
      </div>

      <div className="container-custom py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image gallery skeleton */}
          <div className="space-y-4">
            <Sk className="aspect-square w-full rounded-[2.5rem]" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Sk key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            {/* Category badge */}
            <Sk className="h-5 w-32 rounded-full" />

            {/* Title */}
            <div className="space-y-3">
              <Sk className="h-10 w-full" />
              <Sk className="h-10 w-3/4" />
            </div>

            {/* Price */}
            <div className="py-6 border-y border-gray-100 space-y-2">
              <Sk className="h-8 w-40" />
              <Sk className="h-4 w-28" />
            </div>

            {/* Size options */}
            <div className="space-y-3">
              <Sk className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Sk key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-3/4" />
              <Sk className="h-4 w-5/6" />
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <Sk className="h-16 rounded-2xl" />
              <Sk className="h-16 rounded-2xl" />
            </div>

            {/* CTA Button */}
            <Sk className="h-14 w-full rounded-2xl" />
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-24">
          <div className="flex justify-between items-center mb-10">
            <Sk className="h-9 w-56" />
            <Sk className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
