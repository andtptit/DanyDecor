import Link from "next/link";
import { Palette, MessageCircle } from "lucide-react";
import { getPublicSettings } from "@/lib/settings";

export default async function Header() {
  const { zaloPhone } = await getPublicSettings();
  
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
        <nav className="hidden lg:flex gap-8">
          <Link
            href="/#tranh"
            className="text-[11px] uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors"
          >
            Sản Phẩm
          </Link>
          <Link
            href="/#reviews"
            className="text-[11px] uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors"
          >
            Đánh Giá
          </Link>
        </nav>

        {/* Call to action */}
        <div className="flex items-center gap-2 lg:gap-4">
          <a
            href={`https://zalo.me/${zaloPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-bold text-[10px] lg:text-xs flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Liên hệ</span> Zalo
          </a>
        </div>
      </div>
    </header>
  );
}

