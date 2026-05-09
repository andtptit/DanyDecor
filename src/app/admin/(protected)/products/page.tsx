import { Plus, Search, MoreVertical, Edit, ChevronRight } from "lucide-react";
import prisma from '@/lib/prisma'
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductFilter from "@/components/admin/ProductFilter";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          q ? { name: { contains: q, mode: 'insensitive' } } : {},
          category ? { categoryId: category } : {}
        ]
      },
      include: { 
        category: {
          include: { parent: true }
        }, 
        sizes: true 
      },
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    }).catch(() => [])
  ]);

  async function deleteProduct(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (!id) return { success: false, error: 'Thiếu ID sản phẩm' }

    try {
      await prisma.product.delete({ where: { id } })
      revalidatePath('/admin/products')
      return { success: true }
    } catch (error) {
      console.error('Delete product error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' }
    }
  }

  return (
    <div>
      <AdminBreadcrumb items={[{ label: 'Quản lý sản phẩm' }]} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark font-serif mb-2 flex items-center gap-4">
            Quản lý Sản Phẩm
            <span className="text-sm font-sans font-normal bg-soft-gray text-gray-500 px-3 py-1 rounded-full border border-gray-100">
              {products.length} sản phẩm
            </span>
          </h1>
          <p className="text-gray-500 text-sm">Thêm, sửa, xóa và quản lý danh sách tranh nghệ thuật.</p>
        </div>
        <Link href="/admin/products/create" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Bộ lọc sản phẩm */}
        <ProductFilter categories={categories} totalResults={products.length} />
        
        <table className="w-full text-left text-sm">
          <thead className="bg-soft-gray/50 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4 rounded-tl-3xl">Sản Phẩm</th>
              <th className="px-6 py-4">Danh Mục</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Nổi Bật</th>
              <th className="px-6 py-4 text-right rounded-tr-3xl">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((prod: any) => (
              <tr key={prod.id} className="hover:bg-soft-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                      {prod.images && prod.images.length > 0 ? (
                        <img src={prod.images[0]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-dark mb-1">{prod.name}</p>
                      <p className="text-xs text-gray-400">/{prod.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {prod.category?.parent && (
                      <Link 
                        href={`/admin/products?category=${prod.category.parent.id}`}
                        className="text-[10px] text-gray-400 flex items-center gap-1 hover:text-primary transition-colors w-fit"
                      >
                        {prod.category.parent.name}
                        <ChevronRight className="w-2 h-2" />
                      </Link>
                    )}
                    <Link 
                      href={`/admin/products?category=${prod.category?.id}`}
                      className="text-gray-600 font-medium hover:text-primary transition-colors w-fit"
                    >
                      {prod.category?.name || '-'}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    {prod.sizes && prod.sizes.length > 0 ? (
                      (() => {
                        const prices = prod.sizes
                          .map((s: any) => s.price)
                          .filter((p: any) => p !== null && p > 0);
                        
                        if (prices.length === 0) return <span className="text-gray-400">Liên hệ</span>;
                        
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        
                        return (
                          <span className="font-bold text-primary">
                            {min === max 
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min)
                              : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min)} - ...`
                            }
                          </span>
                        );
                      })()
                    ) : (
                      <span className="font-bold text-primary">
                        {prod.price 
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)
                          : "Liên hệ"
                        }
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {prod.isFeatured ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-600">Có</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-400">Không</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${prod.id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-gray-100 rounded-lg hover:bg-soft-gray">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton 
                      productId={prod.id} 
                      productName={prod.name} 
                      onDelete={deleteProduct} 
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
