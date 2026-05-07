import { ArrowRight, MessageSquare, Star, Award } from "lucide-react";
import prisma from "@/lib/prisma";
import ChatAssistant from "@/components/ChatAssistant";
import HeroBanner from "@/components/HeroBanner";

export default async function Home() {
  // Lấy dữ liệu từ database
  const [banners, featuredProducts, categories] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    }).catch(() => []),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    }).catch(() => [])
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white text-dark py-20 lg:py-40 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-soft-gray opacity-50 -skew-x-12 translate-x-1/4"></div>
        <div className="container-custom relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <p className="text-primary font-bold uppercase tracking-[0.2em] mb-4 text-sm">
              Nâng tầm nghệ thuật sống
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.1] text-dark font-serif">
              Không Gian <br />
              <span className="text-primary italic">Đẳng Cấp</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
              Chuyên cung cấp giải pháp trang trí nội thất bằng tranh nghệ thuật và
              thiết kế khung tranh chuyên nghiệp. Tinh tế trong từng đường nét, sang
              trọng trong mọi không gian.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/shop"
                className="btn-primary px-10 py-4 rounded-full font-bold shadow-xl flex items-center justify-center gap-2"
              >
                Khám phá bộ sưu tập <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/shop"
                className="border-2 border-dark text-dark px-10 py-4 rounded-full font-bold hover:bg-dark hover:text-white transition-all flex items-center justify-center"
              >
                Khung tranh & Decor
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
            {/* Component Banner động giữ nguyên layout khung ảnh */}
            <HeroBanner banners={banners} />
            
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 animate-bounce">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-dark">Top 1 chất lượng</p>
                  <p className="text-xs text-gray-400">Được khách hàng tin dùng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Danh mục nổi bật */}
      <section className="py-20 bg-soft-gray/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark font-serif mb-4">Bộ Sưu Tập Theo Chủ Đề</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat: any) => (
              <a 
                key={cat.id} 
                href={`/shop?category=${cat.id}`}
                className="group bg-white p-6 rounded-[2rem] border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-2xl font-bold">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-dark text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Danh mục: Tranh Treo Tường */}
      <section id="tranh" className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-dark mb-4 font-serif">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-gray-500 max-w-xl">
                Bộ sưu tập tranh canvas, tranh tráng gương cao cấp được tuyển
                chọn để mang lại vẻ đẹp tinh tế cho ngôi nhà bạn.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Premium Collection
              </span>
            </div>
          </div>

          {/* Lưới sản phẩm từ Database */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <div key={product.id} className="product-card bg-white rounded-3xl overflow-hidden flex flex-col group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images[0] || "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {product.category?.name || "Bộ sưu tập"}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-dark group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <a
                        href={`https://zalo.me/YOUR_ZALO_NUMBER`}
                        target="_blank"
                        className="flex items-center gap-2 bg-soft-gray text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                      >
                        <MessageSquare className="w-4 h-4" /> Tư vấn
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                Chưa có sản phẩm nổi bật nào được hiển thị.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews / Social Proof */}
      <section id="reviews" className="py-24 bg-soft-gray">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-dark mb-4 font-serif">
              Khách Hàng Chia Sẻ
            </h2>
            <div className="flex justify-center gap-1.5 text-primary">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 italic mb-8 leading-relaxed">
                "Tranh canvas in rất sắc nét, màu sắc chuẩn y như hình tư vấn. Giao
                hàng cẩn thận không bị trầy xước. Mình treo phòng khách ai vào cũng
                khen."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                  M
                </div>
                <div>
                  <p className="font-bold text-dark">Chị Mai Anh</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    Tranh Trừu Tượng
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 italic mb-8 leading-relaxed">
                "Shop tư vấn rất nhiệt tình. Tranh tráng gương sáng bóng, sang trọng, rất hợp với phòng khách phong cách Bắc Âu của nhà mình."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                  H
                </div>
                <div>
                  <p className="font-bold text-dark">Anh Hoàng Nam</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    Tranh Bắc Âu
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow">
              <p className="text-gray-600 italic mb-8 leading-relaxed">
                "Khung tranh làm rất tỉ mỉ, chắc chắn. Giá cả hợp lý so với chất lượng nhận được. Sẽ tiếp tục ủng hộ shop trong tương lai."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                  T
                </div>
                <div>
                  <p className="font-bold text-dark">Anh Trung Kiên</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    Khung Decor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot AI Component */}
      <ChatAssistant />
    </>
  );
}
