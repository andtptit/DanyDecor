import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MessageSquare, ShieldCheck, Zap, ChevronRight, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import ProductImages from "@/components/ProductImages";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!product) notFound();

  // Lấy các sản phẩm liên quan (cùng danh mục)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  const zaloLink = `https://zalo.me/YOUR_ZALO_NUMBER`; // Bạn hãy thay số điện thoại vào đây

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-soft-gray/30 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <HomeIcon className="w-3 h-3" /> Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-primary transition-colors">Cửa hàng</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dark line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="container-custom py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Cột trái: Hình ảnh (Client Component) */}
          <ProductImages images={product.images} />

          {/* Cột phải: Thông tin */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category?.name || "Bộ sưu tập"}
                </span>
                {product.isFeatured && (
                  <span className="bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-dark font-serif leading-tight mb-6">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-300 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Đặc điểm nổi bật */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-soft-gray/20">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-xs font-bold text-dark">Bảo hành 2 năm</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-soft-gray/20">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-dark">Giao hàng nhanh</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href={zaloLink}
                target="_blank"
                className="flex-1 bg-primary text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all hover:-translate-y-1"
              >
                <MessageSquare className="w-6 h-6" /> Tư vấn qua Zalo
              </a>
              <button className="flex-1 border-2 border-dark text-dark px-10 py-5 rounded-2xl font-bold hover:bg-dark hover:text-white transition-all">
                Thêm vào giỏ hàng
              </button>
            </div>

            {/* Mô tả chi tiết */}
            <div className="pt-10 border-t border-gray-100">
              <h3 className="font-bold text-dark mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Mô tả sản phẩm
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-500 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || "Chưa có mô tả cho sản phẩm này." }}
              />
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-dark font-serif mb-4">Sản Phẩm Tương Tự</h2>
              <div className="w-16 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group space-y-4">
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-100">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark group-hover:text-primary transition-colors line-clamp-1">{p.name}</h4>
                    <p className="text-primary font-bold text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
