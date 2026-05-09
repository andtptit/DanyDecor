'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Palette, LayoutDashboard, Layers, Image as ImageIcon, Settings, LogOut, MonitorPlay } from 'lucide-react';
import { logout } from '@/app/admin/login/actions';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Danh Mục', icon: Layers },
    { href: '/admin/products', label: 'Sản Phẩm', icon: ImageIcon },
    { href: '/admin/banners', label: 'Banner', icon: MonitorPlay },
    { href: '/admin/settings', label: 'Cài Đặt', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-dark text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <span className="font-serif font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-white/10 text-white font-bold shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400'}`} /> 
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <form action={logout}>
          <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </form>
      </div>
    </aside>
  );
}
