import React from 'react';

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative bg-white py-20 lg:py-40 overflow-hidden border-b border-gray-100">
        <div className="container-custom relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="h-16 w-full max-w-md bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-16 w-3/4 bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-20 w-full max-w-xl bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-14 w-48 bg-gray-100 rounded-full animate-pulse"></div>
              <div className="h-14 w-48 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-square bg-gray-50 rounded-[3rem] animate-pulse border-[12px] border-white shadow-xl"></div>
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-16">
            <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse"></div>
            <div className="hidden md:block flex-1 h-px bg-gray-100 mx-8"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] animate-pulse shadow-sm"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-24">
        <div className="container-custom">
          <div className="h-10 w-64 bg-gray-100 rounded-xl mb-16 animate-pulse mx-auto md:mx-0"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-50 overflow-hidden space-y-6">
                <div className="aspect-[4/3] bg-gray-50 animate-pulse"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
