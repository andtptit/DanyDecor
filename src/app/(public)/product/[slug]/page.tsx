import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MessageSquare, ShieldCheck, Zap, ChevronRight, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import ProductImages from "@/components/ProductImages";
import ProductOptions from "@/components/ProductOptions";
import { getPublicSettings } from "@/lib/settings";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { zaloPhone, highlight1Text, highlight2Text } = await getPublicSettings();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { 
      category: {
        include: { parent: true }
      },
      sizes: true
    }
  });

  if (!product) notFound();

  // Lấy các sản phẩm liên quan (cùng danh mục hoặc cùng cha)
  const relatedProducts = await prisma.product.findMany({
    include: { 
      category: {
        include: { parent: true }
      },
      sizes: {
        orderBy: { price: 'asc' }
      }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  const zaloLink = `https://zalo.me/${zaloPhone}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-soft-gray/30 py-3 lg:py-4 border-b border-gray-100/50 overflow-hidden">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-[10px] lg:text-xs font-medium text-gray-400 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 flex-shrink-0">
              <HomeIcon className="w-3 h-3" /> Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/shop" className="hover:text-primary transition-colors flex-shrink-0">Cửa hàng</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            {product.category.parent && (
                <>
                    <Link href={`/shop?category=${product.category.parentId}`} className="hover:text-primary transition-colors flex-shrink-0 max-w-[80px] truncate">
                        {product.category.parent.name}
                    </Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                </>
            )}
            <Link href={`/shop?category=${product.categoryId}`} className="hover:text-primary transition-colors flex-shrink-0 max-w-[80px] truncate">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-dark truncate flex-1 min-w-0">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="container-custom py-8 lg:py-20 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Cột trái: Hình ảnh (Client Component) */}
          <div className="w-full min-w-0 overflow-hidden">
            <ProductImages images={product.images} />
          </div>

          {/* Cột phải: Thông tin */}
          <div className="space-y-8 lg:space-y-10 w-full min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {product.category.parent && (
                    <span className="bg-primary/5 text-primary/60 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                        {product.category.parent.name}
                    </span>
                )}
                <span className="bg-primary/10 text-primary text-[9px] lg:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                  {product.category.name}
                </span>
                {product.isFeatured && (
                  <span className="bg-amber-100 text-amber-600 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-5xl font-bold text-dark font-serif leading-tight mb-4 lg:mb-6 break-words overflow-hidden">
                {product.name}
              </h1>
              
              {/* Product Options (Size & Price & CTA) */}
              <ProductOptions 
                productName={product.name}
                sizes={product.sizes} 
                defaultPrice={product.price || 0} 
                originalPrice={product.originalPrice} 
                zaloLink={zaloLink} 
              />
            </div>

            {/* Đặc điểm nổi bật */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-2xl border border-gray-100 bg-soft-gray/20">
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                <span className="text-[10px] lg:text-xs font-bold text-dark uppercase tracking-wide">
                  {highlight1Text}
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-2xl border border-gray-100 bg-soft-gray/20">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />
                <span className="text-[10px] lg:text-xs font-bold text-dark uppercase tracking-wide">
                  {highlight2Text}
                </span>
              </div>
            </div>
            <div className="pt-8 lg:pt-10 border-t border-gray-100">
              <h3 className="font-bold text-dark mb-4 lg:mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Mô tả sản phẩm
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-500 leading-relaxed text-sm lg:text-base"
                dangerouslySetInnerHTML={{ __html: product.description || "Chưa có mô tả cho sản phẩm này." }}
              />
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 lg:mt-32">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl lg:text-3xl font-bold text-dark font-serif mb-3 lg:mb-4">Sản Phẩm Tương Tự</h2>
              <div className="w-12 h-1 bg-primary mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {relatedProducts.map((p: any) => {
                  const firstSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : null;
                  const displayPrice = firstSize ? firstSize.price ?? p.price : p.price;
                  const displayOriginalPrice = firstSize ? firstSize.originalPrice : p.originalPrice;
                  
                  return (
                    <Link key={p.id} href={`/product/${p.slug}`} className="group space-y-3 lg:space-y-4">
                      <div className="aspect-[4/3] rounded-2xl lg:rounded-[2rem] overflow-hidden border border-gray-100 relative">
                        <Image 
                          src={p.images[0]} 
                          alt={p.name} 
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs lg:text-sm text-dark group-hover:text-primary transition-colors line-clamp-1">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-primary font-bold text-xs lg:text-sm">
                            {displayPrice > 0 
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)
                              : "Liên hệ"
                            }
                          </p>
                          {displayOriginalPrice && displayOriginalPrice > (displayPrice || 0) && (
                            <p className="text-[10px] text-gray-300 line-through">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayOriginalPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
