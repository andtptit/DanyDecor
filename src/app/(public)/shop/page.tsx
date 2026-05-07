import prisma from "@/lib/prisma";
import { Search, SlidersHorizontal, MessageSquare } from "lucide-react";
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
  const { category, sort, q } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  }).catch(() => []);

  const where: any = {};
  if (category) where.categoryId = category;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } }
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true }
  }).catch(() => []);

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Lọc */}
        <aside className="w-full lg:w-64 space-y-10">
          <div>
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" /> Tìm kiếm
            </h3>
            <form action="/shop" method="GET" className="relative">
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Nhập tên tranh..."
                className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              {category && <input type="hidden" name="category" value={category} />}
            </form>
          </div>

          <div>
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Danh mục
            </h3>
            <div className="space-y-2">
              <Link 
                href="/shop" 
                className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${!category ? 'bg-primary text-white font-bold shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                Tất cả sản phẩm
              </Link>
              {categories.map((cat: any) => (
                <Link 
                  key={cat.id}
                  href={`/shop?category=${cat.id}${q ? `&q=${q}` : ''}${sort ? `&sort=${sort}` : ''}`}
                  className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${category === cat.id ? 'bg-primary text-white font-bold shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-sm text-gray-400 font-medium">
              Hiển thị <span className="text-dark font-bold">{products.length}</span> sản phẩm
            </p>
            <ShopSort />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <div key={product.id} className="product-card bg-white rounded-[2rem] overflow-hidden flex flex-col group border border-gray-50 hover:shadow-2xl transition-all duration-500">
                  <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images[0] || "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {product.category?.name || "Bộ sưu tập"}
                    </div>
                  </Link>
                  <div className="p-8 flex flex-col flex-grow">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-lg font-bold mb-3 text-dark group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="text-gray-400 text-xs mb-6 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-300 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <a
                        href={`https://zalo.me/YOUR_ZALO_NUMBER`}
                        target="_blank"
                        className="w-10 h-10 bg-soft-gray text-dark rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100">
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
      <div className="bg-white border-b border-gray-100 py-12 lg:py-20">
        <div className="container-custom">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark font-serif mb-4">Cửa Hàng</h1>
          <p className="text-gray-500 max-w-2xl">
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
