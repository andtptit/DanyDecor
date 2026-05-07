import Link from "next/link";
import { Palette, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="container-custom py-4 lg:py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:gap-3 group">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg lg:rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
            <Palette className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <span className="font-serif font-bold text-lg lg:text-2xl tracking-tight">
            Dany<span className="text-primary">Decor</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-10">
          <Link
            href="/#tranh"
            className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Tranh Nghệ Thuật
          </Link>
          <Link
            href="/#bien-quang-cao"
            className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Khung Tranh
          </Link>
          <Link
            href="/#reviews"
            className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors"
          >
            Khách Hàng
          </Link>
        </nav>

        {/* Call to action */}
        <a
          href={`https://zalo.me/${process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-bold text-xs lg:text-sm flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden xs:inline">Liên hệ</span> Zalo
        </a>
      </div>
    </header>
  );
}
