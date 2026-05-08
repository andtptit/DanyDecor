import Link from "next/link";
import { Palette, Facebook, MessageCircle, Phone, MapPin, Share2 } from "lucide-react";
import { getPublicSettings } from "@/lib/settings";

export default async function Footer() {
  const { zaloPhone, messengerUrl, shopAddress } = await getPublicSettings();

  return (
    <footer className="bg-dark text-white pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <Palette className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">
                Dany<span className="text-primary">Decor</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Nâng tầm không gian sống của bạn với những tác phẩm nghệ thuật tinh tế và giải pháp decor chuyên nghiệp.
            </p>
            <div className="flex gap-4">
              <a href={messengerUrl} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href={`https://zalo.me/${zaloPhone}`} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <h4 className="font-bold text-lg mb-8 relative inline-block">
              Danh Mục
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
            </h4>
            <ul className="space-y-4">
              <li><Link href="/shop?category=tranh-canvas" className="text-gray-400 hover:text-white transition-colors text-sm">Tranh Canvas</Link></li>
              <li><Link href="/shop?category=tranh-trang-guong" className="text-gray-400 hover:text-white transition-colors text-sm">Tranh Tráng Gương</Link></li>
              <li><Link href="/shop?category=khung-tranh" className="text-gray-400 hover:text-white transition-colors text-sm">Khung Tranh Decor</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">Tất Cả Sản Phẩm</Link></li>
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div>
            <h4 className="font-bold text-lg mb-8 relative inline-block">
              Hỗ Trợ
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
            </h4>
            <ul className="space-y-4">
              <li><Link href="/#reviews" className="text-gray-400 hover:text-white transition-colors text-sm">Đánh giá khách hàng</Link></li>
              <li><Link href="/#tranh" className="text-gray-400 hover:text-white transition-colors text-sm">Sản phẩm nổi bật</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">Chính sách bảo hành</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="font-bold text-lg mb-8 relative inline-block">
              Liên Hệ
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary"></span>
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  {shopAddress || 'Đang cập nhật địa chỉ...'}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${zaloPhone}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {zaloPhone}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`https://zalo.me/${zaloPhone}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tư vấn Zalo 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} DanyDecor · Crafted with Passion
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors text-[10px] uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors text-[10px] uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

