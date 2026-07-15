import prisma from "@/lib/prisma";
import Link from "next/link";
import { ImageIcon, Layers, Star, MonitorPlay, Plus, ArrowRight, Edit } from "lucide-react";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, featuredCount, activeBanners, recentProducts] =
    await Promise.all([
      prisma.product.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.product.count({ where: { isFeatured: true } }).catch(() => 0),
      prisma.banner.count({ where: { isActive: true } }).catch(() => 0),
      prisma.product
        .findMany({
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
        .catch(() => []),
    ]);

  const stats = [
    { label: "Sản phẩm", value: productCount, icon: ImageIcon, href: "/admin/products", color: "text-primary bg-primary/10" },
    { label: "Danh mục", value: categoryCount, icon: Layers, href: "/admin/categories", color: "text-purple-500 bg-purple-50" },
    { label: "Nổi bật", value: featuredCount, icon: Star, href: "/admin/products", color: "text-amber-500 bg-amber-50" },
    { label: "Banner đang bật", value: activeBanners, icon: MonitorPlay, href: "/admin/banners", color: "text-green-500 bg-green-50" },
  ];

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Dashboard" }]} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2">Tổng Quan</h1>
          <p className="text-gray-500 text-sm">Chào mừng trở lại hệ thống quản trị DanyDecor.</p>
        </div>
        <Link
          href="/admin/products/create"
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </Link>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-dark">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                {s.label}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Sản phẩm mới thêm */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-dark">Sản phẩm mới thêm</h2>
          <Link href="/admin/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentProducts.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentProducts.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-soft-gray/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category?.name || "Chưa phân loại"}</p>
                </div>
                {p.isFeatured && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-500">
                    <Star className="w-3 h-3" /> Nổi bật
                  </span>
                )}
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray shrink-0"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            Chưa có sản phẩm nào.{" "}
            <Link href="/admin/products/create" className="text-primary font-bold hover:underline">
              Thêm sản phẩm đầu tiên
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
