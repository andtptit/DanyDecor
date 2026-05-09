import prisma from "@/lib/prisma";
import Image from "next/image";
import { Search, SlidersHorizontal, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import ShopSort from "@/components/ShopSort";
import { Suspense } from "react";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const { category: selectedCategoryId, sort, q } = await searchParams;

  const categories = await prisma.category.findMany({
    include: {
      children: {
        orderBy: { name: "asc" }
      }
    },
    where: { parentId: null },
    orderBy: { name: "asc" }
  }).catch(() => []);

  const selectedCategory = selectedCategoryId 
    ? await prisma.category.findUnique({ 
        where: { id: selectedCategoryId },
        include: { children: true, parent: true }
      }) 
    : null;

  const where: any = {};
  if (selectedCategoryId) {
    if (selectedCategory && selectedCategory.children.length > 0) {
      where.OR = [
        { categoryId: selectedCategoryId },
        { category: { parentId: selectedCategoryId } }
      ];
    } else {
      where.categoryId = selectedCategoryId;
    }
  }
  
  if (q) {
    where.AND = where.AND || [];
    where.AND.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    });
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { 
      category: {
        include: { parent: true }
      },
      sizes: {
        orderBy: { price: 'asc' }
      }
    }
  }).catch(() => []);

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Lọc */}
        <aside className="w-full lg:w-64 space-y-8 lg:space-y-10">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm lg:shadow-none lg:bg-transparent lg:p-0 lg:border-none">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Tìm kiếm
            </h3>
            <form action="/shop" method="GET" className="relative">
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Nhập tên tranh..."
                className="w-full bg-soft-gray lg:bg-white border border-transparent lg:border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              {selectedCategoryId && <input type="hidden" name="category" value={selectedCategoryId} />}
            </form>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm lg:shadow-none lg:bg-transparent lg:p-0 lg:border-none">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Danh mục
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2 lg:space-y-4 lg:gap-0">
              <Link 
                href="/shop" 
                className={`px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm transition-all inline-block ${!selectedCategoryId ? 'bg-primary text-white font-bold shadow-md' : 'bg-soft-gray lg:bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                Tất cả sản phẩm
              </Link>
              
              {categories.map((cat: any) => (
                <div key={cat.id} className="w-full lg:space-y-1">
                  <Link 
                    href={`/shop?category=${cat.id}${q ? `&q=${q}` : ''}${sort ? `&sort=${sort}` : ''}`}
                    className={`block px-4 py-2 text-xs lg:text-sm font-bold transition-all rounded-xl lg:rounded-none ${selectedCategoryId === cat.id ? 'text-primary bg-primary/5 lg:bg-transparent' : 'text-dark hover:text-primary'}`}
                  >
                    {cat.name}
                  </Link>
                  {cat.children.length > 0 && (
                    <div className="pl-4 hidden lg:flex flex-col space-y-1 border-l border-gray-100 ml-2 mt-1">
                      {cat.children.map((sub: any) => (
                        <Link 
                          key={sub.id}
                          href={`/shop?category=${sub.id}${q ? `&q=${q}` : ''}${sort ? `&sort=${sort}` : ''}`}
                          className={`block px-3 py-1.5 rounded-lg text-xs transition-all ${selectedCategoryId === sub.id ? 'bg-primary/10 text-primary font-bold' : 'text-gray-400 hover:text-primary hover:bg-gray-50'}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
                <p className="text-sm text-gray-400 font-medium">
                Hiển thị <span className="text-dark font-bold">{products.length}</span> sản phẩm
                </p>
                {selectedCategory && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
                        <span>Cửa hàng</span>
                        <ChevronRight className="w-2 h-2 flex-shrink-0" />
                        {selectedCategory.parentId && (
                            <>
                                <span>{selectedCategory.parent?.name}</span>
                                <ChevronRight className="w-2 h-2 flex-shrink-0" />
                            </>
                        )}
                        <span className="text-primary font-bold">{selectedCategory.name}</span>
                    </div>
                )}
            </div>
            <div className="w-full sm:w-auto border-t border-gray-100 pt-4 sm:border-none sm:pt-0">
                <ShopSort />
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product: any) => {
                const firstSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
                const displayPrice = firstSize ? firstSize.price ?? product.price : product.price;
                const displayOriginalPrice = firstSize ? firstSize.originalPrice : product.originalPrice;

                return (
                  <div key={product.id} className="product-card bg-white rounded-[2rem] overflow-hidden flex flex-col group border border-gray-50 hover:shadow-2xl transition-all duration-500">
                    <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.images[0] || "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {product.category?.name || "Bộ sưu tập"}
                      </div>
                    </Link>
                    <div className="p-6 lg:p-8 flex flex-col flex-grow">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-lg font-bold mb-3 text-dark group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="text-gray-400 text-xs mb-6 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-primary">
                            {displayPrice > 0 
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)
                              : "Liên hệ"
                            }
                          </span>
                          {displayOriginalPrice && displayOriginalPrice > (displayPrice || 0) && (
                            <span className="text-[10px] text-gray-300 line-through">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayOriginalPrice)}
                            </span>
                          )}
                        </div>
                        <a
                          href={`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321'}`}
                          target="_blank"
                          className="w-10 h-10 bg-soft-gray text-dark rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-12 lg:p-20 text-center border border-gray-100">
              <h3 className="text-xl font-bold text-dark mb-2">Không tìm thấy sản phẩm</h3>
              <Link href="/shop" className="text-primary font-bold hover:underline">Quay lại tất cả sản phẩm</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <div className="bg-soft-gray/30 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 py-8 lg:py-20">
        <div className="container-custom">
          <h1 className="text-3xl lg:text-5xl font-bold text-dark font-serif mb-4">Cửa Hàng</h1>
          <p className="text-gray-500 max-w-2xl text-sm lg:text-base">
            Khám phá bộ sưu tập tranh nghệ thuật đa dạng, từ phong cách tối giản hiện đại đến sang trọng, đẳng cấp.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="container-custom py-20 text-center">Đang tải sản phẩm...</div>}>
        <ShopContent {...props} />
      </Suspense>
    </div>
  );
}
