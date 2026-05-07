import { Palette, LayoutDashboard, Layers, Image as ImageIcon, Settings, LogOut, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { logout } from "../login/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-soft-gray overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" /> Dashboard
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-800 transition-colors">
            <Layers className="w-5 h-5 text-gray-400" /> Danh Mục
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-800 transition-colors">
            <ImageIcon className="w-5 h-5 text-gray-400" /> Sản Phẩm
          </Link>
          <Link href="/admin/banners" className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-800 transition-colors">
            <MonitorPlay className="w-5 h-5 text-gray-400" /> Banner
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" /> Cài Đặt
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-soft-gray p-8">
        {children}
      </main>
    </div>
  );
}
